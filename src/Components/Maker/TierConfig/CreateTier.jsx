import { React, useEffect, useState } from "react";
import axios from "../../../api";
import {
  PostTierConfig,
  GetMasterConfig,
  GetExpiryConfig,
} from "../../../apiConfig";
import {
  ButtonArea,
  TextArea,
  DefaultSelect,
  CustomSnakebar,
} from "../../Common/Elements";
import { useFormik } from "formik";
import { TierSchema } from "../../Schema/Schema";
import backArrow from "../../../assets/img/backArrow.svg";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CONFIG_URL, MAKER_URL, SUB_URL } from "../../../Constant";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../../../Hooks/useAuth";
import { Checkbox } from "@mui/material";

export const CreateTier = ({ setTierApproval }) => {
  const { setLoading } = useAuth();
  const CustomNavigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [ExpiryState, setExpiryState] = useState([]);
  const [Master, setMaster] = useState([]);
  const { setConfig_update } = useAuth();
  useEffect(() => {
    expirationAPI();
    GetMasterMYOP();
  }, []);
  //Expiration get API call
  const expirationAPI = async () => {
    try {
      const res = await axios.get(`${GetExpiryConfig}/0/10`);
      setExpiryState(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  //master config
  const GetMasterMYOP = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setLoading(false);
      setMaster(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  //filtered master config for approved status
  const filtered_master = Master.filter((item) => item.isEnabled === true).map(
    (items) => {
      return { ...items };
    }
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  //expiration menu item
  const optionValue = ExpiryState.map((option) => (
    <MenuItem
      sx={{ fontSize: "14px" }}
      key={option.expiration_id}
      value={option.expiration_id}
    >
      {(option.is_monthly ? option.duration + " " + "Months" : "") ||
        (option.is_days ? option.duration + " " + "Days" : "") ||
        (option.is_yearly ? option.duration + " " + "Years" : "")}
    </MenuItem>
  ));
  //onsubmit function
  const onSubmit = async (values, actions) => {
    try {
      const resp = await axios({
        method: "post",
        url: `${PostTierConfig}`,
        data: payLoad,
      });
      console.log("resp", resp);
      actions.resetForm();
      TableCom();
      // setTierApproval(true);
      setConfig_update(true);
    } catch (error) {
      console.log("error", error?.response);
      setOpen(true);
      setmsg_error(error?.response?.data?.message);
    }
  };
  //redirection
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${CONFIG_URL}`);
  };
  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      tier_name: "",
      points_min_limit: "",
      points_max_limit: "",
      amount_min_limit: "",
      amount_max_limit: "",
      multiplier: "",
      expiration_id: "",
      min_redeem: "",
      max_redeem: "",
      max_redeem_day: "",
      max_redeem_month: "",
      max_redeem_year: "",
      cash_converstion_factor: "",
      min_accrual: "",
      max_accrual_per_day: "",
      max_accrual_per_month: "",
      max_accrual_per_year: "",
      is_enabled: false,
      accrual_checkbox: filtered_master[0]?.isPointAccrualLimit === true,
      myop_checkbox: filtered_master[0]?.isMYOPEnabled === true,
    },
    onSubmit,
    validationSchema: TierSchema,
  });
  //payload filter expiration data config
  const expiry_filter = ExpiryState.filter((item) => {
    return item?.expiration_id === values.expiration_id;
  }).map((item) => {
    return {
      duration: item.duration,
      expiration_id: item.expiration_id,
      is_yearly: item?.is_yearly,
      is_monthly: item?.is_monthly,
      is_days: item?.is_days,
    };
  });
  const expiration_config = expiry_filter[0];
  const payLoad = {
    tier_id: uuidv4(),
    tier_name: values.tier_name,
    points_min_limit: values.points_min_limit,
    points_max_limit: values.points_max_limit,
    amount_min_limit: values.amount_min_limit,
    amount_max_limit: values.amount_max_limit,
    multiplier: values.multiplier == "" ? 0 : values.multiplier,
    expiration_config,
    redemption_config: {
      redemption_id: uuidv4(),
      min_redeem: values.min_redeem,
      max_redeem: values.max_redeem,
      max_redeem_day: values.max_redeem_day,
      max_redeem_month: values.max_redeem_month,
      max_redeem_year: values.max_redeem_year,
      cash_converstion_factor: values.cash_converstion_factor,
      tier_id: null,
    },
    accrual_config: {
      accrual_id: uuidv4(),
      min_accrual: values.min_accrual == "" ? 0 : values.min_accrual,
      max_accrual_per_day:
        values.max_accrual_per_day == "" ? 0 : values.max_accrual_per_day,
      max_accrual_per_month:
        values.max_accrual_per_month == "" ? 0 : values.max_accrual_per_month,
      max_accrual_per_year:
        values.max_accrual_per_year == "" ? 0 : values.max_accrual_per_year,
      tier_id: null,
    },
    isEnabled: false,
  };
  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <CustomSnakebar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{
            horizontal: "right",
            vertical: "top",
          }}
          alertmsg={msg_error}
          severity="error"
        />
        <div className="CommonHeader">
          <h5 className="title">Tier Configuration</h5>
          <div>
            <ButtonArea
              onClick={() => {
                TableCom();
              }}
              type="button"
              variant="text"
              value="cancel"
            />
            <ButtonArea
              // disabled={!(isValid && dirty)}
              variant="contained"
              type="submit"
              value="Send for Approval"
            />
          </div>
        </div>
        <div className="common-inner-header">
          <h5>
            <img src={backArrow} onClick={TableCom} alt="back icon" />
            New Tier
          </h5>
          <p>
            The following configurations are supported for the per transaction
            rewards.
          </p>
        </div>
        <div className="form">
          <p className="innerheading">Tier Details</p>
          <div>
            <TextArea
              label="Tier Name"
              placeholder="Enter Name"
              type="text"
              name="tier_name"
              value={values.tier_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.tier_name && touched.tier_name
                  ? "CustomInput"
                  : "CustomInput"
              }
              error={errors.tier_name && touched.tier_name ? true : false}
              helperText={
                errors.tier_name && touched.tier_name && <>{errors.tier_name}</>
              }
            />
          </div>
          <div>
            <TextArea
              label="Min Point Range"
              placeholder="Enter Min Point Range"
              type="text"
              name="points_min_limit"
              value={values.points_min_limit}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.points_min_limit && touched.points_min_limit
                  ? true
                  : false
              }
              helperText={
                errors.points_min_limit &&
                touched.points_min_limit && <>{errors.points_min_limit}</>
              }
            />
            <TextArea
              label="Max Point Range"
              placeholder="Enter Max Point Range"
              type="text"
              name="points_max_limit"
              value={values.points_max_limit}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.points_max_limit && touched.points_max_limit
                  ? true
                  : false
              }
              helperText={
                errors.points_max_limit &&
                touched.points_max_limit && <>{errors.points_max_limit}</>
              }
            />
          </div>
          <div>
            <TextArea
              label="Min Amount Range"
              placeholder="Enter Min Amount Range"
              type="text"
              name="amount_min_limit"
              value={values.amount_min_limit}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.amount_min_limit && touched.amount_min_limit
                  ? true
                  : false
              }
              helperText={
                errors.amount_min_limit &&
                touched.amount_min_limit && <>{errors.amount_min_limit}</>
              }
            />
            <TextArea
              label="Max Amount Range"
              placeholder="Enter Max Amount Range"
              type="text"
              name="amount_max_limit"
              value={values.amount_max_limit}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.amount_max_limit && touched.amount_max_limit
                  ? true
                  : false
              }
              helperText={
                errors.amount_max_limit &&
                touched.amount_max_limit && <>{errors.amount_max_limit}</>
              }
            />
          </div>
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={filtered_master[0]?.isMYOPEnabled === true ? true : false}
            value={filtered_master[0]?.isMYOPEnabled === true ? true : false}
            name="myop_checkbox"
          />
          {/* multiplier based on master get api */}
          {filtered_master.length == 0 ||
          filtered_master[0]?.isMYOPEnabled === true ? (
            <>
              <p className="innerheading">Merchant Accelerator</p>
              <div>
                <div className="field-container" width="250px">
                  <TextArea
                    label="Reward Point Multiplier"
                    placeholder="Enter Reward Point Multiplier"
                    type="text"
                    name="multiplier"
                    value={values.multiplier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="CustomInput"
                    error={
                      errors.multiplier && touched.multiplier ? true : false
                    }
                    helperText={
                      errors.multiplier &&
                      touched.multiplier && <>{errors.multiplier}</>
                    }
                  />
                </div>
              </div>
            </>
          ) : null}
          <p className="innerheading">Reward Expiry</p>
          <div>
            <div className="field-container" width="250px">
              <DefaultSelect
                error={
                  errors.expiration_id && touched.expiration_id ? true : false
                }
                labelId="expirationLabel"
                id="expirationSelect"
                label="Reward Expiry"
                onChange={handleChange}
                onBlur={handleBlur}
                name="expiration_id"
                value={values.expiration_id}
                optionvalue={optionValue}
                formhelpertext={
                  errors.expiration_id &&
                  touched.expiration_id && <>{errors.expiration_id}</>
                }
              />
            </div>
          </div>
          <p className="innerheading">Redeem Limits</p>
          <div>
            <TextArea
              label="Min Redeem Per Redemption"
              placeholder="Enter Min Redeem Per Redemption"
              type="text"
              name="min_redeem"
              value={values.min_redeem}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.min_redeem && touched.min_redeem ? true : false}
              helperText={
                errors.min_redeem &&
                touched.min_redeem && <>{errors.min_redeem}</>
              }
            />
            <TextArea
              label="Max Redeem Per Redemption"
              placeholder="Enter Max Redeem Per Redemption"
              type="text"
              name="max_redeem"
              value={values.max_redeem}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.max_redeem && touched.max_redeem ? true : false}
              helperText={
                errors.max_redeem &&
                touched.max_redeem && <>{errors.max_redeem}</>
              }
            />
          </div>
          <div>
            <TextArea
              label="Max redeem Per Day"
              placeholder="Enter Max redeem Per Day"
              type="text"
              name="max_redeem_day"
              value={values.max_redeem_day}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.max_redeem_day && touched.max_redeem_day ? true : false
              }
              helperText={
                errors.max_redeem_day &&
                touched.max_redeem_day && <>{errors.max_redeem_day}</>
              }
            />
            <TextArea
              label="Max redeem Per Month"
              placeholder="Enter Max redeem Per Month"
              type="text"
              name="max_redeem_month"
              value={values.max_redeem_month}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.max_redeem_month && touched.max_redeem_month
                  ? true
                  : false
              }
              helperText={
                errors.max_redeem_month &&
                touched.max_redeem_month && <>{errors.max_redeem_month}</>
              }
            />
          </div>
          <div>
            <TextArea
              label="Max redeem Per Year"
              placeholder="Enter Max redeem Per Year"
              type="text"
              name="max_redeem_year"
              value={values.max_redeem_year}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.max_redeem_year && touched.max_redeem_year ? true : false
              }
              helperText={
                errors.max_redeem_year &&
                touched.max_redeem_year && <>{errors.max_redeem_year}</>
              }
            />
            <TextArea
              label="Cash Conversion Factor"
              placeholder="Enter Cash Conversion Factor"
              type="text"
              name="cash_converstion_factor"
              value={values.cash_converstion_factor}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={
                errors.cash_converstion_factor &&
                touched.cash_converstion_factor
                  ? true
                  : false
              }
              helperText={
                errors.cash_converstion_factor &&
                touched.cash_converstion_factor && (
                  <>{errors.cash_converstion_factor}</>
                )
              }
            />
          </div>
          {/* Accrual limit set */}
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={
              filtered_master[0]?.isPointAccrualLimit === true ? true : false
            }
            value={
              filtered_master[0]?.isPointAccrualLimit === true ? true : false
            }
            name="accrual_checkbox"
          />
          {filtered_master.length == 0 ||
          filtered_master[0]?.isPointAccrualLimit === true ? (
            <>
              <p className="innerheading">Accrual Limits</p>
              <div>
                <TextArea
                  label="Min Accrual Per Transaction"
                  placeholder="Enter Min Accrual Per Transaction"
                  type="text"
                  name="min_accrual"
                  value={values.min_accrual}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={
                    errors.min_accrual && touched.min_accrual ? true : false
                  }
                  helperText={
                    errors.min_accrual &&
                    touched.min_accrual && <>{errors.min_accrual}</>
                  }
                />
                <TextArea
                  label="Max Accrual Per Day"
                  placeholder="Enter Max Accrual Per Day"
                  type="text"
                  name="max_accrual_per_day"
                  value={values.max_accrual_per_day}
                  onChange={(e) => {
                    handleChange(e);
                    // plusChange(e);
                  }}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={
                    errors.max_accrual_per_day && touched.max_accrual_per_day
                      ? true
                      : false
                  }
                  helperText={
                    errors.max_accrual_per_day &&
                    touched.max_accrual_per_day && (
                      <>{errors.max_accrual_per_day}</>
                    )
                  }
                />
              </div>
              <div>
                <TextArea
                  label="Max Accrual Per Month"
                  placeholder="Enter Max Accrual Per Month"
                  type="text"
                  name="max_accrual_per_month"
                  value={values.max_accrual_per_month}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={
                    errors.max_accrual_per_month &&
                    touched.max_accrual_per_month
                      ? true
                      : false
                  }
                  helperText={
                    errors.max_accrual_per_month &&
                    touched.max_accrual_per_month && (
                      <>{errors.max_accrual_per_month}</>
                    )
                  }
                />
                <TextArea
                  label="Max Accrual Per Year"
                  placeholder="Enter Max Accrual Per Year"
                  type="text"
                  name="max_accrual_per_year"
                  value={values.max_accrual_per_year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={
                    errors.max_accrual_per_year && touched.max_accrual_per_year
                      ? true
                      : false
                  }
                  helperText={
                    errors.max_accrual_per_year &&
                    touched.max_accrual_per_year && (
                      <>{errors.max_accrual_per_year}</>
                    )
                  }
                />
              </div>
            </>
          ) : null}
        </div>
      </form>
    </>
  );
};
