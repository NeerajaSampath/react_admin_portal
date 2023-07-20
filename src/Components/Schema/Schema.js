import * as yup from "yup";

//reusable code
const RegexStringDecimal =
  /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
const RegexOnlyNumber = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?$/;
const Basic_Val = yup
  .number()
  .min(0, "Greater than 0")
  .typeError("Enter Numbers Only")
  .required("Field Required");

//tierschema
export const TierSchema = yup.object().shape({
  tier_name: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Enter alphabets Only")
    .required("Field Required"),
  points_min_limit: Basic_Val.integer("Decimal not allowed"),
  points_max_limit: Basic_Val.integer("Decimal not allowed").test(
    "maxvalue",
    "Greater than Min Point",
    function (maxvalues) {
      const ref = yup.ref("points_min_limit");
      return maxvalues > this.resolve(ref);
    }
  ),
  amount_min_limit: Basic_Val,
  amount_max_limit: Basic_Val.test(
    "maxvalue",
    "Greater than Min Amount",
    function (maxvalues) {
      const ref = yup.ref("amount_min_limit");
      return maxvalues > this.resolve(ref);
    }
  ),
  multiplier: yup.number().when("myop_checkbox", {
    is: true,
    then: Basic_Val.integer("Decimal not allowed"),
    otherwise: yup.number(),
    // .min(0, "Greater than 0")
    // .typeError("Enter Numbers Only"),
  }),
  expiration_id: yup.string().required("Field Required"),
  min_redeem: Basic_Val.integer("Decimal not allowed"),
  max_redeem: Basic_Val.integer("Decimal not allowed").test(
    "maxvalue",
    "Greater than Min Redeem",
    function (maxvalues) {
      const ref = yup.ref("min_redeem");
      return maxvalues > this.resolve(ref);
    }
  ),
  max_redeem_day: Basic_Val.integer("Decimal not allowed").test(
    "maxvalue",
    "Greater than Min Redeem",
    function (maxvalues) {
      const ref = yup.ref("min_redeem");
      return maxvalues >= this.resolve(ref);
    }
  ),
  max_redeem_month: Basic_Val.integer("Decimal not allowed").test(
    "maxvalue",
    "Greater than Redeem PerDay",
    function (maxvalues) {
      const ref = yup.ref("max_redeem_day");
      return maxvalues > this.resolve(ref);
    }
  ),
  max_redeem_year: Basic_Val.integer("Decimal not allowed").test(
    "maxvalue",
    "Greater than Redeem PerMonth",
    function (maxvalues) {
      const ref = yup.ref("max_redeem_month");
      return maxvalues > this.resolve(ref);
    }
  ),
  cash_converstion_factor: Basic_Val.integer("Decimal not allowed"),
  min_accrual: yup.number().when("accrual_checkbox", {
    is: true,
    then: Basic_Val.integer("Decimal not allowed"),
    otherwise: yup
      .number()
      .min(0, "Greater than 0")
      .typeError("Enter Numbers Only"),
  }),
  max_accrual_per_day: yup.number().when("accrual_checkbox", {
    is: true,
    then: Basic_Val.test(
      "maxvalue",
      "Greater than Min Accrual",
      function (maxvalues) {
        const ref = yup.ref("min_accrual");
        return maxvalues > this.resolve(ref);
      }
    ),
    otherwise: yup
      .number()
      .min(0, "Greater than 0")
      .typeError("Enter Numbers Only"),
  }),
  max_accrual_per_month: yup.number().when("accrual_checkbox", {
    is: true,
    then: Basic_Val.test(
      "maxvalue",
      "Greater than Max Accrual Per Day",
      function (maxvalues) {
        const ref = yup.ref("max_accrual_per_day");
        return maxvalues > this.resolve(ref);
      }
    ),
    otherwise: yup
      .number()
      .min(0, "Greater than 0")
      .typeError("Enter Numbers Only"),
  }),
  max_accrual_per_year: yup.number().when("accrual_checkbox", {
    is: true,
    then: Basic_Val.test(
      "maxvalue",
      "Greater than Max Accrual Per Month",
      function (maxvalues) {
        const ref = yup.ref("max_accrual_per_day");
        return maxvalues > this.resolve(ref);
      }
    ),
    otherwise: yup
      .number()
      .min(0, "Greater than 0")
      .typeError("Enter Numbers Only"),
  }),
});

