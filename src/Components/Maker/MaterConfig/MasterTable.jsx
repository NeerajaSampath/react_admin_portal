import { React, useState, useEffect } from "react";
import axios from "../../../api";
import { GetMasterConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../Common/Elements";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { CREATE, EDIT, VIEW } from "../../../Constant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "../../../Hooks/useAuth";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export const MasterTable = () => {
  const {
    setLoading,
    setMasterget,
    setmaster_create_update,
    master_create_update,
    Config_update,
    setConfig_update,
  } = useAuth();
  const CustomNavigate = useNavigate();
  const [rows, setrows] = useState([]);
  const [reqData, setReqData] = useState([]);
  const [open, setOpen] = useState(false);
  const [filt, setFilt] = useState([]);
  const [Filter_Btn, setFilter_Btn] = useState("All");
  //status filter for approval
  const filterApproved = reqData.filter((item) => item?.isEnabled === true);
  //table data destructuring
  const LowercaseFn = (data) => {
    let Fn_Case = [];
    data.forEach((inner_data) => {
      Fn_Case.push({
        configId: inner_data?.configId,
        isInstant: inner_data?.isInstant,
        status: inner_data?.status.toLowerCase(),
        created_date:
          inner_data?.created_date != null
            ? new Date(inner_data?.created_date).toLocaleString()
            : inner_data?.created_date,
        last_modified_date:
          inner_data?.last_modified_date != null
            ? new Date(inner_data?.last_modified_date).toLocaleString()
            : inner_data?.last_modified_date,
        reason:
          inner_data?.reason === null
            ? "-"
            : inner_data?.reason === ""
            ? "-"
            : inner_data?.reason,
        isReversalAllowed: inner_data?.isReversalAllowed,
        isMYOPEnabled: inner_data?.isMYOPEnabled,
        currency: inner_data?.currency,
        isEnabled: inner_data?.isEnabled,
      });
    });
    return Fn_Case;
  };
  //api call for master get
  const MasterTableAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setLoading(false);
      let formate_data = LowercaseFn(res?.data?.data);
      setrows(formate_data);
      setReqData(res?.data?.data);
      setmaster_create_update(!master_create_update);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // console.log("ReqData", reqData);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    MasterTableAPI();
    if (Config_update) {
      setConfig_update(false);
      setOpen(true);
    }
  }, []);
  //redirection fn
  const TableCom = () => {
    CustomNavigate(`${CREATE}`);
    setMasterget(true);
  };
  const ViewMaster = (params) => {
    const currentData = reqData.find((d) => d.configId === params.id);
    sessionStorage.setItem("masterConfigDto", JSON.stringify(currentData));
    CustomNavigate(`${VIEW}/${params?.id}`);
  };
  const EditMaster = (params) => {
    const currentData = reqData.find((d) => d.configId === params.id);
    sessionStorage.setItem("masterConfigDto", JSON.stringify(currentData));
    CustomNavigate(`${EDIT}/${params?.id}`);
  };
  const columns = [
    // {
    //   id: "created_date",
    //   headerName: "Config Id",
    //   field: "configId",
    //   sortable: false,
    //   headerClassName: "Table-header",
    //   flex: 1,
    // },
    {
      id: "configId",
      headerName: "Config Id",
      field: "configId",
      sortable: false,
      headerClassName: "Table-header",
      minWidth: 120,
      flex: 1,
    },
    // {
    //   id: "configId",
    //   headerName: "Merchant Accelerator",
    //   field: "isMYOPEnabled",
    //   sortable: false,
    //   headerClassName: "Table-header",
    //   minWidth: 200,
    //   flex: 1,
    // },
    {
      id: "configId",
      headerName: "status",
      field: "status",
      headerClassName: "Table-header",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          {params?.value === "pending" ? (
            <span className="pending_text">Pending</span>
          ) : params.value === "approved" ? (
            <span className="approved_text">Approved</span>
          ) : (
            <span className="decline_text">Decline</span>
          )}
        </>
      ),
    },
    {
      id: "configId",
      headerName: "Active/Inactive",
      field: "isEnabled",
      sortable: false,
      headerClassName: "Table-header",
      renderCell: (params) => (
        <>
          {params.value === true ? (
            <span
              style={{
                color: "#32a64d",
                background: "rgb(209 227 229 / 69%)",
                padding: "5px 8px 8px",
                fontSize: "12px",
                borderRadius: "5px",
                width: "65px",
                textAlign: "center",
              }}
            >
              Active
            </span>
          ) : (
            <span
              style={{
                color: "#fe403f",
                background: "rgb(238 217 231 / 56%)",
                padding: "5px 8px 8px",
                fontSize: "12px",
                borderRadius: "5px",
                width: "65px",
                textAlign: "center",
              }}
            >
              Inactive
            </span>
          )}
        </>
      ),
      flex: 1,
    },
    {
      field: "created_date",
      sortable: false,
      headerName: "Created Date",
      headerClassName: "Table-header",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "last_modified_date",
      sortable: false,
      headerName: "Last Modified Date",
      headerClassName: "Table-header",
      minWidth: 200,
      flex: 1,
    },
    // {
    //   id: "configId",
    //   headerName: "Reason",
    //   field: "reason",
    //   sortable: false,
    //   headerClassName: "Table-header",
    //   minWidth: 200,
    //   flex: 1,
    // },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "Table-header",
      align: "left",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip
            arrow
            placement="top"
            title={
              params?.row?.isEnabled === false
                ? params?.row?.status === "declined" ||
                  params?.row?.status === "approved"
                  ? `Users doesn't have access to edit.`
                  : `Edit configuration Post Approval.`
                : null
            }
          >
            <IconButton
              sx={{
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "transparent !important",
                },
              }}
            >
              <ButtonArea
                variant="text"
                type="button"
                value="Edit"
                className="editbtn"
                disabled={params?.row?.isEnabled === false}
                style={{
                  opacity: params?.row?.isEnabled === false ? "0.5" : "1",
                }}
                onClick={() => {
                  EditMaster(params);
                  setmaster_create_update(!master_create_update);
                }}
              />
            </IconButton>
          </Tooltip>
          <ButtonArea
            variant="text"
            type="button"
            value="View"
            className="viewbtn"
            onClick={() => ViewMaster(params)}
          />
        </>
      ),
    },
  ];
  //status btn var
  const myop_filtetBtn = [
    {
      id: "1",
      label: "All",
    },
    {
      id: "2",
      label: "Pending",
    },
    {
      id: "3",
      label: "Approved",
    },
    {
      id: "4",
      label: "Decline",
    },
  ];
  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param;
  };
  return (
    <>
      <CustomSnakebar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="inherit" />,
        }}
        alertmsg="Sent for Approval - New Master Created"
        severity="success"
      />
      <div className="CommonHeader">
        <h5 className="title">Master Configuration</h5>
        <div>
          <Tooltip
            arrow
            placement="top"
            title={
              filterApproved[0]?.isEnabled === true
                ? "New edits can be made from the approved configuration."
                : null
            }
          >
            <IconButton
              sx={{
                padding: "0 !important",
                "&.MuiIconButton-root:hover": {
                  backgroundColor: "transparent !important",
                },
              }}
            >
              <ButtonArea
                variant="contained"
                disabled={filterApproved[0]?.isEnabled === true ? true : false}
                onClick={TableCom}
                type="button"
                value="+ New Master"
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {/* filter for status */}
      <div style={{ textAlign: "right", margin: "10px 0" }}>
        {myop_filtetBtn.map((item, index) => (
          <ButtonArea
            style={{ marginRight: "7px", padding: "4px 10px" }}
            variant={Filter_Btn === item.label ? "contained" : "text"}
            key={index}
            value={item.label}
            type="button"
            onClick={(e) => {
              setFilter_Btn(e.target.value);
              if (e.target.value === "Pending") {
                setFilt([
                  {
                    columnField: "status",
                    operatorValue: "startsWith",
                    value: "Pending",
                  },
                ]);
              } else if (e.target.value === "Approved") {
                setFilt([
                  {
                    columnField: "status",
                    operatorValue: "startsWith",
                    value: "Approved",
                  },
                ]);
              } else if (e.target.value === "Decline") {
                setFilt([
                  {
                    columnField: "status",
                    operatorValue: "startsWith",
                    value: "Decline",
                  },
                ]);
              } else if (e.target.value === "All") {
                setFilt([]);
              }
            }}
          />
        ))}
      </div>

      <DataGrid
        sx={{
          border: "unset",
          height: "calc(100vh - 220px)",
          textTransform: "capitalize",
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
            outline: "none !important",
          },
        }}
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: "isEnabled", sort: "desc" }],
        //   },
        // }}
        filterModel={{
          items: filt,
        }}
        onCellClick={handleCellClick}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.configId}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
      />
    </>
  );
};
