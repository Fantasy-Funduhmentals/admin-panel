import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { directWireAccountDetails } from "../../services/userService";
import { RootState } from "../../store";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../StatusModal";
import { getSwapRate } from "../../services/userService";

const WireAccountDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  console.log(
    "🚀 ~ file: directWireAccountDetails.tsx ~ line 25 ~ WireAccountDetails ~ bankDetails",
    bankDetails
  );

  const getSettings = async () => {
    const response = await getSwapRate();
    setBankDetails(response?.data?.directWireAccount);
  };

  const formik = useFormik({
    initialValues: {
      fullname: bankDetails?.name ? bankDetails.name : "",
      physicaladdress: bankDetails?.address ? bankDetails?.address : "",
      bankname: bankDetails?.bankName ? bankDetails?.bankName : "",
      bankaddress: bankDetails?.bankAddress ? bankDetails?.bankAddress : "",
      accountnumber: bankDetails?.accountNo ? bankDetails?.accountNo : "",
      accounttype: bankDetails?.accounttype ? bankDetails?.accounttype : "",
      bankrouting: bankDetails?.routingNo ? bankDetails?.routingNo : "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required().min(1).max(33).label("fullname"),
      physicaladdress: Yup.string()
        .required()
        .min(1)
        .max(33)
        .label("physicaladdress"),
      bankname: Yup.string().required().min(1).max(33).label("bankname"),
      bankaddress: Yup.string().required().min(1).max(33).label("bankaddress"),
      accountnumber: Yup.string()
        .required()
        .min(1)
        .max(33)
        .label("accountnumber"),
      accounttype: Yup.string()
        .required()
        .min(1)
        .max(33)
        .label("accountnumber"),
      bankrouting: Yup.string().required().min(1).max(33).label("bankrouting"),
    }),
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
      console.log(values, "values");
    },
  });

  const handleSubmit = async (values, actions) => {
    try {
      setStatusData(null);

      setLoading(true);
      const params = {
        name: values.fullname,
        address: values.physicaladdress,
        bankName: values.bankname,
        bankAddress: values.bankaddress,
        accountNo: String(values.accountnumber),
        accounttype: values.accounttype,
        routingNo: String(values.bankrouting),
      };
      await directWireAccountDetails(params);
      formik.resetForm();
      setStatusData({
        type: "success",
        message: "Account details has been submitted successfully",
      });
      getSettings();

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

  useEffect(() => {
    getSettings();
  }, []);

  console.log(formik.values);

  return (
    <>
      <form onSubmit={formik.handleSubmit} {...props}>
        <Card>
          <CardHeader title="Direct Wire Account Details" />
          <Divider />
          <CardContent>
            <TextField
              error={Boolean(formik.touched.fullname && formik.errors.fullname)}
              value={formik.values.fullname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Full Name"
              margin="normal"
              name="fullname"
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(
                formik.touched.physicaladdress && formik.errors.physicaladdress
              )}
              value={formik.values.physicaladdress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Physical Address"
              margin="normal"
              name="physicaladdress"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.bankname && formik.errors.bankname)}
              value={formik.values.bankname}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Name"
              margin="normal"
              name="bankname"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.bankaddress && formik.errors.bankaddress
              )}
              value={formik.values.bankaddress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Address"
              margin="normal"
              name="bankaddress"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.accountnumber && formik.errors.accountnumber
              )}
              value={formik.values.accountnumber}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Account Number "
              margin="normal"
              name="accountnumber"
              type="string"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.accounttype && formik.errors.accounttype
              )}
              value={formik.values.accounttype}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Account type (e.g., checking, savings, etc.)"
              margin="normal"
              name="accounttype"
              type="text"
              variant="outlined"
            />
            <TextField
              error={Boolean(
                formik.touched.bankrouting && formik.errors.bankrouting
              )}
              value={formik.values.bankrouting}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              fullWidth
              label="Bank Routing Number"
              margin="normal"
              name="bankrouting"
              type="number"
              variant="outlined"
            />
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            {" "}
            {!loading ? (
              <Button color="primary" variant="contained" type="submit">
                Update
              </Button>
            ) : (
              <CircularProgress disableShrink />
            )}
          </Box>
        </Card>
      </form>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};

export default WireAccountDetails;
