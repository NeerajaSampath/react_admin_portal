import { React, useEffect, useState } from "react";
import axios from "../api";
import { GetDashboardConfig } from "../apiConfig";
import { ButtonArea, DefaultSelect } from "./Common/Elements";
import { DataGrid } from "@mui/x-data-grid";
import { VIEW, REWARD_URL, CONFIG_URL, MAKER_URL, SUB_URL } from "../Constant";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useAuth from "../Hooks/useAuth";
import PropTypes from "prop-types";
// import CircularProgress from "@mui/joy/CircularProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
ChartJS.register(ArcElement, Tooltip, Legend);

// function CircularProgressWithLabel(props) {
//   return (
//     <div style={{ position: "relative", display: "inline-flex" }}>
//       <CircularProgress
//         size={100}
//         determinate
//         // variant="soft"
//         value={props.value}
//         {...props}
//       />
//       <Box
//         sx={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//           position: "absolute",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography variant="caption" component="div" color="text.secondary">
//           {`${Math.round(props.value)}%`}
//         </Typography>
//       </Box>
//     </div>
//   );
// }

// CircularProgressWithLabel.propTypes = {
//   /**
//    * The value of the progress indicator for the determinate variant.
//    * Value between 0 and 100.
//    * @default 0
//    */
//   value: PropTypes.number.isRequired,
// };

