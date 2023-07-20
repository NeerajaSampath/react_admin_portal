import { React, useState } from "react";
import { DialogContent, DialogActions, Dialog } from "@mui/material";
import CreateExpiry from "./CreateExpiry";
import { ButtonArea } from "../../Common/Elements";

const ExpiryModalpopup = ({
  ExpiryModal,
  setExpiryModal,
  setExpiryData_Update,
  ExpiryData_Update,
}) => {
  const [closeAlert, setCloseAlert] = useState(false);
  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "50%",
            maxHeight: 600,
            padding: "15px",
          },
        }}
        maxWidth="s"
        open={ExpiryModal}
      >
        <div className="CommonHeader">
          <h5 className="title">Expiration configuration</h5>
          <div>
            <ButtonArea
              onClick={() => {
                setCloseAlert(!closeAlert);
              }}
              type="button"
              variant="text"
              value="cancel"
            />
          </div>
        </div>
        <DialogContent sx={{ padding: "0", position: "relative" }}>
          <CreateExpiry />
        </DialogContent>
      </Dialog>
      {/* Close alert message */}
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "30%", maxHeight: 500 } }}
        maxWidth="s"
        open={closeAlert}
      >
        <h5 style={{ padding: "15px" }}>Close</h5>
        <DialogContent dividers>
          <h5>Are you sure you want to close this ?</h5>
        </DialogContent>
        <DialogActions>
          <ButtonArea
            onClick={() => {
              setCloseAlert(!closeAlert);
            }}
            type="button"
            variant="text"
            value="cancel"
          />
          <ButtonArea
            type="button"
            onClick={() => {
              setExpiryModal(!ExpiryModal);
              setCloseAlert(!closeAlert);
              setExpiryData_Update(!ExpiryData_Update);
              // CustomNavigate(`${VIEW}`);
            }}
            variant="contained"
            value="Close"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpiryModalpopup;
