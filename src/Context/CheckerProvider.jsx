import { createContext, useState } from "react";
import axios from "../api";
import { PostStatusConfig } from "../apiConfig";
import { useNavigate } from "react-router-dom";
import { CHECKER_CONFIG_URL, CHECKER_URL, SUB_URL } from "../Constant";

const CheckerContext = createContext({});

export const CheckerProvider = ({ children }) => {
  const CustomNavigate = useNavigate();
  const [checkerState, setCheckerState] = useState("");
  const [successState, setsuccessState] = useState(false);
  const [rejectState, setrejectState] = useState(false);
  const [checkerConfigStatus, setcheckerConfigStatus] = useState("");
  const [checkerView, setCheckerView] = useState("");
  const [master_dto, setmaster_dto] = useState("");
  const [MappingDto, setMappingDto] = useState([]);
  const [MasterDto, setMasterDto] = useState([]);
  //get config api state variable
  const [TierDto, setTierDto] = useState([]);
  const [RuleDto, setRuleDto] = useState([]);
  const [CheckerMYOP, setCheckerMYOP] = useState([]);
  const [Expiration, setExpiration] = useState([]);
  const [MYOPid, setMYOPid] = useState("");
  const [Expiryid, setExpiryid] = useState("");
  const [Rule_Tier_Mapping, setRule_Tier_Mapping] = useState(false);
  const [MasterView_state, setMasterView_state] = useState(false);
  const [CheckerMaster, setCheckerMaster] = useState(false);
  const [Expiry, setExpiry] = useState(false);
  //success alert, rejection input value state variable
  const [SuccessMsg, setSuccessMsg] = useState();
  const [Success_Alert_Msg, setSuccess_Alert_Msg] = useState("");
  const [rejectInput, setrejectInput] = useState("");
  //master session storage get
  const CheckerMasterDto = JSON.parse(
    sessionStorage.getItem("MasterDtoStorage")
  );
  //tier session storage get
  const CheckerTierDto = JSON.parse(
    sessionStorage.getItem("tierViewConfigDto")
  );
  //rule session storage get
  const CheckerRuleDto = JSON.parse(
    sessionStorage.getItem("ruleViewConfigDto")
  );
  //rule tier mapping session storage get
  const CheckerMappingDto = JSON.parse(
    sessionStorage.getItem("MappingDtoStorage")
  );
  //expiration filter
  const Expiry_filter = Expiration.filter((expiry) => {
    return expiry?.expiration_id === Expiryid;
  }).map((item) => {
    return { ...item };
  });
  //tier payload
  const TierpayLoad = {
    moduleName: "TIER_CONFIG",
    uuid: `${CheckerTierDto?.tier_id}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //rule payload
  const RulepayLoad = {
    moduleName: "RULE_CONFIG",
    uuid: `${CheckerRuleDto?.rule_config_id}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //rule tier mapping payload
  const Rule_Tier_Mapping_payLoad = {
    moduleName: "RULE_TIER_MAPPING_CONFIG",
    uuid: `${CheckerMappingDto?.ruleTierMappingKeyDto?.ruleConfigId}_${CheckerMappingDto?.ruleTierMappingKeyDto?.tierId}_${CheckerMappingDto?.ruleTierMappingKeyDto?.ruleTierMappingId}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //myop payload
  const MYOP_payLoad = {
    moduleName: "MYOP_CONFIG",
    // uuid: `${myop_filter[0]?.brandId}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //master payload
  const Master_payLoad = {
    moduleName: "MASTER_CONFIG",
    uuid: `${CheckerMasterDto?.configId}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //expiry payload
  const Expiry_payLoad = {
    moduleName: "EXPIRATION_CONFIG",
    uuid: `${Expiration[0]?.expiration_id}`,
    reason: rejectInput,
    status: "PENDING",
  };
  //decline api call
  const checkerDecline = async () => {
    try {
      if (checkerView === "TIER_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: TierpayLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "RULE_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: RulepayLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "RULE_TIER_MAPPING_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: Rule_Tier_Mapping_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "MYOP_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: MYOP_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "MASTER_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: Master_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "EXPIRATION_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/declined`,
          data: Expiry_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      }
      setrejectInput("");
      setrejectState(!rejectState);
      CustomNavigate(`./${SUB_URL}/${CHECKER_URL}/${CHECKER_CONFIG_URL}`);
    } catch (err) {
      console.log("TierpayLoad", TierpayLoad);
      console.log(err.message);
    }
  };
  //approval api call
  const checkerApproved = async () => {
    try {
      if (checkerView === "TIER_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: TierpayLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "RULE_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: RulepayLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "RULE_TIER_MAPPING_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: Rule_Tier_Mapping_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "MYOP_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: MYOP_payLoad,
        });
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "MASTER_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: Master_payLoad,
        });
        console.log("res", res);
        setSuccessMsg(res?.data?.status);
      } else if (checkerView === "EXPIRATION_CONFIG") {
        const res = await axios({
          method: "post",
          url: `${PostStatusConfig}/approved`,
          data: Expiry_payLoad,
        });
      }
      console.log("successfully approved");
      setsuccessState(!successState);
    } catch (err) {
      console.log("err from catch block", err?.response?.data?.message);
      setSuccessMsg(err?.response?.status);
      setSuccess_Alert_Msg(err?.response?.data?.message);
    }
  };
  return (
    <CheckerContext.Provider
      value={{
        setrejectInput,
        rejectInput,
        Success_Alert_Msg,
        setSuccess_Alert_Msg,
        RuleDto,
        setRuleDto,
        SuccessMsg,
        setSuccessMsg,
        MasterDto,
        setMasterDto,
        master_dto,
        setmaster_dto,
        checkerApproved,
        setCheckerState,
        checkerState,
        successState,
        setsuccessState,
        rejectState,
        setrejectState,
        checkerDecline,
        checkerConfigStatus,
        setcheckerConfigStatus,
        checkerView,
        setCheckerView,
        MappingDto,
        setMappingDto,
        Rule_Tier_Mapping,
        setRule_Tier_Mapping,
        CheckerMYOP,
        setCheckerMYOP,
        // myop_filter,
        setMYOPid,
        MYOPid,
        CheckerMaster,
        setCheckerMaster,
        Expiration,
        setExpiration,
        setExpiryid,
        Expiryid,
        Expiry_filter,
        setExpiry,
        Expiry,
        MasterView_state,
        setMasterView_state,
        TierDto,
        setTierDto,
      }}
    >
      {children}
    </CheckerContext.Provider>
  );
};
export default CheckerContext;
