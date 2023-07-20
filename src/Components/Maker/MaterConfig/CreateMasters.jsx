import { React, useState } from "react";
import { Formik, Form } from "formik";
import {
  TextArea,
  Toggle,
  ButtonArea,
  CustomSnakebar,
  DefaultSelect,
} from "../../Common/Elements";
import { masterConfig } from "../../Schema/Schema";
import axios from "../../../api";
import { PostMasterConfig } from "../../../apiConfig";
import { v4 as uuidv4 } from "uuid";
import { MenuItem } from "@mui/material";
import useAuth from "../../../Hooks/useAuth";
import CreateMYOP from "../MYOPConfig/CreateMYOP";
import { useNavigate } from "react-router-dom";
import { MAKER_URL, MASTERCONFIG_URL, SUB_URL } from "../../../Constant";

export const CreateMasters = () => {
  const CustomNavigate = useNavigate();
  const {
    Masterget,
    setMasterget,
    setLoading,
    setmaster_create_update,
    master_create_update,
    setConfig_update,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [msg_error, setmsg_error] = useState(null);
  const [MasterModal, setMasterModal] = useState(Masterget);
  const [MYOPModal, setMYOPModal] = useState(false);
  const [closeAlert, setCloseAlert] = useState(false);
  const [Switch, setSwitch] = useState(false);
  const [SubmitData, setSubmitData] = useState(false);
  const [MappingData, setMappingData] = useState([]);
  const [Modalopen, setModalopen] = useState();
  const [tier_type_earned_points, settier_type_earned_points] = useState(false);
  const [tier_type_available_points, settier_type_available_points] =
    useState(false);
  const arr = [];
  arr.push(...MappingData);
  const initialValues = {
    instant: true,
    isRoundOffPoints: false,
    isPointAccrualLimit: false,
    reversal_allowed: false,
    partial_reversal: false,
    reverse_count: "",
    TierUpgradeInstant: false,
    isTierDowngradeInstant: false,
    tierDowngradeDurationByMonths: "",
    cash_converstion_factor: "",
    myop_enabled: false,
    cash_redemption_enabled: false,
    currency: "",
    tenant: "",
    channelId: "",
    debitAccount: "",
    Narration: false,
    entityId: false,
    accountno: "",
    points: "",
    tranno: "",
    tierUpgradeBy: "",
    precisionEnabled: false,
    precisionValue: "",
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
      tierDowngradeDurationByDays: 0,
      isTierDowngradeInstant: values.isTierDowngradeInstant,
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
          : "0",
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
      precisionValue: values.precisionEnabled ? values.precisionValue : null,
      isPrecisionEnabled: values.precisionEnabled,
    };
    setLoading(true);
    await axios({
      method: "post",
      url: `${PostMasterConfig}`,
      data: payload,
    })
      .then((res) => {
        setLoading(false);
        // console.log(res);
        setMasterModal(false);
        setMasterget(false);
        setmaster_create_update(!master_create_update);
        setConfig_update(true);
        TableCom();
      })
      .catch((error) => {
        setLoading(false);
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
        validationSchema={masterConfig}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched, setvalue }) => {
          const Reversalfield = values.reversal_allowed ? true : false;
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
                  value={values.instant}
                  onChange={handleChange}
                /> */}
                <div>
                  <p className="innerheading">Points Accrual Details</p>
                  <div>
                    <Toggle
                      label="Point Accrual Limit"
                      name="isPointAccrualLimit"
                      value={values.isPointAccrualLimit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="innerheading">Round Off & Precision Details</p>
                  <Toggle
                    label="Round Off Points"
                    name="isRoundOffPoints"
                    value={values.isRoundOffPoints}
                    onChange={handleChange}
                  />
                  <Toggle
                    label="Precision"
                    name="precisionEnabled"
                    value={values.precisionEnabled}
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
                          touched.precisionValue && <>{errors.precisionValue}</>
                        }
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className="innerheading">Redemption Reversal Details</p>
                  <Toggle
                    label="Reversal Allowed"
                    name="reversal_allowed"
                    value={values.reversal_allowed}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked) {
                        values.reverse_count = "";
                        values.partial_reversal = false;
                      }
                    }}
                  />
                  {Reversalfield && (
                    <>
                      <Toggle
                        label="Partial Reversal"
                        name="partial_reversal"
                        value={values.partial_reversal}
                        onChange={handleChange}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <TextArea
                          label="Reverse Count"
                          placeholder="Enter Reverse Count"
                          type="text"
                          name="reverse_count"
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
                      label="Select tier Upgrade Type"
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.value === "EARNED_POINTS") {
                          values.isTierDowngradeInstant = false;
                          settier_type_earned_points(true);
                          settier_type_available_points(false);
                        } else if (e.target.value === "AVAILABLE_POINTS") {
                          values.TierUpgradeInstant = false;
                          settier_type_earned_points(false);
                          settier_type_available_points(true);
                        }
                        // if (e.target.value === "EARNED_POINTS") {
                        //   values.isTierDowngradeInstant = false;
                        //   // settier_type_earned_points(true);
                        // } else if (e.target.value === "AVAILABLE_POINTS") {
                        //   values.TierUpgradeInstant = "";
                        //   // settier_type_earned_points(false);
                        //   // settier_type_available_points(true);
                        // }
                      }}
                      onBlur={handleBlur}
                      name="tierUpgradeBy"
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
                      checked={values.TierUpgradeInstant}
                      value={values.TierUpgradeInstant}
                      onChange={(e) => {
                        handleChange(e);
                        console.log("log", e.target.checked);
                      }}
                    />
                  </div>
                  <Toggle
                    label="Instant Tier Downgrade"
                    name="isTierDowngradeInstant"
                    checked={values.isTierDowngradeInstant}
                    disabled={tier_type_earned_points}
                    value={values.isTierDowngradeInstant}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked) {
                        values.tierDowngradeDurationByMonths = "";
                      }
                    }}
                  />
                  {values.isTierDowngradeInstant === false && (
                    <div style={{ marginTop: "0px" }}>
                      <TextArea
                        label="Tier Downgrade Duration By Months"
                        placeholder="Enter Tier Downgrade Duration By Months"
                        type="text"
                        name="tierDowngradeDurationByMonths"
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
                    value={values.myop_enabled}
                    onChange={(e) => {
                      console.log("onchange value access", e.target.value);
                      handleChange(e);
                      setSwitch(e.target.checked);
                      //   if (e.target.checked) {
                      //     setMYOPModal(!MYOPModal);
                      //   }
                    }}
                    checked={Switch}
                  />
                </div>
                <div>
                  <p className="innerheading">Cash Redemption Details</p>
                  <Toggle
                    label="Cash Redemption"
                    name="cash_redemption_enabled"
                    value={values.cash_redemption_enabled}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked) {
                        values.channelId = "";
                        values.cash_converstion_factor = "";
                        values.debitAccount = "";
                        values.currency = "";
                        values.Narration = false;
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
                    <div>
                      <Toggle
                        label="Narration"
                        name="Narration"
                        value={values.Narration}
                        error={
                          errors.Narration && touched.Narration ? true : false
                        }
                        formhelpertext={
                          errors.Narration &&
                          touched.Narration && <>{errors.Narration}</>
                        }
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.checked) {
                            values.entityId = false;
                            values.accountno = false;
                            values.points = false;
                            values.tranno = false;
                            setMappingData("");
                          }
                        }}
                      />
                      {values.Narration && (
                        <div style={{ marginTop: "0px" }}>
                          <Toggle
                            label="Entity Id"
                            name="entityId"
                            value={values.entityId}
                            customvalue="entityId"
                            onChange={(index) => {
                              handleChange(index);
                              if (index.target.checked) {
                                setMappingData((current) => [
                                  ...current,
                                  "/entityId",
                                ]);
                              } else if (!index.target.checked) {
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
                            value={values.accountno}
                            onChange={(index) => {
                              handleChange(index);
                              if (index.target.checked) {
                                setMappingData((current) => [
                                  ...current,
                                  "/accountno",
                                ]);
                              } else if (!index.target.checked) {
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
                              value={values.points}
                              onChange={(index) => {
                                handleChange(index);
                                if (index.target.checked) {
                                  setMappingData((current) => [
                                    ...current,
                                    "/points",
                                  ]);
                                } else if (!index.target.checked) {
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
                              value={values.tranno}
                              onChange={(index) => {
                                handleChange(index);
                                if (index.target.checked) {
                                  setMappingData((current) => [
                                    ...current,
                                    "/tranno",
                                  ]);
                                } else if (!index.target.checked) {
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
                            Narration Order -{" "}
                            {values.Narration ? arr.join("") : ""}
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
              <div>
                {/* <p className="innerheading">Tier Details</p> */}
                {/* <DefaultSelect
                  error={
                    errors.tierUpgradeBy && touched.tierUpgradeBy ? true : false
                  }
                  labelId="tierUpgradeBy"
                  id="tierUpgradeBySelect"
                  label="Select tier Upgrade Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="tierUpgradeBy"
                  value={values.tierUpgradeBy}
                  optionvalue={TieroptionValue}
                  formhelpertext={
                    errors.tierUpgradeBy &&
                    touched.tierUpgradeBy && <>{errors.tierUpgradeBy}</>
                  }
                /> */}
              </div>
              <div>
                {/* <p className="innerheading">Precision Details</p> */}
                {/* <Toggle
                  label="Precision"
                  name="precisionEnabled"
                  value={values.precisionEnabled}
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
                        touched.precisionValue && <>{errors.precisionValue}</>
                      }
                    />
                  </div>
                )} */}
              </div>
              {/* MYOP Config */}
              <CreateMYOP
                MYOPModal={MYOPModal}
                setMYOPModal={setMYOPModal}
                setCloseAlert={setCloseAlert}
                closeAlert={closeAlert}
                SubmitData={SubmitData}
                setSubmitData={setSubmitData}
                setSwitch={setSwitch}
                Switch={Switch}
                setModalopen={setModalopen}
                Modalopen={Modalopen}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
