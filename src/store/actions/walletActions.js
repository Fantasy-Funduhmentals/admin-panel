import axios from "axios";
import moment from "moment";

import {
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  SET_ADMIN_PANEL_DATA,
  UPDATE_ASSET_FAILURE,
  UPDATE_ASSET_REQUEST,
  UPDATE_ASSET_SUCCESS,
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
  SET_MERCHANT_SETTINGS,
  CHANGE_APFEE,
} from "./actionTypes";
import { v4 as uuidv4 } from "uuid";
import panelConfig from "../../panel.config";

const API_URL = panelConfig.API_URL;

export const getMerchantSettings = async (jwt) => {
  try {
    const res = await axios({
      method: "get",
      url: `${API_URL}/admin/merchant-settings`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error getting Settings", error);
    throw error;
  }
};

export const renderAdminPanelData = () => async (dispatch) => {
  try {
    const jwt = await localStorage.getItem("accessToken");

    const merchantSettingsRes = await getMerchantSettings(jwt);
    // //Parse Merchant Settings Response
    const merchantSettings = {
      apFee: merchantSettingsRes.apFee,
    };
    // //Dispatch Merchant Settings
    dispatch({
      type: SET_MERCHANT_SETTINGS,
      payload: {
        merchantSettings,
      },
    });

    const totalAddresses = await axios({
      method: "get",
      url: `${API_URL}/admin/wallet/totalCount`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const currentDate = await moment().format("YYYY-MM-DD");
    const startDate = await moment().subtract(7, "days").format("YYYY-MM-DD");
    const dailyChartData = await axios({
      method: "get",
      url: `${API_URL}/admin/wallet/dailyWalletGenerated?from=${startDate}&to=${currentDate}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const sortedDailyChartData = await dailyChartData?.data?.sort((b, c) =>
      new Date(b?._id)?.valueOf() > new Date(c?._id)?.valueOf() ? 1 : -1
    );

    const coinsList = await axios({
      method: "get",
      url: `${API_URL}/coin-rates/list/coins`,
    });

    const coins = await coinsList.data
      .filter((coin) => {
        return coin.coinSymbol !== "bcy";
      })
      .map((coin) => {
        return {
          key: coin._id,
          coin: coin.name,
          description: coin.description,
          symbol: coin.coinSymbol,
          orderIndex: coin.orderIndex,
          status: coin.isActive,
          isFixedRate: coin.isFixedRate,
          fixedRate: coin.fixedRate,
          processingFee: coin.processingFee,
          feeReceivingAccount: coin.feeReceivingAccount,
          masterWallet: coin.masterWallet,
          icon: coin.icon,
          coinColor: coin.coinColor,
          decimal: coin.decimal,
          contractAddress: coin.contractAddress,
          contractAbi: coin.contractAbi,
          isErc20: coin.isErc20,
          coingeckoId: coin.coingeckoId,
          isBep20: coin.isBep20,
        };
      });

    console.log("--sortedDailyChartData--", sortedDailyChartData);

    dispatch({
      type: SET_ADMIN_PANEL_DATA,
      payload: {
        totalAddresses: totalAddresses.data,
        dailyChartData: sortedDailyChartData,
        coins: coins,
      },
    });
  } catch (error) {
    console.log("******************>", error);
    throw error;
  }
};

export const changePassword = (oldPassword, newPassword) => async (
  dispatch
) => {
  console.log(oldPassword, newPassword);

  const jwt = await localStorage.getItem("accessToken");

  console.log("---jwt-----", jwt);

  await dispatch({
    type: CHANGE_PASSWORD_REQUEST,
  });
  axios({
    method: "post",
    url: `${API_URL}/admin/auth/change-password`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      newPassword,
      oldPassword,
    },
  })
    .then(() => {
      console.log("Password changes successfully!");
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: {
          passwordChanged: true,
        },
      });
      setTimeout(() => {
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          payload: {
            passwordChanged: false,
          },
        });
      }, 3000);
    })
    .catch(() => {
      dispatch({
        type: CHANGE_PASSWORD_FAILURE,
        payload: {
          changePasswordError: true,
        },
      });
      setTimeout(() => {
        dispatch({
          type: CHANGE_PASSWORD_FAILURE,
          payload: {
            changePasswordError: false,
          },
        });
      }, 3000);
    });
};

export const changeAPFee = (APFee) => async (dispatch) => {
  const jwt = await localStorage.getItem("accessToken");

  console.log("---jwt-----", jwt);

  await dispatch({
    type: CHANGE_APFEE_REQUEST,
  });
  axios({
    method: "post",
    url: `${API_URL}/admin/merchant-settings/updateAPFee`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      APFee,
    },
  })
    .then((res) => {
      console.log("Fee Update Successfully!", res.data);
      dispatch({
        type: CHANGE_APFEE_SUCCESS,
        payload: {
          aPFeeChanged: true,
        },
      });
      dispatch({
        type: CHANGE_APFEE,
        payload: {
          appFee: APFee,
        },
      });
      setTimeout(() => {
        dispatch({
          type: CHANGE_APFEE_SUCCESS,
          payload: {
            aPFeeChanged: false,
          },
        });
      }, 3000);
    })
    .catch((err) => {
      console.log("APFEE updating ERROR", err);
      dispatch({
        type: CHANGE_APFEE_FAILURE,
        payload: {
          changeAPFeeError: true,
        },
      });
      setTimeout(() => {
        dispatch({
          type: CHANGE_APFEE_FAILURE,
          payload: {
            changeAPFeeError: false,
          },
        });
      }, 3000);
    });
};

export const updateAssetDetail = (updatePayload) => async (dispatch) => {
  console.log("updatePayload in walletActions.js", updatePayload);
  const jwt = await localStorage.getItem("accessToken");
  await dispatch({
    type: UPDATE_ASSET_REQUEST,
  });
  // debugger;
  axios({
    method: "patch",
    url: `${API_URL}/admin/coin`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: updatePayload,
  })
    .then(() => {
      console.log("Assets details updated successfully!");
      renderAdminPanelData();
      dispatch({
        type: UPDATE_ASSET_SUCCESS,
        payload: {
          assetDetailUpdated: true,
        },
      });
      setTimeout(() => {
        dispatch({
          type: UPDATE_ASSET_SUCCESS,
          payload: {
            assetDetailUpdated: false,
          },
        });
      }, 3000);
    })
    .catch(() => {
      console.log("Updating assets details failed!");
      dispatch({
        type: UPDATE_ASSET_FAILURE,
        payload: {
          updateAssetDetailError: true,
        },
      });
      setTimeout(() => {
        dispatch({
          type: UPDATE_ASSET_FAILURE,
          payload: {
            updateAssetDetailError: false,
          },
        });
      }, 3000);
    });
};

export const renderDepositAddresses = () => async (dispatch) => {
  try {
    dispatch({
      type: DEPOSIT_ADDRESSES_REQUEST,
    });
    const jwt = await localStorage.getItem("accessToken");
    const coinsList = await axios({
      method: "get",
      url: `${API_URL}/coin-rates/list/coins`,
    });
    const coins = await coinsList.data
      .filter((coin) => {
        return coin.coinSymbol !== "bcy";
      })
      .map((coin) => {
        return {
          key: coin._id,
          coin: coin.name,
          description: coin.description,
          symbol: coin.coinSymbol,
          status: coin.isActive,
          isFixedRate: coin.isFixedRate,
          fixedRate: coin.fixedRate,
          processingFee: coin.processingFee,
          feeReceivingAccount: coin.feeReceivingAccount,
          masterWallet: coin.masterWallet,
        };
      });
    const allDepositAddressesResponse = [];
    for (const coin of coins) {
      const response = await axios({
        method: "get",
        url: `${API_URL}/admin/wallet?coinSymbol=${coin.symbol}`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      allDepositAddressesResponse.push(response.data);
    }
    const sortedAddressArray = allDepositAddressesResponse.map(
      (singleCoinAddresses) => {
        return singleCoinAddresses.map((singleAddress) => {
          if (singleAddress.isERC20 || singleAddress.coinSymbol === "eth") {
            return {
              key: uuidv4(),
              address: singleAddress.address,
              balance:
                singleAddress.balance == "undefined"
                  ? 0
                  : singleAddress.balance,
              symbol: singleAddress.coinSymbol,
              network: "Ethereum",
            };
          } else {
            return {
              key: uuidv4(),
              address: singleAddress.address,
              balance:
                singleAddress.balance == "undefined"
                  ? 0
                  : singleAddress.balance,
              symbol: singleAddress.coinSymbol,
              network: "Bitcoin",
            };
          }
        });
      }
    );

    const simplifyDepositAddressesArray = (arr = []) => {
      const res = [];
      arr?.forEach((element) => {
        element?.forEach((el) => {
          res.push(el);
        });
      });
      return res;
    };

    const depositAddresses = await simplifyDepositAddressesArray(
      sortedAddressArray
    );
    dispatch({
      type: DEPOSIT_ADDRESSES_SUCCESS,
      payload: {
        depositAddresses: depositAddresses,
      },
    });
  } catch (error) {
    console.log("******************>", error);
    dispatch({
      type: DEPOSIT_ADDRESSES_FAILURE,
    });
    throw error;
  }
};

export const addNewToken = (newTokenPayload) => async (dispatch) => {
  //debugger;
  console.log("=============>", newTokenPayload);
  const jwt = await localStorage.getItem("accessToken");
  await dispatch({
    type: ADD_NEW_TOKEN_REQUEST,
  });
  axios({
    method: "post",
    url: `${API_URL}/admin/coin`,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      ...newTokenPayload,
    },
  })
    .then(() => {
      console.log("New token added successfully!");
      dispatch({
        type: ADD_NEW_TOKEN_SUCCESS,
        payload: {
          addNewTokenSuccess: true,
        },
      });
    })
    .catch(() => {
      console.log("Add new token failed!");
      dispatch({
        type: ADD_NEW_TOKEN_FAILURE,
        payload: {
          addNewTokenFailure: true,
        },
      });
    });
};

export const resetAddNewToken = () => (dispatch) => {
  dispatch({
    type: ADD_NEW_TOKEN_RESET,
  });
};
