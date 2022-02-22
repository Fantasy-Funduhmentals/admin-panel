import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import panelConfig from "../../panel.config";
import {
  changeMerchantStatus,
  getAllMerchants,
} from "../../services/posService";
import styles from "./MerchantManagment.module.scss";

const API_URL = panelConfig.API_URL;

const MerchantManagment = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const dataActionHandler = (res) => {
    const dataSources = res.data.map((item) => {
      return {
        key: item._id,
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
        phoneNumber: item?.phoneNumber,
        walletAddress: item?.walletAddress,
        isDisabled: item?.isDisabled,
      };
    });
    setData(dataSources);
  };

  const handleMerchantStatus = (merchantId, status) => {
    changeMerchantStatus({ merchantId, disable: status })
      .then((res) => {
        getMerchantsData();
        notification.success({
          message: `Merchant ${
            status == "true" ? "disabled" : "enabled"
          } successfully`,
        });
      })
      .catch((err) => {
        notification.error({
          message: `Merchant ${
            status == "true" ? "disabled" : "enabled"
          } failed`,
        });
      });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "FirstName",
      key: "FirstName",
      ...getColumnSearchProps("email"),

      render: (text, record) => {
        return record.email;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "Phone",
      key: "Phone",
      render: (text, record) => {
        return record.phoneNumber;
      },
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
      render: (text, record) => {
        return record.walletAddress;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <div
            className={styles.edit}
            onClick={() => {
              // setCoinIndex(index);
              // showDrawer();
            }}
          >
            {/* <Button title="Activate" block /> */}
            {record.isDisabled ? (
              <Popconfirm
                title="Are you sure you want to activate this merchant?"
                onConfirm={() => handleMerchantStatus(record?.key, "false")}
              >
                <Button
                  color="green"
                  // type="default"
                  size="small"
                  style={{ width: 90, borderColor: "green" }}
                >
                  {/* <Tag
                    color={"green"}
                    key={record.status}
                    style={{
                      width: 90,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  > */}
                  <p style={{ color: "green" }}> Activate</p>
                  {/* </Tag> */}
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Are you sure you want to deActivate this merchant?"
                onConfirm={() => handleMerchantStatus(record?.key, "true")}
              >
                <Button
                  type="default"
                  size="small"
                  style={{ width: 90, marginRight: 10 }}
                  danger
                >
                  DeActivate
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const tableLoading = {
    spinning: loading,
    indicator: <Spin indicator={antIcon} />,
  };

  const getMerchantsData = () => {
    getAllMerchants()
      .then((res) => {
        dataActionHandler(res);
      })
      .catch((err) => {
        console.log("--error getting merchants--", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getMerchantsData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Merchants</div>
      <div className={styles.divider} />
      <Table
        loading={loading && tableLoading}
        columns={columns}
        dataSource={data}
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

export default MerchantManagment;
