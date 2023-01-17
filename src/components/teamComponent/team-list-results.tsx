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

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;

  count?: number;
  handlePageChange?: (e?: any, p?: any) => void;
  handleLimitChange?: (e?: any, p?: any) => void;
  page?: number;
  limit?: number;
}

export const TeamListResults = (props: Props) => {
  const {
    data,
    searchQuery,
    count,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
  } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataToDisplay = useMemo(() => {
    if (searchQuery.length > 0) {
      return data.filter(
        (user) =>
          user.detail?.Conference?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          user.detail?.City?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          user.detail?.HeadCoach?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          user.detail?.SpecialTeamsCoach?.toLowerCase().includes(
            searchQuery.toLowerCase()
          )
      );
    } else {
      return data;
    }
  }, [data, searchQuery]);

  return (
    <Card {...props}>
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
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Team Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Global Team ID
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>City</TableCell>
                  <TableCell style={{ color: "#fff" }}>Head Coach</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Special Teams Coach
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Defensive Scheme
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Average Draft Position
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer?._id}
                    selected={selectedCustomerIds.indexOf(customer?._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar
                          src={customer?.detail?.WikipediaLogoUrl}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer?.detail?.Conference)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer?.detail?.Conference}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer?.detail?.GlobalTeamID}</TableCell>
                    <TableCell>{customer?.detail?.City}</TableCell>
                    <TableCell>{customer?.detail?.HeadCoach}</TableCell>
                    <TableCell>{customer?.detail?.SpecialTeamsCoach}</TableCell>
                    <TableCell>{customer?.detail?.DefensiveScheme}</TableCell>
                    <TableCell>
                      {customer?.detail?.AverageDraftPosition}
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
    </Card>
  );
};

TeamListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
