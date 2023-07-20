import { React, useState } from "react";
import { Formik, Form } from "formik";
import {
  TextArea,
  ButtonArea,
  CustomSnakebar,
  RadioGroup,
} from "../../Common/Elements";
import axios from "../../../api";
import { PostExpiryConfig } from "../../../apiConfig";
import { v4 as uuidv4 } from "uuid";
import { Expiry } from "../../Schema/Schema";
import useAuth from "../../../Hooks/useAuth";

const CreateExpiry = () => {
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [Severity, setSeverity] = useState(null);
  const { setLoading } = useAuth();
  const initialValues = {
    duration: "",
    Type_duration: "",
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const ExpiryRadioItem = [
    { id: "is_yearly", title: "Years" },
    { id: "is_monthly", title: "Months" },
    { id: "is_days", title: "Days" },
  ];
  const onSubmit = async (values, actions) => {
    let payload = {
      expiration_id: uuidv4(),
      is_yearly: values.Type_duration === "is_yearly" ? true : false,
      is_monthly: values.Type_duration === "is_monthly" ? true : false,
      is_days: values.Type_duration === "is_days" ? true : false,
      duration: values.duration,
    };
    console.log("payload", payload);
    setLoading(true);
    await axios({
      method: "post",
      url: `${PostExpiryConfig}`,
      data: payload,
    })
      .then((res) => {
        setLoading(false);
        console.log(res);
        actions.resetForm();
        setOpen(true);
        setmsg_error(res.data.message);
        setSeverity("success");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setOpen(true);
        setmsg_error(error.response.data.message);
        setSeverity("error");
      });
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={Expiry}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched, setvalue }) => {
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
                severity={Severity}
              />
              <div className="form" style={{ padding: "20px 10px 0" }}>
                <RadioGroup
                  labelid="Type_duration"
                  name="Type_duration"
                  groplabel="Type Duration"
                  items={ExpiryRadioItem}
                  value={values.Type_duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextArea
                  label="Duration"
                  placeholder="Enter Duration"
                  type="text"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!values.Type_duration}
                  className="CustomInput"
                  error={errors.duration && touched.duration ? true : false}
                  helperText={
                    errors.duration &&
                    touched.duration && <>{errors.duration}</>
                  }
                />
              </div>
              <div style={{ textAlign: "right" }}>
                <ButtonArea
                  type="Submit"
                  variant="contained"
                  value="Create Expiration"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CreateExpiry;
