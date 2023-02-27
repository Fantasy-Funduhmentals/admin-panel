import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AppBar from "@mui/material/AppBar";
import Multiselect from "multiselect-react-dropdown";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: any;
  editData?: any;
}

const UserDetailsModal = (props: Props) => {
  const { open, onClose, editData } = props;
  console.log(
    "🚀 ~ file: Details-modal.tsx:52 ~ DetailsModal ~ editData",
    editData
  );

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar
            sx={{
              background: "#232325",
              boxShadow:
                "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Bug Details
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#111112",
          }}
        >
          <Container maxWidth="lg">
            <Grid>
              <Card>
                <Grid item lg={4} md={6} xs={12}>
                  <Container maxWidth="xl">
                    <CardContent>
                      {editData?.image != "" && (
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            src={editData?.image}
                            style={{
                              height: 500,
                              width: "100%",
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "1rem",
                        pb: 5,
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "0.875rem",
                          color: "#bebcbc",
                        }}
                      >
                        Name:{" "}
                        <Box
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                            color: "#fff",
                          }}
                        >
                          {editData?.name}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          fontSize: "0.875rem",
                          color: "#bebcbc",
                        }}
                      >
                        Email:{" "}
                        <Box
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                            color: "#fff",
                          }}
                        >
                          {editData?.email}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          fontSize: "0.875rem",
                          color: "#bebcbc",
                        }}
                      >
                        Subject:{" "}
                        <Box
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                            color: "#fff",
                          }}
                        >
                          {editData?.subject}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          fontSize: "0.875rem",
                          color: "#bebcbc",
                        }}
                      >
                        Message:{" "}
                        <Box
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                            color: "#fff",
                          }}
                        >
                          {editData?.message}
                        </Box>
                      </Box>
                    </Box>
                  </Container>
                </Grid>
              </Card>
            </Grid>
          </Container>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UserDetailsModal;
