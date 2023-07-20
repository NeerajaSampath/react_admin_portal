import { React, useState } from "react";
import { DialogContent, DialogActions, Dialog } from "@mui/material";
import { ButtonArea, TextArea } from "./Common/Elements";
import TextField from "@mui/material/TextField";
import useChecker from "../Hooks/useChecker";

const RejectionModal = ({
  rejectState,
  setrejectState,
  checkerDecline,
  ViewDetails,
}) => {
  const { rejectInput, setrejectInput } = useChecker();
  return (
    <>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "30%", maxHeight: 500 } }}
        // sx={{
        //   "& .MuiDialog-paper": {
        //     width: "480px",
        //     maxHeight: 600,
        //     padding: "0px",
        //     borderRadius: "10px",
        //   },
        // }}
        maxWidth="s"
        open={rejectState}
      >
        <div className="CommonHeader custom_modal">
          <h5>Reject</h5>
        </div>
        <DialogContent sx={{ padding: "0", position: "relative" }} dividers>
          <div className="reject_div">
            <h5>Are you sure you want to decline this Config?</h5>
            <div className="field-container" style={{ maxWidth: "100%" }}>
              <TextField
                fullWidth
                m={2}
                sx={{
                  margin: "20px 20px 7px 0",
                  paddingBottom: "15px",
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
                InputLabelProps={{ style: { fontSize: 12 } }}
                className="CustomInput"
                id="decline_reason"
                placeholder="Enter Reason"
                label="Reason"
                multiline
                name="decline_reason"
                onChange={(e) => {
                  // console.log(e.target.value);
                  setrejectInput(e.target.value);
                }}
                rows={4}
                variant="outlined"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <ButtonArea
            onClick={() => {
              setrejectState(!rejectState);
              setrejectInput("");
            }}
            type="button"
            variant="text"
            value="Cancel"
          />
          <ButtonArea
            onClick={() => {
              checkerDecline();
            }}
            type="submit"
            variant="contained"
            value="Decline"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RejectionModal;
