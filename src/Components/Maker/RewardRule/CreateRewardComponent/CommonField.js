import { React, useState, useEffect } from "react";
import { Field } from "formik";
import {
  ButtonArea,
  TextArea,
  DefaultSelect,
  RadioGroup,
  NewMultiselect,
} from "../../../Common/Elements";
import { MenuItem, TextField, Autocomplete } from "@mui/material";
import axios from "../../../../api";
import Checkbox from "@mui/material/Checkbox";
import { GetMccConfig } from "../../../../apiConfig";

const CommonField = ({
  i,
  values,
  rulesubtype,
  setValues,
  removeRule,
  listOptions,
  rule_fields,
  handleChange,
  customlabel,
  setFieldValue,
}) => {
  const [ruleField, setRuleField] = useState({
    isEvent: false,
    isMinValueBased: false,
    isFirstScan: false,
    isRecurring: false,
    isReferral: false,
    isBatch: false,
    isMcc: false,
    isCashback: false,
    isMaxValueBased: false,
    isTransaction: false,
  });
  const [ShowField, setShowField] = useState(false);
  const showTextFunc = (value) => {
    const valueFind = listOptions.find((opt) => opt.subTypeName === value);
    setRuleField({
      isMcc: valueFind?.isMcc,
      isMinValueBased: valueFind?.isMinValueBased,
      isBatch: valueFind?.isBatch,
      isCashback: valueFind?.isCashback,
      isEvent: valueFind?.isEvent,
      isFirstScan: valueFind?.isFirstScan,
      isRecurring: valueFind?.isRecurring,
      isReferral: valueFind?.isReferral,
      isMaxValueBased: valueFind?.isMaxValueBased,
      isTransaction: valueFind?.isTransaction,
    });
  };
  //reward type ratio item
  const DebitRadioItem = [
    { id: "absolute", title: "Absolute" },
    { id: "percentage", title: "Percentage" },
  ];
  //mcc api call with onchange fn
  const [mcc_code, setmcc_code] = useState([]);
  const [mcc_id_value, setmcc_id_value] = useState([]);
  // const [mcc_id_value, setmcc_id_value] = useState([]);
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
  //recurring type radio item
  const RecurringRadioItem = [
    { id: "is_yearly", title: "Years" },
    { id: "is_monthly", title: "Months" },
    { id: "is_days", title: "Days" },
  ];
  return (
    <div className="relative">
      <h5 style={{ textTransform: "capitalize" }}>{`${customlabel} ${
        i + 1
      }`}</h5>
      <div style={{ display: ruleField.isTransaction ? "block" : "flex" }}>
        {/* Select sub type for reward */}
        <div className="checkbox-div">
          <Field name={`rule_field.${i}.Sub_type_rule`}>
            {({ field, meta }) => (
              <DefaultSelect
                error={!!meta.error && meta.touched}
                labelId="ruleLabel"
                id="ruleSelect"
                label={`${customlabel} Types`}
                name="Sub_type_rule"
                value={rulesubtype}
                optionvalue={rulesubtype}
                formhelpertext={`${
                  meta.touched && meta.error !== undefined ? meta?.error : ""
                }`}
                {...field}
                onChange={(e) => {
                  setShowField(true);
                  const valueFind = listOptions.find(
                    (opt) => opt.subTypeName === e.target.value
                  );
                  values.rule_field[i].Sub_type_rule = e.target.value;
                  values.rule_field[i].is_recurring = valueFind.isRecurring;
                  values.rule_field[i].is_referral = valueFind.isReferral;
                  values.rule_field[i].is_event = valueFind.isEvent;
                  values.rule_field[i].is_batch = valueFind.isBatch;
                  values.rule_field[i].is_first_scan = valueFind.isFirstScan;
                  values.rule_field[i].is_cashback = valueFind.isCashback;
                  values.rule_field[i].isTransaction = valueFind.isTransaction;
                  values.rule_field[i].isPercentage = valueFind.isPercentage;
                  values.rule_field[i].isValue = valueFind.isValue;
                  values.rule_field[i].max_pnts_field_val =
                    valueFind.isMaxValueBased;
                  values.rule_field[i].min_pnts_field_val =
                    valueFind.isMinValueBased;
                  values.rule_field[i].isInitialSetUp =
                    valueFind.isInitialSetUp;
                  setValues(values);
                  showTextFunc(e.target.value);
                }}
              />
            )}
          </Field>
        </div>
        {/* isTransaction section */}
        {ruleField.isTransaction && (
          <div style={{ margin: "0 0 10px" }}>
            <Field name={`rule_field.${i}.reward_type`}>
              {({ field, meta }) => (
                <RadioGroup
                  labelid="Reward_type"
                  name="reward_type"
                  groplabel="Reward Type"
                  items={DebitRadioItem}
                  value={field.Reward_type}
                  {...field}
                />
              )}
            </Field>
          </div>
        )}
        {/* min & max section */}
        {ruleField?.isMinValueBased && (
          <Field name={`rule_field.${i}.min_pnts`}>
            {({ field, meta }) => (
              <TextArea
                label={
                  customlabel === "referral"
                    ? `${customlabel} Min Count`
                    : `${customlabel} Min Transaction Amount`
                }
                placeholder={`Enter ${customlabel} Min Transaction Amount`}
                variant="outlined"
                disabled={
                  ruleField.isTransaction &&
                  values.rule_field[i].reward_type === ""
                    ? true
                    : false
                }
                type="text"
                id={`rule_field.${i}.min_pnts`}
                className="CustomInput"
                error={meta.error && meta.touched}
                helperText={`${
                  meta.touched && meta.error !== undefined ? meta?.error : ""
                }`}
                {...field}
              />
            )}
          </Field>
        )}
        {ruleField?.isMaxValueBased && (
          <Field name={`rule_field.${i}.max_pnts`}>
            {({ field, meta }) => (
              <TextArea
                label={
                  customlabel === "referral"
                    ? `${customlabel} Max Count`
                    : `${customlabel} Max Transaction Amount`
                }
                placeholder={`Enter ${customlabel} Max Transaction Amount`}
                disabled={
                  ruleField.isTransaction &&
                  values.rule_field[i].reward_type === ""
                    ? true
                    : false
                }
                variant="outlined"
                type="text"
                id={`rule_field.${i}.max_value`}
                className="CustomInput"
                error={meta.error && meta.touched}
                helperText={`${
                  meta.touched && meta.error !== undefined ? meta?.error : ""
                }`}
                {...field}
              />
            )}
          </Field>
        )}
        {/* isMcc section */}
        {ruleField.isMcc && (
          // <div className="field-container autocomplete_div">
          //   <Field name={`rule_field.${i}.mcc_id`}>
          //     {({ field, meta }) => {
          //       // console.log("rule field mcc", values.mcc_id);
          //       return (
          //         <Autocomplete
          //           multiple
          //           m={2}
          //           sx={{
          //             margin: "13px 20px 0px 0",
          //             paddingBottom: "0px",
          //             paddingTop: "5px",
          //             fontSize: 12,
          //             textTransform: "capitalize",
          //           }}
          //           size="small"
          //           limitTags={2}
          //           id="mcc_code_id"
          //           options={mcc_code}
          //           disableCloseOnSelect
          //           name="mcc_id"
          //           value={mcc_id_value}
          //           getOptionLabel={(option) => option.mccId}
          //           filterSelectedOptions
          //           // {...field}
          //           onChange={(e, value) => {
          //             // const mcc_filter = value.map((item) => item?.mccId);
          //             // console.log("mcc_filter", mcc_filter);
          //             // setFieldValue("mcc_id", mcc_filter);
          //             console.log("values from onchange", values.mcc_id);
          //             setmcc_id_value(value.mccId);
          //             handleChange(e);
          //             // setValues(mcc_filter);
          //             console.log("value from onchange", value);
          //           }}
          //           isOptionEqualToValue={(option, value) =>
          //             // console.log("value", value)
          //             option.mccId === value.mccId
          //           }
          //           renderInput={(params) => (
          //             <TextField
          //               fullWidth
          //               size="small"
          //               {...params}
          //               label="MCC Block"
          //               placeholder="Enter MCC Block"
          //             />
          //           )}
          //         />
          //       );
          //     }}
          //   </Field>
          // </div>
          <Field name={`rule_field.${i}.mcc_id`}>
            {({ field, meta }) => (
              <NewMultiselect
                label="Block Mcc Code"
                name="mcc_id"
                value={mcc_id_value}
                onChange={(event) => {
                  handleChangeselect(event);
                }}
                {...field}
                disabled={
                  ruleField.isTransaction &&
                  values.rule_field[i].reward_type === ""
                    ? true
                    : false
                }
                optionvalue={mcc_code.map((mcc_ids, index) => (
                  <MenuItem
                    key={index}
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
            )}
          </Field>
        )}
      </div>
      {/* isRecurring section */}
      {ruleField.isRecurring && (
        <div>
          <Field name={`rule_field.${i}.recurring_type`}>
            {({ field, meta }) => (
              <RadioGroup
                labelid="recurring_type"
                name="recurring_type"
                groplabel="Recurring Type"
                items={RecurringRadioItem}
                value={field.recurring_type}
                {...field}
              />
            )}
          </Field>
          <div>
            <Field name={`rule_field.${i}.recurring_duration`}>
              {({ field, meta }) => (
                <TextArea
                  label={`${customlabel} Duration`}
                  placeholder={`"Enter ${customlabel} Duration"`}
                  disabled={!values.rule_field[i].recurring_type}
                  variant="outlined"
                  type="text"
                  id={`rule_field.${i}.recurring_duration`}
                  className="CustomInput"
                  error={meta.error && meta.touched}
                  helperText={`${
                    meta.touched && meta.error !== undefined ? meta?.error : ""
                  }`}
                  {...field}
                />
              )}
            </Field>
          </div>
        </div>
      )}

      {/* condition value for the remaining payload */}
      {/* transaction checkbox */}
      <Field name={`rule_field.${i}.isTransaction`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.isTransaction}
            onChange={(e) => {
              values.rule_field[i].isTransaction = !field.isTransaction;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* recurring checkbox */}
      <Field name={`rule_field.${i}.is_recurring`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_recurring}
            onChange={(e) => {
              values.rule_field[i].is_recurring = !field.is_recurring;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* min checkbox */}
      <Field name={`rule_field.${i}.min_pnts_field_val`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.min_pnts_field_val}
            onChange={(e) => {
              values.rule_field[i].min_pnts_field_val =
                !field.min_pnts_field_val;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* max checkbox */}
      <Field name={`rule_field.${i}.max_pnts_field_val`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.max_pnts_field_val}
            onChange={(e) => {
              values.rule_field[i].max_pnts_field_val =
                !field.max_pnts_field_val;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* referral checkbox */}
      <Field name={`rule_field.${i}.is_referral`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_referral}
            onChange={(e) => {
              values.rule_field[i].is_referral = !field.is_referral;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* event checkbox */}
      <Field name={`rule_field.${i}.is_event`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_event}
            onChange={(e) => {
              values.rule_field[i].is_event = !field.is_event;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* batch checkbox */}
      <Field name={`rule_field.${i}.is_batch`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_batch}
            onChange={(e) => {
              values.rule_field[i].is_batch = !field.is_batch;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* first scan checkbox */}
      <Field name={`rule_field.${i}.is_first_scan`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_first_scan}
            onChange={(e) => {
              values.rule_field[i].is_first_scan = !field.is_first_scan;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* cashback checkbox */}
      <Field name={`rule_field.${i}.is_cashback`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.is_cashback}
            onChange={(e) => {
              values.rule_field[i].is_cashback = !field.is_cashback;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* cashback checkbox */}
      <Field name={`rule_field.${i}.isPercentage`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.isPercentage}
            onChange={(e) => {
              values.rule_field[i].isPercentage = !field.isPercentage;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* cashback checkbox */}
      <Field name={`rule_field.${i}.is_cashback`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.isValue}
            onChange={(e) => {
              values.rule_field[i].isValue = !field.isValue;
              setValues(values);
            }}
          />
        )}
      </Field>
      {/* cashback checkbox */}
      <Field name={`rule_field.${i}.isInitialSetUp`}>
        {({ field }) => (
          <Checkbox
            className="checkboxhidden"
            label={{ inputProps: { "aria-label": "Checkbox demo" } }}
            checked={field.isInitialSetUp}
            onChange={(e) => {
              values.rule_field[i].isInitialSetUp = !field.isInitialSetUp;
              setValues(values);
            }}
          />
        )}
      </Field>

      {/* add another button */}
      {values.rule_field.length > 1 && (
        <ButtonArea
          type="button"
          variant="text"
          value="- Remove"
          className="remove-btn"
          onClick={() => removeRule(values, setValues, i)}
        />
      )}
    </div>
  );
};
export default CommonField;
