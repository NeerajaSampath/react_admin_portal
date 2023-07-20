import { Form, Formik } from "formik";
import {
  ButtonArea,
  CustomSnakebar,
  TextArea,
  Toggle,
} from "../../Common/Elements";
import { PostSingleRuleTierMapConfig } from "../../../apiConfig";
import { React, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SUB_URL, MAKER_URL, RULETIER_URL } from "../../../Constant";
import axios from "../../../api";
import { v4 as uuidv4 } from "uuid";
import { ruletierEdit } from "../../Schema/Schema";

const RuleTierEdit = () => {
  const CustomNavigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const { setLoading, setConfig_update } = useAuth();
  const ruletierConfigDto = JSON.parse(
    sessionStorage.getItem("ViewruleTierMappingKeyDto")
  );
  const initialValues = {
    rule_name: ruletierConfigDto?.ruleConfigDto?.name,
    tier_name: ruletierConfigDto?.tiersConfigDTO?.tier_name,
    points: ruletierConfigDto?.points,
    refferPoints: ruletierConfigDto?.refferPoints,
    isEnabled: ruletierConfigDto?.isEnabled,
    txn_sub_type: ruletierConfigDto?.ruleConfigDto?.txn_sub_type,
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  //Routes
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${RULETIER_URL}`);
  };
  //submit
  const onSubmit = async (values, actions) => {
    let payload = {
      ruleTierMappingKeyDto: {
        ruleConfigId: ruletierConfigDto?.ruleConfigDto?.rule_config_id,
        tierId: ruletierConfigDto?.tiersConfigDTO?.tier_id,
        ruleTierMappingId: uuidv4(),
      },
      points: values?.points,
      refferPoints: values?.refferPoints == "" ? 0 : values?.refferPoints,
      isEnabled: false,
      refId: ruletierConfigDto?.ruleTierMappingKeyDto?.ruleTierMappingId,
    };
    setLoading(true);
    await axios({
      method: "post",
      url: `${PostSingleRuleTierMapConfig}`,
      data: payload,
    })
      .then((res) => {
        setLoading(false);
        TableCom();
        setConfig_update(true);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setOpen(true);
        setmsg_error(error?.response?.data?.message);
      });
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ruletierEdit}
      onSubmit={onSubmit}
    >
      {({
        errors,
        values,
        touched,
        handleBlur,
        setValues,
        isValid,
        handleChange,
      }) => {
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
            <div className="CommonHeader">
              <h5 className="title">Rule Tier Mapping</h5>
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
                  type="submit"
                  variant="contained"
                  value="Send for Approval"
                  //   disabled={!isValid}
                />
              </div>
            </div>
            {/* <Toggle
              label={values.isEnabled ? "Active Status" : "Inactive Status"}
              name="isEnabled"
              defaultChecked={ruletierConfigDto?.isEnabled}
              value={values.isEnabled}
              onChange={handleChange}
            /> */}
            <p className="innerheading">Rule Tier Mapping Details</p>
            <TextArea
              label="Rule Name"
              InputProps={{
                readOnly: true,
              }}
              placeholder="Enter Rule Name"
              type="text"
              defaultValue={ruletierConfigDto?.ruleConfigDto?.name}
              name="rule_name"
              value={values.rule_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.rule_name && touched.rule_name ? true : false}
              helperText={
                errors.rule_name && touched.rule_name && <>{errors.rule_name}</>
              }
            />
            <TextArea
              label="Tier Name"
              placeholder="Enter Tier Name"
              type="text"
              InputProps={{
                readOnly: true,
              }}
              defaultValue={ruletierConfigDto?.tiersConfigDTO?.tier_name}
              name="tier_name"
              value={values.tier_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.tier_name && touched.tier_name ? true : false}
              helperText={
                errors.tier_name && touched.tier_name && <>{errors.tier_name}</>
              }
            />
            <TextArea
              label={
                ruletierConfigDto?.ruleConfigDto?.is_points_by_percentage
                  ? "Percentage"
                  : "Points"
              }
              placeholder={
                ruletierConfigDto?.ruleConfigDto?.is_points_by_percentage
                  ? "Enter Percentage"
                  : "Enter Points"
              }
              type="text"
              defaultValue={ruletierConfigDto?.points}
              name="points"
              value={values.points}
              onChange={handleChange}
              onBlur={handleBlur}
              className="CustomInput"
              error={errors.points && touched.points ? true : false}
              helperText={
                errors.points && touched.points && <>{errors.points}</>
              }
            />
            {values.txn_sub_type == "FIRST_DEBIT" ||
            values.txn_sub_type == "REFERRAL" ? (
              <TextArea
                label="Referrer Points"
                placeholder="Enter Referrer Points"
                type="text"
                defaultValue={ruletierConfigDto?.refferPoints}
                name="refferPoints"
                value={values.refferPoints}
                onChange={handleChange}
                onBlur={handleBlur}
                className="CustomInput"
                error={
                  errors.refferPoints && touched.refferPoints ? true : false
                }
                helperText={
                  errors.refferPoints &&
                  touched.refferPoints && <>{errors.refferPoints}</>
                }
              />
            ) : null}
          </Form>
        );
      }}
    </Formik>
  );
};

export default RuleTierEdit;
