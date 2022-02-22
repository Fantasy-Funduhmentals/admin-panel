import {
  EditOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Spin,
  Table,
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAllShops } from "../../services/posService";
import Highlighter from "react-highlight-words";
import styles from "./ShopManagment.module.scss";

const ShopManagment = () => {
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
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const dataActionHandler = (res) => {
    const dataSources = res.data.map((item) => {
      return {
        key: item._id,
        name: item.name,
        website: item.website,
        phoneNumber: item?.phone,
        address: item?.address,
        category: item?.category,
        merchantAddress: item?.merchantId?.walletAddress,
      };
    });

    console.log("---data sources---", dataSources);
    setData(dataSources);
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
      // render: (text, record) => {
      //   return record.name;
      // },
    },
    {
      title: "Website",
      dataIndex: "FirstName",
      key: "FirstName",
      render: (text, record) => {
        return record.website;
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
        return record.address;
      },
    },
    {
      title: "Merchant Address",
      dataIndex: "Address",
      key: "Address",
      render: (text, record) => {
        return record.merchantAddress;
      },
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const tableLoading = {
    spinning: loading,
    indicator: <Spin indicator={antIcon} />,
  };

  useEffect(() => {
    setLoading(true);
    getAllShops()
      .then((res) => {
        dataActionHandler(res);
      })
      .catch((err) => {
        console.log("--error getting merchants--", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Shops</div>
      <div className={styles.divider} />
      <Table
        loading={tableLoading}
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

export default ShopManagment;
