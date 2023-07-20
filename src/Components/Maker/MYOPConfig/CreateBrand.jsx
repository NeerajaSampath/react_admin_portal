import { React, useState } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import axios from "../../../api";
import { PostMyopConfig } from "../../../apiConfig";
import { ButtonArea, CustomSnakebar, TextArea } from "../../Common/Elements";
import { v4 as uuidv4 } from "uuid";
import { MYOPBrand } from "../../Schema/Schema";
import { DialogContent, DialogActions, Dialog } from "@mui/material";
import useAuth from "../../../Hooks/useAuth";

const MYOPModal = ({
  Modalopen,
  setModalopen,
  setSubmitData,
  setMYOPModal,
  MYOPModal,
}) => {
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [severity, setseverity] = useState(null);
  const [AddAnother, setAddAnother] = useState(false);
  const { setLoading } = useAuth();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const initialValues = {
    bdid: uuidv4(),
    brand_name: "",
    merchants: [{ mid: uuidv4(), merchantName: "", mcId: "" }],
  };
  const onSubmit = async (values, actions) => {
    let id = uuidv4();
    let payloadDestructure = values.merchants.map((item) => {
      return {
        merchantId: uuidv4(),
        merchantName: item.merchantName,
        mcId: item.mcId,
        isEnabled: false,
        brandId: id,
      };
    });
    let payload = {
      brandId: id,
      brandName: values.brand_name,
      merchants: payloadDestructure,
    };
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: `${PostMyopConfig}`,
        data: payload,
      });
      setLoading(false);
      console.log("res", res);
      setmsg_error(res?.data?.data?.message);
      setseverity("success");
      actions.resetForm();
      setAddAnother(!AddAnother);
      setSubmitData(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setOpen(true);
      setmsg_error(error.response.data.message);
      setseverity("error");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={MYOPBrand}
      onSubmit={onSubmit}
    >
      {({ values, setValues, isValid, dirty, getIn, touched, errors }) => {
        return (
          <Form>
            <CustomSnakebar
              open={open}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              alertmsg={msg_error}
              severity={severity}
            />
            <p className="innerheading">Brand Name Details</p>
            <Field name="brand_name">
              {({ field, meta }) => (
                <TextArea
                  label={"Brand Name"}
                  placeholder="Enter Brand Name"
                  variant="outlined"
                  type="text"
                  id="brand_name"
                  className="CustomInput"
                  error={meta.error && meta.touched}
                  helperText={`${
                    meta.touched && meta.error !== undefined ? meta?.error : ""
                  }`}
                  {...field}
                />
              )}
            </Field>
            <div className="submit-margin">
              <p className="innerheading">Merchant Details</p>
              <FieldArray
                name="merchants"
                render={({ remove, push }) => (
                  <>
                    {values.merchants.map((merchantss, index) => (
                      <div className="relative" key={index}>
                        <h5 style={{ padding: "10px 0" }}>
                          Merchant {index + 1}
                        </h5>
                        <Field name={`merchants.${index}.merchantName`}>
                          {({ field, meta }) => (
                            <TextArea
                              label={"Merchant Name"}
                              placeholder="Enter Merchant Name"
                              variant="outlined"
                              type="text"
                              id="merchantName"
                              className="CustomInput"
                              error={meta.error && meta.touched}
                              helperText={`${
                                meta.touched && meta.error !== undefined
                                  ? meta?.error
                                  : ""
                              }`}
                              {...field}
                            />
                          )}
                        </Field>
                        <Field name={`merchants.${index}.mcId`}>
                          {({ field, meta }) => (
                            <TextArea
                              label={"Merchant Id"}
                              placeholder="Enter Merchant Id"
                              variant="outlined"
                              type="text"
                              id="mcId"
                              className="CustomInput"
                              error={meta.error && meta.touched}
                              helperText={`${
                                meta.touched && meta.error !== undefined
                                  ? meta?.error
                                  : ""
                              }`}
                              {...field}
                            />
                          )}
                        </Field>
                        {values.merchants.length > 1 && (
                          <ButtonArea
                            type="button"
                            variant="text"
                            value="- Remove Merchants"
                            onClick={() => remove(index)}
                            className="remove-btn"
                          />
                        )}
                      </div>
                    ))}
                    <ButtonArea
                      type="button"
                      variant="contained"
                      className="add-another"
                      value="Add Another Merchant"
                      onClick={() =>
                        push({ mid: uuidv4(), merchantName: "", mcId: "" })
                      }
                    />
                  </>
                )}
              />
            </div>
            <div className="submit-div">
              <ButtonArea
                type="submit"
                variant="contained"
                value="Send for Approval"
                disabled={!isValid}
              />
            </div>
            <Dialog
              sx={{ "& .MuiDialog-paper": { width: "30%", maxHeight: 500 } }}
              maxWidth="s"
              open={AddAnother}
            >
              <h5 style={{ padding: "15px" }}>Adding another Merchant </h5>
              <DialogContent dividers>
                <h5>Need to add another Merchant Details</h5>
              </DialogContent>
              <DialogActions>
                <ButtonArea
                  onClick={() => {
                    setAddAnother(!AddAnother);
                    setMYOPModal(!MYOPModal);
                    // setModalopen(!Modalopen);
                  }}
                  type="button"
                  variant="text"
                  value="No"
                />
                <ButtonArea
                  type="button"
                  onClick={() => {
                    setAddAnother(!AddAnother);
                  }}
                  variant="contained"
                  value="Yes"
                />
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};
export default MYOPModal;
