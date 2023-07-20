import { React, useEffect, useState } from "react";
import axios from "../../../api";
import { GetRuleConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../Common/Elements";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { CREATE, VIEW, EDIT } from "../../../Constant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "../../../Hooks/useAuth";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export const RewardTable = ({ RuleApproval, setRuleApproval }) => {
  const CustomNavigate = useNavigate();
  const [rows, setrows] = useState([]);
  const [ruleData, setruleData] = useState([]);
  const [open, setOpen] = useState(false);
  const [filt, setFilt] = useState([]);
  const [Filter_Btn, setFilter_Btn] = useState("All");
  const { setLoading, Config_update, setConfig_update } = useAuth();
  //destructure data for table
  const LowercaseFn = (data) => {
    let Fn_Case = [];
    data.forEach((inner_data) => {
      Fn_Case.push({
        rule_config_id: inner_data?.rule_config_id,
        name: inner_data?.name.toLowerCase(),
        status: inner_data?.status.toLowerCase(),
        isEnabled: inner_data?.is_enabled,
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
      });
    });
    return Fn_Case;
  };
  //api call for rule get
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const RuleTableAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetRuleConfig}/0/50000`);
      setLoading(false);
      let formate_data = LowercaseFn(res.data.data);
      setrows(formate_data);
      setruleData(res?.data?.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  useEffect(() => {
    RuleTableAPI();
    if (Config_update) {
      setConfig_update(false);
      setOpen(true);
    }
    // if (RuleApproval) {
    //   setRuleApproval(!RuleApproval);
    //   setOpen(true);
    // }
  }, []);
  //redirection
  const TableCom = () => {
    CustomNavigate(`${CREATE}`);
  };
  const ViewReward = (params) => {
    const currentData = ruleData.find((d) => d.rule_config_id === params.id);
    sessionStorage.setItem("ruleViewConfigDto", JSON.stringify(currentData));
    CustomNavigate(`${VIEW}/${params.id}`);
  };
  const EditRule = (params) => {
    const currentData = ruleData.find((d) => d.rule_config_id === params.id);
    sessionStorage.setItem("ruleConfigDto", JSON.stringify(currentData));
    CustomNavigate(`${EDIT}/${params?.id}`);
  };
  //column for table data
  const columns = [
    {
      field: `name`,
      sortable: false,
      headerName: "Name",
      headerClassName: "Table-header",
      flex: 1,
    },

    {
      field: `status`,
      headerName: "Status",
      headerClassName: "Table-header",
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
      field: `isEnabled`,
      headerName: "Active/Inactive",
      headerClassName: "Table-header",
      flex: 1,
      sortable: false,
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
    },
    {
      field: "created_date",
      sortable: false,
      headerName: "Created Date",
      headerClassName: "Table-header",
      minwidth: "100px",
      flex: 1,
    },
    {
      field: "last_modified_date",
      sortable: false,
      headerName: "Last Modified Date",
      headerClassName: "Table-header",
      minwidth: "100px",
      flex: 1,
    },
    // {
    //   field: `reason`,
    //   sortable: false,
    //   headerName: "Reason",
    //   headerClassName: "Table-header",
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
                disabled={params?.row?.isEnabled === false}
                style={{
                  opacity: params?.row?.isEnabled === false ? "0.5" : "1",
                }}
                className="editbtn"
                onClick={() => EditRule(params)}
              />
            </IconButton>
          </Tooltip>
          <ButtonArea
            onClick={() => ViewReward(params)}
            variant="text"
            type="button"
            value="view"
            className="viewbtn"
          />
        </>
      ),
    },
  ];
  //status button  var
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
        alertmsg="Sent for Approval - New Rule Created"
        severity="success"
      />
      <div className="CommonHeader">
        <h5 className="title">Reward Rule</h5>
        <div>
          <ButtonArea
            variant="contained"
            onClick={TableCom}
            type="button"
            value="+ Create Reward"
          />
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
        //     // sortModel: ["desc"],
        //     sortModel: [{ field: "isEnabled", sort: "desc" }],
        //   },
        // }}
        filterModel={{
          items: filt,
        }}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onCellClick={handleCellClick}
        getRowId={(row) => row.rule_config_id}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
      />
    </>
  );
};
