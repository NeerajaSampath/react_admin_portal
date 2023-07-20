import { React, useState, useEffect } from "react";
import axios from "../../../api";
import { GetRuleTierMapConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../Common/Elements";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { CREATE, VIEW, EDIT } from "../../../Constant";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "../../../Hooks/useAuth";
import useChecker from "../../../Hooks/useChecker";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";

export const RuleTierTable = ({ TierMapping, setTierMapping }) => {
  const CustomNavigate = useNavigate();
  const [rows, setrows] = useState([]);
  const [reqData, setReqData] = useState([]);
  const [filt, setFilt] = useState([]);
  const [Filter_Btn, setFilter_Btn] = useState("All");
  const [open, setOpen] = useState(false);
  const { setLoading, Config_update, setConfig_update } = useAuth();
  const { Rule_Tier_Mapping, setRule_Tier_Mapping } = useChecker();
  const formateData = (data) => {
    let F_data = [];
    data.forEach((inner_data) => {
      F_data.push({
        id:
          inner_data?.ruleTierMappingKeyDto?.ruleConfigId +
          inner_data?.ruleTierMappingKeyDto?.tierId +
          inner_data?.ruleTierMappingKeyDto?.ruleTierMappingId,
        name: inner_data?.ruleConfigDto?.name.toLowerCase(),
        tier_name: inner_data?.tiersConfigDTO?.tier_name.toLowerCase(),
        points: inner_data?.points,
        status: inner_data?.status.toLowerCase(),
        isEnabled: inner_data?.isEnabled,
        created_date:
          inner_data?.created_date != null
            ? new Date(inner_data?.created_date).toLocaleString()
            : inner_data?.created_date,
        last_modified_date:
          inner_data?.last_modified_date != null
            ? new Date(inner_data?.last_modified_date).toLocaleString()
            : inner_data?.last_modified_date,
        // created_date: new Date(inner_data?.created_date).toLocaleString(),
        reason:
          inner_data?.reason === null
            ? "-"
            : inner_data?.reason === ""
            ? "-"
            : inner_data?.reason,
      });
    });
    return F_data;
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const RuleTierTableAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetRuleTierMapConfig}/0/5000`);
      setLoading(false);
      let formate_data = formateData(res.data.data);
      setReqData(res.data.data);
      setrows(formate_data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  useEffect(() => {
    RuleTierTableAPI();
    if (Config_update) {
      setConfig_update(false);
      setOpen(true);
    }
    // console.log("Config_update", Config_update);
    // if (TierMapping) {
    //   setTierMapping(!TierMapping);
    //   setOpen(true);
    // }
  }, []);
  const TableCom = () => {
    CustomNavigate(`${CREATE}`);
  };
  const ViewReward = (params) => {
    const currentData = reqData.find(
      (d) =>
        d.ruleTierMappingKeyDto.ruleConfigId +
          d.ruleTierMappingKeyDto.tierId +
          d?.ruleTierMappingKeyDto?.ruleTierMappingId ===
        params.id
    );
    sessionStorage.setItem(
      "ruleTierMappingKeyDto",
      JSON.stringify(currentData)
    );
    CustomNavigate(`${VIEW}/${params?.id}`);
  };
  const EditRuleTier = (params) => {
    const currentData = reqData.find(
      (d) =>
        d?.ruleTierMappingKeyDto?.ruleConfigId +
          d?.ruleTierMappingKeyDto?.tierId +
          d?.ruleTierMappingKeyDto?.ruleTierMappingId ===
        params.id
    );
    sessionStorage.setItem(
      "ViewruleTierMappingKeyDto",
      JSON.stringify(currentData)
    );
    CustomNavigate(`${EDIT}/${params?.id}`);
  };
  const columns = [
    {
      headerName: "Rule Name",
      field: "name",
      sortable: false,
      headerClassName: "Table-header",
      // flex: 1,
    },
    {
      headerName: "Tier Name",
      field: "tier_name",
      sortable: false,
      headerClassName: "Table-header",
      // flex: 1,
    },

    {
      headerName: "status",
      field: "status",
      headerClassName: "Table-header",
      // flex: 1,
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
      headerName: "Active/Inactive",
      field: "isEnabled",
      sortable: false,
      flex: 1,
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
      // flex: 1,
    },
    {
      field: "created_date",
      sortable: false,
      headerName: "Created Date",
      headerClassName: "Table-header",
      minwidth: 300,
      flex: 1,
    },
    {
      field: "last_modified_date",
      sortable: false,
      headerName: "Last Modified Date",
      headerClassName: "Table-header",
      minwidth: 300,
      flex: 1,
    },
    // {
    //   headerName: "Reason",
    //   field: "reason",
    //   sortable: false,
    //   headerClassName: "Table-header",
    //   flex: 1,
    // },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      headerClassName: "Table-header",
      align: "left",
      flex: 1,
      renderCell: (params) => {
        return (
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
                  onClick={() => EditRuleTier(params)}
                />
              </IconButton>
            </Tooltip>
            <ButtonArea
              variant="text"
              type="button"
              value="View"
              className="viewbtn"
              onClick={() => {
                params && ViewReward(params);
                setRule_Tier_Mapping(false);
              }}
            />
          </>
        );
      },
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
        alertmsg="Sent for Approval - New Rule Tier Mapping Created"
        severity="success"
      />
      <div className="CommonHeader">
        <h5 className="title">Rule Tier Mapping</h5>
        <div>
          <ButtonArea
            variant="contained"
            onClick={TableCom}
            type="button"
            value="+ New Rule Tier Mapping"
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
        //     sortModel: [{ field: "isEnabled", sort: "desc" }],
        //   },
        // }}
        filterModel={{
          items: filt,
        }}
        onCellClick={handleCellClick}
        disableRowSelectionOnClick={false}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        options={{
          grouping: true,
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
      />
    </>
  );
};
