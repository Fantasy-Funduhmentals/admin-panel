import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { changePassword } from "../../services/userService";
import StatusModal from "../StatusModal";
import { getNormalizedError } from "../../utils/helpers";

export const SettingsPassword = (props) => {
  const [statusData, setStatusData] = useState(null);
  const [duration, setDuration] = useState("month");

  const [loading, setLoading] = useState(false);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      amount: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required().min(8).max(33).trim(),
      amount: Yup.string().required().min(8).max(33).trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);

      setLoading(true);
      const params = {
        email: values.email,
        newPassword: values.amount,
      };

      await changePassword(params);

      formik.resetForm();

      setStatusData({
        type: "success",
        message: "Password has been changed successfully",
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

  return (
    <form {...props} onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="NFTS" title="NFT detail" />
        <Divider />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
            style={{ width: "100%", columnGap: "6rem" }}
          >
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(formik.touched.amount && formik.errors.amount)}
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Amount"
              margin="normal"
              name="amount"
              type="text"
              variant="outlined"
            />
          </Box>
          <Box
            sx={{ mt: 7 }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Box sx={{ width: 500 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">NFTS</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  label="Duration"
                  onChange={handleDurationChange}
                >
                  <MenuItem value={"month"}>1 Month</MenuItem>
                  <MenuItem value={"threeMonths"}>3 Months</MenuItem>
                  <MenuItem value={"yearly"}>1 Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" type="submit">
            {loading ? <CircularProgress /> : "Update"}
          </Button>
        </Box>
      </Card>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </form>
  );
};
