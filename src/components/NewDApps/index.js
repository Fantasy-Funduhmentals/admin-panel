import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory, useParams } from "react-router-dom";
import "../../global.scss";
import karaConfig from "../../panel.config";
import instance from "../../utils/helper/http.helper";
import { DAppSchema } from "../../validations/validations";
import styles from "./NewDApp.module.scss";

const defaultValues = {
  title: "",
  featuredImage: {
    url: "",
    key: "",
  },
  url: "",
  shortDescription: "",
  isFeatured: false,
};

const API_URL = karaConfig.API_URL;

const AddDApp = ({ current, steps }) => {
  const [defaultValuesState, setdefaultValuesState] = useState({
    ...defaultValues,
    featuredImage: {
      url: "",
      key: "",
    },
  });
  const [imageList, setImageList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const handleOnChangeLogo = ({ file, fileList, event }, values) => {
    if (!fileList.length) {
      values.featuredImage = {
        url: "",
        key: "",
      };
    }
    setImageList(fileList);
  };
  const [progress, setProgress] = useState(0);
  const uploadimage = async (options, values) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("file", file);

    try {
      // values.image = "url link";
      const res = await instance.post(
        `${API_URL}/admin/dapp-links/upload-image`,
        fmData,
        config
      );
      console.log("res image", res);
      onSuccess("Ok");
      values.featuredImage.url = res.data.url;
      values.featuredImage.key = res.data.key;
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };
  const history = useHistory();
  const param = useParams();

  const fetchSingleData = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/admin/dapp-links/${id}`);

      const { title, image, shortDescription, url, isFeatured } = res.data[0];
      const data = {
        title,
        featuredImage: {
          url: image?.url,
          key: image?.key,
        },
        shortDescription: shortDescription,
        url,
        isFeatured,
      };
      setdefaultValuesState(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (param.id) {
      fetchSingleData(param.id);
    }
    return () => {
      setdefaultValuesState(defaultValues);
    };
  }, []);
  const onSubmit = async (values, formikBag) => {
    console.log("values", values);
    const { featuredImage, title, url, shortDescription, isFeatured } = values;
    const data = {
      image: featuredImage,
      title,
      shortDescription,
      url,
      isFeatured,
    };
    if (param.id) {
      try {
        const res = await instance.patch(`${API_URL}/admin/dapp-links/update`, {
          ...data,
          _id: param.id,
        });
        message.success("Updated Successfully");
        formikBag.resetForm();
        history.push("/DApps-management");
      } catch (error) {
        message.error("Something Went Wrong");
        console.log("error", error);
      }
    } else {
      try {
        const res = await instance.post(
          `${API_URL}/admin/dapp-links/create`,
          data
        );
        message.success("Added Successfully");
        formikBag.resetForm();
        history.push("/DApps-management");
      } catch (error) {
        message.error("Something Went Wrong");
        console.log("error", error);
      }
    }
  };

  const renderForm = (formikBag, values = formikBag.values) => {
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.title}>Add DApp Details</div>
          <div className={styles.divider} />
          <Form className={styles.form}>
            {
              <>
                <label htmlFor="title" className={styles.label}>
                  Title :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field name="title" type="text" placeholder="Write Title" />
                  <div className={styles.error}>
                    <ErrorMessage name="title" />
                  </div>
                </div>
                <label htmlFor="shortDescription" className={styles.label}>
                  Description :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    name="shortDescription"
                    as="textarea"
                    maxlength="200"
                    placeholder="Write short description"
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="shortDescription" />
                  </div>
                </div>
                <label htmlFor="title" className={styles.label}>
                  URL Link :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field name="url" type="text" placeholder="Write/Paste URL" />
                  <div className={styles.error}>
                    <ErrorMessage name="url" />
                  </div>
                </div>
                <label
                  htmlFor="logo"
                  className={styles.label}
                  style={{ lineHeight: "40px" }}
                >
                  Add image :
                </label>
                <div className={styles.uploadDiv}>
                  <Upload
                    fileList={imageList}
                    listType="picture"
                    customRequest={(e) => uploadimage(e, values)}
                    onChange={(e) => handleOnChangeLogo(e, values)}
                  >
                    {imageList && imageList.length === 0 && (
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    )}
                  </Upload>
                  {!values.featuredImage?.url && (
                    <div className={styles.error}>
                      <ErrorMessage name="featuredImage.url" />
                    </div>
                  )}
                </div>
                <label className={styles.label}>Featured :</label>
                <label className={styles.switch}>
                  <Field
                    type="checkbox"
                    checked={values.isFeatured}
                    name="isFeatured"
                  />
                  <span className={`${styles.round} ${styles.slider}`} />
                </label>
                <div
                  className={styles.buttonDiv}
                  onClick={() => setClicked(true)}
                >
                  <button type="submit">
                    <PlusOutlined />
                    <span>Submit</span>
                  </button>
                </div>
              </>
            }
          </Form>
        </div>
      </>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={defaultValuesState}
      validationSchema={DAppSchema}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};
export default AddDApp;
