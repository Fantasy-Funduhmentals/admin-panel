import * as yup from "yup";

export const userLoginSchema = yup.object().shape({
  username: yup.string().required("Username field is required"),
  password: yup.string().required("Password field is required"),
});

export const assetDetailsSchema = yup.object().shape({
  description: yup.string().required("Field is required"),
  coingeckoId: yup.string().required("Field is required"),
  fee: yup.string().required("Field is required"),
  address: yup.string().required("Field is required"),
  orderIndex: yup
    .number()
    .typeError("Must be a number")
    .min(1)
    .positive()
    .integer(),
  coinColor: yup.string().required("Field is required"),
  isFixed: yup.boolean(),
  fixedRate: yup.string().when("isFixed", {
    is: true,
    then: yup.string().required("Field is required"),
  }),
  decimal: yup
    .number()
    .typeError("Must be a number")
    .min(1)
    .positive()
    .integer(),
  contractAddress: yup.string().nullable(true),
  contractAbi: yup.string().nullable(true),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Old Password field is required"),
  password: yup
    .string()
    .min(8, "Min Password Length is 8")
    .required("Password field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password don't match!")
    .required("Confirm password field is required"),
});

export const changeAPFeeSchema = yup.object().shape({
  apFee: yup
    .string()
    .required("Algorithmic Protection Fee is required")
    .matches(/^-?\d*\.?\d*$/, "Algorithmic Protection Fee must be a number"),
});

export const addNewTokenSchema = yup.object().shape({
  name: yup.string().required("Name field is required"),
  coinSymbol: yup.string().required("Coin Symbol field is required"),
  description: yup.string().required("Description field is required"),
  feeReceivingAccount: yup
    .string()
    .required("Fee Receiving Account field is required"),
  processingFee: yup
    .number()
    .typeError("Must be a number")
    .required("Processing Fee field is required"),
  masterWallet: yup.string().required("Master Wallet field is required"),
  coingeckoId: yup.string().required("CoinGecko Id field is required"),
  contractAddress: yup.string().required("Contract Address field is required"),
  contractAbi: yup.string().required("Contract Abi field is required"),
  isFixedRate: yup.boolean(),
  decimal: yup
    .number()
    .typeError("Must be a number")
    .min(1)
    .positive()
    .integer(),
  fixedRate: yup
    .number()
    .typeError("Must be a number")
    .when("isFixedRate", {
      is: true,
      then: yup
        .number()
        .typeError("Must be a number")
        .required("Field is required"),
    }),
  orderIndex: yup
    .number()
    .typeError("Must be a number")
    .min(1)
    .positive()
    .integer()
    .required("Coin order index is required"),
});
export const careersSchema = yup.object().shape({
  title: yup.string().required("Title field is required"),
  desc: yup.string().required("Description field is required"),
  experience: yup.string().required("Experience field is required"),
  salary: yup.string().required("Salary field is required"),
  qualification: yup.string().required("Qualification field is required"),
  skills: yup.array().min(1),
  country: yup.string().required("Country field is required"),
  city: yup.string().required("City field is incorrect"),
  positions: yup
    .number()
    .typeError("Must be a number")
    .min(1)
    .positive()
    .integer(),
});

export const newsSchema = yup.object().shape({
  title: yup.string().required("Title field is required"),
  featuredImage: yup.object().shape({
    url: yup.string().required("Image field is required"),
  }),
  shortDesc: yup.string().required("Description field is required"),
  tags: yup.string().required("Field is required"),
  // paragraphBol: "",
  paragraphHtml: yup.string().required("Field is required"),
});
export const DAppSchema = yup.object().shape({
  title: yup.string().required("Title field is required"),
  featuredImage: yup.object().shape({
    url: yup.string().required("Image field is required"),
  }),
  shortDescription: yup.string().required("Description field is required"),
  url: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .required("URL field is required"),
});
export const UserSchema = yup.object().shape({
  firstName: yup.string().required("Name field is required"),
  lastName: yup.string().required("Name field is required"),
  email: yup
    .string()
    .required("Email field is required")
    .email("Email format is invalid"),
  password: yup
    .string()
    .min(8, "Min Password Length is 8")
    .required("Password field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password don't match!")
    .required("Confirm password field is required"),
});
