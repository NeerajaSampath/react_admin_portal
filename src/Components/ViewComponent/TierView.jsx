import { useState, React, useEffect } from "react";
import { ButtonArea, CustomSnakebar } from "../Common/Elements";
import viewArrow from "../../assets/img/viewArrow.svg";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CHECKER_CONFIG_URL,
  CONFIG_URL,
  MAKER_URL,
  SUB_URL,
  CHECKER_URL,
} from "../../Constant";
import { GetMasterConfig } from "../../apiConfig";
import axios from "../../api";
import useChecker from "../../Hooks/useChecker";
import RejectionModal from "../RejectionModal";
import SuccessModal from "../SuccessModal";
var CryptoJS = require("crypto-js");

export const TierView = () => {
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const [Master, setMaster] = useState([]);
  const {
    setrejectState,
    rejectState,
    setSuccessMsg,
    checkerDecline,
    successState,
    setsuccessState,
    checkerApproved,
    checkerConfigStatus,
    SuccessMsg,
    Success_Alert_Msg,
  } = useChecker();
  useEffect(() => {
    GetMasterMYOP();
  }, []);
  const SECRET_KEY = `${process.env.REACT_APP_CRYPTO_SECRET}`;
  const encrypted_username = sessionStorage.getItem("logindetails");
  const username_decrypt = CryptoJS.AES.decrypt(
    encrypted_username,
    SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);
  const ViewClick = () => {
    if (location.pathname.includes(`${MAKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${CONFIG_URL}`);
    } else if (location.pathname.includes(`${CHECKER_URL}`)) {
      setSuccessMsg("");
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
    }
  };
  const tierConfigDto = JSON.parse(sessionStorage.getItem("tierViewConfigDto"));
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
  const GetMasterMYOP = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setMaster(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  //filtered master config for approved status
  const filtered_master = Master.filter((item) => item.isEnabled === true).map(
    (items) => {
      return { ...items };
    }
  );
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
        <h5 className="title">Tier Configuration</h5>
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
          {tierConfigDto?.tier_name?.toLowerCase()}{" "}
          <span className="tier_username">
            ({`Create by ${username_decrypt.replace(/^"(.*)"$/, "$1")}`})
          </span>
        </h5>
      </div>
      <div>
        <p className="innerheading">Tier Details</p>
        <div>
          <div className="View-entity">
            <span className="label-view">Tier Name</span>
            <p className="value-view">
              {tierConfigDto?.tier_name?.toLowerCase()}
            </p>
          </div>
        </div>
        <div>
          <div className="View-entity">
            <span className="label-view">Min Point Range</span>
            <p className="value-view">{tierConfigDto?.points_min_limit}</p>
          </div>
          <div className="View-entity">
            <span className="label-view">Max Point Range</span>
            <p className="value-view">{tierConfigDto?.points_max_limit}</p>
          </div>
        </div>
        <div>
          <div className="View-entity">
            <span className="label-view">Min Amount Range</span>
            <p className="value-view">{tierConfigDto?.amount_min_limit}</p>
          </div>
          <div className="View-entity">
            <span className="label-view">Max Amount Range</span>
            <p className="value-view">{tierConfigDto?.amount_max_limit}</p>
          </div>
        </div>
        <div>
          {filtered_master.length == 0 ||
          filtered_master[0]?.isMYOPEnabled === true ? (
            <>
              <div className="View-entity">
                <span className="label-view">Merchant Accelerator</span>
                <p className="value-view">{tierConfigDto?.multiplier}</p>
              </div>
            </>
          ) : null}
          {/* {Master.isMYOPEnabled && ( */}

          {/* )} */}
        </div>
        <p className="innerheading">Reward Expiry</p>
        <div>
          <div className="View-entity">
            <p className="value-view">
              {(tierConfigDto?.expiration_config?.is_monthly
                ? tierConfigDto?.expiration_config?.duration + " " + "Months"
                : "") ||
                (tierConfigDto?.expiration_config?.is_days
                  ? tierConfigDto?.expiration_config?.duration + " " + "Days"
                  : "") ||
                (tierConfigDto?.expiration_config?.is_yearly
                  ? tierConfigDto?.expiration_config?.duration + " " + "Years"
                  : "")}
            </p>
          </div>
        </div>
        <p className="innerheading">Redeem limits</p>
        <div>
          <div className="View-entity">
            <span className="label-view">Min Redeem</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.min_redeem}
            </p>
          </div>
          <div className="View-entity">
            <span className="label-view">Max Redeem</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.max_redeem}
            </p>
          </div>
        </div>
        <div>
          <div className="View-entity">
            <span className="label-view">Max Redeem Per Day</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.max_redeem_day}
            </p>
          </div>
          <div className="View-entity">
            <span className="label-view">Max Redeem Per Month</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.max_redeem_month}
            </p>
          </div>
        </div>
        <div>
          <div className="View-entity">
            <span className="label-view">Max Redeem Per Year</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.max_redeem_year}
            </p>
          </div>
          <div className="View-entity">
            <span className="label-view">Cash Conversion Factor</span>
            <p className="value-view">
              {tierConfigDto?.redemption_config?.cash_converstion_factor}
            </p>
          </div>
        </div>
        {/* {Master.isPointAccrualLimit && ( */}
        {/* <> */}
        {filtered_master.length == 0 ||
        filtered_master[0]?.isPointAccrualLimit === true ? (
          <>
            <p className="innerheading">Accrual limits</p>
            <div>
              <div className="View-entity">
                <span className="label-view">Min Accrual</span>
                <p className="value-view">
                  {tierConfigDto?.accrual_config?.min_accrual}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Max Accrual Per Day</span>
                <p className="value-view">
                  {tierConfigDto?.accrual_config?.max_accrual_per_day}
                </p>
              </div>
            </div>
            <div>
              <div className="View-entity">
                <span className="label-view">Max Accrual Per Month</span>
                <p className="value-view">
                  {tierConfigDto?.accrual_config?.max_accrual_per_month}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Max Accrual Per Year</span>
                <p className="value-view">
                  {tierConfigDto?.accrual_config?.max_accrual_per_year}
                </p>
              </div>
            </div>
          </>
        ) : null}

        <p className="innerheading">Reason for the Decline</p>
        <div className="View-entity">
          <p className="value-view" style={{ paddingTop: 0 }}>
            {tierConfigDto?.reason === null
              ? "-"
              : tierConfigDto?.reason === ""
              ? "-"
              : tierConfigDto?.reason}
          </p>
        </div>
      </div>
      <RejectionModal
        rejectState={rejectState}
        setrejectState={setrejectState}
        checkerDecline={checkerDecline}
      />
    </div>
  );
};
