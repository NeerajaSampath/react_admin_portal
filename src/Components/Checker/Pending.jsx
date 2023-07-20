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

const Pending = ({ ViewConfig, FilterData }) => {
  const [PendingStatus, setPendingStatus] = useState([]);
  const [filter_data, setfilter_data] = useState([]);
  const [resetValue, setresetValue] = useState("");
  const [filt, setFilt] = useState([]);
  const { setLoading } = useAuth();
  const {
    setcheckerConfigStatus,
    setCheckerView,
    setmaster_dto,
    setRule_Tier_Mapping,
    setCheckerMaster,
    setExpiry,
    setExpiryid,
    setMasterView_state,
    MasterDto,
    MappingDto,
    TierDto,
    RuleDto,
    setsuccessState,
    setSuccessMsg,
    setRuleDto,
    setMasterDto,
    setTierDto,
    setMappingDto,
  } = useChecker();
  useEffect(() => {
    PendingAPI();
    RuleGetAPI();
    TierGetAPI();
    MasterGetAPI();
    RuleTierAPI();
  }, []);
  const LowercaseFn = (DataTable) => {
    return DataTable.flatMap((item) =>
      item.uuidList.map((id, index) => {
        const lastIndex = id.lastIndexOf("-");
        const uuid_list_splice = id.slice(0, lastIndex);
        const uuid_mapping = uuid_list_splice.split(/[_]+/);
        // const active_status = id.split("-");
        // const Enabled = active_status.pop();
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
        };
      })
    );
  };
  //api call for Pending
  const PendingAPI = async () => {
    try {
      setLoading(true);
      const res = await axios({
        method: "get",
        url: `${GetStatusConfig}/pending`,
      });
      setLoading(false);
      let formate_data = LowercaseFn(res.data.data.configStatusRequestList);
      setPendingStatus(formate_data);
      setfilter_data(res?.data?.data?.configStatusRequestList);
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
  const columns = [
    { field: "uuidList", headerName: "Config Id", flex: 1, sortable: false },
    {
      field: "configName",
      headerName: "Config Name",
      flex: 1,
      sortable: false,
    },
    {
      field: "moduleName",
      headerName: "Module Name",
      flex: 1,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <span className="pending_text">{params?.value}</span>
        </>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      headerClassName: "Table-header",
      align: "left",
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
              setSuccessMsg("");
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
                console.log("ruleMappingDto", ruleMappingDto);
                console.log("MappingDto", MappingDto);
                sessionStorage.setItem(
                  "MappingDtoStorage",
                  JSON.stringify(ruleMappingDto)
                );
                setsuccessState(false);
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
                console.log("currentData_rule", currentData_rule);
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
          "&.MuiDataGrid-root .MuiDataGrid-columnHeader": {
            // background: "#ecf2ff",
          },
        }}
        onCellClick={handleCellClick}
        rows={PendingStatus}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "table-body odd"
            : "table-body even"
        }
        initialState={{
          sorting: {
            sortModel: [{ field: "status", sort: "desc" }],
          },
        }}
        filterModel={{
          items: filt,
        }}
      />
    </>
  );
};

export default Pending;
