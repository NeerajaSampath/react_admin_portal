import { useState, React, useEffect } from "react";
import viewArrow from "../../assets/img/viewArrow.svg";
import axios from "../../api";
import { useNavigate, useLocation } from "react-router-dom";
import {
  REWARD_URL,
  MAKER_URL,
  SUB_URL,
  CHECKER_CONFIG_URL,
  CHECKER_URL,
} from "../../Constant";
import useAuth from "../../Hooks/useAuth";
import useChecker from "../../Hooks/useChecker";
import { ButtonArea, CustomSnakebar } from "../Common/Elements";
import SuccessModal from "../SuccessModal";
import RejectionModal from "../RejectionModal";
import { GetMccConfig } from "../../apiConfig";

export const RewardView = () => {
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const { setLoading } = useAuth();
  const {
    setrejectState,
    rejectState,
    setsuccessState,
    successState,
    checkerApproved,
    checkerConfigStatus,
    checkerDecline,
    SuccessMsg,
    setSuccessMsg,
    // ruleConfigDto,
    setruleConfigDto,
    Success_Alert_Msg,
  } = useChecker();
  const [mcc_id, setmcc_id] = useState([]);
  useEffect(() => {
    GetMcc_CodeApi();
  }, []);
  const ViewClick = () => {
    if (location.pathname.includes(`${MAKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`);
    } else if (location.pathname.includes(`${CHECKER_URL}`)) {
      setSuccessMsg("");
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
    }
  };
  const ruleConfigDto = JSON.parse(sessionStorage.getItem("ruleViewConfigDto"));
  //mcc static id integration
  const arr = ruleConfigDto?.mcc_ids;
  const GetMcc_CodeApi = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetMccConfig}`,
      });
      setLoading(false);
      setmcc_id(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  //filter for mcc id
  const mcc_code_filter = mcc_id
    .filter((mcc_code) => {
      return arr.includes(mcc_code?.mccId);
    })
    .map((item) => {
      return { ...item };
    });
  const [open, setopen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopen(false);
  };
  useEffect(() => {
    if (SuccessMsg === 409) {
      setopen(true);
    } else {
      setopen(false);
    }
  }, [SuccessMsg]);
  console.log("ruleConfigDto?.reason", ruleConfigDto?.reason);
  return (
    <div>
      {SuccessMsg == 409 ? (
        <CustomSnakebar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          alertmsg={Success_Alert_Msg}
          severity="error"
        />
      ) : SuccessMsg == "success" ? (
        <SuccessModal
          successState={successState}
          setsuccessState={setsuccessState}
        />
      ) : null}
      <div className="CommonHeader">
        <h5 className="title">Reward Rule</h5>
        <div>
          {location.pathname.includes(`${CHECKER_URL}`) && (
            <>
              <ButtonArea
                type="button"
                variant="text"
                value="Decline"
                onClick={() => {
                  setrejectState(!rejectState);
                  setSuccessMsg("");
                }}
                disabled={checkerConfigStatus !== "PENDING" ? true : false}
              />
              <ButtonArea
                variant="contained"
                type="submit"
                value="Approval"
                onClick={() => {
                  checkerApproved();
                  if (SuccessMsg === "success") {
                    setsuccessState(true);
                  } else {
                    setopen(true);
                    setsuccessState(false);
                  }
                }}
                disabled={checkerConfigStatus !== "PENDING" ? true : false}
              />
            </>
          )}
        </div>
      </div>
      <div className="common-inner-header view-heading">
        <img onClick={ViewClick} src={viewArrow} alt="back icon" />
        <h5>
          <span>
            (Request ID) -{ruleConfigDto.rule_config_id} - Rewards (
            {ruleConfigDto.txn_type?.toLowerCase()})
          </span>
        </h5>
      </div>
      <div>
        <p className="innerheading">Transaction Details</p>
        <div>
          <div className="View-entity">
            <span className="label-view">Transaction Type</span>
            <p className="value-view">
              {ruleConfigDto.txn_type?.toLowerCase()}
            </p>
          </div>
          <div className="View-entity">
            <span className="label-view">Transaction Sub Type</span>
            <p className="value-view">
              {ruleConfigDto.txn_sub_type?.toLowerCase()}
            </p>
          </div>
        </div>
        <div>
          <p className="innerheading">Reward Details</p>
          {ruleConfigDto.is_points_by_percentage ? (
            <div className="View-entity">
              <span className="label-view">Reward Type</span>
              <p className="value-view">Percentage</p>
            </div>
          ) : ruleConfigDto.is_points_by_value === true ? (
            <div className="View-entity">
              <span className="label-view">Reward Type</span>
              <p className="value-view">Absolute</p>
            </div>
          ) : null}

          <div className="View-entity">
            <span className="label-view">Min Amount</span>
            <p className="value-view">
              {ruleConfigDto.min_value === null ? "0" : ruleConfigDto.min_value}
            </p>
          </div>
          <div className="View-entity">
            <span className="label-view">Max Amount</span>
            <p className="value-view">{ruleConfigDto.max_value}</p>
          </div>
        </div>
        <div>
          <div className="View-entity">
            <span className="label-view">Blocked MCC Codes</span>
            {mcc_code_filter.length !== 0 ? (
              <ul className="value-view">
                {mcc_code_filter.map((item) => (
                  <li key={item.mccId} className="mcc_list">
                    {item.mccCode + " - " + item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="value-view">Nil</p>
            )}
          </div>
        </div>
        <div>
          <p className="innerheading">Recurring Details</p>
          <div className="View-entity">
            <span className="label-view">Recurring</span>
            <p className="value-view">
              {ruleConfigDto.is_recurring === true ? "True" : "False"}
            </p>
          </div>
          {ruleConfigDto.is_recurring === true && (
            <>
              <div className="View-entity">
                <span className="label-view">Duration</span>
                <p className="value-view">
                  {ruleConfigDto.duration + " "}
                  {ruleConfigDto.is_monthly ? "Months" : null}
                  {ruleConfigDto.is_yearly ? "Years" : null}
                  {ruleConfigDto.is_days ? "Days" : null}
                </p>
              </div>
            </>
          )}
          <div>
            <p className="innerheading">Referral Details</p>
            <div className="View-entity">
              <span className="label-view">Referral</span>
              <p className="value-view">
                {ruleConfigDto.is_referral === true ? "True" : "False"}
              </p>
            </div>
            {ruleConfigDto.is_referral === true && (
              <>
                <div className="View-entity">
                  <span className="label-view">Per Referral</span>
                  <p className="value-view">
                    {ruleConfigDto.is_per_referral === true ? "True" : "False"}
                  </p>
                </div>
                <div className="View-entity">
                  <span className="label-view">Milestone</span>
                  <p className="value-view">
                    {ruleConfigDto.is_milestone === true ? "True" : "False"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="innerheading">Event Details</p>
          <div className="View-entity">
            <span className="label-view">Event</span>
            <p className="value-view">
              {ruleConfigDto.is_event === true ? "True" : "False"}
            </p>
          </div>
        </div>
      </div>
      <p className="innerheading">Reason for the Decline</p>
      <div className="View-entity">
        <p className="value-view" style={{ paddingTop: 0 }}>
          {ruleConfigDto?.reason === null
            ? "-"
            : ruleConfigDto?.reason === ""
            ? "-"
            : ruleConfigDto?.reason}
        </p>
      </div>
      <RejectionModal
        rejectState={rejectState}
        setrejectState={setrejectState}
        checkerDecline={checkerDecline}
        ruleConfigDto={ruleConfigDto}
      />
    </div>
  );
};
