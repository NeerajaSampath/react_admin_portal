import React, { useState, useEffect } from "react";
import Header from "./Components/Common/Header";
import "./assets/Styles/style.css";
import Sidebar from "./Components/Common/Asidebar";
import { Route, Routes } from "react-router-dom";
import { CreateReward } from "./Components/Maker/RewardRule/CreateReward";
import { RewardView } from "./Components/ViewComponent/RewardView";
import { RewardTable } from "./Components/Maker/RewardRule/RewardTable";
import { CreateTier } from "./Components/Maker/TierConfig/CreateTier";
import { TierView } from "./Components/ViewComponent/TierView";
import { TierTable } from "./Components/Maker/TierConfig/TierTable";
import { CreateRuleTier } from "./Components/Maker/RuleTierMap/CreateRuleTier";
import { RuleTierTable } from "./Components/Maker/RuleTierMap/RuleTierTable";
import { RuleTierView } from "./Components/ViewComponent/RuleTierView";
import { CustomSnakebar } from "./Components/Common/Elements";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  REPORT_URL,
  RULETIER_URL,
  CREATE,
  VIEW,
  HOME_URL,
  REWARD_URL,
  CONFIG_URL,
  MASTERCONFIG_URL,
  MYOP_URL,
  LOGIN_URL,
  MAKER_URL,
  CHECKER_URL,
  SUPPORT_URL,
  SUB_URL,
  CHECKER_CONFIG_URL,
  EXPIRY_URL,
  EDIT,
} from "./Constant";
import { ErrorPage } from "./ErrorPage";
import MYOPTable from "./Components/Maker/MYOPConfig/MYOPTable";
import Layout from "./Components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "./api";
import { RefreshConfig, GetMasterConfig, LoginConfig } from "./apiConfig";
import styled from "styled-components";
import Dashboard from "./Components/Dashboard";
import CustomerDetails from "./Components/SupportPortal/CustomerDetails";
import { useIdleTimer } from "react-idle-timer";
import useAuth from "./Hooks/useAuth";
import Config from "./Components/Checker/Config";
import useChecker from "./Hooks/useChecker";
import MYOPView from "./Components/ViewComponent/MYOPView";
import { MasterTable } from "./Components/Maker/MaterConfig/MasterTable";
import { MasterView } from "./Components/ViewComponent/MasterView.jsx";
import { CreateMasters } from "./Components/Maker/MaterConfig/CreateMasters";
import { ExpiryTable } from "./Components/Maker/ExpiryConfig/ExpiryTable";
import { ExpiryView } from "./Components/ViewComponent/ExpiryView";
import { MasterEdit } from "./Components/Maker/MaterConfig/MasterEdit";
import { EditTier } from "./Components/Maker/TierConfig/EditTier";
import { EditRule } from "./Components/Maker/RewardRule/EditRule";
import RuleTierEdit from "./Components/Maker/RuleTierMap/RuleTierEdit";

var CryptoJS = require("crypto-js");

