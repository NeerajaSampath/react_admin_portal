import { React, useState } from "react";
import { Field } from "formik";
import { ButtonArea, TextArea, DefaultSelect } from "../../Common/Elements";

export const RuleTierField = ({
  i,
  values,
  setValues,
  ruleValue,
  tierValue,
  ruleState,
  removeRule,
  handleChange,
}) => {
  const [PercentTrue, setPercentTrue] = useState(false);
  const [referral_points, setreferral_points] = useState(false);
  const referral_pointsfn = (e) => {
    const valueFind = ruleState.find(
      (opt) => opt.rule_config_id === e.target.value
    );
    setPercentTrue(valueFind.is_points_by_percentage);
    if (
      valueFind.txn_sub_type === "REFERRAL" ||
      valueFind.txn_sub_type === "FIRST_DEBIT"
    ) {
      setreferral_points(true);
    } else {
      setreferral_points(false);
    }
  };
  return (
    <div key={i} className="list-group list-group-flush">
      <div className="list-group-item relative">
        <h5>Rule Tier Mapping {i + 1}</h5>
        <Field name={`ruleTireList.${i}.ruleConfigId`}>
          {({ field, meta }) => (
            <DefaultSelect
              error={!!meta.error && meta.touched}
              labelId="ruleLabel"
              id="ruleSelect"
              label="Reward Rule"
              name="ruleConfigId"
              value={ruleValue}
              optionvalue={ruleValue}
              formhelpertext={`${
                meta.touched && meta.error !== undefined ? meta?.error : ""
              }`}
              {...field}
              onChange={(e) => {
                handleChange(e);
                const name = ruleState.find(
                  (names) => names.rule_config_id === e.target.value
                );
                setPercentTrue(name.is_points_by_percentage);
                referral_pointsfn(e);
              }}
            />
          )}
        </Field>
        <Field name={`ruleTireList.${i}.tierId`}>
          {({ field, meta }) => (
            <DefaultSelect
              error={!!meta.error && meta.touched}
              labelId="ruleLabel"
              id="ruleSelect"
              label="Tier Config"
              name="ruleConfigId"
              value={tierValue[0]}
              optionvalue={tierValue}
              formhelpertext={`${
                meta.touched && meta.error !== undefined ? meta?.error : ""
              }`}
              {...field}
            />
          )}
        </Field>
        <Field name={`ruleTireList.${i}.points`}>
          {({ field, meta }) => (
            <TextArea
              label={PercentTrue ? "Percentage" : "Points"}
              placeholder={`Enter ${PercentTrue ? "Percentage" : "Points"}`}
              variant="outlined"
              type="text"
              className="CustomInput"
              error={meta.error && meta.touched}
              helperText={`${
                meta.touched && meta.error !== undefined ? meta?.error : ""
              }`}
              {...field}
            />
          )}
        </Field>
        {referral_points && (
          <Field name={`ruleTireList.${i}.refferpoints`}>
            {({ field, meta }) => (
              <TextArea
                label="Refferer Points"
                placeholder={`Enter Refferer Points`}
                variant="outlined"
                type="text"
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

        {values.ruleTireList.length > 1 && (
          <ButtonArea
            type="button"
            variant="text"
            value="- Remove"
            className="remove-btn"
            onClick={() => removeRule(values, setValues, i)}
          />
        )}
      </div>
    </div>
  );
};
