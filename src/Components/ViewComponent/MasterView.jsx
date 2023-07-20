import { useState, React, useEffect } from "react";
import viewArrow from "../../assets/img/viewArrow.svg";
import { useNavigate, useLocation } from "react-router-dom";
import useChecker from "../../Hooks/useChecker";
import {
  MAKER_URL,
  SUB_URL,
  CHECKER_URL,
  CHECKER_CONFIG_URL,
  MASTERCONFIG_URL,
} from "../../Constant";
import SuccessModal from "../SuccessModal";
import { ButtonArea, CustomSnakebar } from "../Common/Elements";
import RejectionModal from "../RejectionModal";

export const MasterView = () => {
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const {
    rejectState,
    setrejectState,
    setsuccessState,
    successState,
    checkerApproved,
    checkerConfigStatus,
    MasterView_state,
    setMasterView_state,
    checkerDecline,
    SuccessMsg,
    setSuccessMsg,
    Success_Alert_Msg,
  } = useChecker();
  const masterConfigDto = JSON.parse(sessionStorage.getItem("masterConfigDto"));
  const CheckerMasterDto = JSON.parse(
    sessionStorage.getItem("MasterDtoStorage")
  );
  const ViewClick = () => {
    if (location.pathname.includes(`${MAKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}`);
    } else if (location.pathname.includes(`${CHECKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
      setMasterView_state(false);
      setSuccessMsg("");
    }
  };
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
  return (
    <div className="dashboard_table">
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
        <h5 className="title">Master Configuration</h5>
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
                  setsuccessState(false);
                  checkerApproved();
                }}
                disabled={checkerConfigStatus !== "PENDING" ? true : false}
              />
            </>
          )}
        </div>
      </div>
      {MasterView_state && (
        <div>
          <div className="common-inner-header view-heading">
            <img onClick={ViewClick} src={viewArrow} alt="back icon" />
            <h5>
              <span>Config Id - {CheckerMasterDto?.configId}</span>
            </h5>
          </div>
          {/* <div className="View-entity">
            <span className="label-view">Instant</span>
            <p className="value-view">
              {CheckerMasterDto?.isInstant ? "True" : "False"}
            </p>
          </div> */}
          <div>
            <p className="innerheading">Points Accrual Details</p>
            <div className="View-entity">
              <span className="label-view">Accrual Limits</span>
              <p className="value-view">
                {CheckerMasterDto?.isPointAccrualLimit ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Round Off & Precision Details</p>
            <div className="View-entity">
              <span className="label-view">Round Off</span>
              <p className="value-view">
                {CheckerMasterDto?.isRoundOffPoints ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Precision</span>
              <p className="value-view">
                {CheckerMasterDto?.isPrecisionEnabled === true
                  ? "True"
                  : "False"}
              </p>
            </div>
            {CheckerMasterDto?.isPrecisionEnabled && (
              <div className="View-entity">
                <span className="label-view">Precision Value</span>
                <p className="value-view">{CheckerMasterDto?.precisionValue}</p>
              </div>
            )}
          </div>
          <div>
            <p className="innerheading">Redemption Reversal Details</p>
            <div className="View-entity">
              <span className="label-view">Reversal</span>
              <p className="value-view">
                {CheckerMasterDto?.isReversalAllowed ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Partial Reversal</span>
              <p className="value-view">
                {CheckerMasterDto?.isPartialReversal ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Reverse Count</span>
              <p className="value-view">{CheckerMasterDto?.reverseCount}</p>
            </div>
          </div>
          <div>
            <p className="innerheading">Tier Upgrade & Downgrade Details</p>
            <div className="View-entity">
              <span className="label-view">Tier Upgrade Type</span>
              <p className="value-view">
                {CheckerMasterDto?.tierUpgradeBy?.toLowerCase()}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Tier Upgrade</span>
              <p className="value-view">
                {CheckerMasterDto?.isTierUpgradeInstant ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <div className="View-entity">
              <span className="label-view">Instant Tier Downgrade</span>
              <p className="value-view">
                {CheckerMasterDto?.isTierDowngradeInstant ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">
                Tier Downgrade Duration By Months
              </span>
              <p className="value-view">
                {CheckerMasterDto?.tierDowngradeDurationByMonths}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Merchant Accelerator Details</p>
            <div className="View-entity">
              <p className="value-view">
                {CheckerMasterDto?.isMYOPEnabled ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Cash Redemption Details</p>
            <div>
              <div className="View-entity">
                <span className="label-view">Cash Redemption</span>
                <p className="value-view">
                  {CheckerMasterDto?.isCashRedemptionEnabled ? "True" : "False"}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Tenant</span>
                <p className="value-view">
                  {CheckerMasterDto?.tenant === null
                    ? "Nil"
                    : CheckerMasterDto?.tenant}
                </p>
              </div>
            </div>
            <div className="View-entity">
              <span className="label-view">channel Id</span>
              <p className="value-view">
                {CheckerMasterDto?.channelId === null
                  ? "Nil"
                  : CheckerMasterDto?.channelId}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Cash Conversion Factor</span>
              <p className="value-view">
                {CheckerMasterDto?.cashConverstionFactor}
              </p>
            </div>
          </div>
          <div>
            {/* <p className="innerheading">Account Details</p> */}
            <div className="View-entity">
              <span className="label-view">currency</span>
              <p className="value-view">
                {CheckerMasterDto?.currency === null
                  ? "Nil"
                  : CheckerMasterDto?.currency}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Debit Account</span>
              <p className="value-view">
                {CheckerMasterDto?.debitAccount === null
                  ? "Nil"
                  : CheckerMasterDto?.debitAccount}
              </p>
            </div>
          </div>
          <div>
            {/* <p className="innerheading">Narration Details</p> */}
            <div className="View-entity">
              <span className="label-view">Narration</span>
              <p className="value-view">
                {CheckerMasterDto?.narrationFormat2 === null
                  ? "Nil"
                  : CheckerMasterDto?.narrationFormat2}
              </p>
            </div>
          </div>
          <p className="innerheading">Reason for the Decline</p>
          <div className="View-entity">
            <p className="value-view" style={{ paddingTop: 0 }}>
              {masterConfigDto?.reason === null
                ? "-"
                : masterConfigDto?.reason === ""
                ? "-"
                : masterConfigDto?.reason}
            </p>
          </div>
        </div>
      )}
      {MasterView_state === false && (
        <>
          <div className="common-inner-header view-heading">
            <img onClick={ViewClick} src={viewArrow} alt="back icon" />
            <h5>
              <span>Config Id - {masterConfigDto?.configId}</span>
            </h5>
          </div>
          {/* <div className="View-entity">
            <span className="label-view">Instant</span>
            <p className="value-view">
              {masterConfigDto?.isInstant ? "True" : "False"}
            </p>
          </div> */}
          <div>
            <p className="innerheading">Points Accrual Details</p>
            <div className="View-entity">
              <span className="label-view">Accrual Limits</span>
              <p className="value-view">
                {masterConfigDto?.isPointAccrualLimit ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Round Off & Precision Details</p>
            <div className="View-entity">
              <span className="label-view">Round Off</span>
              <p className="value-view">
                {masterConfigDto?.isRoundOffPoints ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Precision</span>
              <p className="value-view">
                {masterConfigDto?.isPrecisionEnabled === true
                  ? "True"
                  : "False"}
              </p>
            </div>
            {masterConfigDto?.isPrecisionEnabled && (
              <div className="View-entity">
                <span className="label-view">Precision Value</span>
                <p className="value-view">{masterConfigDto?.precisionValue}</p>
              </div>
            )}
          </div>
          <div>
            <p className="innerheading">Redemption Reversal Details</p>
            <div className="View-entity">
              <span className="label-view">Reversal</span>
              <p className="value-view">
                {masterConfigDto?.isReversalAllowed ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Partial Reversal</span>
              <p className="value-view">
                {masterConfigDto?.isPartialReversal ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Reverse Count</span>
              <p className="value-view">{masterConfigDto?.reverseCount}</p>
            </div>
          </div>
          <div>
            <p className="innerheading">Tier Upgrade & Downgrade Details</p>
            <div className="View-entity">
              <span className="label-view">Tier Upgrade Type</span>
              <p className="value-view">
                {masterConfigDto?.tierUpgradeBy?.toLowerCase()}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Tier Upgrade</span>
              <p className="value-view">
                {masterConfigDto?.isTierUpgradeInstant ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <div className="View-entity">
              <span className="label-view">Instant Tier Downgrade</span>
              <p className="value-view">
                {masterConfigDto?.isTierDowngradeInstant ? "True" : "False"}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">
                Tier Downgrade Duration By Months
              </span>
              <p className="value-view">
                {masterConfigDto?.tierDowngradeDurationByMonths}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Merchant Accelerator Details</p>
            <div className="View-entity">
              <p className="value-view">
                {masterConfigDto?.isMYOPEnabled ? "True" : "False"}
              </p>
            </div>
          </div>
          <div>
            <p className="innerheading">Cash Redemption Details</p>
            <div>
              <div className="View-entity">
                <span className="label-view">Cash Redemption</span>
                <p className="value-view">
                  {masterConfigDto?.isCashRedemptionEnabled ? "True" : "False"}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Tenant</span>
                <p className="value-view">
                  {masterConfigDto?.tenant === null
                    ? "Nil"
                    : masterConfigDto?.tenant}
                </p>
              </div>
            </div>
            <div className="View-entity">
              <span className="label-view">channel Id</span>
              <p className="value-view">
                {masterConfigDto?.channelId === null
                  ? "Nil"
                  : masterConfigDto?.channelId}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Cash Conversion Factor</span>
              <p className="value-view">
                {masterConfigDto?.cashConverstionFactor}
              </p>
            </div>
          </div>
          <div>
            {/* <p className="innerheading">Account Details</p> */}
            <div className="View-entity">
              <span className="label-view">currency</span>
              <p className="value-view">
                {masterConfigDto?.currency === null
                  ? "Nil"
                  : masterConfigDto?.currency}
              </p>
            </div>
            <div className="View-entity">
              <span className="label-view">Debit Account</span>
              <p className="value-view">
                {masterConfigDto?.debitAccount === null
                  ? "Nil"
                  : masterConfigDto?.debitAccount}
              </p>
            </div>
          </div>
          <div>
            {/* <p className="innerheading">Narration Details</p> */}
            <div className="View-entity">
              <span className="label-view">Narration</span>
              <p className="value-view">
                {masterConfigDto?.narrationFormat2 === null
                  ? "Nil"
                  : masterConfigDto?.narrationFormat2}
              </p>
            </div>
          </div>
          <p className="innerheading">Reason for the Decline</p>
          <div className="View-entity">
            <p className="value-view" style={{ paddingTop: 0 }}>
              {masterConfigDto?.reason === null
                ? "-"
                : masterConfigDto?.reason === ""
                ? "-"
                : masterConfigDto?.reason}
            </p>
          </div>
        </>
      )}
      <RejectionModal
        rejectState={rejectState}
        setrejectState={setrejectState}
        checkerDecline={checkerDecline}
      />
    </div>
  );
};
