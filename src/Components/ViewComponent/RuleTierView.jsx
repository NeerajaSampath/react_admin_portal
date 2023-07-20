import { React, useEffect, useState } from "react";
import viewArrow from "../../assets/img/viewArrow.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { ButtonArea, CustomSnakebar } from "../Common/Elements";
import {
  RULETIER_URL,
  MAKER_URL,
  SUB_URL,
  CHECKER_URL,
  CHECKER_CONFIG_URL,
} from "../../Constant";
import useChecker from "../../Hooks/useChecker";
import SuccessModal from "../SuccessModal";
import RejectionModal from "../RejectionModal";

export const RuleTierView = () => {
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const {
    rejectState,
    setrejectState,
    setsuccessState,
    successState,
    checkerApproved,
    checkerConfigStatus,
    checkerDecline,
    Rule_Tier_Mapping,
    setRule_Tier_Mapping,
    setSuccessMsg,
    SuccessMsg,
    Success_Alert_Msg,
  } = useChecker();
  const ruleTierMappingKeyDto = JSON.parse(
    sessionStorage.getItem("ruleTierMappingKeyDto")
  );
  const MappingDtoStorage = JSON.parse(
    sessionStorage.getItem("MappingDtoStorage")
  );
  const ViewClick = () => {
    if (location.pathname.includes(`${MAKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${RULETIER_URL}`);
    } else if (location.pathname.includes(`${CHECKER_URL}`)) {
      setRule_Tier_Mapping(!Rule_Tier_Mapping);
      setSuccessMsg("");
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
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
        <h5 className="title">RuleTierMapping</h5>
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
      {/* checker view content */}
      {Rule_Tier_Mapping && (
        <>
          <div>
            <div className="common-inner-header view-heading">
              <img onClick={ViewClick} src={viewArrow} alt="back icon" />
              <h5>
                <span>
                  ({MappingDtoStorage?.ruleConfigDto.name.toLowerCase()}) to (
                  {MappingDtoStorage?.tiersConfigDTO.tier_name.toLowerCase()})
                  Mapping
                </span>
              </h5>
            </div>
            <p className="innerheading">Rule Tier Mapping Details</p>
            <div>
              <div className="View-entity">
                <span className="label-view">Rule Name</span>
                <p className="value-view">
                  {MappingDtoStorage?.ruleConfigDto.name.toLowerCase()}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Tier Name</span>
                <p className="value-view">
                  {MappingDtoStorage?.tiersConfigDTO.tier_name.toLowerCase()}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">
                  {MappingDtoStorage?.ruleConfigDto.is_points_by_percentage
                    ? "Percentage"
                    : "Points"}
                </span>
                <p className="value-view">{MappingDtoStorage?.points}</p>
              </div>
              <div className="View-entity">
                <span className="label-view">Refferer Points</span>
                <p className="value-view">{MappingDtoStorage?.refferPoints}</p>
              </div>
              {/* <p className="innerheading">Reason for the Decline</p>
              <div className="View-entity">
                <p className="value-view" style={{ paddingTop: 0 }}>
                  {MappingDtoStorage?.reason === null
                    ? "-"
                    : MappingDtoStorage?.reason === ""
                    ? "-"
                    : MappingDtoStorage?.reason}
                </p>
              </div> */}
            </div>
          </div>
        </>
      )}
      {/* maker view content */}
      {Rule_Tier_Mapping === false && (
        <>
          <div className="common-inner-header view-heading">
            <img onClick={ViewClick} src={viewArrow} alt="back icon" />
            <h5>
              <span>
                ({ruleTierMappingKeyDto?.ruleConfigDto?.name.toLowerCase()}) to
                (
                {ruleTierMappingKeyDto?.tiersConfigDTO?.tier_name.toLowerCase()}
                ) Mapping
              </span>
            </h5>
          </div>
          <div>
            <p className="innerheading">Rule Tier Mapping Details</p>
            <div>
              <div className="View-entity">
                <span className="label-view">Rule Name</span>
                <p className="value-view">
                  {ruleTierMappingKeyDto?.ruleConfigDto?.name.toLowerCase()}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">Tier Name</span>
                <p className="value-view">
                  {ruleTierMappingKeyDto?.tiersConfigDTO?.tier_name.toLowerCase()}
                </p>
              </div>
              <div className="View-entity">
                <span className="label-view">
                  {ruleTierMappingKeyDto?.ruleConfigDto?.is_points_by_percentage
                    ? "Percentage"
                    : "Points"}
                </span>
                <p className="value-view">{ruleTierMappingKeyDto?.points}</p>
              </div>
              <div className="View-entity">
                <span className="label-view">Refferer Points</span>
                <p className="value-view">
                  {ruleTierMappingKeyDto?.refferPoints}
                </p>
              </div>
              {/* <p className="innerheading">Reason for the Decline</p>
              <div className="View-entity">
                <p className="value-view" style={{ paddingTop: 0 }}>
                  {ruleTierMappingKeyDto?.reason === null
                    ? "-"
                    : ruleTierMappingKeyDto?.reason === ""
                    ? "-"
                    : ruleTierMappingKeyDto?.reason}
                </p>
              </div> */}
            </div>
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
