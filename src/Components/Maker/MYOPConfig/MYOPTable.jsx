import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "../../../api";
import { GetMyopConfig } from "../../../apiConfig";
import { ButtonArea } from "../../Common/Elements";
import CreateMYOP from "./CreateMYOP";
import useAuth from "../../../Hooks/useAuth";

function Row(props) {
  const { rows } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow className="tr_bg">
        <TableCell
          sx={{
            paddingBottom: "10px",
            paddingTop: "10px",
            fontSize: "12px",
            border: "unset",
          }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {rows.brandName}
        </TableCell>
      </TableRow>
      <TableRow className="tr_bg">
        <TableCell
          style={{ paddingBottom: "0px", paddingTop: "0px", fontSize: "12px" }}
          colSpan={12}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: "10px" }}>
              <Typography
                variant="body"
                sx={{ marginBottom: "20px" }}
                component="div"
              >
                Merchant Details
              </Typography>
              <Box className="collapse-table">
                <Table size="small" aria-label="MYOP Details">
                  <TableHead>
                    <TableRow sx={{ fontSize: "12px" }}>
                      <TableCell
                        sx={{
                          fontSize: "12px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Merchant Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "12px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        Merchant Id
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.merchants.map((merchant) => (
                      <TableRow key={merchant.merchantId}>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            border: "unset",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                          component="td"
                          scope="row"
                        >
                          {merchant.merchantName}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "12px",
                            border: "unset",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                          component="td"
                          scope="row"
                        >
                          {merchant.mcId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function MYOPTable() {
  const [MYOPTable, setMYOPTable] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [MYOPModal, setMYOPModal] = React.useState(false);
  const [closeAlert, setCloseAlert] = React.useState(false);
  const [SubmitData, setSubmitData] = React.useState(false);
  const [Switch, setSwitch] = React.useState(false);
  const { setLoading } = useAuth();
  React.useEffect(() => {
    MYOPAPI();
  }, [MYOPModal]);
  const currentRows = MYOPTable.filter((r, ind) => {
    return ind >= rowsPerPage * page && ind < rowsPerPage * (page + 1);
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const MYOPAPI = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${GetMyopConfig}/0/5000`);
      setLoading(false);
      setMYOPTable(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };
  return (
    <>
      <div className="CommonHeader">
        <h5 className="title">MYOP Configuration list</h5>
        <ButtonArea
          value="Create New MYOP"
          variant="contained"
          type="button"
          onClick={() => {
            setMYOPModal(true);
          }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table className="myop_table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "12px" }}>Brand Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => (
              <Row rows={row} key={index} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={MYOPTable.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <CreateMYOP
        setMYOPModal={setMYOPModal}
        MYOPModal={MYOPModal}
        setCloseAlert={setCloseAlert}
        closeAlert={closeAlert}
        SubmitData={SubmitData}
        setSubmitData={setSubmitData}
        setSwitch={setSwitch}
        Switch={Switch}
      />
    </>
  );
}
