import { React, useState, useEffect } from "react";
import { ButtonArea, TextArea, DefaultSelect } from "../Common/Elements";
import { useFormik } from "formik";
import { CustomerSchema } from "../Schema/Schema";
import axios from "../../api";
import {
  GetCustomerConfig,
  GetLedgerConfig,
  GetTierConfig,
  GetFetchBalConfig,
  GetCustomerMyopMapConfig,
} from "../../apiConfig";
import { MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import useAuth from "../../Hooks/useAuth";
import download from "../../assets/img/download.png";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { utils, writeFileXLSX } from "xlsx";
var CryptoJS = require("crypto-js");

const CustomerDetails = () => {
  const [customerData, setcustomerData] = useState("");
  const [tier, setTier] = useState("");
  const [customer_details, setcustomer_details] = useState([]);
  const [fetch_Balance_details, setfetch_Balance_details] = useState([]);
  const [myop_mapping, setmyop_mapping] = useState([]);
  const [SelectedDate, setSelectedDate] = useState("");
  const [FieldShow, setFieldShow] = useState(false);
  const [dateFilter, setdateFilter] = useState("");
  const [Conflict, setConflict] = useState(false);
  const [myop_filter, setmyop_filter] = useState("All");
  const [filt, setFilt] = useState([]);
  const [start_date_state, setstart_date_state] = useState();
  const [end_date_state, setend_date_state] = useState();
  const [Tablefn, setTablefn] = useState("");
  const { setLoading } = useAuth();
  const date_arr = [];
  useEffect(() => {
    TierAPI();
    //date filter format
    const CurrentMonth = `${moment()
      .startOf("month")
      .format("YYYY-MM-DD")}/${moment().endOf("month").format("YYYY-MM-DD")}`;
    const threeMonth = `${moment()
      .subtract(2, "months")
      .startOf("month")
      .format("YYYY-MM-DD")}/${moment().endOf("month").format("YYYY-MM-DD")}`;
    const sixMonth = `${moment()
      .subtract(5, "months")
      .startOf("month")
      .format("YYYY-MM-DD")}/${moment().endOf("month").format("YYYY-MM-DD")}`;
    const lastyear = `${moment()
      .subtract(1, "year")
      .startOf("year")
      .format("YYYY-MM-DD")}/${moment()
      .subtract(1, "year")
      .endOf("year")
      .format("YYYY-MM-DD")}`;
    const custome_date_date = `${moment(start_date_state).format(
      "YYYY-MM-DD"
    )}/${moment(end_date_state).format("YYYY-MM-DD")}`;
    //switch case for date filter based on select value
    switch (dateFilter) {
      case "Current Month":
        date_arr.push(`${CurrentMonth}`);
        break;
      case "Last 3 Month":
        date_arr.push(`${threeMonth}`);
        break;
      case "Last 6 Month":
        date_arr.push(`${sixMonth}`);
        break;
      case "Last Year":
        date_arr.push(`${lastyear}`);
        break;
      case "Custom Date":
        date_arr.push(`${custome_date_date}`);
        break;
      default:
    }
    setSelectedDate(date_arr);
  }, [dateFilter, start_date_state, end_date_state]);
  const TierAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetTierConfig}/0/50000`,
      });
      setLoading(false);
      setTier(res.data.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  //tnx history select date filter
  const date_option = [
    {
      id: 1,
      value: "Current Month",
    },
    {
      id: 2,
      value: "Last 3 Month",
    },
    {
      id: 3,
      value: "Last 6 Month",
    },
    {
      id: 4,
      value: "Last Year",
    },
    {
      id: 5,
      value: "Custom Date",
    },
  ];
  const filter_date = date_option.map((item, index) => (
    <MenuItem sx={{ fontSize: "14px" }} key={index} value={item.value}>
      {item.value}
    </MenuItem>
  ));
  //date select change
  const DateHandleChange = (e) => {
    setdateFilter(e.target.value);
  };

  const LowercaseFn = (data1) => {
    let Fn_Case = [];
    data1.map((inner) => {
      const tier_filter = tier
        ?.filter((typeid) => typeid?.tier_id === inner?.tier_id)
        .map((items) => items?.tier_name.toLowerCase());
      Fn_Case.push({
        wallet_history_id: inner?.wallet_history_id,
        created_date: inner?.created_date,
        rule_name: inner?.sub_type.toLowerCase(),
        tier_name: tier_filter.toString(),
        points: inner?.points,
        amount: inner?.amount,
        expiry_date:
          inner?.expiry_date === null ? "-" : inner?.expiry_date?.substr(0, 10),
        current_balance: inner?.current_balance,
        is_myop_history: inner?.is_myop_history,
        brand_name: inner?.is_myop_history ? inner?.brand_name : "-",
        reason: inner?.reason === null ? "-" : inner?.reason,
      });
    });
    return Fn_Case;
  };
  const onSubmit = async (values, actions) => {
    //encryption for entity id
    var encryptedBase64Key = `${process.env.REACT_APP_SECRET_KEY}`;
    var parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);
    var iv = CryptoJS.enc.Hex.parse(0);
    var plaintText = `${values.entity_id}`;
    var encryptedData = CryptoJS.AES.encrypt(plaintText, parsedBase64Key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    var string = encryptedData
      .toString()
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    try {
      setLoading(true);
      const ledger_api = await axios({
        method: "get",
        url: `${GetLedgerConfig}/` + string + `/${SelectedDate}/0/5000`,
      });
      const customer_api = await axios({
        method: "get",
        url: `${GetCustomerConfig}/` + string,
      });
      const fetchBal_api = await axios({
        method: "get",
        url: `${GetFetchBalConfig}/` + string,
      });
      const customer_myop_map_api = await axios({
        method: "get",
        url: `${GetCustomerMyopMapConfig}/` + string,
      });
      setLoading(false);
      setcustomer_details(customer_api?.data?.data);
      setfetch_Balance_details(fetchBal_api?.data?.data);
      setmyop_mapping(customer_myop_map_api?.data?.data);
      setConflict(false);
      let formate_data = LowercaseFn(ledger_api?.data?.data?.wallet_history);
      setTablefn(formate_data);
      setcustomerData(ledger_api?.data?.data);
      setFieldShow(true);
    } catch (error) {
      setLoading(false);
      console.log("error from support portal", error);
      setFieldShow(false);
      setConflict(true);
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      entity_id: "",
      date_filter: "",
      start_date: "",
      end_date: "",
    },
    onSubmit,
    validationSchema: CustomerSchema,
  });
  //filter for non/myop& myop
  const myop_filtetBtn = [
    {
      id: "1",
      label: "All",
    },
    {
      id: "2",
      label: "MYOP",
    },
    {
      id: "1",
      label: "Non/MYOP",
    },
  ];
  //table column variable
  const columns = [
    {
      id: "wallet_history_id",
      headerName: "Transaction Date",
      field: "created_date",
      headerClassName: "Table-header",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Rule Name",
      field: "rule_name",
      headerClassName: "Table-header",
      minWidth: 300,
      // maxWidth: 300,
    },
    {
      id: "wallet_history_id",
      headerName: "Tier Name",
      field: "tier_name",
      headerClassName: "Table-header",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Point",
      field: "points",
      headerClassName: "Table-header",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Amount",
      field: "amount",
      headerClassName: "Table-header",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Expiry Date",
      field: "expiry_date",
      headerClassName: "Table-header",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Current Balance",
      field: "current_balance",
      headerClassName: "Table-header",
      align: "left",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "MYOP History",
      field: "is_myop_history",
      headerClassName: "Table-header",
      align: "left",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Brand Name",
      field: "brand_name",
      headerClassName: "Table-header",
      align: "left",
      minWidth: 150,
    },
    {
      id: "wallet_history_id",
      headerName: "Reason",
      field: "reason",
      headerClassName: "Table-header",
      align: "left",
      minWidth: 600,
      // maxWidth: 600,
    },
  ];
  //export transaction history in excel format for all , myop & non/myop
  var Tablefn_myop = "";
  var Tablefn_nonmyop = "";
  Tablefn.length != 0 &&
    (Tablefn_myop = Tablefn.filter((item) => item.is_myop_history === true).map(
      (items) => {
        return { ...items };
      }
    ));
  Tablefn.length != 0 &&
    (Tablefn_nonmyop = Tablefn.filter(
      (item) => item.is_myop_history === false
    ).map((items) => {
      return { ...items };
    }));
  function All_Filter() {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(Tablefn));
    writeFileXLSX(
      wb,
      `${customer_details.entity_id} - Transaction_history.xlsx`
    );
  }
  function MYOP_enable() {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(Tablefn_myop));
    writeFileXLSX(
      wb,
      `${customer_details.entity_id} - Transaction_history_myop_enable.xlsx`
    );
  }
  function MYOP_disable() {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(Tablefn_nonmyop));
    writeFileXLSX(
      wb,
      `${customer_details.entity_id} - Transaction_history_myop_disable.xlsx`
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="customer-portal">
          <TextArea
            placeholder="Enter Customer Id"
            type="text"
            label="Customer Id"
            name="entity_id"
            value={values.entity_id}
            onChange={(e) => {
              handleChange(e);
            }}
            onBlur={handleBlur}
            className={
              errors.entity_id && touched.entity_id
                ? "CustomInput"
                : "CustomInput"
            }
            error={errors.entity_id && touched.entity_id ? true : false}
            helperText={
              errors.entity_id && touched.entity_id && <>{errors.entity_id}</>
            }
          />
          <DefaultSelect
            labelId="SelectedateLabel"
            id="SelectedateSelect"
            label="Date filter for Tnx History"
            onChange={(e) => {
              handleChange(e);
              DateHandleChange(e);
              values.start_date = "";
              values.end_date = "";
            }}
            onBlur={handleBlur}
            name="date_filter"
            value={values.date_filter}
            optionvalue={filter_date}
            error={errors.date_filter && touched.date_filter ? true : false}
            formhelpertext={
              errors.date_filter &&
              touched.date_filter && <>{errors.date_filter}</>
            }
          />
          {dateFilter === "Custom Date" && (
            <>
              <DatePicker
                // className="CustomInput"
                m={2}
                InputProps={{
                  style: { fontSize: "12px" },
                }}
                label="Start Date"
                value={values?.start_date}
                disableFuture
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setFieldValue("start_date", newValue);
                  setstart_date_state(newValue);
                }}
                renderInput={(params) => (
                  <TextArea
                    className="CustomInput"
                    name="start_date"
                    onBlur={handleBlur}
                    {...params}
                    helperText={touched?.start_date ? errors?.start_date : ""}
                    error={touched?.start_date && Boolean(errors?.start_date)}
                    autoComplete="off"
                  />
                )}
              />
              <DatePicker
                m={2}
                InputProps={{
                  style: { fontSize: "12px" },
                }}
                label="End Date"
                value={values?.end_date}
                disableFuture
                inputFormat="dd-MM-yyyy"
                onChange={(newValue) => {
                  setFieldValue("end_date", newValue);
                  setend_date_state(newValue);
                }}
                renderInput={(params) => (
                  <TextArea
                    className="CustomInput"
                    name="end_date"
                    onBlur={handleBlur}
                    {...params}
                    helperText={touched?.end_date ? errors?.end_date : ""}
                    error={touched?.end_date && Boolean(errors?.end_date)}
                    autoComplete="off"
                  />
                )}
              />
            </>
          )}
          <ButtonArea
            value="Search"
            type="submit"
            variant="contained"
            className="custom_button"
          />
        </div>
      </form>
      {Conflict && (
        <h5>The customer details are not present in the loyalty system.</h5>
      )}
      {FieldShow && (
        <div>
          <p className="innerheading">Customer Details</p>
          <div>
            <div className="View-entity">
              <h5 className="label-view">Name</h5>
              <p className="value-view">{customer_details?.name}</p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Phone Number</h5>
              <p className="value-view">{customer_details?.phone_number}</p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Email ID</h5>
              <p className="value-view" style={{ textTransform: "none" }}>
                {customer_details.email}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Entity ID</h5>
              <p className="value-view">{customer_details?.entity_id}</p>
            </div>
          </div>
          <div>
            <div className="View-entity">
              <h5 className="label-view">First Txn Amount</h5>
              <p className="value-view">{customer_details?.first_txn_amount}</p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">MYOP Enabled</h5>
              <p className="value-view">
                {customer_details?.is_myop_enabled === true ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Referrer Details</p>
            <div className="View-entity">
              <h5 className="label-view">Referral</h5>
              <p className="value-view">
                {customer_details?.is_referral === true ? "True" : "False"}
              </p>
            </div>
            {customer_details?.is_referral && (
              <div className="View-entity">
                <h5 className="label-view">Referrer Entity Id</h5>
                <p className="value-view">
                  {customer_details?.referrer_entity_id}
                </p>
              </div>
            )}
            <div className="View-entity">
              <h5 className="label-view">Referrer Count</h5>
              <p className="value-view">{customer_details?.referred_count}</p>
            </div>
          </div>
          <div>
            <p className="innerheading">Balance Details</p>
            <div className="View-entity">
              <h5 className="label-view">Opening Balance</h5>
              <p className="value-view">
                {customerData?.opening_balance == undefined
                  ? "Nill"
                  : customerData?.opening_balance}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Closing Balance</h5>
              <p className="value-view">
                {customerData?.closing_balance == undefined
                  ? "Nill"
                  : customerData?.closing_balance}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Total Available Points</h5>
              <p className="value-view">
                {fetch_Balance_details?.available_points === undefined
                  ? "0"
                  : fetch_Balance_details?.available_points}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Total Points Earned</h5>
              <p className="value-view">
                {fetch_Balance_details?.total_points_earned == undefined
                  ? "0"
                  : fetch_Balance_details?.total_points_earned}
              </p>
            </div>
          </div>
          <div>
            <div className="View-entity">
              <h5 className="label-view">Total Points Redeem</h5>
              <p className="value-view">
                {fetch_Balance_details?.redeemed_points == undefined
                  ? "0"
                  : fetch_Balance_details?.redeemed_points}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Total Expired Points</h5>
              <p className="value-view">
                {fetch_Balance_details?.expired_points == undefined
                  ? "0"
                  : fetch_Balance_details?.expired_points}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Points Details</p>
            <div className="View-entity">
              <h5 className="label-view">Earned Points</h5>
              <p className="value-view">
                {customerData?.earned_points == undefined
                  ? "0"
                  : customerData?.earned_points}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Spent Points</h5>
              <p className="value-view">
                {customerData?.spent_points == undefined
                  ? "0"
                  : customerData?.spent_points}
              </p>
            </div>
            <div className="View-entity">
              <h5 className="label-view">Expired Points</h5>
              <p className="value-view">
                {customerData?.expired_points == undefined
                  ? "0"
                  : Math.abs(customerData?.expired_points)}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">MYOP Mapping Details</p>
            <div className="View-entity">
              <h5 className="label-view">Brand Name</h5>
            </div>
            {myop_mapping?.merchants.length !== 0 ? (
              <ul className="list_style value-view">
                {myop_mapping?.merchants.map((item, index) => (
                  <li key={index}>{item?.brandName}</li>
                ))}
              </ul>
            ) : (
              "Nil"
            )}
          </div>
          <div className="innerheading button_con">
            Transaction History
            {Tablefn.length != 0 && (
              <div
                className=""
                style={{
                  display: "flex",
                  paddingRight: "30px",
                  position: "relative",
                }}
              >
                {myop_filtetBtn.map((item, index) => (
                  <ButtonArea
                    style={{ marginRight: "7px", padding: "4px 10px" }}
                    variant={myop_filter === item.label ? "contained" : "text"}
                    key={index}
                    value={item.label}
                    type="button"
                    onClick={(e) => {
                      setmyop_filter(e.target.value);
                      if (e.target.value === "MYOP") {
                        setFilt([
                          {
                            columnField: "is_myop_history",
                            operatorValue: "startsWith",
                            value: "true",
                          },
                        ]);
                      } else if (e.target.value === "Non/MYOP") {
                        setFilt([
                          {
                            columnField: "is_myop_history",
                            operatorValue: "startsWith",
                            value: "false",
                          },
                        ]);
                      } else if (e.target.value === "All") {
                        setFilt([]);
                      }
                    }}
                  />
                ))}
                <img
                  src={download}
                  onClick={(e) => {
                    myop_filter === "All" && All_Filter(e);
                    if (myop_filter === "Non/MYOP") {
                      if (Tablefn_nonmyop.length != 0) {
                        MYOP_disable(e);
                      }
                    } else if (myop_filter === "MYOP") {
                      if (Tablefn_myop.length != 0) {
                        MYOP_enable(e);
                      }
                    }
                  }}
                  style={{
                    marginRight: "7px",
                    position: "absolute",
                    right: "0",
                    margin: "auto",
                    bottom: "0",
                    top: "0",
                    opacity:
                      Tablefn_myop.length !== 0 || Tablefn_nonmyop.length !== 0
                        ? "1"
                        : "0.6",
                    cursor:
                      Tablefn_myop.length !== 0 || Tablefn_nonmyop.length !== 0
                        ? "pointer"
                        : "text",
                  }}
                  alt="download icon"
                  className="download_icon"
                />
              </div>
            )}
          </div>
          {Tablefn.length != 0 ? (
            <DataGrid
              slots={{ toolbar: GridToolbar }}
              sx={{
                border: "unset",
                height: "calc(100vh - 220px)",
                textTransform: "capitalize",
                marginTop: "20px",
                overflowX: "scroll",
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
                  outline: "none !important",
                },
              }}
              rows={Tablefn}
              columns={columns}
              getRowId={(row) => row.wallet_history_id}
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
              hideFilterPanel
              scrollbarSize={50}
            />
          ) : (
            <>
              <h5
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                Records not found
              </h5>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
