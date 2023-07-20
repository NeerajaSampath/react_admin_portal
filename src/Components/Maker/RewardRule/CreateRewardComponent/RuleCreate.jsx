import { React } from "react";
import { Formik, Form, FieldArray } from "formik";
import axios from "../../../../api";
import { PostRuleConfig } from "../../../../apiConfig";
import { ButtonArea, CustomSnakebar } from "../../../Common/Elements";
import { v4 as uuidv4 } from "uuid";
import { RuleCreation } from "../../../Schema/Schema";
import CommonField from "./CommonField";
import useAuth from "../../../../Hooks/useAuth";

const RuleCreate = ({
  TableCom,
  open,
  setOpen,
  handleClose,
  setmsg_error,
  msg_error,
  customlabel,
  rulesubtype,
  listOptions,
  rulesubtypeLength,
}) => {
  const initialValues = {
    rule_field: [],
  };
  const { setLoading, setConfig_update } = useAuth();
  //onsubmit with payload destructure
  const onSubmit = async (values, actions) => {
    // payload destructure
    let payloadDestructure = values.rule_field.map((item) => {
      return {
        rule_config_id: uuidv4(),
        name: item.Sub_type_rule,
        txn_type: customlabel.toUpperCase(),
        txn_sub_type: item.Sub_type_rule,
        is_points_by_percentage: item.isTransaction
          ? item.reward_type === "percentage"
          : item.isPercentage
          ? true
          : false,
        is_points_by_value: item.isTransaction
          ? item.reward_type === "absolute"
          : item.isValue
          ? true
          : false,
        min_value: item.min_pnts === "" ? 0.0 : item.min_pnts,
        max_value: item.max_pnts === "" ? 0.0 : item.max_pnts,
        mcc_code: null,
        is_referral: item.is_referral,
        is_per_referral: item.Sub_type_rule === "REFERRAL" ? true : false,
        is_milestone:
          item.Sub_type_rule === "REFERRAL_MILESTONE" ? true : false,
        is_event: item.is_event,
        is_recurring: item.is_recurring,
        is_yearly: item.recurring_type === "is_yearly" ? true : false,
        is_monthly: item.recurring_type === "is_monthly" ? true : false,
        is_days: item.recurring_type === "is_days" ? true : false,
        duration:
          item.recurring_duration === "" ? null : item.recurring_duration,
        is_batch: item.is_batch,
        mcc_ids: item.mcc_id,
        is_first_scan: item.is_first_scan,
        base_points: 5.0,
        mile_stone_points: 0.0,
        is_campaign: false,
        multiplier: 0,
        start_date: null,
        end_date: null,
        is_initial_setup: false,
        is_enabled: false,
        is_cashback: item.is_cashback,
        is_reversal: false,
      };
    });
    let payload = {
      ruleConfigDtoList: payloadDestructure,
    };
    // console.log("payload", payload);
    setLoading(true);
    await axios({
      method: "post",
      url: `${PostRuleConfig}`,
      data: payload,
    })
      .then((res) => {
        console.log("res", res?.data);
        setLoading(false);
        TableCom();
        setConfig_update(true);
      })
      .catch((error) => {
        setLoading(false);
        setOpen(true);
        console.log(error);
        setmsg_error(error?.response?.data?.message);
      });
  };

  function addOneRule(values, setValues) {
    const rule_field = [...values.rule_field];
    rule_field.push({
      Sub_type_rule: "",
      reward_type: "",
      min_pnts: "",
      max_pnts: "",
      min_pnts_field_val: "",
      max_pnts_field_val: "",
      mcc_id: [],
      recurring_type: "",
      recurring_duration: "",
      is_recurring: false,
      is_referral: false,
      is_event: false,
      is_batch: false,
      is_first_scan: false,
      is_cashback: false,
      isTransaction: false,
      isPercentage: false,
      isValue: false,
      isInitialSetUp: false,
    });
    setValues({ ...values, rule_field });
  }
  function removeRule(values, setValues, index) {
    const rule_field = [...values.rule_field];
    rule_field.splice(index, 1);
    setValues({ rule_field });
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RuleCreation}
      onSubmit={onSubmit}
    >
      {({ values, setValues, setFieldValue, handleChange, isValid, dirty }) => {
        values.rule_field.length === 0 &&
          values.rule_field.push({
            Sub_type_rule: "",
            reward_type: "",
            min_pnts: "",
            max_pnts: "",
            min_pnts_field_val: "",
            max_pnts_field_val: "",
            mcc_id: [],
            recurring_type: "",
            recurring_duration: "",
            is_recurring: false,
            is_referral: false,
            is_event: false,
            is_batch: false,
            is_first_scan: false,
            is_cashback: false,
            isTransaction: false,
            isPercentage: false,
            isValue: false,
            isInitialSetUp: false,
          });
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
              severity="error"
            />
            <FieldArray name="rule_field">
              {() =>
                values.rule_field.map((rule_fields, i) => {
                  return (
                    <CommonField
                      key={i}
                      i={i}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      customlabel={customlabel}
                      values={values}
                      rule_fields={rule_fields}
                      rulesubtype={rulesubtype}
                      setValues={setValues}
                      removeRule={removeRule}
                      listOptions={listOptions}
                    />
                  );
                })
              }
            </FieldArray>
            {values.rule_field.length < rulesubtypeLength && (
              <ButtonArea
                type="button"
                variant="contained"
                value={`+ Another ${customlabel}`}
                onClick={() => addOneRule(values, setValues)}
              />
            )}
            <div className="submit-div">
              <ButtonArea
                type="submit"
                variant="contained"
                value="Send for Approval"
                disabled={!isValid}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export default RuleCreate;
