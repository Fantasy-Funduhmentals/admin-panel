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
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
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
  const Item = [
    {
      name: "standard user",
    },
    {
      name: "sdira",
    },
    // {
    //   name: "ira",
    // },
  ];

  const { open, onClose, editData } = props;

  const [image, setImage] = useState(null);
  const [symbolImage, setSymbolImage] = useState(null);

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editSymbolImage, setEditSymbolImage] = useState(null);
  const [selectItems, setSelectItems] = useState("");
  const [recievestatus, setrecievestatus] = useState(true);

  const handleDurationChange = (event) => {
    setSelectItems(event.target.value);
  };
  useEffect(() => {
    if (editData) {
      setEditImage(editData.icon.url);
      setEditSymbolImage(editData.displaySymbol);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Enter Your Name").min(2).max(50).trim(),
      email: Yup.string()
        .email("Please Enter a Valid Email")
        .trim()
        .required("Enter Your Email"),

      password: Yup.string()
        .required()
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("Password")
        .trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleImageUpload = async (file: any, type: string) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", type);

    const uploadRes = await uploadImage(formData);
    return uploadRes.data.url;
  };

  const recieveData = (data) => {
    setrecievestatus(data);
  };

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);
      if (!image) {
        setStatusData({
          type: "error",
          message: "Please select an image to continue",
        });
        return;
      }
      if (selectItems == "") {
        setStatusData({
          type: "error",
          message: "Please select an type to continue",
        });
        return;
      }

      setLoading(true);

      let params = {
        ...values,
        // sdira: true,
        type: selectItems,
        isWalletActivated: recievestatus,
      };

      const userProfileImage = await handleImageUpload(image, "profilePicture");
      params.profilePicture = userProfileImage;
      await createNewUser({
        ...params,
        email: params.email.replaceAll(" ", ""),
      });

      formik.resetForm();
      setImage(null);
      setSymbolImage(null);
      onClose();
      setStatusData({
        type: "success",
        message: "User has been created successfully",
      });
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

  const handleImageSelection = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
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
          <Toolbar>
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
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <Card>
                  <CardHeader
                    subheader="This image will be used as primary profile image of the user across the system."
                    title="Profile Image"
                  />
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Avatar
                        src={
                          editImage
                            ? editImage
                            : image && URL.createObjectURL(image)
                        }
                        sx={{
                          height: 64,
                          mb: 2,
                          width: 64,
                        }}
                      />
                    </Box>
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      type="file"
                      onChange={(ev) => handleImageSelection(ev)}
                    />
                  </Box>
                </Card>
              </Grid>

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
                            helperText="Please enter the real name of the user.."
                            label="Name"
                            name="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            required
                            value={formik.values.name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.email && formik.errors.email
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            fullWidth
                            label="User Email"
                            name="email"
                            helperText="Please enter user email address"
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={Boolean(
                              formik.touched.password && formik.errors.password
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            fullWidth
                            label="Password"
                            name="password"
                            helperText="Please enter the password for this email."
                            required
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Select Items
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={selectItems}
                              label="Select Items"
                              onChange={handleDurationChange}
                            >
                              {Item.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Grid />
                        </Grid>
                      </Grid>
                      <Card sx={{ mt: 3 }}>
                        <ToggleButton recieveData={recieveData} />
                      </Card>
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
