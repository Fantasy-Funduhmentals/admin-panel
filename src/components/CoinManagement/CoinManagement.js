import {
  EditOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Input,
  message,
  Space,
  Table,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import panelConfig from "../../panel.config";
import {
  renderAdminPanelData,
  updateAssetDetail,
} from "../../store/actions/walletActions";
import { assetDetailsSchema } from "../../validations/validations";
import styles from "./CoinManagement.module.scss";

const API_URL = panelConfig.API_URL;

const CoinManagement = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.wallet.coins);
  const isUpdatingAssetDetail = useSelector(
    (state) => state.wallet.isUpdatingAssetDetail
  );
  const assetDetailUpdated = useSelector(
    (state) => state.wallet.assetDetailUpdated
  );
  const updateAssetDetailError = useSelector(
    (state) => state.wallet.updateAssetDetailError
  );
  useEffect(() => {
    console.log("state in CoinManagement.js", coins);
  }, [coins]);
  const [coinIndex, setCoinIndex] = useState(0);
  const [iconObject, setIconObject] = useState(undefined);

  const uploadProps = {
    name: "file",
    maxCount: 1,
    listType: "picture",
    multiple: true,
    action: `${API_URL}/admin/coin/upload-image`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    beforeUpload: (file) => {
      if (file.type !== "image/png") {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === "image/png" ? true : Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setIconObject({
          ...info.file.response,
        });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{ color: filtered ? "#1890ff" : "#177ddc", fontSize: "20px" }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Coin Icon",
      dataIndex: "icon",
      key: "icon",
      render: (text, record) => {
        return (
          <img
            src={record?.icon?.url}
            alt={record.coin}
            width={30}
            height={30}
          />
        );
      },
    },
    {
      title: "Coin Name",
      dataIndex: "coin",
      key: "coin",
      ...getColumnSearchProps("coin"),
      render: (text, record) => {
        return record.coin.toUpperCase();
      },
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text, record) => {
        return record.symbol.toUpperCase();
      },
    },
    {
      title: "Order Index",
      dataIndex: "orderIndex",
      key: "orderIndex",
      render: (text, record) => {
        return record.orderIndex;
      },
      sorter: {
        compare: (a, b) => a.orderIndex - b.orderIndex,
        multiple: 2,
      },
    },
    {
      title: "Default Status",
      key: "status",
      dataIndex: "status",
      render: (text, record) => {
        if (record.status) {
          return (
            <Tag color={"green"} key={record.status}>
              ACTIVE
            </Tag>
          );
        }
        if (!record.status) {
          return (
            <Tag color={"volcano"} key={record.status}>
              INACTIVE
            </Tag>
          );
        }
      },
    },
    {
      title: "Rate",
      key: "isFixedRate",
      dataIndex: "isFixedRate",
      render: (text, record) => {
        if (!record.isFixedRate) {
          return (
            <Tag color={"blue"} key={record.isFixedRate}>
              MARKET RATE
            </Tag>
          );
        }
        if (record.isFixedRate) {
          return (
            <Tag color={"purple"} key={record.isFixedRate}>
              FIXED RATE
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const index = coins.findIndex((obj) => obj.key === record.key);
        return (
          <div
            className={styles.edit}
            onClick={() => {
              setCoinIndex(index);
              showDrawer();
            }}
          >
            <EditOutlined className={styles.editIcon} />
          </div>
        );
      },
    },
  ];

  const [drawer, setDrawer] = useState(false);
  const showDrawer = async () => {
    setDrawer(true);
  };
  const closeDrawer = () => {
    if (!isUpdatingAssetDetail) {
      setDrawer(false);
      setIconObject(undefined);
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: coins[coinIndex]?.description || "",
      fee: coins[coinIndex]?.processingFee || "",
      address: coins[coinIndex]?.feeReceivingAccount || "",
      active: coins[coinIndex]?.status,
      isFixed: coins[coinIndex]?.isFixedRate,
      fixedRate: coins[coinIndex]?.fixedRate || 0,
      coingeckoId: coins[coinIndex]?.coingeckoId || "",
      coinColor: coins[coinIndex]?.coinColor || "",
      decimal: coins[coinIndex]?.decimal || 1,
      orderIndex: coins[coinIndex]?.orderIndex || 1,
      contractAddress: coins[coinIndex]?.contractAddress || null,
      contractAbi: JSON.stringify(coins[coinIndex]?.contractAbi) || null,
      cointype: coins[coinIndex]?.isErc20
        ? "isErc20"
        : coins[coinIndex]?.isBep20
        ? "isBep20"
        : null || null,
    },
    validationSchema: assetDetailsSchema,
    onSubmit: async (values, onSubmitProps) => {
      console.log("Edit Asset Details: ", values);
      if (values.cointype == "isErc20") {
        values.isErc20 = true;
        values.isBep20 = false;
      } else if (values.cointype == "isBep20") {
        values.isErc20 = false;
        values.isBep20 = true;
      }
      await dispatch(
        updateAssetDetail({
          id: coins[coinIndex]?.key,
          description: values.description,
          coinSymbol: coins[coinIndex]?.symbol,
          orderIndex: Number(values.orderIndex),
          name: coins[coinIndex]?.coin,
          feeReceivingAddress: values.address,
          masterWallet: coins[coinIndex]?.masterWallet,
          processingFee: values.fee,
          isFixedRate: values.isFixed,
          fixedRate: Number(values.fixedRate),
          isActive: values.active,
          fixedRateHistory: [
            {
              price: Number(values.fixedRate),
              timestamp: moment().valueOf(),
            },
          ],
          icon: iconObject,
          decimal: Number(values.decimal),
          coingeckoId: values.coingeckoId.toLowerCase(),
          coinColor: values.coinColor,
          contractAddress: values.contractAddress,
          contractAbi: JSON.parse(values.contractAbi),
          isErc20: values.isErc20,
          isBep20: values.isBep20,
        })
      );
      await setTimeout(() => {
        dispatch(renderAdminPanelData());
      }, 3000);
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>Coin Management</div>

        <div className={styles.addToken}>
          {/* <Link to="/add-new-token">
            <button className={styles.button}>
              <span>
                <PlusOutlined />
              </span>
              Add New Token
            </button>
          </Link> */}
        </div>
      </div>
      <div className={styles.divider} />
      <Table
        columns={columns}
        dataSource={coins}
        pagination={{ pageSize: 6 }}
        scroll={{ x: true }}
      />
      <Drawer
        title={`${coins[coinIndex]?.coin.toUpperCase()} - Edit Asset Details`}
        width={500}
        onClose={closeDrawer}
        visible={drawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div className={styles.editDrawer}>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputDiv}>
              <label htmlFor="fee">
                Company Profit Fee{" "}
                <span>
                  <Tooltip
                    placement="top"
                    title={`This fee will be sent to cold address as company profit from each transaction of this token.`}
                  >
                    <InfoCircleOutlined className={styles.tooltip} />
                  </Tooltip>
                </span>
              </label>
              <input type="text" {...formik.getFieldProps("fee")} />
            </div>
            {formik.touched.fee && formik.errors.fee ? (
              <div className={styles.error}>{formik.errors.fee}</div>
            ) : null}
            {formik.values.cointype && (
              <div className={styles.inputDiv}>
                <label htmlFor="kycStatus">Coin Type</label>
                <select {...formik.getFieldProps("cointype")}>
                  <option value="isErc20" label="isErc20" />
                  <option value="isBep20" label="isBep20" />
                </select>
              </div>
            )}
            <div className={styles.inputDiv}>
              <label htmlFor="address">Cold Deposit Address</label>
              <input type="text" {...formik.getFieldProps("address")} />
            </div>
            {formik.touched.address && formik.errors.address ? (
              <div className={styles.error}>{formik.errors.address}</div>
            ) : null}
            <div className={styles.inputDiv}>
              <label htmlFor="description">Asset Description</label>
              <textarea {...formik.getFieldProps("description")} />
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div className={styles.error}>{formik.errors.description}</div>
            ) : null}
            <div className={styles.inputDiv}>
              <label htmlFor="isFixed">
                Set Asset's Fixed Rate?
                <span>
                  <Tooltip
                    placement="top"
                    title={`It may take upto 10 - 15 minutes to apply asset fixed rate across the HOGI Wallet network.`}
                  >
                    <InfoCircleOutlined className={styles.tooltip} />
                  </Tooltip>
                </span>
              </label>
              <label className={styles.switch}>
                <input
                  checked={formik.values.isFixed}
                  type="checkbox"
                  {...formik.getFieldProps("isFixed")}
                />
                <span className={`${styles.round} ${styles.slider}`} />
              </label>
            </div>
            {formik.values.isFixed && (
              <div className={styles.inputDiv}>
                <label htmlFor="fixedRate">Fixed Rate</label>
                <input type="text" {...formik.getFieldProps("fixedRate")} />
              </div>
            )}
            {formik.touched.fixedRate && formik.errors.fixedRate ? (
              <div className={styles.error}>{formik.errors.fixedRate}</div>
            ) : null}

            {coins[coinIndex]?.symbol === "btc" ||
            coins[coinIndex]?.symbol === "eth" ? null : (
              <div className={styles.inputDiv}>
                <label htmlFor="active">Asset Active Status</label>
                <label className={styles.switch}>
                  <input
                    checked={formik.values.active}
                    type="checkbox"
                    {...formik.getFieldProps("active")}
                  />
                  <span className={`${styles.round} ${styles.slider}`} />
                </label>
              </div>
            )}

            <div className={styles.inputDiv}>
              <label htmlFor="coingeckoId">CoinGecko ID</label>
              <input type="text" {...formik.getFieldProps("coingeckoId")} />
            </div>
            {formik.touched.coingeckoId && formik.errors.coingeckoId ? (
              <div className={styles.error}>{formik.errors.coingeckoId}</div>
            ) : null}

            <div className={styles.inputDiv}>
              <label htmlFor="coinColor">
                Default Coin Color{" "}
                <span>
                  <Tooltip
                    placement="top"
                    title={`Color will be used to display graph and stats in the HOGI Wallet. Only enter HEX value of a color.`}
                  >
                    <InfoCircleOutlined className={styles.tooltip} />
                  </Tooltip>
                </span>
              </label>
              <input type="text" {...formik.getFieldProps("coinColor")} />
            </div>
            {formik.touched.coinColor && formik.errors.coinColor ? (
              <div className={styles.error}>{formik.errors.coinColor}</div>
            ) : null}

            {coins[coinIndex]?.isErc20 ? (
              <>
                <div className={styles.inputDiv}>
                  <label htmlFor="contractAddress">Contract Address</label>
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
                  <label htmlFor="decimal">
                    Decimal{" "}
                    <span>
                      <Tooltip placement="top" title={`Should be atleast 1.`}>
                        <InfoCircleOutlined className={styles.tooltip} />
                      </Tooltip>
                    </span>
                  </label>
                  <input type="text" {...formik.getFieldProps("decimal")} />
                </div>
                {formik.touched.decimal && formik.errors.decimal ? (
                  <div className={styles.error}>{formik.errors.decimal}</div>
                ) : null}

                <div className={styles.inputDiv}>
                  <label htmlFor="Contract Abi">Contract Abi</label>
                  <textarea {...formik.getFieldProps("contractAbi")} />
                </div>
                {formik.touched.contractAbi && formik.errors.contractAbi ? (
                  <div className={styles.error}>
                    {formik.errors.contractAbi}
                  </div>
                ) : null}
              </>
            ) : null}

            <div className={styles.inputDiv}>
              <label htmlFor="orderIndex">Coin Order Index</label>
              <input type="text" {...formik.getFieldProps("orderIndex")} />
            </div>
            {formik.touched.orderIndex && formik.errors.orderIndex ? (
              <div className={styles.error}>{formik.errors.orderIndex}</div>
            ) : null}

            <div className={styles.inputDiv}>
              <label htmlFor="changeAssetIcon">
                Change Asset Icon{" "}
                <span>
                  <Tooltip
                    placement="top"
                    title={`[ IMPORTANT ] Only upload coin icons which are similar in design and dimension to the previously used icons. The icon uploaded should be in svg format and 30 x 30 (px) in dimension.`}
                  >
                    <InfoCircleOutlined className={styles.tooltip} />
                  </Tooltip>
                </span>
              </label>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload Icon</Button>
              </Upload>
            </div>

            <button className={styles.button} type="submit">
              {isUpdatingAssetDetail ? (
                <LoadingOutlined style={{ fontSize: 24 }} spin />
              ) : (
                "Save"
              )}
            </button>
            {updateAssetDetailError && (
              <div className={styles.error}>
                Updating {coins[coinIndex]?.coin?.toUpperCase()} Detail Failed!
              </div>
            )}
            {assetDetailUpdated && (
              <div className={styles.success}>
                {coins[coinIndex]?.coin?.toUpperCase()} Details Updated
                Successfully!
              </div>
            )}
          </form>
        </div>
      </Drawer>
    </div>
  );
};

export default CoinManagement;
