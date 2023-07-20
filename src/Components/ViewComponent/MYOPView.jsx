import { React } from "react";
import { ButtonArea } from "../Common/Elements";
import viewArrow from "../../assets/img/viewArrow.svg";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CHECKER_CONFIG_URL,
  CONFIG_URL,
  MAKER_URL,
  SUB_URL,
  CHECKER_URL,
} from "../../Constant";
import useChecker from "../../Hooks/useChecker";
import RejectionModal from "../RejectionModal";
import SuccessModal from "../SuccessModal";

const MYOPView = () => {
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const {
    setrejectState,
    rejectState,
    checkerDecline,
    successState,
    setsuccessState,
    checkerApproved,
    checkerConfigStatus,
    myop_filter,
  } = useChecker();

  const ViewClick = () => {
    // if (location.pathname.includes(`${MAKER_URL}`)) {
    //   CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${CONFIG_URL}`);
    // } else if (location.pathname.includes(`${CHECKER_URL}`)) {
    //   CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
    // }
    CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
  };
  return (
    <div>
      <div className="CommonHeader">
        <h5 className="title">MYOP Configuration</h5>
        <div>
          {location.pathname.includes(`${CHECKER_URL}`) && (
            <>
              <ButtonArea
                type="button"
                variant="text"
                value="Decline"
                onClick={() => {
                  setrejectState(!rejectState);
                }}
                disabled={checkerConfigStatus !== "PENDING" ? true : false}
              />
              <ButtonArea
                variant="contained"
                type="submit"
                value="Approval"
                onClick={() => {
                  setsuccessState(!successState);
                  checkerApproved();
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
          {myop_filter[0]?.brandName} Brand - {myop_filter[0]?.brandId}
        </h5>
      </div>
      <div>
        <p className="innerheading">Brand Details</p>
        <div>
          <div className="View-entity">
            <span className="label-view">Brand Name</span>
            <p className="value-view">{myop_filter[0]?.brandName}</p>
          </div>
        </div>
        <p className="innerheading">Merchant Details</p>
        <div>
          {myop_filter[0]?.merchants.map((item) => (
            <div className="myop_">
              <div className="View-entity">
                <span className="label-view">Merchant Name</span>
                <p className="value-view">{item?.merchantName}</p>
              </div>
              <div className="View-entity">
                <span className="label-view">Merchant Id</span>
                <p className="value-view">{item?.mcId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SuccessModal
        successState={successState}
        setsuccessState={setsuccessState}
      />
      <RejectionModal
        rejectState={rejectState}
        setrejectState={setrejectState}
        checkerDecline={checkerDecline}
      />
    </div>
  );
};

export default MYOPView;
