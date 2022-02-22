import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, notification, Popconfirm, Spin, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteProduct, getAllProducts } from "../../services/posService";
import styles from "./productManagment.module.scss";

const ProductManagment = () => {
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
        title: item?.title,
        image: item?.image,
        category: item?.category,
        price: item?.price,
        merchantName: `${item?.merchantId?.firstName} ${item?.merchantId?.lastName}`,
        shopName: item?.shopId?.name,
      };
    });
    setData(dataSources);
  };

  const handleProductDelete = (productId) => {
    deleteProduct(productId)
      .then((res) => {
        getProductsData();
        notification.success({
          message: `Product deleted successfully`,
        });
      })
      .catch((err) => {
        notification.error({
          message: `Unable to delete product! Try again later`,
        });
      });
  };

  const columns = [
    {
      title: "Product Image",
      dataIndex: "Image",
      key: "Image",
      render: (text, record) => {
        console.log("record for coin", record?.icon);
        return (
          <img src={record?.image} alt={record.title} width={30} height={30} />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => {
        return record.title;
      },
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      render: (text, record) => {
        return record.category;
      },
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (text, record) => {
        return `${record.price}$`;
      },
    },
    {
      title: "Merchant Name",
      dataIndex: "Merchant Name",
      key: "Merchant Name",
      render: (text, record) => {
        return record.merchantName;
      },
    },
    {
      title: "Shop Name",
      dataIndex: "Shop Name",
      key: "Shop Name",
      render: (text, record) => {
        return record.shopName;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleProductDelete(record?.key)}
          >
            <Button type="default" size="small" style={{ width: 90 }} danger>
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const tableLoading = {
    spinning: loading,
    indicator: <Spin indicator={antIcon} />,
  };

  const getProductsData = () => {
    getAllProducts()
      .then((res) => {
        dataActionHandler(res);
      })
      .catch((err) => {
        notification.error({
          message: `Unable to get products!`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getProductsData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Products</div>
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

export default ProductManagment;
