import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import axios from "axios";
import { convertToHTML } from "draft-convert";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory, useParams } from "react-router-dom";
import "../../global.scss";
import karaConfig from "../../panel.config";
import instance from "../../utils/helper/http.helper";
import { newsSchema } from "../../validations/validations";
import TextEditor from "../TextEditor";
import MyCheckbox from "../_common/CustomCheckBox";
import styles from "./newNews.module.scss";

const defaultValues = {
  title: "",
  featuredImage: {
    url: "",
    key: "",
  },
  shortDesc: "",
  tags: "",
  isFeatured: false,
  paragraphHtml: "",
};

const API_URL = karaConfig.API_URL;

const AddNews = ({ current, steps }) => {
  const [defaultValuesState, setdefaultValuesState] = useState({
    ...defaultValues,
    featuredImage: {
      url: "",
      key: "",
    },
  });
  const [imageList, setImageList] = useState([]);
  const [editorState, setEditorState] = useState();
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
        `${API_URL}/admin/news/upload-image`,
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
      const res = await axios.get(`${API_URL}/admin/news/${id}`);

      const {
        title,
        featuredImage,
        description,
        tags,
        isFeatured,
        content,
      } = res.data[0];
      const blocksFromHTML = convertFromHTML(content);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
      const data = {
        title,
        featuredImage: {
          url: featuredImage?.url,
          key: featuredImage?.key,
        },
        shortDesc: description,
        tags,
        isFeatured,
        paragraphHtml: content,
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
    const {
      featuredImage,
      title,
      paragraphHtml,
      shortDesc,
      tags,
      isFeatured,
    } = values;
    const data = {
      featuredImage: featuredImage,
      title,
      content: paragraphHtml,
      description: shortDesc,
      tags,
      isFeatured,
    };
    if (param.id) {
      try {
        const res = await instance.patch(`${API_URL}/admin/news/update`, {
          ...data,
          _id: param.id,
        });
        message.success("Updated Successfully");
        formikBag.resetForm();
        history.push("/news-management");
      } catch (error) {
        message.error("Something Went Wrong");
        console.log("error", error);
      }
    } else {
      try {
        const res = await instance.post(`${API_URL}/admin/news/create`, data);
        message.success("Added Successfully");
        formikBag.resetForm();
        history.push("/news-management");
      } catch (error) {
        message.error("Something Went Wrong");
        console.log("error", error);
      }
    }
  };

  const renderForm = (formikBag, values = formikBag.values) => {
    console.log("valuessss", formikBag);
    return (
      <>
        <div className={styles.wrapper}>
          <div className={styles.title}>Add News</div>
          <div className={styles.divider} />
          <Form className={styles.form}>
            {true && (
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
                <label htmlFor="shortDesc" className={styles.label}>
                  Short Description :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    name="shortDesc"
                    type="text"
                    maxlength="200"
                    placeholder="Write short description"
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="shortDesc" />
                  </div>
                </div>
                <label htmlFor="tags" className={styles.label}>
                  {" "}
                  Tags :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field name="tags" type="text" placeholder="Write tags" />
                  <div className={styles.error}>
                    <ErrorMessage name="tags" />
                  </div>
                </div>
                <label
                  htmlFor="desc"
                  className={styles.label}
                  style={{ lineHeight: "40px" }}
                >
                  Brief Description :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <TextEditor
                    value={editorState && editorState}
                    onChange={(e) => {
                      setEditorState(e);
                      values.paragraphHtml = convertToHTML(
                        e.getCurrentContent()
                      );
                      values.paragraphBol = e.getCurrentContent().hasText();
                    }}
                  />
                  {!editorState?.getCurrentContent().hasText() && clicked && (
                    <div className={styles.error}>This Field is Required</div>
                  )}
                </div>
                <MyCheckbox name="isFeatured" />
                <div className={styles.error}>
                  <ErrorMessage name="isFeatured" />
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
                  {/* <div className={styles.error}>
                    <ErrorMessage name="featuredImage.url" />
                  </div> */}
                </div>
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
            )}
          </Form>
        </div>
      </>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={defaultValuesState}
      validationSchema={newsSchema}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};
export default AddNews;
