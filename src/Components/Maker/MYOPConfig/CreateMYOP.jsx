import React from "react";
import { DialogContent, DialogActions, Dialog } from "@mui/material";
import { ButtonArea } from "../../Common/Elements";
import CreateBrand from "./CreateBrand";

const CreateMYOP = ({
  MYOPModal,
  setMYOPModal,
  setCloseAlert,
  closeAlert,
  SubmitData,
  setSubmitData,
  setSwitch,
  Switch,
}) => {
  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            maxHeight: 600,
            padding: "15px",
          },
        }}
        maxWidth="s"
        open={MYOPModal}
      >
        <div className="CommonHeader">
          <h5 className="title">MYOP configuration</h5>
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
          <CreateBrand
            setSubmitData={setSubmitData}
            MYOPModal={MYOPModal}
            setMYOPModal={setMYOPModal}
          />
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
              setMYOPModal(!MYOPModal);
              setCloseAlert(!closeAlert);
              // if(SubmitData === false){
              //     setSwitch(!Switch);
              // } else {
              //     setSubmitData(false);
              // }
              //   setSubmitData(false);
            }}
            variant="contained"
            value="Close"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateMYOP;