//rule schema
export const RuleCreation = yup.object().shape({
  rule_field: yup.array().of(
    yup.object({
      Sub_type_rule: yup.string().required("Field Required"),
      min_pnts: yup.number().when("min_pnts_field_val", {
        is: (min_pnts_field_val) => min_pnts_field_val,
        then: yup
          .number()
          .min(0, "Greater than 0")
          .typeError("Should be number")
          .required("Field Required"),
        otherwise: yup.number(),
      }),
      max_pnts: yup.number().when("max_pnts_field_val", {
        is: (max_pnts_field_val) => max_pnts_field_val,
        then: yup
          .number()
          .min(0, "Greater than 0")
          .typeError("Should be number")
          .required("Field Required")
          .test("maxvalue", "Greater than Min", function (maxvalues) {
            const ref = yup.ref("min_pnts");
            return maxvalues > this.resolve(ref);
          }),
        otherwise: yup.number(),
      }),
      recurring_type: yup.string(),
      recurring_duration: yup.string().when("recurring_type", {
        is: (recurring_type) => recurring_type,
        then: yup
          .string()
          .matches(RegexStringDecimal, "Not Valid")
          .required("Field Required"),
        otherwise: yup.string(),
      }),
    })
  ),
});

export const RuleEditSchema = yup.object().shape({
  name: yup.string().required("Field Required"),
  min_pnts: yup
    .number()
    .min(0, "Greater than 0")
    .typeError("Enter Numbers Only")
    .required("Field Required"),
  max_pnts: yup
    .number()
    .min(0, "Greater than 0")
    .typeError("Enter Numbers Only")
    .required("Field Required")
    .test("maxvalue", "Greater than Min", function (maxvalues) {
      const ref = yup.ref("min_pnts");
      return maxvalues >= this.resolve(ref);
    }),
  recurring_type: yup.string(),
  duration: yup.string().when("recurring_type", {
    is: (recurring_type) => recurring_type,
    then: yup
      .string()
      .matches(RegexStringDecimal, "Not Valid")
      .required("Field Required"),
    otherwise: yup.string(),
  }),
});

//rule tier schema
export const ruletier = yup.object().shape({
  ruleTireList: yup.array().of(
    yup.object().shape({
      ruleConfigId: yup.string().required("Field Required"),
      tierId: yup.string().required("Field Required"),
      points: yup
        .string()
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Not Valid"
        )
        .required("Field Required"),
      refferpoints: yup
        .string()
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Not Valid"
        ),
      // .required("Field Required"),
    })
  ),
});

//rule tier edit schema
export const ruletierEdit = yup.object().shape({
  points: yup
    .string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Not Valid"
    )
    .required("Field Required"),
  refferpoints: yup
    .string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Not Valid"
    ),
});

//master schema
export const masterConfig = yup.object().shape({
  reversal_allowed: yup.boolean(),
  reverse_count: yup.string().when(["reversal_allowed"], {
    is: (reversal_allowed) => reversal_allowed === true,
    then: yup
      .string()
      .matches(RegexOnlyNumber, "Not Valid")
      .test("maxvalue", "Value greater than 0", function (maxvalues) {
        return maxvalues > 0;
      })
      .required("Field Required"),
    otherwise: yup.string().matches(RegexOnlyNumber, "Not Valid"),
  }),
  tierUpgradeBy: yup.string().required("Field Required"),
  tierDowngradeDurationByMonths: yup
    .string()
    .matches(/^(0*[1-9][0-9]*)$/, "Not Valid")
    .notRequired(),
  cash_redemption_enabled: yup.boolean(),
  cash_converstion_factor: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(RegexOnlyNumber, "Not Valid")
      .required("Field Required"),
    otherwise: yup.string().matches(RegexOnlyNumber, "Not Valid"),
  }),
  channelId: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Z\s]+$/, "Not Valid")
      .max(3, "Max 3 Letters")
      .min(3, "Min 3 Letters")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[A-Z\s]+$/, "Not Valid"),
  }),
  tenant: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[aA-zZ\s]+$/, "Not Valid")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[A-Z\s]+$/, "Not Valid"),
  }),
  debitAccount: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9\s]+$/, "Not Valid")
      .max(16, "Max 16 Digits")
      .min(8, "Min 8 Digits")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[0-9\s]+$/, "Not Valid"),
  }),
  currency: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup.string().required("Field Required"),
    otherwise: yup.string(),
  }),
  Narration: yup.bool().when("cash_redemption_enabled", {
    is: true,
    then: yup.bool().oneOf([true], "Field Required").required("Field Required"),
    otherwise: yup.bool(),
  }),
  precisionEnabled: yup.boolean(),
  precisionValue: yup.string().when("precisionEnabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9\s]+$/, "Not Valid")
      // .max(3, "Max 3 Letters")
      // .min(3, "Min 3 Letters")
      .required("Field Required"),
    otherwise: yup.string(),
  }),
});

