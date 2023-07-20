import { React, useEffect, useState } from "react";
import { ButtonArea } from "../Common/Elements";
import axios from "../../api";
import {
  GetStatusConfig,
  GetRuleConfig,
  GetMasterConfig,
  GetTierConfig,
  GetRuleTierMapConfig,
} from "../../apiConfig";
import useAuth from "../../Hooks/useAuth";
import useChecker from "../../Hooks/useChecker";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const Approval = ({ ViewConfig }) => {
  const [ApproveState, setApproveState] = useState([]);
  const [filter_data, setfilter_data] = useState([]);
  const [resetValue, setresetValue] = useState("");
  const [filt, setFilt] = useState([]);
  const { setLoading } = useAuth();
  const {
    setcheckerConfigStatus,
    setCheckerView,
    setRule_Tier_Mapping,
    setCheckerMaster,
    setExpiry,
    setExpiryid,
    setmaster_dto,
    setMasterView_state,
    MasterDto,
    TierDto,
    RuleDto,
    setRuleDto,
    setMasterDto,
    setTierDto,
    setMappingDto,
    MappingDto,
  } = useChecker();
  useEffect(() => {
    ApprovedAPI();
    RuleGetAPI();
    MasterGetAPI();
    TierGetAPI();
    RuleTierAPI();
  }, []);
  //api call for approval
  const LowercaseFn = (DataTable) => {
    return DataTable.flatMap((item) =>
      item.uuidList.map((id, index) => {
        const lastIndex = id.lastIndexOf("-");
        const uuid_list_splice = id.slice(0, lastIndex);
        const uuid_mapping = uuid_list_splice.split(/[_]+/);
        const active_status = id.split("-");
        const Enabled = active_status.pop();
        // const config_name = id.split("]")[0].toLowerCase();
        return {
          id: `${item?.moduleName}-${index + 1}`,
          moduleName: item?.moduleName.toLowerCase(),
          uuidList: id,
          configName:
            item?.moduleName === "TIER_CONFIG"
              ? TierDto?.filter(
                  (typeid) => typeid.tier_id === uuid_list_splice
                ).map((items) => items?.tier_name.toLowerCase())
              : item?.moduleName === "RULE_CONFIG"
              ? RuleDto?.filter(
                  (typeid) => typeid.rule_config_id === uuid_list_splice
                ).map((items) => items?.name.toLowerCase())
              : item?.moduleName === "RULE_TIER_MAPPING_CONFIG"
              ? MappingDto?.filter(
                  (d) =>
                    d?.ruleTierMappingKeyDto?.ruleConfigId ===
                      uuid_mapping[0] &&
                    d?.ruleTierMappingKeyDto?.ruleTierMappingId ===
                      uuid_mapping[2] &&
                    d?.ruleTierMappingKeyDto?.tierId === uuid_mapping[1]
                ).map(
                  (items) =>
                    `${items?.ruleConfigDto.name.toLowerCase()} ,
                    ${items?.tiersConfigDTO.tier_name.toLowerCase()}`
                )
              : item?.moduleName === "MASTER_CONFIG"
              ? "Master"
              : null,
          status: item?.status.toLowerCase(),
          Enabled: Enabled,
        };
      })
    );
  };
  // const LowercaseFn = (DataTable) => {
  //   return DataTable.flatMap((item) =>
  //     item.uuidList.map((id, index) => {
  //       // const lastIndex = id.lastIndexOf("-");
  //       // const uuid_list_splice = id.slice(0, lastIndex);
  //       // const uuid_mapping = uuid_list_splice.split(/[_]+/);
  //       const active_status = id.split("-");
  //       const Enabled = active_status.pop();
  //       const config_name = id.split("]")[0].toLowerCase();
  //       return {
  //         id: `${item?.moduleName}-${index + 1}`,
  //         moduleName: item?.moduleName.toLowerCase(),
  //         uuidList:
  //           item?.moduleName === "MASTER_CONFIG" ? id : id.split("]")[1],
  //         configName:
  //           item?.moduleName === "MASTER_CONFIG"
  //             ? "Master"
  //             : config_name.replace("[", ""),
  //         status: item?.status.toLowerCase(),
  //         Enabled: Enabled,
  //       };
  //     })
  //   );
  // };
  const ApprovedAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetStatusConfig}/approved`,
      });
      setLoading(false);
      let formate_data = LowercaseFn(res.data.data.configStatusRequestList);
      setApproveState(formate_data);
      setfilter_data(res?.data?.data?.configStatusRequestList);
      // console.log("approved", res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const RuleGetAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetRuleConfig}/0/5000`,
      });
      setLoading(false);
      setRuleDto(res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  const TierGetAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetTierConfig}/0/5000`,
      });
      setLoading(false);
      setTierDto(res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  const RuleTierAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetRuleTierMapConfig}/0/5000`,
      });
      setLoading(false);
      setMappingDto(res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  const MasterGetAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetMasterConfig}/0/5000`,
      });
      setLoading(false);
      setMasterDto(res?.data?.data);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  //column for the pending api table
  const columns = [
    { field: "uuidList", headerName: "Config Id", sortable: false, flex: 1 },
    {
      field: "configName",
      headerName: "Config Name",
      sortable: false,
      flex: 1,
    },
    {
      field: "moduleName",
      headerName: "Module Name",
      sortable: false,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <span className="approved_text">{params?.value}</span>
        </>
      ),
    },
    {
      field: "Enabled",
      headerName: "Active/Inactive",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {/* {params.value === "true" ? (
              <ToggleOnIcon sx={{ color: "#32a64d", fontSize: "30px" }} />
            ) : (
              <ToggleOffIcon sx={{ color: "#ccc", fontSize: "30px" }} />
            )} */}
            {params.value === "true" ? (
              <span
                style={{
                  color: "#32a64d",
                  background: "rgb(209 227 229 / 69%)",
                  padding: "5px 8px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  width: "65px",
                  textAlign: "center",
                }}
              >
                Active
              </span>
            ) : (
              <span
                style={{
                  color: "#fe403f",
                  background: "rgb(238 217 231 / 56%)",
                  padding: "5px 8px 8px",
                  fontSize: "12px",
                  borderRadius: "5px",
                  width: "65px",
                  textAlign: "center",
                }}
              >
                Inactive
              </span>
            )}
          </>
        );
      },
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "Table-header",
      align: "left",
      sortable: false,
      renderCell: (params) => (
        <>
          <ButtonArea
            variant="text"
            type="button"
            value="View"
            className="viewbtn"
            onClick={() => {
              const lastIndex = params?.row?.uuidList.lastIndexOf("-");
              const uuid_list_splice = params?.row?.uuidList.slice(
                0,
                lastIndex
              );
              console.log("uuid_list_splice", uuid_list_splice);
              setCheckerView(params?.row?.moduleName.toUpperCase());
              setcheckerConfigStatus(params?.row?.status.toUpperCase());
              if (
                params?.row?.moduleName.toUpperCase() ===
                "RULE_TIER_MAPPING_CONFIG"
              ) {
                const uuid_mapping = uuid_list_splice.split(/[_]+/);
                const ruleMappingDto = MappingDto.find(
                  (d) =>
                    d?.ruleTierMappingKeyDto?.ruleConfigId ===
                      uuid_mapping[0] &&
                    d?.ruleTierMappingKeyDto?.ruleTierMappingId ===
                      uuid_mapping[2] &&
                    d?.ruleTierMappingKeyDto?.tierId === uuid_mapping[1]
                );
                sessionStorage.setItem(
                  "MappingDtoStorage",
                  JSON.stringify(ruleMappingDto)
                );
                setRule_Tier_Mapping(true);
              }
              if (params?.row?.moduleName.toUpperCase() === "MASTER_CONFIG") {
                setmaster_dto(`${uuid_list_splice}`);
                setCheckerMaster(true);
                setMasterView_state(true);
                const currentData = MasterDto.find(
                  (d) => d.configId === uuid_list_splice
                );
                sessionStorage.setItem(
                  "MasterDtoStorage",
                  JSON.stringify(currentData)
                );
              }
              if (
                params?.row?.moduleName.toUpperCase() === "EXPIRATION_CONFIG"
              ) {
                setExpiryid(`${uuid_list_splice}`);
                setCheckerMaster(false);
                setExpiry(true);
              }
              if (params?.row?.moduleName.toUpperCase() === "TIER_CONFIG") {
                const currentData_tier = TierDto.find(
                  (d) => d.tier_id === uuid_list_splice
                );
                sessionStorage.setItem(
                  "tierViewConfigDto",
                  JSON.stringify(currentData_tier)
                );
              }
              if (params?.row?.moduleName.toUpperCase() === "RULE_CONFIG") {
                const currentData_rule = RuleDto.find(
                  (d) => d.rule_config_id === uuid_list_splice
                );
                sessionStorage.setItem(
                  "ruleViewConfigDto",
                  JSON.stringify(currentData_rule)
                );
              }
              ViewConfig(uuid_list_splice);
            }}
          />
        </>
      ),
    },
  ];
  //filter button functions
  const FilterOption = filter_data.map((item) => (
    <MenuItem
      sx={{ fontSize: "14px", textTransform: "capitalize" }}
      key={item.id}
      value={item.moduleName.toLowerCase()}
    >
      {item.moduleName.toLowerCase()}
    </MenuItem>
  ));
  const filter_change = (e) => {
    setresetValue(e.target.value);
    setFilt([
      {
        columnField: "moduleName",
        operatorValue: "startsWith",
        value: e.target.value.toLowerCase(),
      },
    ]);
  };
  const handleCellClick = (param, event) => {
    event.defaultMuiPrevented = param;
  };
  return (
    <>
      {/* filter section */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "7px", fontSize: "12px" }}>Filter By</span>
        <div className="filter_select">
          <FormControl fullWidth>
            <InputLabel
              sx={{ fontSize: "12px", textTransform: "capitalize" }}
              size="small"
              id="filterid"
            >
              Select Module Name
            </InputLabel>
            <Select
              fullWidth
              labelId="filterlabelid"
              id="filterid"
              label="Select Module Name"
              onChange={filter_change}
              name="filterSelect"
              value={resetValue}
              sx={{
                fontSize: "12px",
                paddingTop: "2px",
                textTransform: "capitalize",
              }}
              size="small"
            >
              {FilterOption}
            </Select>
          </FormControl>
        </div>
        <ButtonArea
          type="button"
          onClick={() => {
            setresetValue("");
            setFilt([]);
          }}
          value="reset"
        />
        {/* <DefaultSelect
          labelId="filterlabelid"
          id="filterid"
          label="Select Module Name"
          onChange={filter_change}
          name="filterSelect"
          optionvalue={FilterOption}
        /> */}
      </div>
      {/* datagrid table */}
      <DataGrid
        sx={{
          border: "unset",
          height: "calc(100vh - 220px)",
          textTransform: "capitalize",
          marginTop: "20px",
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
            outline: "none !important",
          },
        }}
        onCellClick={handleCellClick}
        rows={ApproveState}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: "Enabled", sort: "desc" }],
        //   },
        // }}
        filterModel={{
          items: filt,
        }}
      />
    </>
  );
};

export default Approval;
