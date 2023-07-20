import { React, useEffect, useState } from "react";
import { ButtonArea } from "../Common/Elements";
import Approved from "../Checker/Approved";
import Pending from "../Checker/Pending";
import Decline from "./Decline";
import { useNavigate } from "react-router-dom";
import { VIEW } from "../../Constant";
import axios from "../../api";
import useAuth from "../../Hooks/useAuth";
import { MenuItem } from "@mui/material";
import {
  GetRuleTierMapConfig,
  GetMyopConfig,
  GetMasterConfig,
  GetTierConfig,
  GetRuleConfig,
} from "../../apiConfig";
import useChecker from "../../Hooks/useChecker";

const Approval = () => {
  const CustomNavigate = useNavigate();
  const { setLoading } = useAuth();
  const ViewConfig = (id) => {
    CustomNavigate(`${VIEW}/${id}`);
  };
  const {
    setMappingDto,
    setCheckerMYOP,
    setMasterDto,
    MasterDto,
    setTierDto,
    TierDto,
    setRuleDto,
    RuleDto,
  } = useChecker();
  //status tab title
  const [configStatus, setConfigStatus] = useState("Pending");
  const statusData = [
    {
      id: "1",
      status: "Pending",
    },
    {
      id: "2",
      status: "Approved",
    },
    {
      id: "3",
      status: "Decline",
    },
  ];
  // filter data title
  const FilterData = [
    {
      id: 1,
      label: "All",
    },
    {
      id: 2,
      label: "MASTER_CONFIG",
    },
    {
      id: 3,
      label: "TIER_CONFIG",
    },
    {
      id: 4,
      label: "RULE_CONFIG",
    },
    {
      id: 5,
      label: "RULE_TIER_MAPPING_CONFIG",
    },
  ];
  //tab content function
  let tabcontent = [];
  if (configStatus === "Pending") {
    tabcontent.push(
      <Pending key="1" ViewConfig={ViewConfig} FilterData={FilterData} />
    );
  } else if (configStatus === "Approved") {
    tabcontent.push(
      <Approved key="2" ViewConfig={ViewConfig} FilterData={FilterData} />
    );
  } else if (configStatus === "Decline") {
    tabcontent.push(
      <Decline key="3" ViewConfig={ViewConfig} FilterData={FilterData} />
    );
  }
  return (
    <>
      <div className="CommonHeader">
        <h5 className="title">Configuration List</h5>
      </div>
      <div className="customtab">
        {statusData.map((item) => (
          <ButtonArea
            key={item.id}
            value={item.status}
            className={`${
              configStatus === item.status ? "Tabactive" : "Tabinactive"
            }`}
            onClick={(e) => {
              setConfigStatus(item.status);
            }}
            type="button"
            variant="text"
          />
        ))}
      </div>
      <div className="TabContent">{tabcontent}</div>
    </>
  );
};

export default Approval;
