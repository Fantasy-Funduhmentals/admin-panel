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

export const DistributeNft = (props) => {
  const { nft } = useAppSelector((state) => state.nft);
  const { address } = useWeb3();
  const [statusData, setStatusData] = useState(null);
  const [selectNft, setSelectNft] = useState(nft[0]);
  const [loading, setLoading] = useState(false);
  const [supply, setSupply] = useState(false);
  const handleDurationChange = (e) => {
    console.log("selectNft%%%%%", e.target.value);

    setSelectNft(e.target.value);
  };


  console.log("nft%%%%", nft[0]);
  console.log("selectNft%%%%", selectNft);
  

  useEffect(() => {
    if(address){
      fetchBalance();
    }
  }, [selectNft,address]);

  useEffect(() => {
    setSelectNft(nft[0])

  },[])

  const fetchBalance = async () => {  
    const nftDistribution = await GetNftBalanceContract();
    const res = await nftDistribution?.methods?
      .balanceOf(address, selectNft?.index)?
      .call();
    setSupply(res);
    // console.log("nftDistribution:::", res);
  };

  const handleSubmit = async (values) => {
    setLoading(true)
    let amount = values.amount;
    let from = address;
    let to = address;
    let id = selectNft.index
    let data = []
    console.log("amount:::", amount);
    console.log("from:::", from);
    console.log("to:::", to);
    console.log("data:::", data);

    const nftDistribution = await GetNftBalanceContract();
    const res = await nftDistribution.methods.mint(to,id,amount, data).send({ from: address });;
    console.log("nftDistribution:::", res);
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
      amount: Yup.string().required("Amount is required").max(33).trim(),
    }),
    onSubmit: (values, actions) => {

      
      handleSubmit(values);
      // mintBalance()
    },
  });

  // const handleSubmit = async (values, actions) => {};

  return (
    <>
      <form {...props} onSubmit={formik.handleSubmit}>
        <Card>
          {loading ? <CircularProgress/>  : <CardHeader title="Total Supply :" subheader= {supply}  /> }
          
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
                    value={selectNft}
                    label="NFT"
                    onChange={(e) => handleDurationChange(e)}
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
//       console.log("updateBalanceRes{{{{{{{", updateBalanceRes);
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
