import {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  UPDATE_ASSET_REQUEST,
  UPDATE_ASSET_SUCCESS,
  UPDATE_ASSET_FAILURE,
  SET_ADMIN_PANEL_DATA,
  DEPOSIT_ADDRESSES_FAILURE,
  DEPOSIT_ADDRESSES_SUCCESS,
  DEPOSIT_ADDRESSES_REQUEST,
  ADD_NEW_TOKEN_REQUEST,
  ADD_NEW_TOKEN_SUCCESS,
  ADD_NEW_TOKEN_FAILURE,
  ADD_NEW_TOKEN_RESET,
  CHANGE_APFEE_REQUEST,
  CHANGE_APFEE_SUCCESS,
  CHANGE_APFEE_FAILURE,
  CHANGE_APFEE,
  SET_MERCHANT_SETTINGS,
} from "../actions/actionTypes";

const initialState = {
  totalAddresses: 0,
  coins: [],
  merchantSettings: {
    apFee: 0,
  },
  dailyChartData: [],
  depositAddresses: [],
  isChangingPassword: false,
  changePasswordError: false,
  passwordChanged: false,
  isChangingAPFee: false,
  changeAPFeeError: false,
  aPFeeChanged: false,
  isUpdatingAssetDetail: false,
  updateAssetDetailError: false,
  assetDetailUpdated: false,
  depositAddressesRequest: false,
  depositAddressesSuccess: false,
  depositAddressesFailure: false,
  addNewTokenRequest: false,
  addNewTokenSuccess: false,
  addNewTokenFailure: false,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN_PANEL_DATA:
      return {
        ...state,
        totalAddresses: action.payload.totalAddresses,
        dailyChartData: action.payload.dailyChartData,
        coins: action.payload.coins,
      };
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        isChangingPassword: true,
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isChangingPassword: false,
        passwordChanged: action.payload.passwordChanged,
      };
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isChangingPassword: false,
        passwordChanged: false,
        changePasswordError: action.payload.changePasswordError,
      };
    case UPDATE_ASSET_REQUEST:
      return {
        ...state,
        isUpdatingAssetDetail: true,
      };
    case UPDATE_ASSET_SUCCESS:
      return {
        ...state,
        isUpdatingAssetDetail: false,
        assetDetailUpdated: action.payload.assetDetailUpdated,
      };
    case UPDATE_ASSET_FAILURE:
      return {
        ...state,
        isUpdatingAssetDetail: false,
        assetDetailUpdated: false,
        updateAssetDetailError: action.payload.updateAssetDetailError,
      };
    case DEPOSIT_ADDRESSES_REQUEST:
      return {
        ...state,
        depositAddressesRequest: true,
      };
    case DEPOSIT_ADDRESSES_SUCCESS:
      return {
        ...state,
        depositAddressesRequest: false,
        depositAddressesSuccess: true,
        depositAddresses: action.payload.depositAddresses,
      };
    case DEPOSIT_ADDRESSES_FAILURE:
      return {
        ...state,
        depositAddressesRequest: false,
        depositAddressesSuccess: false,
        depositAddressesFailure: true,
      };
    case ADD_NEW_TOKEN_REQUEST:
      return {
        ...state,
        addNewTokenRequest: true,
      };
    case ADD_NEW_TOKEN_SUCCESS:
      return {
        ...state,
        addNewTokenRequest: false,
        addNewTokenSuccess: action.payload.addNewTokenSuccess,
      };
    case ADD_NEW_TOKEN_FAILURE:
      return {
        ...state,
        addNewTokenRequest: false,
        addNewTokenSuccess: false,
        addNewTokenFailure: action.payload.addNewTokenFailure,
      };
    case ADD_NEW_TOKEN_RESET:
      return {
        ...state,
        addNewTokenRequest: false,
        addNewTokenSuccess: false,
        addNewTokenFailure: false,
      };
    case CHANGE_APFEE_REQUEST:
      return {
        ...state,
        isChangingAPFee: true,
      };
    case CHANGE_APFEE_SUCCESS:
      return {
        ...state,
        isChangingAPFee: false,
        aPFeeChanged: action.payload.aPFeeChanged,
      };
    case CHANGE_APFEE_FAILURE:
      return {
        ...state,
        isChangingAPFee: false,
        aPFeeChanged: false,
        changeAPFeeError: action.payload.changeAPFeeError,
      };
    case CHANGE_APFEE:
      console.log("----SET_APPFEE--CALLED--", action.payload);
      return {
        ...state,
        merchantSettings: {
          ...state.merchantSettings,
          apFee: action.payload.appFee,
        },
      };
    case SET_MERCHANT_SETTINGS:
      return {
        ...state,
        merchantSettings: action.payload.merchantSettings,
      };
    default:
      return state;
  }
};

export default walletReducer;
