import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  TableBody,
  CircularProgress,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import StatusModal from "../StatusModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  onPressEdit?: any;
}

export const NftListResults = (props: Props) => {
  const { data, searchQuery, onPressEdit } = props;
  console.log("data&&&{{{{", data);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [editorState, setEditorState] = useState("");
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [statusData, setStatusData] = useState(null);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;
    let filterData = data?.slice().sort((v1, v2) => v1.index - v2.index);

    if (searchQuery.length > 0) {
      return filterData
        .filter((user) =>
          user.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return filterData?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const hanldeSubmitNewletter = async () => {
    setloading(true);
    const convertedData = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    let params = {
      markup: convertedData,
    };
    try {
      const response = await HTTP_CLIENT.post("newsletter/broadcast", params);
      console.log("markup data", response);
      if (response.data) {
        setStatusData({
          type: "success",
          message: "successfully sent",
        });
      }
      handleClose();
      setloading(false);
    } catch (error) {
      setStatusData({
        type: "error",
        message: error.data.response.message,
      });
      setloading(false);
    }
  };

  return (
    <Card {...props}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Newsletter
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </Typography>
          <Button variant="contained" onClick={hanldeSubmitNewletter}>
            {loading ? <CircularProgress color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </Modal>
      <Box
        style={{
          width: "100%",
          marginTop: "2rem",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button sx={{ mb: 4 }} variant="contained" onClick={handleOpen}>
          send Newsletter
        </Button>
      </Box>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            // marginTop: theme.spacing.unit * 3,
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.length === data.length}
                      color="primary"
                      indeterminate={
                        selectedCustomerIds.length > 0 &&
                        selectedCustomerIds.length < data.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell> */}
                  <TableCell>Users</TableCell>
                  {/* <TableCell>Image</TableCell>

                  <TableCell>Index</TableCell>
                  <TableCell>Price Per unit</TableCell>
                  <TableCell>Remaining Supply</TableCell>
                  <TableCell>Total Supply</TableCell> */}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => {
                  return (
                    <TableRow
                      hover
                      key={customer._id}
                      selected={
                        selectedCustomerIds.indexOf(customer._id) !== -1
                      }
                    >
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          {/* <Avatar src={customer.image} sx={{ mr: 2 }}>
                            {getInitials(customer.name)}
                          </Avatar> */}
                          <Typography color="textPrimary" variant="body1">
                            {customer.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* <TableCell>
                        <img
                          src={customer?.image}
                          style={{ height: 30, width: 30 }}
                        />
                      </TableCell>
                      <TableCell>{customer.index} </TableCell>
                      <TableCell>{customer.pricePerShare}</TableCell>
                      <TableCell>{customer.remainingSupply}</TableCell>
                      <TableCell>{customer.totalSupply}</TableCell>
                      <TableCell onClick={() => onPressEdit(customer)}>
                        <ModeEditIcon color="secondary" />
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Card>
  );
};
