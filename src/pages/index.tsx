import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import Head from "next/head";
import { useState } from "react";
import * as Yup from "yup";
import StatusModal from "../components/StatusModal";
import OTP from "../components/twoFa/otp";
import { handleUserLogin } from "../services/userService";
import { getNormalizedError } from "../utils/helpers";

const Login = () => {
  const [twoFa, setTwoFa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [authToken, setyAuthToken] = useState<any>(null);

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setLoading(true);
      const loginRes: any = await handleUserLogin(values);
      setyAuthToken(loginRes?.data?.accessToken);
      var config: any = {
        method: "post",
        url: "http://159.223.80.12:5001/2fa/generate",
        headers: {
          Authorization: `Bearer ${loginRes?.data?.accessToken}`,
        },
      };

      if (loginRes?.data?.isBlocked == true) {
        setStatusData({
          type: "error",
          message: `Sub Admin Blocked ${loginRes?.data?.user?.blockReason}`,
        });
        setLoading(false);
        return;
      } else {
        setLoading(false);
        setTwoFa(true);
        const response = await axios(config);
        setStatusData({
          type: "success",
          message: response?.data?.message,
        });
      }
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
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

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
                type="password"
                value={formik.values.password}
                variant="outlined"
                color="success"
              />
              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  // disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {loading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    "Generate 2fa"
                  )}
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
