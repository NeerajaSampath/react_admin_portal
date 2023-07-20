import { React, useEffect } from "react";
import axios from "../../api";
import { GetExpiryConfig } from "../../apiConfig";
import useAuth from "../../Hooks/useAuth";
import useChecker from "../../Hooks/useChecker";
import { ButtonArea } from "../Common/Elements";
import {
  CHECKER_URL,
  MAKER_URL,
  SUB_URL,
  CHECKER_CONFIG_URL,
  EXPIRY_URL,
} from "../../Constant";
import { useLocation, useNavigate } from "react-router-dom";
import viewArrow from "../../assets/img/viewArrow.svg";
import SuccessModal from "../SuccessModal";
import RejectionModal from "../RejectionModal";

export const ExpiryView = ({ ExpiryUpdate }) => {
  const { setLoading } = useAuth();
  const location = useLocation();
  const CustomNavigate = useNavigate();
  const {
    setExpiration,
    Expiry_filter,
    Expiration,
    Expiry,
    rejectState,
    setrejectState,
    checkerConfigStatus,
    setsuccessState,
    checkerApproved,
    successState,
    checkerDecline,
  } = useChecker();
  useEffect(() => {
    GetExpiryDetails();
  }, []);
  const GetExpiryDetails = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetExpiryConfig}/0/5000`,
      });
      setLoading(false);
      setExpiration(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  const ViewClick = () => {
    if (location.pathname.includes(`${MAKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${EXPIRY_URL}`);
    } else if (location.pathname.includes(`${CHECKER_URL}`)) {
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
    }
  };
  return (
    <div key="2" className="dashboard_table">
      {/* {Expiration.length == 0 && "No expiration created"} */}
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
      <div className="common-inner-header view-heading">
        <img onClick={ViewClick} src={viewArrow} alt="back icon" />
        <h5>
          <span>Expiration Details</span>
        </h5>
      </div>
      <div className="expiry_div">
        <div className="View-entity">
          <span className="label-view">Expiration Id</span>
        </div>
        <div className="View-entity">
          <span className="label-view">Duration</span>
        </div>
      </div>
      {Expiry ? (
        <>
          {Expiry_filter.map((item, index) => {
            return (
              <div key={index} className="expiry_div">
                <div className="View-entity">
                  <p className="value-view">{item.expiration_id}</p>
                </div>
                <div className="View-entity">
                  <p className="value-view">
                    {item.duration} {item.is_monthly ? "Months" : null}
                    {item.is_yearly ? "Years" : null}
                    {item.is_days ? "Days" : null}
                  </p>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {Expiration.map((item, index) => {
            return (
              <div key={index} className="expiry_div">
                <div className="View-entity">
                  <p className="value-view">{item.expiration_id}</p>
                </div>
                <div className="View-entity">
                  <p className="value-view">
                    {item.duration} {item.is_monthly ? "Months" : null}
                    {item.is_yearly ? "Years" : null}
                    {item.is_days ? "Days" : null}
                  </p>
                </div>
              </div>
            );
          })}
        </>
      )}
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
