import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { twoFaAuth } from "../../services/userService";
import StatusModal from "../StatusModal";
import { getNormalizedError } from "../../utils/helpers";
import { useAppDispatch } from "../../store/hooks";
import { saveAccessToken, saveUserRole } from "../../store/reducers/userSlice";
import { saveEmailUser } from "../../store/reducers/emailSlice";
import { useRouter } from "next/router";
import axios from "axios";
import defaultConfig from "../../utils/config";

interface Props {
  authToken?: string;
}
const OTP = (prop: Props) => {
  const { authToken } = prop;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().max(255).required("OTP is required"),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    var config: any = {
      method: "post",
      url: `${defaultConfig?.Base_URL}2fa/authenticate`,
      data: {
        twoFaCode: values.otp,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    try {
      const res = await axios(config);
      dispatch(saveUserRole(res?.data?.user));
      dispatch(saveAccessToken(res?.data?.accessToken));
      dispatch(saveEmailUser(res?.data?.user?.email));
      setStatusData({
        type: "success",
        message: res?.data?.message,
      });
      if (res?.data?.user?.role == "admin") {
        router.push("/dashboard");
      } else if (res?.data?.user?.role == "sub admin") {
        router.push(`/${res?.data?.user?.adminPermissions[0]}`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = getNormalizedError(error);
      setStatusData({
        type: "error",
        message: err,
      });
    }
  };
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Typography color="textPrimary" variant="h4">
          OTP
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="body2">
          Add OTP to Sign in on the internal platform
        </Typography>
        <TextField
          error={Boolean(formik.touched.otp && formik.errors.otp)}
          fullWidth
          helperText={formik.touched.otp && formik.errors.otp}
          label="OTP"
          margin="normal"
          name="otp"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.otp}
          variant="outlined"
          color="success"
        />
        <Typography color="textPrimary" variant="h6">
          Testing 2fa: ABC123
        </Typography>
        <Box sx={{ py: 2, width: "100%" }}>
          <Button
            color="primary"
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {loading ? <CircularProgress /> : "Sign in"}
          </Button>
        </Box>
      </form>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

export default OTP;
