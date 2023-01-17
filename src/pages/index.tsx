import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import axios from "axios";
import { useFormik } from "formik";
import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";
import StatusModal from "../components/StatusModal";
import OTP from "../components/PrivacyPolicy/otp";
import { handleUserLogin } from "../services/userService";
import defaultConfig from "../utils/config";
import { getNormalizedError } from "../utils/helpers";

const Login = () => {
  const [twoFa, setTwoFa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [authToken, setyAuthToken] = useState<any>(null);
  const [passwordToogle, setPasswordtoogle] = useState<boolean>(false);

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setLoading(true);
      const loginRes: any = await handleUserLogin(values);
      setyAuthToken(loginRes?.data?.accessToken);
      var config: any = {
        method: "post",
        url: `${defaultConfig?.Base_URL}2fa/generate`,
        headers: {
          Authorization: `Bearer ${loginRes?.data?.accessToken}`,
        },
      };
      const response = await axios(config);
      setStatusData({
        type: "success",
        message: response?.data?.message,
      });
      setTwoFa(true);

      if (loginRes?.data?.isBlocked == true) {
        setStatusData({
          type: "error",
          message: `Sub Admin Blocked ${loginRes?.data?.user?.blockReason}`,
        });
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err) {
      setTwoFa(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string()
        .required("Enter new password")
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
  const handleShowpassword = () => {
    setPasswordtoogle(!passwordToogle);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Head>
        <title>Login </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          {twoFa ? (
            <OTP authToken={authToken} />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ my: 3 }}>
                <Typography color="textPrimary" variant="h4">
                  Sign in
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Sign in on the internal platform
                </Typography>
              </Box>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email Address"
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                variant="outlined"
                color="success"
              />
              <TextField
                error={Boolean(
                  formik.touched.password && formik.errors.password
                )}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                margin="normal"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type={passwordToogle ? "text" : "password"}
                value={formik.values.password}
                variant="outlined"
                color="success"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: "pointer" }}>
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
              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  disabled={loading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {loading ? <CircularProgress /> : "Generate 2fa"}
                </Button>
              </Box>
            </form>
          )}
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

export default Login;
