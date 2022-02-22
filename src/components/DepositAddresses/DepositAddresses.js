import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Spin, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import panelConfig from "../../panel.config";
import { renderDepositAddresses } from "../../store/actions/walletActions";
import styles from "./DepositAddresses.module.scss";

const API_URL = panelConfig.API_URL;

const DepositAddresses = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(renderDepositAddresses());
  }, []);

  const state = useSelector((state) => state);
  const depositAddressesSuccess = useSelector(
    (state) => state.wallet.depositAddressesSuccess
  );

  const depositAddresses = useSelector(
    (state) => state.wallet.depositAddresses
  );

  console.log("--deposit addresses-----", depositAddresses);

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

  useEffect(() => {
    console.log("state in DepositAddresses.js", state);
  }, [state]);

  const columns = [
    // {
    //   title: "Coin Icon",
    //   dataIndex: "icon",
    //   key: "icon",
    //   render: (text, record) => {
    //     return (
    //       <img
    //         src={coinIcons[record.symbol]}
    //         alt={record.coin}
    //       />
    //     );
    //   },
    // },
    {
      title: "Coin",
      dataIndex: "symbol",
      key: "symbol",
      render: (text, record) => {
        return record.symbol.toUpperCase();
      },
    },

    {
      title: "Wallet Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      sorter: {
        compare: (a, b) => a.balance - b.balance,
        multiple: 2,
      },
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const tableLoading = {
    spinning: !depositAddressesSuccess,
    indicator: <Spin indicator={antIcon} />,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>User Deposit Addresses</div>
      <div className={styles.divider} />
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={depositAddresses}
        pagination={{
          defaultPageSize: 6,
          showSizeChanger: true,
          pageSizeOptions: ["6", "12", "18"],
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default DepositAddresses;
