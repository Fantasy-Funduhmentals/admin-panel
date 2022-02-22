import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message, Space, Spin, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import karaConfig from "../../panel.config";
import instance from "../../utils/helper/http.helper";
import styles from "./newManagement.module.scss";
const API_URL = karaConfig.API_URL;

const NewsManagement = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState();
  const [selectedItem, setSelectedItem] = useState(null);

  const dataActionHandler = (res) => {
    console.log("ressssss", res);
    const dataSources = res.data.map((item) => {
      return {
        key: item._id,
        title: item.title,
        image: item.featuredImage.url,
        date: moment(item.createdAt).format("MMM DD, YYYY"),
      };
    });
    setData(dataSources);
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const tableLoading = {
    spinning: !data.length > 0,
    indicator: <Spin indicator={antIcon} />,
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await instance.get(`${API_URL}/admin/news`);
      console.log("fetched data", res);
      dataActionHandler(res);
    } catch (error) {
      console.log(error);
    }
  };
  const updateHandler = (e, id) => {
    history.push({ pathname: `/add-news/${id}` });
  };
  const deleteHandler = async (e, id) => {
    try {
      const res = await instance.delete(
        `${API_URL}/admin/news/delete/${selectedItem}`
      );

      const data2 = data.filter((item) => item.key !== selectedItem);
      setData(data2);
      message.success("Deleted Successfully");
    } catch (error) {
      message.error("Something Went Wrong");
    }
    setShowModal(false);
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          src={record.image}
          style={{ height: "70px", width: "70px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created At",
      dataIndex: "date",
      key: "date",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a
            style={{ fontSize: "25px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              updateHandler(e, record.key);
            }}
          >
            <EditOutlined />
          </a>
          <a
            style={{ fontSize: "25px", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(record.key);
              setShowModal(true);
            }}
          >
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>News Management</div>
        <div className={styles.addToken}>
          <Link to="/add-news">
            <button className={styles.button}>
              <span>
                <PlusOutlined />
              </span>
              Add New News
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.divider} />
      <Table
        loading={tableLoading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6 }}
        scroll={{ x: true }}
      />
      <Modal
        title="Alert"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <div style={{ display: "flex" }}>
            <Button
              key="back"
              type="primary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button key="submit" type="danger" onClick={() => deleteHandler()}>
              Delete
            </Button>
          </div>,
        ]}
      >
        <h3>Are you sure you want to delete ?</h3>
        <p> You will lose the data !</p>
      </Modal>
    </div>
  );
};

export default NewsManagement;
