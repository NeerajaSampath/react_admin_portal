import { React, useEffect, useState } from "react";
import axios from "../../../api";
import { GetTypeConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../Common/Elements";
import { useNavigate } from "react-router-dom";
import { MAKER_URL, REWARD_URL, SUB_URL } from "../../../Constant";
import { MenuItem } from "@mui/material";
import useAuth from "../../../Hooks/useAuth";
import RuleCreate from "./CreateRewardComponent/RuleCreate";
import { uuid4 } from "@sentry/utils";

export const CreateReward = ({ setRuleApproval }) => {
  const CustomNavigate = useNavigate();
  const { setLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [RewardTab, setRewardTab] = useState([]);
  const [Rewardtypeid, setRewardtypeid] = useState();
  const [listOptions, setListOptions] = useState([]);
  const [customlabel, setCustomLabel] = useState();
  const [FieldShow, setFieldShow] = useState(false);
  const [rule_msg, setrule_msg] = useState(false);
  //toast close function
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const rule_msg_close = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setrule_msg(false);
  };
  //type api call
  useEffect(() => {
    RewardTabAPI();
  }, []);
  useEffect(() => {
    LoadingAPI();
    getOptions(RewardTab);
    if (RewardTab.length === 0) {
      const timer = setTimeout(() => {
        setrule_msg(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setrule_msg(false);
    }
  }, [RewardTab]);
  const LoadingAPI = () => {
    const firstElement = RewardTab[0];
    const First_Element_Id = firstElement?.typeId;
    const First_Element_Type = firstElement?.typeName.toLowerCase();
    setRewardtypeid(First_Element_Id);
    setCustomLabel(First_Element_Type);
  };
  const RewardTabAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetTypeConfig}/0/1000`);
      setLoading(false);
      setRewardTab(res?.data?.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  //redirection click
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`);
    setRuleApproval(true);
  };
  const cancelRedirect = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`);
  };
  //subtype menuitem and length
  const rulesubtype = RewardTab.filter(
    (typeid) => typeid.typeId === Rewardtypeid
  ).map((items) =>
    items.subTypeConfigDTOS.map((item) => (
      <MenuItem
        sx={{ fontSize: "14px", textTransform: "capitalize" }}
        key={item.subTypeId}
        maintypeid={item.typeId}
        value={item.subTypeName}
      >
        {item.subTypeName.toLowerCase()}
      </MenuItem>
    ))
  );
  const rulesubtypeLength = RewardTab.filter(
    (typeid) => typeid.typeId === Rewardtypeid
  ).map((items) => items.subTypeConfigDTOS.length);
  function getOptions(RewardTab) {
    const createList = RewardTab?.map((i) =>
      i.subTypeConfigDTOS.map((j) => j)
    ).flat(1);
    setListOptions(createList);
  }
  //tab content for rule config
  let tabcontent = [];
  tabcontent.push(
    <RuleCreate
      key={uuid4()}
      rulesubtype={rulesubtype}
      rulesubtypeLength={rulesubtypeLength}
      listOptions={listOptions}
      setFieldShow={setFieldShow}
      FieldShow={FieldShow}
      customlabel={customlabel}
      TableCom={TableCom}
      setOpen={setOpen}
      open={open}
      handleClose={handleClose}
      CustomNavigate={CustomNavigate}
      setmsg_error={setmsg_error}
      msg_error={msg_error}
    />
  );
  return (
    <>
      <div className="CommonHeader">
        <h5 className="title">Reward Rule</h5>
        <div>
          <ButtonArea
            onClick={() => {
              cancelRedirect();
            }}
            type="button"
            variant="text"
            value="cancel"
          />
        </div>
      </div>
      {RewardTab.length != 0 && (
        <>
          <div className="customtab">
            {RewardTab.map((item) => (
              <ButtonArea
                key={item.typeId}
                value={item.typeName.toLowerCase()}
                className={`${
                  customlabel === item.typeName.toLowerCase()
                    ? "Tabactive"
                    : "Tabinactive"
                }`}
                onClick={(e) => {
                  setCustomLabel(item.typeName.toLowerCase());
                  setRewardtypeid(item.typeId);
                }}
                type="button"
                variant="text"
              />
            ))}
          </div>
          <div className="TabContent">{tabcontent}</div>
        </>
      )}
      <CustomSnakebar
        open={rule_msg}
        onClose={rule_msg_close}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        alertmsg="Before creating a Rule configuration, please set up Type configuration from Backend."
        severity="info"
      />
    </>
  );
};
