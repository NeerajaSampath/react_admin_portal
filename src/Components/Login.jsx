import { React, useState } from "react";
import { TextField, Button } from "@mui/material";
import m2plogo from "../assets/img/m2p.svg";
import {
  HOME_URL,
  MASTERCONFIG_URL,
  VIEW,
  MAKER_URL,
  SUB_URL,
  SUPPORT_URL,
  CHECKER_URL,
  CREATE,
} from "../Constant";
import {
  DialogContent,
  Dialog,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import axios from "../api";
import { LoginConfig } from "../apiConfig";
import styled from "styled-components";
import { LoginVal } from "./Schema/Schema";
import { CustomSnakebar, ButtonArea } from "./Common/Elements";
import jwt_decode from "jwt-decode";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
var CryptoJS = require("crypto-js");

const Login = () => {
  const { setAuth, setrefresh_Token, setLoading, master_update } = useAuth();
  const { setUsername, Masterget } = useAuth();
  const [open, setOpen] = useState(false);
  const [Severity, setSeverity] = useState(null);
  const [msg_error, setmsg_error] = useState(null);
  const [autohide, setautohide] = useState(false);
  const [view_hidden, setview_hidden] = useState(false);
  const [portal_option, setportal_option] = useState(false);
  const [portal_checkbox, setportal_checkbox] = useState();
  const CustomNavigate = useNavigate();
  const [selected_portal_value, setselected_portal_value] = useState();
  const handleChangecheckbox = (event) => {
    setselected_portal_value(event.target.value);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const resp = await axios({
        method: "post",
        url: `${LoginConfig}`,
        data: payLoad,
        headers: {
          Authorization: "",
        },
      });
      setLoading(false);
      const access_token = resp?.data?.access_token;
      const refresh_token = resp?.data?.refresh_token;
      const refresh_expires_in = resp?.data?.refresh_expires_in;
      //using store the token in context hooks
      setAuth(`Bearer ${access_token}`);
      setrefresh_Token(`${refresh_token}`);
      var decoded = jwt_decode(access_token);
      if ("resource_access" in decoded == false) {
        setOpen(true);
        setmsg_error(
          "Role aren't asigned, contact admin for the role asigning."
        );
        setSeverity("error");
      } else if (decoded.resource_access.Loyalty_Admin.roles.length > 1) {
        setOpen(false);
        setportal_option(true);
        setportal_checkbox(decoded.resource_access.Loyalty_Admin.roles);
      } else if (
        decoded.resource_access.Loyalty_Admin.roles.includes(
          "admin-portal-support"
        )
      ) {
        setOpen(false);
        CustomNavigate(`/${SUB_URL}/${SUPPORT_URL}`);
      } else if (
        decoded.resource_access.Loyalty_Admin.roles.includes(
          "admin-portal-checker"
        )
      ) {
        setOpen(false);
        CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${HOME_URL}`);
      } else if (
        decoded.resource_access.Loyalty_Admin.roles.includes(
          "admin-portal-maker"
        )
      ) {
        setOpen(false);
        CustomNavigate(
          `/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}/${CREATE}`
        );
      }
      const SECRET_KEY = `${process.env.REACT_APP_CRYPTO_SECRET}`;
      const username_encrypt = CryptoJS.AES.encrypt(
        JSON.stringify(payLoad.username),
        SECRET_KEY
      ).toString();
      const pass_encrypt = CryptoJS.AES.encrypt(
        JSON.stringify(payLoad.password),
        SECRET_KEY
      ).toString();
      sessionStorage.setItem("access_token", resp.data.access_token);
      sessionStorage.setItem("refresh_token", resp.data.refresh_token);
      sessionStorage.setItem(
        "refresh_expires_in",
        resp.data.refresh_expires_in
      );
      sessionStorage.setItem("access_expires_in", resp.data.expires_in);
      sessionStorage.setItem(
        "role",
        decoded.resource_access.Loyalty_Admin.roles
      );
      sessionStorage.setItem("logindetails", username_encrypt);
      sessionStorage.setItem("logindetailspass", pass_encrypt);
      actions.resetForm();
      setUsername(values.user_id);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      setOpen(true);
      setmsg_error(error.response.data.error_description);
      setSeverity("error");
      setautohide(true);
    }
  };
  const redirect_condition = () => {
    sessionStorage.setItem("role", selected_portal_value);
    if (selected_portal_value === "admin-portal-maker") {
      CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}/${CREATE}`);
    } else if (selected_portal_value === "admin-portal-checker") {
      CustomNavigate(`/${SUB_URL}/${CHECKER_URL}/${HOME_URL}`);
    } else if (selected_portal_value === "admin-portal-support") {
      CustomNavigate(`/${SUB_URL}/${SUPPORT_URL}`);
    }
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        user_id: "",
        password: "",
      },
      onSubmit,
      validationSchema: LoginVal,
    });
  const payLoad = {
    username: values.user_id,
    password: values.password,
  };
  const onclick_fn = (e) => {
    setview_hidden(!view_hidden);
  };

  return (
    <LoginStyle>
      <CustomSnakebar
        open={open}
        autoHideDuration={autohide ? 2000 : null}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        alertmsg={msg_error}
        severity={Severity}
      />
      <div>
        <h5 className="header_logo">
          Loyalty <br />
          <span>Program</span>
        </h5>
      </div>
      <div className="Login_div">
        <h6 className="logo">Loyalty Program</h6>
        <span>Login</span>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="User ID"
            InputLabelProps={{ style: { fontSize: 15 } }}
            placeholder="Enter User ID"
            type="text"
            name="user_id"
            className="login_input"
            value={values.user_id}
            size="medium"
            onChange={handleChange}
            onBlur={handleBlur}
            inputProps={{ padding: "20px 0 20px" }}
            sx={{
              paddingBottom: "15px",
              marginTop: "12px",
              fontSize: "16px",
              borderRadius: "7px",
              borderColor: "rgba(187, 188, 188, 0.5)",
            }}
            fullWidth
            error={errors.user_id && touched.user_id ? true : false}
            helperText={
              errors.user_id && touched.user_id && <>{errors.user_id}</>
            }
          />
          <div className="password_div">
            <TextField
              fullWidth
              inputProps={{ padding: "0px 0 20px" }}
              sx={{
                paddingBottom: "15px",
                margin: "20px 0 5px",
                fontSize: "16px",
                borderRadius: "7px",
                borderColor: "rgba(187, 188, 188, 0.5)",
              }}
              value={values.password}
              InputLabelProps={{ style: { fontSize: 15 } }}
              size="medium"
              onChange={handleChange}
              onBlur={handleBlur}
              label="Password"
              placeholder="Enter Password"
              type={view_hidden ? "text" : "password"}
              name="password"
              className="login_input"
              error={errors.password && touched.password ? true : false}
              helperText={
                errors.password && touched.password && <>{errors.password}</>
              }
            />
            <div onClick={onclick_fn}>
              {view_hidden ? (
                <VisibilityIcon color="action" className="password_hide_show" />
              ) : (
                <VisibilityOffIcon
                  color="action"
                  className="password_hide_show"
                />
              )}
            </div>
          </div>
          {/* <span className='forgot_passwrd'>Forgot Password</span> */}
          <div>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                padding: "15px",
                borderRadius: "8px",
                marginTop: "20px",
                textTransform: "capitalize",
              }}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
      <div className="footer_login">
        <div>
          <ul className="terms_privy">
            <li>Terms and Conditions</li>
            <li>Privacy Policy</li>
            <li>© M2P Fintech 2021</li>
          </ul>
        </div>
        <div className="logo_footer">
          <img src={m2plogo} alt="m2p logo" />
          <span>
            Powered by
            <br />
            m2p fintech
          </span>
        </div>
      </div>
      {/* selection for the redirection portal when user having more than one portal access */}
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
        open={portal_option}
      >
        <div className="CommonHeader custom_modal">
          <h5>Login as</h5>
        </div>
        <DialogContent
          sx={{ padding: "10px 20px", position: "relative" }}
          dividers
        >
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="portal list"
              name="portal_select"
              value={selected_portal_value}
              onChange={handleChangecheckbox}
            >
              {portal_checkbox != undefined &&
                portal_checkbox.map((item) => (
                  <FormControlLabel
                    value={item}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "16px",
                          },
                        }}
                      />
                    }
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "14px",
                      },
                    }}
                    label={
                      item === "admin-portal-checker"
                        ? "Checker Portal"
                        : item === "admin-portal-maker"
                        ? "Maker Portal"
                        : "Support Portal"
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <ButtonArea
            onClick={() => {
              setportal_option(false);
              setselected_portal_value("");
            }}
            type="button"
            variant="text"
            value="cancel"
          />
          <ButtonArea
            onClick={() => {
              redirect_condition();
            }}
            type="button"
            variant="contained"
            value="Proceed"
          />
        </DialogActions>
      </Dialog>
    </LoginStyle>
  );
};
export default Login;
const LoginStyle = styled.div`
  height: 100vh;
  background: linear-gradient(109.6deg, #ee6b6b -190.2%, #0d1634 78.71%);
  padding: 10px 40px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-around;
  .header_logo {
    color: #fff;
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;
    margin-bottom: 0px;
    span {
      font-size: 24px;
    }
  }
  .Login_div {
    background: #ffffff;
    border: 2px solid rgba(104, 91, 199, 0.3);
    box-shadow: -4px -4px 24px rgb(0 0 0 / 25%),
      4px 4px 10px rgb(94 102 159 / 20%);
    border-radius: 32px;
    padding: 40px;
    width: 400px;
    margin-right: 50px;
    margin-left: auto;
    span {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #231f20;
      margin-bottom: 20px;
      display: block;
    }
  }
  .logo {
    font-size: 30px;
    margin-bottom: 40px;
  }
  .field-container {
    max-width: 100%;
  }
  .footer_login {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .logo_footer {
      display: flex;
      float: right;
      align-items: center;
      span {
        color: #fff;
        font-size: 9px;
        line-height: 16px;
        opacity: 0.8;
        padding-left: 10px;
      }
    }
  }
  .forgot_passwrd {
    color: #4d7ff7 !important;
    float: right;
    margin-top: -20px;
    letter-spacing: normal !important;
    text-transform: capitalize !important;
    cursor: pointer;
  }
  .terms_privy {
    list-style: disc;
    list-style-position: outside;
    margin-top: 0px;
    li {
      display: inline-block;
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      padding-right: 30px;
      color: #fff;
    }
  }
`;
