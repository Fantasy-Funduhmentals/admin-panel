import { useEffect, useState } from "react";
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
import { changePassword } from "../../services/userService.ts";
import StatusModal from "../StatusModal";
import { RootState } from "../../store";
import { useWeb3 } from "@3rdweb/hooks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { HTTP_CLIENT } from "../../utils/axiosClient.tsx";
import { getNormalizedError } from "../../utils/helpers";
import { GetNftBalanceContract } from "../../utils/contract/nftBalanceContract";
import { saveNFT } from "../../store/reducers/nftSlice";
import { getNFTData } from "../../services/tokenService";
import { useDispatch } from "react-redux";

export const DistributeNft = (props) => {
  const { nft } = useAppSelector((state) => state.nft);
  const { address } = useWeb3();
  const [statusData, setStatusData] = useState(null);
  const [selectNft, setSelectNft] = useState("");
  const [loading, setLoading] = useState(false);
  const handleDurationChange = (event) => {
    setSelectNft(event.target.value);
  };
  const dispatch = useAppDispatch();
  const getTokensListing = async () => {
    setLoading(true);
    try {
      const coinsRes = await getNFTData();
      dispatch(saveNFT(coinsRes.data));
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
    // if (!nft) {
    getTokensListing();
    // }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      amount: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email is invalid")
        .required("Email is required")
        .trim(),
      amount: Yup.number().required("Amount is required").positive("Amount will be greater than or equal to 1").integer("Please enter value without decimal"),
    }),
    onSubmit: (values, actions) => {

      handleSubmit(values, actions);
    },
  });

  const handleSubmit = async (values, actions) => {
    if (Number(selectNft?.remainingSupply) < Number(values.amount)) {
      setStatusData({
        type: "error",
        message: "Insufficient balance in contract",
      });

      return;
    }
    if (!address) {
      setStatusData({
        type: "error",
        message: "Please connect your wallet first",
      });
      return;
    }
    try {
      setStatusData(null);
      setLoading(true);
      const params = {
        balance: String(values.amount),
      };

      if (!selectNft) {
        setStatusData({
          type: "error",
          message: "please select nft first",
        });
        setLoading(false);
        return;
      } else {
        params.nftToken = String(selectNft._id);
        params.nftIndex = String(selectNft.index);
      }
      const addressRes = await HTTP_CLIENT.get(
        `wallet/get-user-bnb-wallet/${values.email}`
      );

      if (addressRes.data.address) {
        let from = address;
        let id = selectNft.index;
        let amount = values.amount;
        let to = addressRes.data.address;
        let data = [];
        const nftDistribution = await GetNftBalanceContract();
        const res = await nftDistribution.methods
          .safeTransferFrom(from, to, id, amount, data)
          .send({ from: address });

        if (res) {
          params.user = String(addressRes.data.userId);

          const updateBalanceRes = await HTTP_CLIENT.post(
            "nft-wallet/update-nft-token",
            params
          );
        }
      }
      formik.resetForm();
      setSelectNft("");
      setStatusData({
        type: "success",
        message: "Transaction successfully",
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });

    }
  };

  return (
    <form {...props} onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="NFTS" title="NFT details" />
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
              helperText={formik.errors.email}
              name="email"
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(formik.touched.amount && formik.errors.amount)}
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              helperText={formik.errors.amount}
              fullWidth
              label="Amount"
              margin="normal"
              name="amount"
              type="number"
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
                  value={selectNft}
                  label="NFT"
                  onChange={handleDurationChange}
                >
                  {nft.map((item) => (
                    <MenuItem value={item}>{item.name}</MenuItem>
                  ))}
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
            {loading ? <CircularProgress color="inherit" /> : "Send"}
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
