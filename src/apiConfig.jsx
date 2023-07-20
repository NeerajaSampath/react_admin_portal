//Tier config
const GetTierConfig = `/api/v1/tiers`;
const PostTierConfig = `/api/v1/tiers`;

//Rule config
const GetRuleConfig = `/api/v1/rule/configs`;
const PostRuleConfig = `/api/v1/rules/configs`;
const PostSingleRuleConfig = `/api/v1/rule/configs`;

//Expiration config
const GetExpiryConfig = `/api/v1/expirations`;
const PostExpiryConfig = `/api/v1/expiration`;

//Master config
const GetMasterConfig = `/api/v1/master/config`;
const PostMasterConfig = `/api/v1/master/config`;

//Type config
const GetTypeConfig = `/api/v1/types`;
const PostTypeConfig = `/api/v1/types`;

//rule tier config
const GetRuleTierMapConfig = `/api/v1/rule/tier/page`;
const PostRuleTierMapConfig = `/api/v1/rule/tiers`;
const PostSingleRuleTierMapConfig = `/api/v1/rule/tier`;

//MYOP config
const GetMyopConfig = `/api/v1/myop`;
const PostMyopConfig = `/api/v1/myop/configs`;

//mcc config
const GetMccConfig = `/api/v1/mcc`;
const PostMccConfig = `/api/v1/mcc`;

//dashboard config
const GetDashboardConfig = `/api/v1/dashboard/ledger`;

//support config
const GetCustomerConfig = `/api/v1/customer`;
const GetLedgerConfig = `/api/v1/ledger`;
const GetFetchBalConfig = `/api/v1/balance`;
const GetCustomerMyopMapConfig = `/api/v1/customer/myop`;

//checker config
const GetStatusConfig = `/api/v1/configs/status`;
const PostStatusConfig = `/api/v1/configs`;

//Login config
const LoginConfig = `/api/v1/login`;
const RefreshConfig = `/api/v1/refresh`;

export {
  GetTierConfig,
  GetFetchBalConfig,
  PostTierConfig,
  GetRuleConfig,
  PostRuleConfig,
  GetExpiryConfig,
  PostExpiryConfig,
  GetMasterConfig,
  PostMasterConfig,
  GetTypeConfig,
  PostTypeConfig,
  GetRuleTierMapConfig,
  PostRuleTierMapConfig,
  GetMyopConfig,
  PostMyopConfig,
  GetMccConfig,
  PostMccConfig,
  GetDashboardConfig,
  GetCustomerConfig,
  GetLedgerConfig,
  LoginConfig,
  RefreshConfig,
  GetStatusConfig,
  PostStatusConfig,
  GetCustomerMyopMapConfig,
  PostSingleRuleConfig,
  PostSingleRuleTierMapConfig,
};
