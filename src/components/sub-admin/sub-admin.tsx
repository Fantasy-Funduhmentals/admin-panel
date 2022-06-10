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
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { useAppDispatch } from "../../store/hooks";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { saveAdminUser } from "../../store/reducers/adminSlice";
import { getAdminUserData } from "../../services/tokenService";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

// export default function AlertDialog({ data }) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [statusData, setStatusData] = useState(null);
//   const [checked, setChecked] = useState(data?.block);
//   const [some, setSome] = useState(false);
//   const dispatch = useAppDispatch();
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   function capitalizeFirstLetter(str: string) {
//     return str[0].toUpperCase() + str.slice(1);
//   }

//   const handleUserBlock = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     try {
//       setChecked(event.target.checked == true ? 1 : 0);
//       setLoading(true);
//       await HTTP_CLIENT.get(`/auth/user-block/${data?.id}`);
//       setSome(!some);
//       setLoading(false);
//       handleClose();
//     } catch (err) {
//       const error = getNormalizedError(err);
//       setStatusData({
//         type: "error",
//         message: error,
//       });
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     getAdminUsers();
//   }, [some]);

//   const getAdminUsers = async () => {
//     try {
//       // const AdminUser = await getAdminUserData();
//       // dispatch(saveAdminUser(AdminUser.data));
//     } catch (err) {
//       const error = getNormalizedError(err);
//       setStatusData({
//         type: "error",
//         message: error,
//       });
//     }
//   };

//   return (
//     <div>
//       <SeverityPill
//         color={(data?.block === 0 && "error") || "success"}
//         onClick={handleClickOpen}
//         style={{ cursor: "pointer" }}
//       >
//         {data?.block === 0 ? "Block " : "Unblock "}
//       </SeverityPill>

//       <StatusModal
//         statusData={statusData}
//         onClose={() => setStatusData(null)}
//       />
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogContent>
//           {data?.block == 1 ? (
//             <DialogContentText id="alert-dialog-description">
//               Are you sure want to Block
//             </DialogContentText>
//           ) : (
//             <DialogContentText id="alert-dialog-description">
//               Are you sure want to Unblock
//             </DialogContentText>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           {loading ? (
//             <Button>Loading...</Button>
//           ) : (
//             <Button onClick={handleUserBlock}>Confirm</Button>
//           )}
//         </DialogActions>
//       </Dialog>
//       <StatusModal
//         statusData={statusData}
//         onClose={() => setStatusData(null)}
//       />
//     </div>
//   );
// }
export const AdminsList = (props: Props) => {
  const { data, searchQuery } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [sdira, setSdira] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else if (sdira) {
      return data.filter((user) => user.sdira);
    } else {
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery, sdira]);

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
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>roles</TableCell>
                  <TableCell>Permissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                  >
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>

                    <TableCell>{customer.role}</TableCell>
                    <TableCell>
                      {customer?.adminPermissions?.length > 0 &&
                        customer.adminPermissions}
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
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

AdminsList.propTypes = {
  data: PropTypes.array.isRequired,
};
