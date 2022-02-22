import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message, Result, Steps, Tooltip, Upload } from "antd";
import { useFormik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import panelConfig from "../../panel.config";
import {
  addNewToken,
  resetAddNewToken,
} from "../../store/actions/walletActions";
import { addNewTokenSchema } from "../../validations/validations";
import styles from "./NewToken.module.scss";

const { Step } = Steps;
const { Dragger } = Upload;

const API_URL = panelConfig.API_URL;
const NewToken = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const addNewTokenSuccess = useSelector(
    (state) => state.wallet.addNewTokenSuccess
  );
  const addNewTokenFailure = useSelector(
    (state) => state.wallet.addNewTokenFailure
  );

  const [current, setCurrent] = useState(0);
  const [iconObject, setIconObject] = useState({
    key: "",
    url: "",
  });

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Upload Coin Icon",
    },
    {
      title: "Basic Info",
    },
    {
      title: "Network Info",
    },
    {
      title: "Contract Info",
    },
  ];
  const props = {
    name: "file",
    maxCount: 1,
    listType: "picture",
    multiple: true,
    action: `${API_URL}/admin/coin/upload-image`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    beforeUpload: (file) => {
      if (file.type !== "image/svg+xml") {
        message.error(`${file.name} is not a svg file`);
      }
      return file.type === "image/svg+xml" ? true : Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setIconObject({
          ...iconObject,
          ...info.file.response,
        });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const resetAddNewTokenHandler = async () => {
    await dispatch(resetAddNewToken());
    await history.push("/coin-management");
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      coinSymbol: "",
      coinColor: "#FFFFFF",
      description: "",
      feeReceivingAccount: "",
      processingFee: "",
      masterWallet: "",
      coingeckoId: "",
      contractAddress: "",
      contractAbi: "",
      isActive: false,
      isErc20: true,
      isBep20: false,
      isFixedRate: false,
      fixedRate: 0,
      decimal: 1,
      orderIndex: "",
      cointype: "",
    },
    validationSchema: addNewTokenSchema,
    onSubmit: (values, onSubmitProps) => {
      if (values.cointype == "isErc20") {
        values.isErc20 = true;
        values.isBep20 = false;
      } else {
        values.isErc20 = false;
        values.isBep20 = true;
      }
      console.log("values", values);
      try {
        dispatch(
          addNewToken({
            ...values,
            blockchain: "ethereum",
            fixedRate: Number(values.fixedRate),
            decimal: 1,
            icon: iconObject,
            fixedRateHistory: [
              {
                price: Number(values.fixedRate),
                timestamp: moment().valueOf(),
              },
            ],
            coinSymbol: values.coinSymbol.toLowerCase(),
            contractAbi: JSON.parse(values.contractAbi),
            orderIndex: Number(values.orderIndex),
          })
        );
      } catch (error) {
        console.log("error", error);
      }

      // debugger;
      onSubmitProps.resetForm();
    },
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Add New Token</div>
      <div className={styles.divider} />
      {!addNewTokenSuccess && !addNewTokenFailure ? (
        <>
          <div className={styles.multiStep}>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
          <form onSubmit={formik.handleSubmit}>
            {current === 0 && (
              <div className={styles.uploadDiv}>
                <Dragger
                  {...props}
                  style={{
                    padding: "20px 80px",
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag coin icon to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    [ IMPORTANT ] Only upload coin icons which are similar in
                    design and dimension to the previously used icons. The icon
                    uploaded should be in svg format and 30 x 30 (px) in
                    dimension.
                  </p>
                </Dragger>
              </div>
            )}
            {current === 1 && (
              <>
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Name</label>
                    {/*<span>*/}
                    {/*  <Tooltip*/}
                    {/*    placement="top"*/}
                    {/*    title={`Some tooltip text here...`}*/}
                    {/*  >*/}
                    {/*    <InfoCircleOutlined className={styles.tooltip} />*/}
                    {/*  </Tooltip>*/}
                    {/*</span>*/}
                  </div>
                  <input type="text" {...formik.getFieldProps("name")} />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className={styles.error}>{formik.errors.name}</div>
                ) : null}
                <div className={styles.inputDiv}>
                  <label htmlFor="kycStatus">Coin Type</label>
                  <select {...formik.getFieldProps("cointype")}>
                    <option value="isErc20" label="isErc20" />
                    <option value="isBep20" label="isBep20" />
                  </select>
                </div>
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Token Symbol</label>
                  </div>
                  <input type="text" {...formik.getFieldProps("coinSymbol")} />
                </div>
                {formik.touched.coinSymbol && formik.errors.coinSymbol ? (
                  <div className={styles.error}>{formik.errors.coinSymbol}</div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Coin Order Index</label>
                    <span>
                      <Tooltip
                        placement="top"
                        title={`The value of this field will be the order of asset in the wallet.`}
                      >
                        <InfoCircleOutlined className={styles.tooltip} />
                      </Tooltip>
                    </span>
                  </div>
                  <input type="text" {...formik.getFieldProps("orderIndex")} />
                </div>
                {formik.touched.orderIndex && formik.errors.orderIndex ? (
                  <div className={styles.error}>{formik.errors.orderIndex}</div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>CoinGecko Id</label>
                  </div>
                  <input type="text" {...formik.getFieldProps("coingeckoId")} />
                </div>
                {formik.touched.coingeckoId && formik.errors.coingeckoId ? (
                  <div className={styles.error}>
                    {formik.errors.coingeckoId}
                  </div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Token Default Color</label>
                    <span>
                      <Tooltip
                        placement="top"
                        title={`Color will be used to display graph and stats in the HOGI Wallet. If not set default color for the token will be white (#FFFFFF). Only enter HEX value of a color.`}
                      >
                        <InfoCircleOutlined className={styles.tooltip} />
                      </Tooltip>
                    </span>
                  </div>
                  <input type="text" {...formik.getFieldProps("coinColor")} />
                </div>
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Token Description</label>
                  </div>
                  <textarea {...formik.getFieldProps("description")} />
                </div>
                {formik.touched.description && formik.errors.description ? (
                  <div className={styles.error}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </>
            )}
            {current === 2 && (
              <>
                <div className={styles.inputDiv}>
                  <label
                    htmlFor="active"
                    style={{
                      marginBottom: "5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Asset Active Status
                  </label>
                  <label className={styles.switch}>
                    <input
                      checked={formik.values.isActive}
                      type="checkbox"
                      {...formik.getFieldProps("isActive")}
                    />
                    <span className={`${styles.round} ${styles.slider}`} />
                  </label>
                </div>
                <div className={styles.inputDiv}>
                  <label
                    style={{
                      marginBottom: "5px",
                      textTransform: "uppercase",
                    }}
                    htmlFor="isFixed"
                  >
                    Is Token Fixed Rate?
                  </label>
                  <label className={styles.switch}>
                    <input
                      checked={formik.values.isFixedRate}
                      type="checkbox"
                      {...formik.getFieldProps("isFixedRate")}
                    />
                    <span className={`${styles.round} ${styles.slider}`} />
                  </label>
                </div>
                {formik.values.isFixedRate && (
                  <div className={styles.inputDiv}>
                    <label
                      style={{
                        marginBottom: "5px",
                        textTransform: "uppercase",
                      }}
                      htmlFor="fixedRate"
                    >
                      Fixed Rate
                    </label>
                    <input type="text" {...formik.getFieldProps("fixedRate")} />
                  </div>
                )}
                {formik.touched.fixedRate && formik.errors.fixedRate ? (
                  <div className={styles.error}>{formik.errors.fixedRate}</div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Fee Receiving Account</label>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("feeReceivingAccount")}
                  />
                </div>
                {formik.touched.feeReceivingAccount &&
                formik.errors.feeReceivingAccount ? (
                  <div className={styles.error}>
                    {formik.errors.feeReceivingAccount}
                  </div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Processing Fee</label>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("processingFee")}
                  />
                </div>
                {formik.touched.processingFee && formik.errors.processingFee ? (
                  <div className={styles.error}>
                    {formik.errors.processingFee}
                  </div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Master Wallet</label>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("masterWallet")}
                  />
                </div>
                {formik.touched.masterWallet && formik.errors.masterWallet ? (
                  <div className={styles.error}>
                    {formik.errors.masterWallet}
                  </div>
                ) : null}
              </>
            )}
            {current === 3 && (
              <>
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Decimal</label>
                    <span>
                      <Tooltip placement="top" title={`Should be atleast 1.`}>
                        <InfoCircleOutlined className={styles.tooltip} />
                      </Tooltip>
                    </span>
                  </div>
                  <input type="text" {...formik.getFieldProps("decimal")} />
                </div>
                {formik.touched.decimal && formik.errors.decimal ? (
                  <div className={styles.error}>{formik.errors.decimal}</div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Contract Address</label>
                  </div>
                  <input
                    type="text"
                    {...formik.getFieldProps("contractAddress")}
                  />
                </div>
                {formik.touched.contractAddress &&
                formik.errors.contractAddress ? (
                  <div className={styles.error}>
                    {formik.errors.contractAddress}
                  </div>
                ) : null}
                <div className={styles.inputDiv}>
                  <div className={styles.label}>
                    <label>Contract Abi</label>
                  </div>
                  <textarea {...formik.getFieldProps("contractAbi")} />
                </div>
                {formik.touched.contractAbi && formik.errors.contractAbi ? (
                  <div className={styles.error}>
                    {formik.errors.contractAbi}
                  </div>
                ) : null}
              </>
            )}
            <div className={styles.formButtons}>
              <div className={styles.previousButton}>
                {current > 0 && (
                  <div className={styles.button} onClick={() => prev()}>
                    <ArrowLeftOutlined />
                  </div>
                )}
              </div>
              {current < steps.length - 1 && (
                <div className={styles.buttonDiv}>
                  <div className={styles.button} onClick={() => next()}>
                    <ArrowRightOutlined />
                  </div>
                </div>
              )}
              {current === steps.length - 1 && (
                <div className={styles.buttonDiv}>
                  <button type="submit">
                    <PlusOutlined />
                    <span>Add New Token</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </>
      ) : null}
      {addNewTokenSuccess && (
        <Result
          status="success"
          title="Success!"
          subTitle="New token added successfully. I may take 10 - 15 minutes to completely reflect changes across the HOGI Wallet Network."
          extra={[
            <Button
              onClick={resetAddNewTokenHandler}
              type="primary"
              key="console"
            >
              Go to Coin Management
            </Button>,
          ]}
        />
      )}
      {addNewTokenFailure && (
        <Result
          status="error"
          title="Error!"
          subTitle="Adding new token failed!. This may be due to network issue or wrong information. Try again!"
          extra={[
            <Button
              onClick={resetAddNewTokenHandler}
              type="primary"
              key="console"
            >
              Go to Coin Management
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default NewToken;
