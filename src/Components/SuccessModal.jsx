import { React, useEffect, useState } from "react";
import { DialogContent, Dialog } from "@mui/material";
import SuccessTick from "../assets/img/successTick.svg";
import { ButtonArea, CustomSnakebar } from "./Common/Elements";
import { useNavigate } from "react-router-dom";
import useChecker from "../Hooks/useChecker";
const SuccessModal = ({ successState, setsuccessState }) => {
  const CustomNavigate = useNavigate();
  const { SuccessMsg, setrejectInput } = useChecker();

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "480px",
          maxHeight: 600,
          padding: "0px",
          borderRadius: "10px",
        },
      }}
      maxWidth="s"
      open={successState}
    >
      <>
        <div className="CommonHeader custom_modal">
          <div style={{ textAlign: "right", width: "100%" }}>
            <ButtonArea
              onClick={() => {
                setrejectInput("");
                setsuccessState(!successState);
                CustomNavigate(`../`);
              }}
              type="button"
              variant="contained"
              value="Close"
            />
          </div>
        </div>
        <DialogContent sx={{ padding: "0", position: "relative" }}>
          <div className="success_div">
            <img src={SuccessTick} alt="SuccessTick" />
            <h5 className="success_title">Successfully Approved</h5>
            {/* <p className="success_info">
              Request ID-100123456 - Rewards (Transaction)
            </p> */}
          </div>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default SuccessModal;
