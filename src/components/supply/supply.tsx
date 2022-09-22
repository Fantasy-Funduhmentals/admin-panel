import { useState, useEffect } from "react";
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
import { getNFTData } from "../../services/tokenService.ts"
import { saveNFT } from "../../store/reducers/nftSlice";
import { RotatingLines } from "react-loader-spinner";
// import { useAppDispatch, useAppSelector } from "../store/hooks";


export const DistributeNft = (props) => {
  const { nft } = useAppSelector((state) => state.nft);
  const { address } = useWeb3();
  const [statusData, setStatusData] = useState(null);
  const [selectNft, setSelectNft] = useState("");
  const [loading, setLoading] = useState(false);
  const [supply, setSupply] = useState(false);
  const dispatch = useAppDispatch();



  const handleDurationChange = (e) => {

    setSelectNft(e.target.value);
  };

  const getTokensListing = async () => {
    setLoading(true);
    try {
      const coinsRes = await getNFTData();
      dispatch(saveNFT(coinsRes.data));
      setLoading(false);
    }
    catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };


  useEffect(() => {
    if (address && selectNft) {
      fetchBalance();
    }

  }, [selectNft, address]);

  useEffect(() => {
    getTokensListing();

  }, [])

  const fetchBalance = async () => {
    if (nft) {
      const nftDistribution = await GetNftBalanceContract();
      const res = await nftDistribution?.methods ?
        .balanceOf(address, selectNft?.index) ?
        .call();
      setSupply(res);
    }

  };

  const handleSubmit = async (values) => {
    if (!selectNft) {
      setStatusData({
        type: "error",
        message: "Please select NFT first",
      });
      return
    }
    if (formik.values.amount < 1) {
      setStatusData({
        type: "error",
        message: "Amount will be greate than or eqaul to 1",
      });
      return
    }
    setLoading(true)
    let amount = values.amount;
    let from = address;
    let to = address;
    let id = selectNft.index
    let data = []
    const nftDistribution = await GetNftBalanceContract();
    const res = await nftDistribution?.methods?.mint(to, id, amount, data)?.send({ from: address });;
    fetchBalance()
    setLoading(false)
  }

  const formik = useFormik({
    initialValues: {
      // email: "",
      amount: "",
    },
    validationSchema: Yup.object({
      // email: Yup.string()
      // .email("Email is invalid")
      // .required("Email is required")
      // .trim(),
      amount: Yup.number().required("Amount is required").positive("Amount will be greater than or equal to 1").integer("Please enter value without decimal").max(33),
    }),
    onSubmit: (values, actions) => {


      handleSubmit(values);
      actions.resetForm()
      // mintBalance()
    },
  });

  // const handleSubmit = async (values, actions) => {};

  return (
    <>
      <form {...props} onSubmit={formik.handleSubmit}>
        <Card>
          {loading ? <RotatingLines
            strokeColor="#5048e5"
            strokeWidth="5"
            animationDuration="0.75"
            width="36"
            visible={true}
          /> : <CardHeader title="Total Supply :" subheader={supply} />}

          <Divider />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
              style={{ width: "100%", columnGap: "6rem" }}
            >
              {/* <TextField
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
            /> */}

              {/* <TextField
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
            /> */}
            </Box>
            <Box
              sx={{ mt: 7 }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: 500 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">NFTS</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectNft?.name}
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
            <Box
              sx={{ mt: 7 }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: 500 }}>
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
              {loading ? <CircularProgress color="inherit" /> : "Update"}
            </Button>
          </Box>
        </Card>

        <StatusModal
          statusData={statusData}
          onClose={() => setStatusData(null)}
        />
      </form>
    </>
  );
};

// if (Number(selectNft?.remainingSupply) < Number(values.amount)) {
//   setStatusData({
//     type: "error",
//     message: "Insufficient balance in contract",
//   });
//   return;
// }
// if (!address) {
//   setStatusData({
//     type: "error",
//     message: "Please active your wallet first",
//   });
//   return;
// }
// try {
//   setStatusData(null);
//   setLoading(true);
//   const params = {
//     balance: String(values.amount),
//   };
//   if (!selectNft) {
//     setStatusData({
//       type: "error",
//       message: "please select nft first",
//     });
//     setLoading(false);
//     return;
//   } else {
//     params.nftToken = String(selectNft._id);
//     params.nftIndex = String(selectNft.index);
//   }
//   const addressRes = await HTTP_CLIENT.get(
//     `wallet/get-user-bnb-wallet/${values.email}`
//   );
//   if (addressRes.data.address) {
//     let from = address;
//     let id = selectNft.index;
//     let amount = values.amount;
//     let to = addressRes.data.address;
//     let data = [];
//     const nftDistribution = await GetNftBalanceContract();
//     const res = await nftDistribution.methods
//       .safeTransferFrom(from, to, id, amount, data)
//       .send({ from: address });
//     if (res) {
//       params.user = String(addressRes.data.userId);
//       const updateBalanceRes = await HTTP_CLIENT.post(
//         "nft-wallet/update-nft-token",
//         params
//       );
//     }
//   }
//   formik.resetForm();
//   setSelectNft("");
//   setStatusData({
//     type: "success",
//     message: "Transaction successfully",
//   });
//   setLoading(false);
// } catch (err) {
//   const error = getNormalizedError(err);
//   setStatusData({
//     type: "error",
//     message: error,
//   });
//   setLoading(false);
// }
