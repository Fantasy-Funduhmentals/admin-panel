import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { uploadImage } from "../services/generalService";
import { createNewUser } from "../services/userService";
import { getNormalizedError } from "../utils/helpers";
import StatusModal from "./StatusModal";
import ToggleButton from "../components/toggleButton/toggle";
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

const AddUserModal = (props: Props) => {
  const { open, onClose, editData } = props;
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordToogle, setPasswordtoogle] = useState(false);
  const [recievestatus, setrecievestatus] = useState(true);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    //
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Enter Your Name").min(2).max(50).trim(),
      email: Yup.string()
        .email("Please Enter a Valid Email")
        .trim()
        .required("Enter Your Email"),

      password: Yup.string()
        .required("Enter Your password")
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("password")
        .trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const recieveData = (data) => {
    setrecievestatus(data);
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      // if (!image) {
      //   setStatusData({
      //     type: "error",
      //     message: "Please select an image to continue",
      //   });
      //   return;
      // }
      // if (selectItems == "") {
      //   setStatusData({
      //     type: "error",
      //     message: "Please select an type to continue",
      //   });
      //   return;
      // }

      setLoading(true);

      let params = {
        ...values,
        // sdira: true,
        // type: selectItems == "standard user" ? "standard" : "sdira",
        // isWalletActivated: recievestatus,
      };

      // const userProfileImage = await handleImageUpload(image, "profilePicture");
      // params.profilePicture = userProfileImage;
      const res = await createNewUser({
        ...params,
        email: params.email.replaceAll(" ", ""),
      });
      formik.resetForm();
      // setImage(null);
      // setSymbolImage(null);
      onClose();
      if (res.data.error === true) {
        setStatusData({
          type: "error",
          message: res?.data?.message,
        });
      } else {
        setStatusData({
          type: "success",
          message: res?.data?.message
            ? res?.data?.message
            : "User has been created successfully",
        });
      }

      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  const handleShowpassword = () => {
    setPasswordtoogle(!passwordToogle);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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
              User Registration
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
              <Grid item lg={8} md={6} xs={12}>
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Please enter all the required information create new user."
                      title="User Details"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.name && formik.errors.name
                            )}
                            fullWidth
                            helperText={
                              formik.touched.name && formik.errors.name
                            }
                            label="Name"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.email && formik.errors.email
                            )}
                            helperText={
                              formik.touched.email && formik.errors.email
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            fullWidth
                            label="User Email"
                            name="email"
                            variant="outlined"
                            color="success"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.password && formik.errors.password
                            )}
                            helperText={
                              formik.touched.password && formik.errors.password
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            fullWidth
                            type={passwordToogle ? "text" : "password"}
                            label="Password"
                            name="password"
                            variant="outlined"
                            color="success"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleShowpassword()}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {passwordToogle ? (
                                      <Visibility />
                                    ) : (
                                      <VisibilityOffIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      {loading ? (
                        <Button
                          color="primary"
                          variant="contained"
                          type="button"
                          fullWidth
                        >
                          <CircularProgress color="inherit" />
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          fullWidth
                        >
                          Save details
                        </Button>
                      )}
                    </Box>
                  </Card>
                </form>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Box>
  );
};

export default AddUserModal;