const Admin = () => {
  const { setunauth, setmaster_update, setLoading } = useAuth();
  const { checkerView } = useChecker();
  const CustomNavigate = useNavigate();
  const [TierApproval, setTierApproval] = useState(false);
  const [TierMapping, setTierMapping] = useState(false);
  const [RuleApproval, setRuleApproval] = useState(false);
  useEffect(() => {
    MastergetAPI();
  }, []);
  const MastergetAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setLoading(false);
      setmaster_update(res?.data?.data);
      if (sessionStorage.getItem("role") === "admin-portal-maker") {
        if (!res?.data?.data.length) {
          CustomNavigate(
            `/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}/${CREATE}`
          );
        } else {
          CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${HOME_URL}`);
        }
      } else if (sessionStorage.getItem("role") === "admin-portal-checker") {
        CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${HOME_URL}`);
      } else if (sessionStorage.getItem("role") === "admin-portal-support") {
        CustomNavigate(`/${SUB_URL}/${SUPPORT_URL}`);
      }
    } catch (error) {
      setLoading(false);
      // console.log("error", error);
    }
  };
  //screen idle validation
  const handleOnIdle = (event) => {
    CustomNavigate(`/${SUB_URL}/${LOGIN_URL}`);
    sessionStorage.clear();
  };
  const handleOnActive = (event) => {
    console.log("time remaining", getRemainingTime());
  };
  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });
  //login function for the refresh token
  const LoginApi = async () => {
    const SECRET_KEY = `${process.env.REACT_APP_CRYPTO_SECRET}`;
    const encrypted_username = sessionStorage.getItem("logindetails");
    const encrypted_password = sessionStorage.getItem("logindetailspass");
    const username_decrypt = CryptoJS.AES.decrypt(
      encrypted_username,
      SECRET_KEY
    )
      .toString(CryptoJS.enc.Utf8)
      .replace(/\/+$/, "");
    const pass_decrypt = CryptoJS.AES.decrypt(encrypted_password, SECRET_KEY)
      .toString(CryptoJS.enc.Utf8)
      .replace(/\/+$/, "");
    const payLoad = {
      username: JSON.parse(username_decrypt),
      password: JSON.parse(pass_decrypt),
    };
    const resp = await axios({
      method: "post",
      url: `${LoginConfig}`,
      data: payLoad,
      headers: {
        Authorization: null,
        "Access-Control-Allow-Origin": "*",
      },
    });
    sessionStorage.setItem("access_token", resp.data.access_token);
    sessionStorage.setItem("refresh_token", resp.data.refresh_token);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${sessionStorage.getItem("access_token")}`;
  };
  const MINUTE_MS = 14.9 * 60 * 1000;
  useEffect(() => {
    const interval = setInterval(() => {
      LoginApi();
    }, MINUTE_MS);
    return () => {
      clearInterval(interval);
      //when screen get reload : need to call login function
      LoginApi();
      //adding auth
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem(
        "access_token"
      )}`;
    };
  }, []);
  //common header using axios for auth
  axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem(
    "access_token"
  )}`;

  //503 and login function triger
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status == 503) {
        console.log("temporarily unavailable");
        setunauth(true);
      } else if (error.response.status == 0) {
        return LoginApi();
      }
      return Promise.reject(error);
    }
  );
  // Axios interceptor to handle expired tokens
  // axios.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     const originalRequest = error.config;
  //     if (error.response.status === 0 && !originalRequest._retry) {
  //       console.log("if condition for token expiry", accessToken);
  //       originalRequest._retry = true;
  //       return refreshAccessToken().then(() => {
  //         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  //         return axios(originalRequest);
  //       });
  //     }
  //     return Promise.reject(error);
  //   }
  // );
  //refresh token function
  const refreshTokenEndpoint = `${RefreshConfig}`;
  let accessToken = `${sessionStorage.getItem("access_token")}`;
  let refreshToken = `${sessionStorage.getItem("refresh_token")}`;
  // Function to refresh the access token using the refresh token
  async function refreshAccessToken() {
    try {
      const response = await axios.post(refreshTokenEndpoint, {
        refresh_token: refreshToken,
      });
      accessToken = response.data.access_token;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  return (
    <Appstyle>
      <div className="main">
        <Header />
        <div className="mainDiv">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="content">
            <Routes>
              {/* Maker routes */}
              <Route
                index
                path={`/${SUB_URL}/${MAKER_URL}/${HOME_URL}`}
                element={<Dashboard />}
              />
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`}
                element={<Layout />}
              >
                <Route
                  index
                  element={
                    <RewardTable
                      RuleApproval={RuleApproval}
                      setRuleApproval={setRuleApproval}
                    />
                  }
                />
                <Route
                  path={`${CREATE}`}
                  element={<CreateReward setRuleApproval={setRuleApproval} />}
                />
                <Route path={`${VIEW}/:id`} element={<RewardView />} />
                <Route path={`${EDIT}/:id`} element={<EditRule />} />
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}`}
                element={<Layout />}
              >
                <Route index element={<MasterTable />} />
                <Route path={`${CREATE}`} element={<CreateMasters />} />
                <Route path={`${VIEW}/:id`} element={<MasterView />} />
                <Route path={`${EDIT}/:id`} element={<MasterEdit />} />
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${EXPIRY_URL}`}
                element={<Layout />}
              >
                <Route index element={<ExpiryTable />} />
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${CONFIG_URL}`}
                element={<Layout />}
              >
                <Route
                  index
                  element={
                    <TierTable
                      setTierApproval={setTierApproval}
                      TierApproval={TierApproval}
                    />
                  }
                />
                <Route
                  path={`${CREATE}`}
                  element={<CreateTier setTierApproval={setTierApproval} />}
                />
                <Route path={`${VIEW}/:id`} element={<TierView />} />
                <Route path={`${EDIT}/:id`} element={<EditTier />} />
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${REPORT_URL}`}
                element={<Layout />}
              />
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${RULETIER_URL}`}
                element={<Layout />}
              >
                <Route
                  index
                  element={
                    <RuleTierTable
                      TierMapping={TierMapping}
                      setTierMapping={setTierMapping}
                    />
                  }
                />
                <Route
                  path={`${CREATE}`}
                  element={<CreateRuleTier setTierMapping={setTierMapping} />}
                />
                <Route path={`${VIEW}/:id`} element={<RuleTierView />} />
                <Route path={`${EDIT}/:id`} element={<RuleTierEdit />} />
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}`}
                element={<Layout />}
              >
                {/* <Route
                  index
                  path={`${VIEW}`}
                  element={<MasterExpiryConfig />}
                /> */}
              </Route>
              <Route
                path={`/${SUB_URL}/${MAKER_URL}/${MYOP_URL}`}
                element={<Layout />}
              >
                <Route index element={<MYOPTable />} />
              </Route>

              {/* checker route */}
              <Route
                path={`/${SUB_URL}/${CHECKER_URL}/${HOME_URL}`}
                index
                element={<Dashboard />}
              />
              <Route
                path={`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`}
                element={<Layout />}
              >
                <Route index element={<Config />} />
                <Route
                  path={`${VIEW}/:id`}
                  index
                  element={
                    // <MasterView />
                    <>
                      {checkerView === "TIER_CONFIG" && <TierView />}
                      {checkerView === "RULE_CONFIG" && <RewardView />}
                      {checkerView === "EXPIRATION_CONFIG" && <ExpiryView />}
                      {checkerView === "MASTER_CONFIG" && <MasterView />}
                      {checkerView === "RULE_TIER_MAPPING_CONFIG" && (
                        <RuleTierView />
                      )}
                      {checkerView === "MYOP_CONFIG" && <MYOPView />}
                    </>
                  }
                />
              </Route>
              {/* Support portal */}
              <Route
                path={`/${SUB_URL}/${SUPPORT_URL}`}
                index
                element={<CustomerDetails />}
              />
              <Route
                path="*"
                element={
                  <ErrorPage
                    statusCode="404"
                    msg="Page Not Found"
                    description="The page you`re looking for does not seem to exits"
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Appstyle>
  );
};

export default Admin;
const Appstyle = styled.div`
  .main {
    background: var(--bgColor);
    height: 100vh;
    overflow: hidden;
    .mainDiv {
      width: 100%;
      display: flex;
      height: calc(100% - 100px);
      .sidebar {
        width: 250px;
        background: var(--primary);
        box-shadow: 9.50079px 3.80032px 9.50079px rgb(231 231 255 / 15%);
        margin-top: 16px;
        border-radius: 0px 20px 20px 0px;
        height: 100%;
      }
      .content {
        width: calc(100% - 250px);
        margin: 16px;
        background: var(--brandWhite);
        box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        height: 100%;
        overflow-y: scroll;
        padding: 20px;
        position: relative;
      }
    }
  }
`;
