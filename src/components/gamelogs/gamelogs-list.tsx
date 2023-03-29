import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import moment from "moment";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
  handlePageChange?: (p?: any, c?: any) => void;
  handlelimitchange?: (p?: any, c?: any) => void;
  page?: number;
  limit?: number;
}

export const GamelogsList = (props: Props) => {
  const {
    data,
    searchQuery,
    handlePageChange,
    handlelimitchange,
    page,
    limit,
  } = props;
  console.log("🚀 ~ file: gamelogs-list.tsx:39 ~ GamelogsList ~ data:", data);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data?.filter((item) =>
        item?.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return data?.slice(begin, end);
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
                  <TableCell style={{ color: "#fff" }}>position</TableCell>
                  <TableCell style={{ color: "#fff" }}>Week</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    deducted amount
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>profit amount</TableCell>
                  <TableCell style={{ color: "#fff" }}>created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((item) => (
                  <TableRow
                    hover
                    key={item?._id}
                    selected={selectedCustomerIds?.indexOf(item?._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar src={item?.detail?.Url} sx={{ mr: 2 }}>
                          {getInitials(item?.position)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {item?.position}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item?.week ? item?.week : "-"}</TableCell>
                    <TableCell>
                      {Number(item?.winningAmount)?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {Number(item?.winningAmount * 0.02)?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")}
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
        count={data?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlelimitchange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

GamelogsList.propTypes = {
  item: PropTypes.array.isRequired,
};