export const masterEditConfig = yup.object().shape({
  reversal_allowed: yup.boolean(),
  reverse_count: yup.string().when(["reversal_allowed"], {
    is: (reversal_allowed) => reversal_allowed === true,
    then: yup
      .string()
      .matches(RegexOnlyNumber, "Not Valid")
      .test("maxvalue", "Value greater than 0", function (maxvalues) {
        return maxvalues > 0;
      })
      .required("Field Required"),
    otherwise: yup.string().matches(RegexOnlyNumber, "Not Valid"),
  }),
  tierUpgradeBy: yup.string().required("Field Required"),
  tierDowngradeDurationByMonths: yup
    .string()
    .matches(/^(0*[0-9][0-9]*)$/, "Not Valid")
    .notRequired(),
  cash_redemption_enabled: yup.boolean(),
  cash_converstion_factor: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(RegexOnlyNumber, "Not Valid")
      .test("maxvalue", "Value greater than 0", function (maxvalues) {
        return maxvalues > 0;
      })
      .required("Field Required"),
    otherwise: yup.string().matches(RegexOnlyNumber, "Not Valid"),
  }),
  channelId: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[A-Z\s]+$/, "Not Valid")
      .max(3, "Max 3 Letters")
      .min(3, "Min 3 Letters")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[A-Z\s]+$/, "Not Valid"),
  }),
  tenant: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[aA-zZ\s]+$/, "Not Valid")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[A-Z\s]+$/, "Not Valid"),
  }),
  debitAccount: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9\s]+$/, "Not Valid")
      .max(16, "Max 16 Digits")
      .min(8, "Min 8 Digits")
      .required("Field Required"),
    otherwise: yup.string().matches(/^[0-9\s]+$/, "Not Valid"),
  }),
  currency: yup.string().when("cash_redemption_enabled", {
    is: true,
    then: yup.string().required("Field Required"),
    otherwise: yup.string(),
  }),
  Narration: yup.bool().when("cash_redemption_enabled", {
    is: true,
    then: yup.bool().oneOf([true], "Field Required").required("Field Required"),
    otherwise: yup.bool(),
  }),
  precisionEnabled: yup.boolean(),
  precisionValue: yup.string().when("precisionEnabled", {
    is: true,
    then: yup
      .string()
      .matches(/^[0-9\s]+$/, "Not Valid")
      // .max(3, "Max 3 Letters")
      // .min(3, "Min 3 Letters")
      .required("Field Required"),
    otherwise: yup.string(),
  }),
});

//myop schema
export const MYOPBrand = yup.object().shape({
  brand_name: yup
    .string()
    .matches(/^[^-\s][a-zA-Z0-9_\s-]+$/, "Not Valid")
    .required("Field Required"),
  merchants: yup.array().of(
    yup.object().shape({
      merchantName: yup
        .string()
        .matches(/^[^-\s][a-zA-Z0-9_\s-]+$/, "Not Valid")
        .required("Field Required"),
      mcId: yup
        .string()
        // .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?$/, "Not Valid")
        .required("Field Required"),
    })
  ),
});

//login schema
export const LoginVal = yup.object().shape({
  user_id: yup
    .string()
    .email("Invalid email format")
    .required("Field Required"),
  password: yup.string().required("Field Required"),
});

//expiry schema
export const Expiry = yup.object().shape({
  duration: Basic_Val.integer("Decimal not allowed"),
  Type_duration: yup.string().required("Field Required"),
});

//customer portal schema
export const CustomerSchema = yup.object().shape({
  entity_id: yup
    .string()
    .matches(/^[\w-]*$/, "Enter valid Entity ID")
    .required("Field Required"),
  date_filter: yup.string().required("Field Required"),
  start_date: yup.date().when("date_filter", {
    is: "Custom Date",
    then: yup.date().typeError("Enter Valid Date").required("Field Required"),
    otherwise: yup.date(),
  }),
  end_date: yup.date().when("date_filter", {
    is: "Custom Date",
    then: yup
      .date()
      .typeError("Enter Valid Date")
      .required("Field Required")
      .test("maxvalue", "Greater than Start date", function (maxvalues) {
        const ref = yup.ref("start_date");
        return maxvalues >= this.resolve(ref);
      }),
    otherwise: yup.date(),
  }),
});
