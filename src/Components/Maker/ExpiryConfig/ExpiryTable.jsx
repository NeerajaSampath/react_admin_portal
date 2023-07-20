import { React, useState, useEffect } from "react";
import axios from "../../../api";
import { GetExpiryConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../Common/Elements";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useAuth from "../../../Hooks/useAuth";
import ExpiryModalpopup from "./ExpiryModalpopup";

export const ExpiryTable = () => {
  const { setLoading } = useAuth();
  const [rows, setrows] = useState([]);
  const [reqData, setReqData] = useState([]);
  const [open, setOpen] = useState(false);
  const [ExpiryModal, setExpiryModal] = useState(false);
  //dependency for get api after creation done
  const [ExpiryData_Update, setExpiryData_Update] = useState(false);
  //filter state
  const [filt, setFilt] = useState([]);
  const [Filter_Btn, setFilter_Btn] = useState("All");
  //table data customize
  const LowercaseFn = (data) => {
    let Fn_Case = [];
    data.forEach((inner_data) => {
      Fn_Case.push({
        expiration_id: inner_data?.expiration_id,
        duration: inner_data?.duration,
        exp_type: inner_data?.is_monthly
          ? "Months"
          : inner_data?.is_yearly
          ? "Years"
          : inner_data?.is_days
          ? "Days"
          : null,
        final_type:
          inner_data?.duration +
          " " +
          (inner_data?.is_monthly
            ? "Months"
            : inner_data?.is_yearly
            ? "Years"
            : inner_data?.is_days
            ? "Days"
            : null),
      });
    });
    return Fn_Case;
  };
  //expiration api call
  const ExpiryTableAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetExpiryConfig}/0/5000`,
      });
      setLoading(false);
      let formate_data = LowercaseFn(res?.data?.data);
      setrows(formate_data);
      setReqData(res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    ExpiryTableAPI();
  }, [ExpiryData_Update]);
  const TableCom = () => {
    setExpiryModal(true);
    setExpiryData_Update(!ExpiryData_Update);
  };
  //column for table datagrid
  const columns = [
    {
      id: "expiration_id",
      headerName: "Config Id",
      sortable: false,
      field: "expiration_id",
      headerClassName: "Table-header",
      flex: 3,
    },
    {
      id: "expiration_id",
      headerName: "Expiration Duration",
      field: "final_type",
      sortable: false,
      headerClassName: "Table-header",
      align: "right",
      headerAlign: "right",
      flex: 3,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   headerClassName: "Table-header",
    //   align: "left",
    //   renderCell: (params) => (
    //     <>
    //       <ButtonArea
    //         variant="text"
    //         type="button"
    //         value="Edit"
    //         className="editbtn"
    //       />
    //     </>
    //   ),
    // },
  ];
  //filter for status
  const status_filter_btn = [
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
        alertmsg="Sent for Approval - New Tier Created"
        severity="success"
      />
      <div className="CommonHeader">
        <h5 className="title">Expiration Configuration</h5>
        <div>
          <ButtonArea
            variant="contained"
            onClick={TableCom}
            type="button"
            value="+ New Expiration"
          />
        </div>
      </div>
      {/* filter for status */}
      {/* <div style={{ textAlign: "right", margin: "10px 0" }}>
        {status_filter_btn.map((item, index) => (
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
      </div> */}

      <DataGrid
        sx={{
          border: "unset",
          height: "calc(100vh - 220px)",
          textTransform: "capitalize",
          marginTop: "20px",
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
            outline: "none !important",
          },
        }}
        onCellClick={handleCellClick}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.expiration_id}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
        filterModel={{
          items: filt,
        }}
      />
      <ExpiryModalpopup
        setExpiryModal={setExpiryModal}
        ExpiryModal={ExpiryModal}
        setExpiryData_Update={setExpiryData_Update}
        ExpiryData_Update={ExpiryData_Update}
      />
    </>
  );
};
