import { React, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  Tabs,
  FormHelperText,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import PropTypes from "prop-types";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

export const TextArea = (props) => {
  return (
    <div style={props.Style} className="field-container">
      <TextField
        fullWidth
        m={2}
        sx={{
          margin: "10px 20px 7px 0",
          paddingBottom: "15px",
          fontSize: 12,
          textTransform: "capitalize",
        }}
        InputLabelProps={{ style: { fontSize: 12 } }}
        required={props.required}
        id={props.id}
        label={props.label}
        type={props.type}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onchange}
        onBlur={props.onBlur}
        className={props.className}
        disabled={props.disabled}
        error={props.error}
        helperText={props.helperText}
        size="small"
        {...props}
      />
    </div>
  );
};
export const ButtonArea = (props) => {
  return (
    <Button
      size="small"
      sx={{
        fontSize: "12px",
        textTransform: "capitalize",
        borderBottom: "1px solid transparent",
      }}
      variant={props.variant}
      className={props.className}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      {...props}
    >
      {props.value}
    </Button>
  );
};
export function RadioGroup(props) {
  const {
    name,
    label,
    value,
    onChange,
    items,
    className,
    labelid,
    checked,
    groplabel,
  } = props;
  return (
    <FormControl>
      <FormLabel sx={{ fontSize: "14px" }} labelid={labelid}>
        {groplabel}
      </FormLabel>
      <MuiRadioGroup
        row
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        items={items}
        checked={checked}
        groplabel={groplabel}
        labelid={labelid}
        size="small"
        {...props}
      >
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={
              <Radio
                size="small"
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                }}
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
              },
            }}
            label={item.title}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
export const Toggle = (props) => {
  return (
    <FormControl
      sx={{ margin: "0px 0px 0px 0", paddingBottom: "5px" }}
      error={props.error}
      size="small"
    >
      <FormControlLabel
        label={props.label}
        checked={props.checked}
        control={<Switch defaultChecked={props.defaultChecked} />}
        className="customtoggle"
        onChange={props.onChange}
        {...props}
      ></FormControlLabel>
      <FormHelperText>{props?.formhelpertext}</FormHelperText>
    </FormControl>
  );
};

export const MultiSelect = (props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
      },
    },
  };
  return (
    <div className="field-container">
      <FormControl fullWidth>
        <InputLabel sx={{ fontSize: "12px" }} id={props.labelId}>
          {props.label}
        </InputLabel>
        <Select
          labelId={props.labelId}
          id={props.id}
          name={props.name}
          onBlur={props.onBlur}
          multiple
          size="small"
          value={props.value}
          onChange={props.onChange}
          sx={{ fontSize: "12px", margin: "10px 20px 7px 0" }}
          input={<OutlinedInput label={props.label} />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          selectstate={props.selectstate}
        >
          {props.selectstate}
          {/* {Multioption} */}
        </Select>
      </FormControl>
    </div>
  );
};
export const DefaultSelect = (props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200,
        overflowX: "scroll",
        textTransform: "capitalize",
      },
    },
  };
  return (
    <div className="field-container">
      <FormControl
        sx={{ margin: "11px 20px 0px 0", paddingBottom: "20px" }}
        error={props.error}
        fullWidth
      >
        <InputLabel
          sx={{ fontSize: "12px", textTransform: "capitalize" }}
          size="small"
          id={props.labelId}
        >
          {props.label}
        </InputLabel>
        <Select
          labelId={props.labelId}
          id={props.id}
          label={props.label}
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={props.name}
          sx={{
            fontSize: "12px",
            paddingTop: "2px",
            textTransform: "capitalize",
          }}
          size="small"
          value={props.value}
          formhelpertext={props?.formhelpertext}
          optionvalue={props.optionvalue}
          MenuProps={MenuProps}
          isvaluebased={props.isvaluebased}
          disabled={props?.disabled}
          {...props}
        >
          {props.optionvalue}
        </Select>
        <FormHelperText>{props?.formhelpertext}</FormHelperText>
      </FormControl>
    </div>
  );
};
export const CustomSnakebar = (props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.autoHideDuration}
      onClose={props.onClose}
      anchorOrigin={props.anchorOrigin}
      alertmsg={props.alertmsg}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        className={props.className}
        {...props}
      >
        {props.alertmsg}
      </Alert>
    </Snackbar>
  );
};
function TabPanel(props) {
  const { children, value, index, className, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: "15px 0" }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export const CustomTab = ({ tabs, customlabels }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {customlabels}
        </Tabs>
      </Box>
      {tabs?.map(({ Component }, i) => (
        <TabPanel className="tabPanel" value={value} index={i} key={i}>
          <div>{Component}</div>
        </TabPanel>
      ))}
    </Box>
  );
};

export const NewMultiselect = (props) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
        // maxWidth: 200,
        width: 300,
        overflowX: "scroll",
        textTransform: "capitalize",
        fontSize: "12px",
      },
    },
  };
  return (
    <div className="field-container">
      <TextField
        label={props.label}
        select
        m={2}
        sx={{
          margin: "10px 20px 7px 0",
          paddingBottom: "15px",
          fontSize: "12px",
          textTransform: "capitalize",
        }}
        style={{ fontSize: "30px" }}
        InputLabelProps={{ style: { fontSize: 12 } }}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        fullWidth
        size="small"
        SelectProps={{
          multiple: true,
          MenuProps,
        }}
        optionvalue={props.optionvalue}
        error={props.error}
        helperText={props.helperText}
        {...props}
      >
        {props.optionvalue}
      </TextField>
    </div>
  );
};
