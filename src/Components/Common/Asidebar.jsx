import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/img/home.svg";
import RewardIcon from "../../assets/img/rewardsRule.svg";
import TierConfig from "../../assets/img/tierConfig.svg";
import TierAssign from "../../assets/img/tierAssign.svg";
import ReportIcon from "../../assets/img/Report.svg";
import Pending from "../../assets/img/pending.svg";
import styled from "styled-components";
import {
  CONFIG_URL,
  REWARD_URL,
  MASTERCONFIG_URL,
  RULETIER_URL,
  REPORT_URL,
  MYOP_URL,
  HOME_URL,
  VIEW,
  MAKER_URL,
  CHECKER_URL,
  SUPPORT_URL,
  SUB_URL,
  CHECKER_CONFIG_URL,
  LOGIN_URL,
  EXPIRY_URL,
} from "../../Constant";
import useAuth from "../../Hooks/useAuth";

const Asidebar = () => {
  const { master_update, master_filter_myop } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("role") === null) {
      navigate(`/${SUB_URL}/${LOGIN_URL}`);
    }
  }, []);
  return (
    <SideBar>
      <div className="sidebarDiv">
        {sessionStorage.getItem("role") === `admin-portal-maker` && (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${HOME_URL}`}
            >
              <img src={HomeIcon} alt="HomeIcon" />
              <h1>Home</h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}`}
            >
              <img src={TierConfig} alt="TierConfig" />
              <h1>Master Configuration</h1>
            </NavLink>
            {master_filter_myop?.includes(true) && (
              <NavLink
                className={({ isActive }) =>
                  isActive ? "sidebarContent active" : "sidebarContent"
                }
                to={`/${SUB_URL}/${MAKER_URL}/${MYOP_URL}`}
              >
                <img src={ReportIcon} alt="Refferral" />
                <h1>MYOP Configuration</h1>
              </NavLink>
            )}
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${EXPIRY_URL}`}
            >
              <img src={TierConfig} alt="TierConfig" />
              <h1>Expiry Configuration</h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${CONFIG_URL}`}
            >
              <img src={TierConfig} alt="TierConfig" />
              <h1>Tier Configuration</h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`}
            >
              <img src={RewardIcon} alt="RewardIcon" />
              <h1>Reward Rule</h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${MAKER_URL}/${RULETIER_URL}`}
            >
              <img src={TierAssign} alt="TierAssign" />
              <h1>Rule Tier Mapping</h1>
            </NavLink>
            {/* <NavLink className={({ isActive }) => (isActive ? 'sidebarContent active' : 'sidebarContent')} to={`/${SUB_URL}/${MAKER_URL}/${REPORT_URL}`} >
                    <img src={ReportIcon} alt="ReportIcon" />
                    <h1>Report</h1>
                </NavLink> */}
          </>
        )}
        {sessionStorage.getItem("role") === `admin-portal-checker` && (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${CHECKER_URL}/${HOME_URL}`}
            >
              <img src={HomeIcon} alt="HomeIcon" />
              <h1>Home</h1>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`}
            >
              <img src={Pending} alt="ApprovalIcon" />
              <h1>Configuration List</h1>
            </NavLink>
          </>
        )}
        {sessionStorage.getItem("role") === `admin-portal-support` && (
          <>
            <NavLink
              className={({ isActive }) =>
                isActive ? "sidebarContent active" : "sidebarContent"
              }
              to={`/${SUB_URL}/${SUPPORT_URL}`}
            >
              <img src={Pending} alt="ApprovalIcon" />
              <h1>Find Customer</h1>
            </NavLink>
          </>
        )}
      </div>
    </SideBar>
  );
};

export default Asidebar;

const SideBar = styled.div`
  .sidebarDiv {
    padding-top: 25px;
    margin-right: 20px;
    height: calc(100% - 100px);
    .sidebarContent {
      display: flex;
      align-items: center;
      padding: 9px 0px;
      text-decoration: none;
      padding-left: 25px;
      img {
        margin-right: 12px;
        width: 20px;
        height: 21px;
      }
      h1 {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        color: var(--brandWhite);
      }
    }
  }
  .active {
    background: var(--SidebarActive);
    border-radius: 0px 6px 6px 0px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      width: 5px;
      height: 39px;
      left: 0;
      background-color: Var(--brandWhite);
      border-radius: 0px 6px 6px 0px;
    }
  }
`;