export default function Dashboard() {
  const CustomNavigate = useNavigate();
  const [dashboardData, setdashboardData] = useState([]);
  const [RuleDashboard, setRuleDashboard] = useState([]);
  const [TierDashboard, setTierDashboard] = useState([]);
  const { setLoading } = useAuth();
  const Rule_Details = "Rule Details";
  const Tier_Details = "Tier Details";
  const [customlabel, setCustomLabel] = useState(`${Rule_Details}`);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const CurrentMonth = `${moment()
    .startOf("month")
    .format("YYYY-MM-DD")}/${moment().endOf("month").format("YYYY-MM-DD")}`;
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderRadius: 0,
        hoverOffset: 4,
        responsive: true,
        borderWidth: 0,
      },
    ],
  };
  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = "14px";
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "top";
        var text = dashboardData?.total_earned_points,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
  //rule details
  const RuleformateData = (data) => {
    let F_data = [];
    data.forEach((inner_data) => {
      F_data.push({
        id: inner_data?.rule_config_id,
        name:
          inner_data?.rule_name != null
            ? inner_data?.rule_name.toLowerCase()
            : inner_data?.rule_name,
        points_earned: inner_data?.total_earned_points,
        action: "",
      });
    });
    return F_data;
  };
  //tier details
  const TierformateData = (data) => {
    let F_data = [];
    data.forEach((inner_data) => {
      F_data.push({
        id: inner_data?.tier_id,
        name: inner_data?.tier_name.toLowerCase(),
        points_earned: inner_data?.earned_points,
        action: "",
      });
    });
    return F_data;
  };
  //api call fro the dashboard
  useEffect(() => {
    DashboardAPI();
  }, []);
  const DashboardAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetDashboardConfig}/${CurrentMonth}`);
      let Rule_formate_data = RuleformateData(
        res.data.data.rule_earned_points_list
      );
      let Tier_formate_data = TierformateData(
        res.data.data.tier_earned_points_list
      );
      setdashboardData(res.data.data);
      setRuleDashboard(Rule_formate_data);
      setTierDashboard(Tier_formate_data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  //redirection for the rule config
  const ViewReward = (id) => {
    CustomNavigate(`../${SUB_URL}/${MAKER_URL}/${REWARD_URL}/${VIEW}/${id}`);
  };
  const ViewTier = (id) => {
    CustomNavigate(`../${SUB_URL}/${MAKER_URL}/${CONFIG_URL}/${VIEW}/${id}`);
  };
  const RuleCol = [
    {
      field: `name`,
      headerName: "Rule Name",
      headerClassName: "Table-header",
      sortable: false,
      flex: 1,
    },
    {
      field: `points_earned`,
      headerName: "Earned Points",
      align: "right",
      headerAlign: "right",
      sortable: false,
      headerClassName: "Table-header",
      flex: 1,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   headerClassName: "Table-header",
    //   align: "left",
    //   renderCell: (params) => (
    //     <>
    //       <ButtonArea
    //         onClick={() => {
    //           console.log("clicked");
    //           const rule = sessionStorage.setItem("ruleConfigDto", );
    //           // ViewReward(params?.id)
    //         }}
    //         variant="text"
    //         type="button"
    //         value="view"
    //         className="viewbtn"
    //       />
    //     </>
    //   ),
    // },
  ];
  const TierCol = [
    {
      field: `name`,
      headerName: "Tier Name",
      sortable: false,
      headerClassName: "Table-header",
      flex: 1,
    },
    {
      field: `points_earned`,
      headerName: "Earned Points",
      align: "right",
      sortable: false,
      headerAlign: "right",
      headerClassName: "Table-header",
      flex: 1,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   headerClassName: "Table-header",
    //   align: "left",
    //   renderCell: (params) => (
    //     <>
    //       <ButtonArea
    //         onClick={() => ViewTier(params?.id)}
    //         variant="text"
    //         type="button"
    //         value="view"
    //         className="viewbtn"
    //       />
    //     </>
    //   ),
    // },
  ];
  let tabcontent = [];
  if (customlabel === `${Rule_Details}`) {
    tabcontent.push(
      <div key="1" className="dashboard_table">
        <DataGrid
          sx={{
            border: "unset",
            minHeight: "300px",
            textTransform: "capitalize",
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            },
          }}
          rows={RuleDashboard}
          columns={RuleCol}
          hideFooter={true}
          getRowId={(row) => row.id}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? "table-body odd"
              : "table-body even"
          }
        />
      </div>
    );
  } else if (customlabel === `${Tier_Details}`) {
    tabcontent.push(
      <div key="1" className="dashboard_table">
        <DataGrid
          sx={{
            border: "unset",
            minHeight: "300px",
            textTransform: "capitalize",
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            },
          }}
          rows={TierDashboard}
          columns={TierCol}
          hideFooter={true}
          getRowId={(row) => row.id}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? "table-body odd"
              : "table-body even"
          }
        />
      </div>
    );
  }
  return (
    <>
      <div className="CommonHeader">
        <h5 className="title">Dashboard</h5>
      </div>
      {/* <CircularProgress
        variant="determinate"
        value={50}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "100%",
          boxShadow: "inset 0 0 0px 11px #ccc",
          backgroundColor: "transparent",
        }}
        thickness={5}
      >
        50
        {dashboardData?.total_earned_points}
      </CircularProgress> */}
      {/* <CircularProgressWithLabel value={dashboardData?.total_earned_points} /> */}
      <div>
        {/* <DefaultSelect
        labelId='SelectedateLabel'
        id="SelectedateSelect"
        label="Select date"
        onChange={DateHandleChange}
        name="Selectedate"
        value={SelectedDate}
        optionvalue={optionValue}
        /> */}
        {/* {ShowField && <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{fontSize: '12px'}}
              label="From Date"
              value={FromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
                setApidate(customdate);
              }}
              maxDate={moment(new Date()).subtract(1, 'day')}
              renderInput={(params) => <TextArea {...params} className='CustomInput datepicker' />}
            />
            <DatePicker
              sx={{fontSize: '12px'}}
              label="To Date"
              value={Todate}
              minDate={new Date()}
              onChange={(newValue) => {
                setTodate(newValue);
                setApidate(customdate);
              }}
              renderInput={(params) => <TextArea {...params} className='CustomInput datepicker' />}
            />
          </LocalizationProvider>
        </>} */}
      </div>
      <div>
        {/* <Doughnut
          data={data}
          plugins={plugins}
          width={250}
          height={250}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: "90%",
            // fill: true,
            pointHitRadius: 90,
            legend: {
              display: true,
              position: "bottom",
              usePointStyle: "true",
              labels: {
                fontSize: 12,
                padding: 25,
                fontColor: "red",
              },
            },
            layout: {
              padding: 40,
            },
          }}
        /> */}
      </div>
      <div className="total_data">
        <div className="inner_data">
          <p>Total Earned Points</p>
          <span>{dashboardData.total_earned_points}</span>
          <span className="time_period">Current Month</span>
        </div>
        <div className="inner_data">
          <p>Total Expired Points</p>
          <span>{dashboardData.total_expired_points}</span>
          <span className="time_period">Current Month</span>
        </div>
        <div className="inner_data">
          <p>Total Cash Redemption Points</p>
          <span>{dashboardData.cash_redemption_points}</span>
          <span className="time_period">Current Month</span>
        </div>
        <div className="inner_data">
          <p>Total Catalogue Redemption Points</p>
          <span>{dashboardData.catalogue_redemption_points}</span>
          <span className="time_period">Current Month</span>
        </div>
      </div>
      <h5 className="custom_head">Points Summary - LTD </h5>
      <div>
        <div className="customtab">
          <ButtonArea
            value={Rule_Details}
            className={`${
              customlabel === `${Rule_Details}` ? "Tabactive" : "Tabinactive"
            }`}
            type="button"
            variant="text"
            onClick={() => {
              setCustomLabel(`${Rule_Details}`);
            }}
          />
          <ButtonArea
            value={Tier_Details}
            className={`${
              customlabel === `${Tier_Details}` ? "Tabactive" : "Tabinactive"
            }`}
            type="button"
            variant="text"
            onClick={() => {
              setCustomLabel(`${Tier_Details}`);
            }}
          />
        </div>
        <div className="TabContent">{tabcontent}</div>
      </div>
    </>
  );
}
