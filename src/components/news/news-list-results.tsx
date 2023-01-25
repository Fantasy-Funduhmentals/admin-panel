import {
  Avatar,
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { getNormalizedError } from "../../utils/helpers";
import { handleUpdateNewsImages } from "../../services/newsService";
import StatusModal from "../StatusModal";
import { changesImageUrl } from "../../services/shopService";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  count?: number;
  handlePageChange?: (p?: any, c?: any) => void;
  handleLimitChange?: (p?: any, c?: any) => void;
  page?: number;
  limit?: number;
  getCoinsListing: () => void;
}

export const NewsListResults = (props: Props) => {
  const {
    data,
    searchQuery,
    count,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    getCoinsListing,
  } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [rejectShow, setrejectShow] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState("");

  const handleEditPlayer = (data: any) => {
    setPlayerId(data?._id);
    setrejectShow(true);
  };

  const handleClose = () => {
    setrejectShow(false);
  };

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const uploadRes = await changesImageUrl(formData);
    return uploadRes?.data?.url;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (image === "") {
        setStatusData({
          type: "error",
          message: "please select image first",
        });
        return;
      }

      setloading(true);
      let params = {
        coverImage: await handleImageUpload(image[0], "NFT"),
      };

      const res = await handleUpdateNewsImages(playerId, params);
      setStatusData({
        type: "success",
        message: res?.data?.message,
      });
      setrejectShow(false);

      getCoinsListing();
      setloading(false);
    } catch (err) {
      setloading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter(
        (user) =>
          user?.detail?.Title?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          user?.detail?.Source?.toLowerCase().includes(
            searchQuery.toLowerCase()
          )
      );
    } else {
      return data;
    }
  }, [page, limit, data, searchQuery]);

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Source</TableCell>
                  <TableCell style={{ color: "#fff" }}>Title</TableCell>
                  <TableCell style={{ color: "#fff" }}>Author</TableCell>
                  <TableCell style={{ color: "#fff" }}>News ID</TableCell>
                  <TableCell style={{ color: "#fff" }}>Player ID</TableCell>
                  <TableCell style={{ color: "#fff" }}>Team</TableCell>
                  {/* <TableCell style={{ color: "#fff" }}>Time Ago</TableCell> */}
                  <TableCell style={{ color: "#fff" }}>created At</TableCell>
                  <TableCell style={{ color: "#fff" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => (
                  <TableRow
                    hover
                    key={item?._id}
                    selected={selectedCustomerIds.indexOf(item?._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar src={item?.detail?.Url} sx={{ mr: 2 }}>
                          {getInitials(item?.detail?.Source)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {item?.detail?.Source}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item?.detail?.Title}</TableCell>
                    <TableCell>{item?.detail?.Author}</TableCell>
                    <TableCell>{item?.detail?.NewsID} </TableCell>
                    <TableCell>{item?.detail?.PlayerID} </TableCell>
                    <TableCell>{item?.detail?.Team} </TableCell>
                    {/* <TableCell>{item?.detail?.TimeAgo} </TableCell> */}
                    <TableCell>
                      {moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                    <TableCell onClick={() => handleEditPlayer(item)}>
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Modal
        open={rejectShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ background: "rgba(0, 0, 0, 0.7)" }}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 364,
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: 4,
            boxShadow: 60,
            p: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update News Image
            </Typography>

            <TextField
              onChange={(ev: any) => {
                if (ev?.target?.files) setImage(ev?.target?.files);
              }}
              inputProps={{ accept: "image/x-png,image/gif,image/jpeg" }}
              fullWidth
              // label="video"
              margin="normal"
              name="image"
              color="success"
              variant="outlined"
              type="file"
            />

            <Box sx={{ width: "100%", textAlign: "center" }}>
              {loading ? (
                <Button
                  style={{ marginTop: 14 }}
                  color="primary"
                  variant="contained"
                  type="submit"
                  fullWidth
                >
                  <CircularProgress color="inherit" size="35px" />
                </Button>
              ) : (
                <Button
                  style={{ marginTop: 14 }}
                  color="primary"
                  variant="contained"
                  type="submit"
                  fullWidth
                >
                  Submit
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Card>
  );
};

NewsListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
