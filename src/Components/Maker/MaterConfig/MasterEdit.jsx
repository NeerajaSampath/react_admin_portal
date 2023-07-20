import { React, useEffect, useState } from "react";
import {
  ButtonArea,
  TextArea,
  Toggle,
  CustomSnakebar,
  DefaultSelect,
} from "../../Common/Elements";
import { masterEditConfig } from "../../Schema/Schema";
import axios from "../../../api";
import { PostMasterConfig } from "../../../apiConfig";
import { MenuItem } from "@mui/material";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SUB_URL, MAKER_URL, MASTERCONFIG_URL } from "../../../Constant";
import useAuth from "../../../Hooks/useAuth";

export const MasterEdit = () => {
  const { setConfig_update } = useAuth();
  const CustomNavigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const masterConfigDto = JSON.parse(sessionStorage.getItem("masterConfigDto"));
  const narration_format_split =
    masterConfigDto?.narrationFormat1 != null &&
    masterConfigDto?.narrationFormat1.toString().split("/");
  masterConfigDto?.narrationFormat1 != null && narration_format_split.shift();
  const narration_mapping =
    masterConfigDto?.narrationFormat1 != null
      ? narration_format_split.map((i) => "/" + i)
      : [];
  const [MappingData, setMappingData] = useState(narration_mapping);
  const [tier_type_earned_points, settier_type_earned_points] = useState(false);
  const [tier_type_available_points, settier_type_available_points] =
    useState(false);
  const [DefaultValueMaster, setDefaultValueMaster] = useState({
    isPartialReversal: masterConfigDto?.isPartialReversal,
    narration: masterConfigDto?.narrationFormat1 != null,
    entityId:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("entityid")
        : false,
    accountno:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("accountno")
        : false,
    points:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("points")
        : false,
    tranno:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("tranno")
        : false,
  });
  const arr = [];
  arr.push(...MappingData);
  const initialValues = {
    configId: masterConfigDto?.configId,
    instant: masterConfigDto?.isInstant,
    isRoundOffPoints: masterConfigDto?.isRoundOffPoints,
    isPointAccrualLimit: masterConfigDto?.isPointAccrualLimit,
    reversal_allowed: masterConfigDto?.isReversalAllowed,
    partial_reversal: masterConfigDto?.isPartialReversal,
    reverse_count: masterConfigDto?.reverseCount,
    TierUpgradeInstant: masterConfigDto?.isTierUpgradeInstant,
    isTierDowngradeInstant:
      masterConfigDto?.isTierDowngradeInstant === null
        ? false
        : masterConfigDto?.isTierDowngradeInstant,
    tierDowngradeDurationByMonths:
      masterConfigDto?.tierDowngradeDurationByMonths,
    cash_converstion_factor: masterConfigDto?.cashConverstionFactor,
    myop_enabled: masterConfigDto?.isMYOPEnabled,
    cash_redemption_enabled: masterConfigDto?.isCashRedemptionEnabled,
    currency:
      masterConfigDto?.currency === null ? "" : masterConfigDto?.currency,
    tenant: masterConfigDto?.tenant === null ? "" : masterConfigDto?.tenant,
    channelId:
      masterConfigDto?.channelId === null ? "" : masterConfigDto?.channelId,
    debitAccount:
      masterConfigDto?.debitAccount === null
        ? ""
        : masterConfigDto?.debitAccount,
    Narration: masterConfigDto?.narrationFormat1 != null ? true : false,
    entityId:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("entityid")
          ? true
          : false
        : false,
    accountno:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("accountno")
          ? true
          : false
        : false,
    points:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("points")
          ? true
          : false
        : false,
    tranno:
      masterConfigDto?.narrationFormat1 != null
        ? masterConfigDto?.narrationFormat1.includes("tranno")
          ? true
          : false
        : false,
    tierUpgradeBy: masterConfigDto?.tierUpgradeBy,
    precisionEnabled: masterConfigDto?.isPrecisionEnabled,
    precisionValue:
      masterConfigDto?.precisionValue == null
        ? 0
        : masterConfigDto?.precisionValue,
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const onSubmit = async (values, actions) => {
    const PayloadReversalfield = values.reversal_allowed ? true : false;
    let payload = {
      configId: uuidv4(),
      isInstant: values.instant,
      isRoundOffPoints: values.isRoundOffPoints,
      isPointAccrualLimit: values.isPointAccrualLimit,
      isReversalAllowed: values.reversal_allowed,
      isPartialReversal: PayloadReversalfield ? values.partial_reversal : false,
      reverseCount: PayloadReversalfield ? values.reverse_count : "0",
      isTierUpgradeInstant: values.TierUpgradeInstant,
      tierDowngradeDurationByMonths:
        values.tierDowngradeDurationByMonths === ""
          ? 0
          : values.tierDowngradeDurationByMonths,
      //   isMYOPEnabled: Switch === false ? false : values.myop_enabled,
      isMYOPEnabled: values.myop_enabled,
      isCashRedemptionEnabled: values.cash_redemption_enabled,
      channelId:
        values.cash_redemption_enabled === true ? values.channelId : null,
      tenant: values.cash_redemption_enabled === true ? values.tenant : null,
      cashConverstionFactor:
        values.cash_redemption_enabled === true
          ? values.cash_converstion_factor
          : 0,
      narrationFormat2:
        values.cash_redemption_enabled === true ? arr.join("") : null,
      narrationFormat1:
        values.cash_redemption_enabled === true ? arr.join("") : null,
      currency:
        values.cash_redemption_enabled === true ? values.currency : null,
      debitAccount:
        values.cash_redemption_enabled === true ? values.debitAccount : null,
      tierUpgradeBy: values.tierUpgradeBy,
      tierDowngradeBy: null,
      precisionValue: values.precisionEnabled ? values.precisionValue : 0,
      isPrecisionEnabled: values.precisionEnabled,
      refId: values.configId,
    };
    await axios({
      method: "post",
      url: `${PostMasterConfig}`,
      data: payload,
    })
      .then((res) => {
        console.log(res);
        TableCom();
        setConfig_update(true);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
        setOpen(true);
        setmsg_error(error.response.data.message);
      });
  };
  const currencyData = [
    { id: 1, Currency: "INR" },
    { id: 2, Currency: "EUR" },
    { id: 3, Currency: "ALL" },
    { id: 4, Currency: "GBP" },
    { id: 5, Currency: "DZD" },
    { id: 6, Currency: "USD" },
    { id: 7, Currency: "AOA" },
    { id: 8, Currency: "XCD" },
    { id: 9, Currency: "ARS" },
    { id: 10, Currency: "AMD" },
    { id: 11, Currency: "AWG" },
    { id: 12, Currency: "SHP" },
    { id: 13, Currency: "AUD" },
    { id: 14, Currency: "AZN" },
    { id: 15, Currency: "BSD" },
    { id: 16, Currency: "BHD" },
    { id: 17, Currency: "BDT" },
    { id: 18, Currency: "BBD" },
    { id: 19, Currency: "BYN" },
    { id: 20, Currency: "BZD" },
    { id: 21, Currency: "XOF" },
    { id: 22, Currency: "BMD" },
    { id: 23, Currency: "AFN" },
    { id: 24, Currency: "BTN" },
    { id: 25, Currency: "BOB" },
    { id: 26, Currency: "BAM" },
    { id: 27, Currency: "BWP" },
    { id: 28, Currency: "BRL" },
    { id: 29, Currency: "BND/SGD" },
    { id: 30, Currency: "BGN" },
    { id: 31, Currency: "BIF" },
    { id: 32, Currency: "KHR" },
    { id: 33, Currency: "XAF" },
    { id: 34, Currency: "CAD" },
    { id: 35, Currency: "CVE" },
    { id: 36, Currency: "KYD" },
    { id: 37, Currency: "NZD" },
    { id: 38, Currency: "CLP" },
    { id: 39, Currency: "CNY" },
    { id: 40, Currency: "COP" },
    { id: 41, Currency: "KMF" },
    { id: 42, Currency: "CDF" },
    { id: 43, Currency: "CRC" },
    { id: 44, Currency: "HRK" },
    { id: 45, Currency: "CUP/CUC" },
    { id: 46, Currency: "ANG" },
    { id: 47, Currency: "CZK" },
    { id: 48, Currency: "DKK" },
    { id: 49, Currency: "DJF" },
    { id: 50, Currency: "DOP" },
    { id: 51, Currency: "EGP" },
    { id: 52, Currency: "ERN" },
    { id: 53, Currency: "SZL, ZAR" },
    { id: 54, Currency: "ETB" },
    { id: 55, Currency: "FKP" },
    { id: 56, Currency: "none, Oyra, Øre" },
    { id: 57, Currency: "FJD" },
    { id: 58, Currency: "XPF" },
  ];
  const optionValue = currencyData.map((option) => (
    <MenuItem sx={{ fontSize: "14px" }} key={option.id} value={option.Currency}>
      {option.Currency}
    </MenuItem>
  ));
  const TierUpGrade = [
    {
      id: 1,
      label: "AVAILABLE_POINTS",
    },
    {
      id: 2,
      label: "EARNED_POINTS",
    },
  ];
  const TieroptionValue = TierUpGrade.map((option) => (
    <MenuItem sx={{ fontSize: "14px" }} key={option.id} value={option.label}>
      {option.label.toLowerCase()}
    </MenuItem>
  ));
  const TableCom = () => {
    CustomNavigate(`/${SUB_URL}/${MAKER_URL}/${MASTERCONFIG_URL}`);
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={masterEditConfig}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched, setValues }) => {
          const Reversalfield = values.reversal_allowed ? true : false;
          // setMappingData(values.entityId);
          if (values.tierUpgradeBy === "EARNED_POINTS") {
            settier_type_earned_points(true);
            settier_type_available_points(false);
          } else if (values.tierUpgradeBy === "AVAILABLE_POINTS") {
            settier_type_earned_points(false);
            settier_type_available_points(true);
          }
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
                <h5 className="title">Master Configuration</h5>
                <div>
                  <ButtonArea
                    type="button"
                    variant="text"
                    value="Cancel"
                    onClick={TableCom}
                  />
                  <ButtonArea
                    type="Submit"
                    variant="contained"
                    value="Send for Approval"
                  />
                </div>
              </div>
              <div className="form">
                {/* <p className="innerheading">Instant</p>
                <Toggle
                  label="Instant"
                  name="instant"
                  defaultChecked={masterConfigDto?.isInstant}
                  value={values.instant}
                  onChange={handleChange}
                /> */}
                <div>
                  <p className="innerheading">Points Accrual Details</p>
                  <div>
                    <Toggle
                      label="Point Accrual Limit"
                      name="isPointAccrualLimit"
                      defaultChecked={masterConfigDto?.isPointAccrualLimit}
                      value={values.isPointAccrualLimit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="innerheading">Round Off & Precision Details</p>
                  <div>
                    <Toggle
                      label="Round Off Points"
                      name="isRoundOffPoints"
                      defaultChecked={masterConfigDto?.isRoundOffPoints}
                      value={values.isRoundOffPoints}
                      onChange={handleChange}
                    />
                    <Toggle
                      label="Precision"
                      name="precisionEnabled"
                      value={values.precisionEnabled}
                      defaultChecked={masterConfigDto?.isPrecisionEnabled}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.checked) {
                          values.precisionValue = "";
                        }
                      }}
                    />
                    {values.precisionEnabled && (
                      <div style={{ marginTop: "10px" }}>
                        <TextArea
                          label="Precision Value"
                          placeholder="Enter Precision Value"
                          type="text"
                          name="precisionValue"
                          defaultValue={masterConfigDto?.precisionValue}
                          value={values.precisionValue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="CustomInput"
                          error={
                            errors.precisionValue && touched.precisionValue
                              ? true
                              : false
                          }
                          helperText={
                            errors.precisionValue &&
                            touched.precisionValue && (
                              <>{errors.precisionValue}</>
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="innerheading">Redemption Reversal Details</p>
                  <Toggle
                    label="Reversal Allowed"
                    name="reversal_allowed"
                    defaultChecked={masterConfigDto?.isReversalAllowed}
                    value={values.reversal_allowed}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked) {
                        values.reverse_count = "";
                        values.partial_reversal = false;
                        setDefaultValueMaster((prev) => {
                          return { ...prev, isPartialReversal: false };
                        });
                      }
                    }}
                  />
                  {Reversalfield && (
                    <>
                      <Toggle
                        label="Partial Reversal"
                        name="partial_reversal"
                        checked={DefaultValueMaster?.isPartialReversal}
                        value={values.partial_reversal}
                        onChange={(e) => {
                          handleChange(e);
                          setDefaultValueMaster((prev) => {
                            return {
                              ...prev,
                              isPartialReversal: e.target.checked,
                            };
                          });
                        }}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <TextArea
                          label="Reverse Count"
                          placeholder="Enter Reverse Count"
                          type="text"
                          name="reverse_count"
                          defaultValue={masterConfigDto?.reverseCount}
                          value={values.reverse_count}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="CustomInput"
                          error={
                            errors.reverse_count && touched.reverse_count
                              ? true
                              : false
                          }
                          helperText={
                            errors.reverse_count &&
                            touched.reverse_count && <>{errors.reverse_count}</>
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <p className="innerheading">
                    Tier Upgrade & Downgrade Details
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <DefaultSelect
                      error={
                        errors.tierUpgradeBy && touched.tierUpgradeBy
                          ? true
                          : false
                      }
                      labelId="tierUpgradeBy"
                      id="tierUpgradeBySelect"
                      label="Select Tier Upgrade Type"
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.value === "EARNED_POINTS") {
                          settier_type_earned_points(true);
                        } else if (e.target.value === "AVAILABLE_POINTS") {
                          settier_type_earned_points(false);
                          settier_type_available_points(true);
                        }
                      }}
                      onBlur={handleBlur}
                      name="tierUpgradeBy"
                      defaultValue={masterConfigDto?.tierUpgradeBy}
                      value={values.tierUpgradeBy}
                      optionvalue={TieroptionValue}
                      formhelpertext={
                        errors.tierUpgradeBy &&
                        touched.tierUpgradeBy && <>{errors.tierUpgradeBy}</>
                      }
                    />
                    <Toggle
                      label="Tier Upgrade"
                      name="TierUpgradeInstant"
                      disabled={tier_type_available_points}
                      defaultChecked={masterConfigDto?.isTierUpgradeInstant}
                      value={values.TierUpgradeInstant}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div>
                    <Toggle
                      label="Instant Tier Downgrade"
                      name="isTierDowngradeInstant"
                      disabled={tier_type_earned_points}
                      defaultChecked={masterConfigDto?.isTierDowngradeInstant}
                      value={values.isTierDowngradeInstant}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.checked) {
                          values.tierDowngradeDurationByMonths = "";
                        }
                      }}
                    />
                  </div>
                  {values.isTierDowngradeInstant === false && (
                    <div style={{ marginTop: "0px" }}>
                      <TextArea
                        label="Tier Downgrade Duration By Months"
                        placeholder="Enter Tier Downgrade Duration By Months"
                        type="text"
                        name="tierDowngradeDurationByMonths"
                        defaultValue={
                          masterConfigDto?.tierDowngradeDurationByMonths
                        }
                        value={values.tierDowngradeDurationByMonths}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="CustomInput"
                        error={
                          errors.tierDowngradeDurationByMonths &&
                          touched.tierDowngradeDurationByMonths
                            ? true
                            : false
                        }
                        helperText={
                          errors.tierDowngradeDurationByMonths &&
                          touched.tierDowngradeDurationByMonths && (
                            <>{errors.tierDowngradeDurationByMonths}</>
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="innerheading">Merchant Accelerator Details</p>
                  <Toggle
                    label="Merchant Accelerator"
                    name="myop_enabled"
                    defaultChecked={masterConfigDto?.isMYOPEnabled}
                    value={values.myop_enabled}
                    onChange={(e) => {
                      handleChange(e);
                      //   setSwitch(e.target.checked);
                      //   if (e.target.checked) {
                      //     setMYOPModal(!MYOPModal);
                      //   }
                    }}
                    // checked={Switch}
                  />
                </div>
                <div>
                  <p className="innerheading">Cash Redemption Details</p>
                  <Toggle
                    label="Cash Redemption"
                    name="cash_redemption_enabled"
                    defaultChecked={masterConfigDto?.isCashRedemptionEnabled}
                    value={values.cash_redemption_enabled}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked === false) {
                        values.tenant = "";
                        values.channelId = "";
                        values.cash_converstion_factor = "";
                        values.debitAccount = "";
                        values.currency = "";
                        values.Narration = false;
                        setDefaultValueMaster((prev) => {
                          return { ...prev, narration: false };
                        });
                      }
                    }}
                  />
                </div>
                {values.cash_redemption_enabled && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ position: "relative" }}>
                      <TextArea
                        label="Tenant"
                        placeholder="Enter Tenant"
                        type="text"
                        name="tenant"
                        defaultValue={masterConfigDto?.tenant}
                        value={values.tenant}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="CustomInput"
                        error={errors.tenant && touched.tenant ? true : false}
                        helperText={
                          errors.tenant &&
                          touched.tenant && <>{errors.tenant}</>
                        }
                      />
                      <TextArea
                        label="Channel Id"
                        placeholder="Enter Channel Id"
                        type="text"
                        name="channelId"
                        defaultValue={masterConfigDto?.channelId}
                        value={values.channelId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="CustomInput"
                        error={
                          errors.channelId && touched.channelId ? true : false
                        }
                        helperText={
                          errors.channelId &&
                          touched.channelId && <>{errors.channelId}</>
                        }
                      />
                      <TextArea
                        label="Cash Conversion Factor"
                        placeholder="Enter Cash Conversion Factor"
                        type="text"
                        name="cash_converstion_factor"
                        defaultValue={masterConfigDto?.cashConverstionFactor}
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
                      {/* <p className='NoteClass'><b>Note:</b> Ex: 10 Cash Conversion Factor = RS.1</p> */}
                    </div>
                    {/* <p className="innerheading">Narration Details</p> */}
                    {/* <p className="innerheading">Narration Details</p> */}
                    <div>
                      <Toggle
                        label="Narration"
                        name="Narration"
                        value={values.Narration}
                        checked={DefaultValueMaster?.narration}
                        error={
                          errors.Narration && touched.Narration ? true : false
                        }
                        formhelpertext={
                          errors.Narration &&
                          touched.Narration && <>{errors.Narration}</>
                        }
                        onChange={(e) => {
                          handleChange(e);
                          setDefaultValueMaster((prev) => {
                            return {
                              ...prev,
                              narration: e.target.checked,
                              entityId: false,
                              accountno: false,
                              points: false,
                              tranno: false,
                            };
                          });
                          if (e.target.checked) {
                            setMappingData("");
                            values.entityId = false;
                            values.accountno = false;
                            values.points = false;
                            values.tranno = false;
                          }
                        }}
                      />
                      {values.Narration && (
                        <div style={{ marginTop: "0px" }}>
                          <Toggle
                            label="Entity Id"
                            name="entityId"
                            checked={DefaultValueMaster?.entityId}
                            value={values.entityId}
                            customvalue="entityId"
                            onChange={(e) => {
                              handleChange(e);
                              setDefaultValueMaster((prev) => {
                                return {
                                  ...prev,
                                  entityId: e.target.checked,
                                };
                              });
                              if (e.target.checked) {
                                setMappingData((current) => [
                                  ...current,
                                  "/entityId",
                                ]);
                              } else if (!e.target.checked) {
                                setMappingData((current) =>
                                  current.filter(
                                    (MappingData) => MappingData !== "/entityId"
                                  )
                                );
                              }
                            }}
                          />
                          <Toggle
                            label="Account Number"
                            name="accountno"
                            checked={DefaultValueMaster?.accountno}
                            value={values.accountno}
                            onChange={(e) => {
                              handleChange(e);
                              setDefaultValueMaster((prev) => {
                                return {
                                  ...prev,
                                  accountno: e.target.checked,
                                };
                              });
                              if (e.target.checked) {
                                setMappingData((current) => [
                                  ...current,
                                  "/accountno",
                                ]);
                              } else if (!e.target.checked) {
                                setMappingData((current) =>
                                  current.filter(
                                    (MappingData) =>
                                      MappingData !== "/accountno"
                                  )
                                );
                              }
                            }}
                          />
                          <div style={{ marginTop: "10px" }}>
                            <Toggle
                              label="Points"
                              name="points"
                              checked={DefaultValueMaster?.points}
                              value={values.points}
                              onChange={(e) => {
                                handleChange(e);
                                setDefaultValueMaster((prev) => {
                                  return {
                                    ...prev,
                                    points: e.target.checked,
                                  };
                                });
                                if (e.target.checked) {
                                  setMappingData((current) => [
                                    ...current,
                                    "/points",
                                  ]);
                                } else if (!e.target.checked) {
                                  setMappingData((current) =>
                                    current.filter(
                                      (MappingData) => MappingData !== "/points"
                                    )
                                  );
                                }
                              }}
                            />
                            <Toggle
                              label="Transaction Number"
                              name="tranno"
                              checked={DefaultValueMaster?.tranno}
                              value={values.tranno}
                              onChange={(e) => {
                                handleChange(e);
                                setDefaultValueMaster((prev) => {
                                  return {
                                    ...prev,
                                    tranno: e.target.checked,
                                  };
                                });
                                if (e.target.checked) {
                                  setMappingData((current) => [
                                    ...current,
                                    "/tranno",
                                  ]);
                                } else if (!e.target.checked) {
                                  setMappingData((current) =>
                                    current.filter(
                                      (MappingData) => MappingData !== "/tranno"
                                    )
                                  );
                                }
                              }}
                            />
                          </div>
                          <p className="narration_details">
                            Narration Order -{arr.join("")}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* <p className="innerheading">Account Details</p> */}
                    <DefaultSelect
                      error={errors.currency && touched.currency ? true : false}
                      labelId="currencyLabel"
                      id="currencySelect"
                      label="Select Currency Type"
                      defaultValue={
                        masterConfigDto?.currency === null
                          ? ""
                          : masterConfigDto?.currency
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="currency"
                      value={values.currency}
                      optionvalue={optionValue}
                      formhelpertext={
                        errors.currency &&
                        touched.currency && <>{errors.currency}</>
                      }
                    />
                    <TextArea
                      label="Debit Account Number"
                      placeholder="Enter Debit Account Number"
                      type="text"
                      name="debitAccount"
                      defaultValue={masterConfigDto?.debitAccount}
                      value={values.debitAccount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="CustomInput"
                      error={
                        errors.debitAccount && touched.debitAccount
                          ? true
                          : false
                      }
                      helperText={
                        errors.debitAccount &&
                        touched.debitAccount && <>{errors.debitAccount}</>
                      }
                    />
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
