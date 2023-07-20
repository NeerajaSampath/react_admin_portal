import { React, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "../../../api";
import { v4 as uuidv4 } from "uuid";
import {
  PostRuleTierMapConfig,
  GetRuleConfig,
  GetTierConfig,
} from "../../../apiConfig";
import {
  ButtonArea,
  TextArea,
  DefaultSelect,
  CustomSnakebar,
} from "../../Common/Elements";
import { MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RULETIER_URL, MAKER_URL, SUB_URL } from "../../../Constant";
import { ruletier } from "../../Schema/Schema";
import useAuth from "../../../Hooks/useAuth";
import { RuleTierField } from "./RuleTierField";

export const CreateRuleTier = ({ setTierMapping }) => {
  const CustomNavigate = useNavigate();
  const { setLoading, setConfig_update } = useAuth();
  const [ruleState, setRuleState] = useState([]);
  const [tierState, setTierState] = useState([]);
  const [tier_filter, settier_filter] = useState([]);
  const [rule_filter, setrule_filter] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    RuleAPI();
    TierApi();
  }, []);
  useEffect(() => {
    //tier mapping based on enable true
    const filter_tier_map = tierState
      .filter((d) => d?.is_enabled === true)
      .map((item) => {
        return { ...item };
      });
    settier_filter(filter_tier_map);
    //rule mapping based on enable true
    const filter_rule_map = ruleState
      .filter((d) => d?.is_enabled === true)
      .map((item) => {
        return { ...item };
      });
    setrule_filter(filter_rule_map);
  }, [tierState, ruleState]);
  const RuleAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetRuleConfig}/0/5000`);
      setLoading(false);
      setRuleState(res?.data?.data);
    } catch (err) {
      setLoading(false);
      console.log(err?.message);
    }
  };
  const TierApi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetTierConfig}/0/10`);
      setLoading(false);
      setTierState(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  const initialValues = {
    ruleTireList: [],
  };
  const ruleValue = rule_filter.map((option) => (
    <MenuItem
      sx={{ fontSize: "14px", textTransform: "capitalize" }}
      key={`tier_${option.rule_config_id}`}
      value={option.rule_config_id}
      is_points_by_percentage={
        option.is_points_by_percentage === "true" ? "false" : "true"
      }
    >
      {option.name.toLowerCase()}
    </MenuItem>
  ));
  const tierValue = tier_filter.map((option) => (
    <MenuItem
      sx={{ fontSize: "14px" }}
      key={`tier_${option.tier_id}`}
      value={option.tier_id}
    >
      {option.tier_name.toLowerCase()}
    </MenuItem>
  ));
  const onSubmit = async (values, actions) => {
    let payloadDestructure = values.ruleTireList.map((item) => {
      return {
        ruleTierMappingKeyDto: {
          ruleConfigId: item.ruleConfigId,
          tierId: item.tierId,
          ruleTierMappingId: uuidv4(),
        },
        points: item.points,
        refferPoints: item.refferpoints == "" ? 0 : item.refferpoints,
        isEnabled: false,
      };
    });
    let payload = {
      ruleTierMappingDtoList: payloadDestructure,
    };
    setLoading(true);
    await axios({
      method: "post",
      url: `${PostRuleTierMapConfig}`,
      data: payload,
    })
      .then((res) => {
        setLoading(false);
        TableCom();
        setConfig_update(true);
        // setTierMapping(true);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setOpen(true);
        setmsg_error(error?.response?.data?.message);
      });
  };
  function addOneRule(values, setValues) {
    const ruleTireList = [...values.ruleTireList];
    ruleTireList.push({
      ruleConfigId: "",
      tierId: "",
      points: "",
      refferpoints: "",
    });
    setValues({ ...values, ruleTireList });
  }
  function removeRule(values, setValues, index) {
    const ruleTireList = [...values.ruleTireList];
    ruleTireList.splice(index, 1);
    setValues({ ruleTireList });
  }
  //Routes
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${RULETIER_URL}`);
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ruletier}
      onSubmit={onSubmit}
    >
      {({ errors, values, touched, setValues, isValid, handleChange }) => {
        values.ruleTireList.length === 0 &&
          values.ruleTireList.push({
            ruleConfigId: "",
            tierId: "",
            points: "",
            refferpoints: "",
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
                  disabled={!isValid}
                />
              </div>
            </div>
            <p className="innerheading">Rule Tier Mapping Details</p>
            <FieldArray name="ruleTireList">
              {() =>
                values.ruleTireList.map((ruleTire, i) => {
                  return (
                    <RuleTierField
                      key={i}
                      i={i}
                      ruleTire={ruleTire}
                      values={values}
                      setValues={setValues}
                      ruleValue={ruleValue}
                      tierValue={tierValue}
                      ruleState={ruleState}
                      removeRule={removeRule}
                      handleChange={handleChange}
                    />
                  );
                })
              }
            </FieldArray>
            <Field name="numberOfTickets">
              {({ field }) => (
                <ButtonArea
                  type="button"
                  variant="contained"
                  value="+ Rule Tier Mapping"
                  onClick={() => addOneRule(values, setValues)}
                />
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
};
