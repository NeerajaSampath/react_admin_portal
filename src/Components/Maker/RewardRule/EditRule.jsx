import { React, useEffect, useState } from "react";
import axios from "../../../api";
import {
  PostTierConfig,
  GetMasterConfig,
  GetExpiryConfig,
  GetTierConfig,
  PostRuleConfig,
  GetMccConfig,
  PostSingleRuleConfig,
  GetTypeConfig,
} from "../../../apiConfig";
import {
  ButtonArea,
  TextArea,
  DefaultSelect,
  CustomSnakebar,
  RadioGroup,
  Toggle,
  NewMultiselect,
} from "../../Common/Elements";
import { useFormik } from "formik";
import { RuleEditSchema } from "../../Schema/Schema";
import backArrow from "../../../assets/img/backArrow.svg";
import { MenuItem, Tooltip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MAKER_URL, REWARD_URL, SUB_URL } from "../../../Constant";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../../../Hooks/useAuth";

export const EditRule = ({ setTierApproval }) => {
  const { setLoading, setConfig_update } = useAuth();
  const CustomNavigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [typeAPI, settypeAPI] = useState([]);
  const ruleConfigDto = JSON.parse(sessionStorage.getItem("ruleConfigDto"));
  const [reward_type, setreward_type] = useState(
    ruleConfigDto?.is_points_by_percentage ? "percentage" : "absolute"
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    RewardTabAPI();
  }, []);
  const RewardTabAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetTypeConfig}/0/1000`);
      setLoading(false);
      settypeAPI(res?.data?.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  const data = typeAPI.flatMap((item) => {
    return item.subTypeConfigDTOS.map((items) => {
      return { ...items };
    });
  });
  const filter_subtype = data
    .filter((item) => item.subTypeName === ruleConfigDto?.txn_sub_type)
    .map((items) => {
      return { ...items };
    });
  console.log("typeAPI", filter_subtype[0]?.isMinValueBased);
  //onsubmit function
  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const resp = await axios({
        method: "post",
        url: `${PostSingleRuleConfig}`,
        data: payLoad,
      });
      setLoading(false);
      actions.resetForm();
      TableCom();
      setConfig_update(true);
      // setTierApproval(true);
    } catch (error) {
      setLoading(false);
      console.log("error", error.response);
      setOpen(true);
      setmsg_error(error.response.data.message);
    }
  };
  //redirection
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${REWARD_URL}`);
  };
  //recurring type radio item
  const RecurringRadioItem = [
    { id: "is_yearly", title: "Years" },
    { id: "is_monthly", title: "Months" },
    { id: "is_days", title: "Days" },
  ];
  //mcc config function
  const [mcc_code, setmcc_code] = useState([]);
  const [mcc_id_value, setmcc_id_value] = useState(ruleConfigDto?.mcc_ids);
  useEffect(() => {
    mcc_codeApi();
  }, []);
  const mcc_codeApi = async () => {
    try {
      // setLoading(true);
      const res = await axios.get(`${GetMccConfig}`);
      // setLoading(false);
      setmcc_code(res.data.data);
    } catch (err) {
      // setLoading(false);
      console.log(err.message);
    }
  };
  const handleChangeselect = (event) => {
    const {
      target: { value },
    } = event;
    setmcc_id_value(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  //reward type ratio item
  const DebitRadioItem = [
    { id: "absolute", title: "Absolute" },
    { id: "percentage", title: "Percentage" },
  ];
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
    initialValues: {
      name: ruleConfigDto?.name.toLowerCase(),
      txn_type: ruleConfigDto?.txn_type,
      txn_sub_type: ruleConfigDto?.txn_sub_type,
      // Reward_type: ruleConfigDto?.is_points_by_percentage
      //   ? "percentage"
      //   : "absolute",
      base_points: ruleConfigDto?.base_points,
      min_pnts: ruleConfigDto?.min_value,
      max_pnts: ruleConfigDto?.max_value,
      is_first_scan: ruleConfigDto?.is_first_scan,
      is_campaign: ruleConfigDto?.is_campaign,
      multiplier: ruleConfigDto?.multiplier,
      start_date: ruleConfigDto?.start_date,
      end_date: ruleConfigDto?.end_date,
      mcc_code: ruleConfigDto?.mcc_code,
      recurring_type: ruleConfigDto?.is_yearly
        ? "is_yearly"
        : ruleConfigDto?.is_monthly
        ? "is_monthly"
        : ruleConfigDto?.is_days
        ? "is_days"
        : "",
      duration: ruleConfigDto?.duration === null ? "" : ruleConfigDto?.duration,
      is_referral: ruleConfigDto?.is_referral,
      is_per_referral: ruleConfigDto?.is_per_referral,
      is_milestone: ruleConfigDto?.is_milestone,
      mile_stone_points: ruleConfigDto?.mile_stone_points,
      is_batch: ruleConfigDto?.is_batch,
      is_recurring: ruleConfigDto?.is_recurring,
      is_initial_setup: ruleConfigDto?.is_initial_setup,
      is_event: ruleConfigDto?.is_event,
      is_enabled: ruleConfigDto?.is_enabled,
      mcc_ids: ruleConfigDto?.mcc_ids,
      is_cashback: ruleConfigDto?.is_cashback,
    },
    onSubmit,
    validationSchema: RuleEditSchema,
  });
  const payLoad = {
    rule_config_id: uuidv4(),
    name: values?.name,
    txn_type: ruleConfigDto?.txn_type,
    txn_sub_type: ruleConfigDto?.txn_sub_type,
    is_points_by_percentage: reward_type === "percentage",
    is_points_by_value: reward_type === "absolute",
    base_points: ruleConfigDto?.base_points,
    min_value: values?.min_pnts,
    max_value: values?.max_pnts,
    is_first_scan: ruleConfigDto?.is_first_scan,
    is_campaign: ruleConfigDto?.is_campaign,
    multiplier: ruleConfigDto?.multiplier,
    start_date: ruleConfigDto?.start_date,
    end_date: ruleConfigDto?.end_date,
    mcc_code: ruleConfigDto?.mcc_code,
    is_yearly: values.recurring_type === "is_yearly",
    is_monthly: values.recurring_type === "is_monthly",
    is_days: values.recurring_type === "is_days",
    duration: values?.duration,
    is_referral: ruleConfigDto?.is_referral,
    is_per_referral: ruleConfigDto?.is_per_referral,
    is_milestone: ruleConfigDto?.is_milestone,
    mile_stone_points: ruleConfigDto?.mile_stone_points,
    is_batch: values?.is_batch,
    is_recurring: values?.is_recurring,
    is_initial_setup: ruleConfigDto?.is_initial_setup,
    is_event: ruleConfigDto?.is_event,
    is_enabled: ruleConfigDto?.is_enabled,
    mcc_ids: mcc_id_value,
    is_cashback: false,
    refId: ruleConfigDto?.rule_config_id,
    isEnabled: ruleConfigDto?.is_enabled,
    is_reversal: false,
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
          <h5 className="title">Rule Configuration</h5>
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
        <div
          className="common-inner-header"
          style={{
            display: "flex",
            alignItem: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h5>
              <img src={backArrow} onClick={TableCom} alt="back icon" />
              Edit Rule - {ruleConfigDto?.txn_type.toLowerCase()}
            </h5>
            <p>
              The following configurations are supported for the per transaction
              rewards.
            </p>
          </div>
          {/* <Toggle
            label={values.is_enabled ? "Active Status" : "Inactive Status"}
            name="is_enabled"
            defaultChecked={ruleConfigDto?.is_enabled}
            value={values.is_enabled}
            onChange={handleChange}
          /> */}
        </div>
        <div className="form">
          {/* <p className="innerheading">Rule Details</p> */}
          {/* rule name */}
          <div>
            <p className="innerheading">Rule Details</p>
            <TextArea
              label={`Rule Name`}
              placeholder="Enter Rule name"
              type="text"
              name="name"
              InputProps={{
                readOnly: true,
              }}
              defaultValue={ruleConfigDto?.name}
              value={values.name.toLowerCase()}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.name && touched.name ? true : false}
              helperText={errors.name && touched.name && <>{errors.name}</>}
            />
          </div>
          <div>
            <p className="innerheading">Type & SubType Details</p>
            <TextArea
              label={`Transaction Type`}
              placeholder="Enter Rule name"
              type="text"
              name="name"
              InputProps={{
                readOnly: true,
              }}
              defaultValue={ruleConfigDto?.txn_type}
              value={values.txn_type.toLowerCase()}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.name && touched.name ? true : false}
              helperText={errors.name && touched.name && <>{errors.name}</>}
            />
            <TextArea
              label={`Transaction SubType`}
              placeholder="Enter Transaction SubType"
              type="text"
              name="name"
              InputProps={{
                readOnly: true,
              }}
              defaultValue={ruleConfigDto?.txn_sub_type}
              value={values.txn_sub_type.toLowerCase()}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.name && touched.name ? true : false}
              helperText={errors.name && touched.name && <>{errors.name}</>}
            />
          </div>
          {/* type details reward */}
          {filter_subtype[0]?.isValue && (
            <div>
              <p className="innerheading">Reward Type Details</p>
              <RadioGroup
                labelid="Reward_type"
                name="reward_type"
                groplabel="Reward Type"
                items={DebitRadioItem}
                value={reward_type}
                onChange={(e) => {
                  setreward_type(e.target.value);
                  handleChange(e);
                }}
              />
            </div>
          )}
          <div>
            {filter_subtype[0]?.isMinValueBased && (
              <>
                <p className="innerheading">Min Transaction Amount Details</p>
                <TextArea
                  label={`${ruleConfigDto?.txn_sub_type} Min Transaction Amount`}
                  placeholder="Enter Min Transaction Amount"
                  type="text"
                  name="min_pnts"
                  defaultValue={ruleConfigDto?.min_value}
                  value={values.min_pnts}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={errors.min_pnts && touched.min_pnts ? true : false}
                  helperText={
                    errors.min_pnts &&
                    touched.min_pnts && <>{errors.min_pnts}</>
                  }
                />
              </>
            )}
            {filter_subtype[0]?.isMaxValueBased && (
              <>
                <p className="innerheading">Max Transaction Amount Details</p>
                <TextArea
                  label={`${ruleConfigDto?.txn_sub_type} Max Transaction Amount`}
                  placeholder="Enter Max Transaction Amount"
                  type="text"
                  name="max_pnts"
                  defaultValue={ruleConfigDto?.max_value}
                  value={values.max_pnts}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="CustomInput"
                  error={errors.max_pnts && touched.max_pnts ? true : false}
                  helperText={
                    errors.max_pnts &&
                    touched.max_pnts && <>{errors.max_pnts}</>
                  }
                />
              </>
            )}
          </div>
          {filter_subtype[0]?.isRecurring && (
            <div>
              <p className="innerheading">Recurring Details</p>
              <RadioGroup
                labelid="recurringlabel_type"
                name="recurring_type"
                groplabel="Recurring Type"
                items={RecurringRadioItem}
                value={values.recurring_type}
                onChange={handleChange}
              />
              <TextArea
                label="Duration"
                placeholder="Enter Duration"
                type="text"
                name="duration"
                disabled={!values.recurring_type}
                defaultValue={
                  ruleConfigDto?.duration === null ? "" : values.duration
                }
                value={values.duration}
                onChange={handleChange}
                onBlur={handleBlur}
                className="CustomInput"
                error={errors.duration && touched.duration ? true : false}
                helperText={
                  errors.duration && touched.duration && <>{errors.duration}</>
                }
              />
            </div>
          )}
          {/* batch details */}
          {filter_subtype[0]?.isBatch && (
            <div>
              <p className="innerheading">Milestone Details</p>
              {/* <Tooltip
                arrow
                placement="top"
                title="..."
                style={{ padding: "0" }}
              >
                <IconButton
                  sx={{
                    "&.MuiIconButton-root:hover": {
                      backgroundColor: "transparent !important",
                    },
                  }}
                > */}
              <Toggle
                label="Milestone"
                name="is_batch"
                disabled
                // inputProps={{
                //   readOnly: true,
                // }}
                defaultChecked={ruleConfigDto?.is_batch}
                value={values.is_batch}
                onChange={handleChange}
              />
              {/* </IconButton>
              </Tooltip> */}
            </div>
          )}
          {filter_subtype[0]?.isMcc && (
            <div>
              <p className="innerheading">MCC Details</p>
              <NewMultiselect
                label="Block Mcc Code"
                name="mcc_ids"
                value={mcc_id_value}
                defaultValue={mcc_id_value}
                onChange={(event) => {
                  handleChangeselect(event);
                }}
                optionvalue={mcc_code.map((mcc_ids, index) => (
                  <MenuItem
                    key={index}
                    defaultValue={values.mcc_ids}
                    value={mcc_ids.mccId}
                    option={mcc_ids.mccCode}
                    sx={{
                      fontSize: "14px",
                      textTransform: "capitalize",
                      wordBreak: "break-all",
                    }}
                  >
                    {mcc_ids.mccCode + " - " + mcc_ids.name}
                  </MenuItem>
                ))}
              />
            </div>
          )}
        </div>
      </form>
    </>
  );
};
