import { PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory, useParams } from "react-router-dom";
import eye from "../../assets/images/show-eye.svg";
import "../../global.scss";
import karaConfig from "../../panel.config";
import instance from "../../utils/helper/http.helper";
import { UserSchema } from "../../validations/validations";
import styles from "./user.module.scss";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const API_URL = karaConfig.API_URL;

const AddUser = ({ current, steps }) => {
  const [defaultValuesState, setdefaultValuesState] = useState({
    ...defaultValues,
  });
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);
  const [clicked, setClicked] = useState(false);

  const history = useHistory();
  const param = useParams();

  const fetchSingleData = async (id) => {
    try {
      // const res = await axios.get(`${API_URL}/admin/dapp-links/${id}`);
      // const { title, image, shortDescription, url } = res.data[0];
      // const data = {
      //   title,
      //   featuredImage: {
      //     url: image?.url,
      //     key: image?.key,
      //   },
      //   shortDescription: shortDescription,
      //   url,
      // };
      // setdefaultValuesState(data);
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
    let data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    console.log("values", data);
    if (param.id) {
      // try {
      //   const res = await instance.patch(`${API_URL}/admin/dapp-links/update`, {
      //     ...data,
      //     _id: param.id,
      //   });
      //   message.success("Updated Successfully");
      //   formikBag.resetForm();
      //   history.push("/user-management");
      // } catch (error) {
      //   message.error("Something Went Wrong");
      //   console.log("error", error);
      // }
    } else {
      try {
        const res = await instance.post(`${API_URL}/auth/create-user`, data);
        message.success("Added Successfully");
        formikBag.resetForm();
        history.push("/user-management");
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
            {true && (
              <>
                <label htmlFor="firstName" className={styles.label}>
                  First Name :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Write Your Name"
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="firstName" />
                  </div>
                </div>

                <label htmlFor="lastName" className={styles.label}>
                  Last Name :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Write Your Name"
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="lastName" />
                  </div>
                </div>

                <label htmlFor="email" className={styles.label}>
                  Email :
                </label>
                <div style={{ marginBottom: "20px" }}>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Write Your Email"
                  />
                  <div className={styles.error}>
                    <ErrorMessage name="email" />
                  </div>
                </div>
                <label htmlFor="password" className={styles.label}>
                  Password :
                </label>
                <div className={styles.passwordWrapper}>
                  <Field
                    name="password"
                    type={revealPassword ? "text" : "password"}
                    placeholder="Write Password"
                  />
                  <div
                    className={styles.inputIcon}
                    onMouseDown={() => setRevealPassword(true)}
                    onMouseUp={() => setRevealPassword(false)}
                  >
                    <img src={eye} alt="check" />
                  </div>
                </div>
                <div className={styles.error}>
                  <ErrorMessage name="password" />
                </div>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password :
                </label>
                <div className={styles.passwordWrapper}>
                  <Field
                    name="confirmPassword"
                    type={revealConfirmPassword ? "text" : "password"}
                    placeholder="Write Password again"
                  />
                  <div
                    className={styles.inputIcon}
                    onMouseDown={() => setRevealConfirmPassword(true)}
                    onMouseUp={() => setRevealConfirmPassword(false)}
                  >
                    <img src={eye} alt="check" />
                  </div>
                </div>
                <div className={styles.error}>
                  <ErrorMessage name="confirmPassword" />
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
      validationSchema={UserSchema}
      render={renderForm}
      onSubmit={onSubmit}
    />
  );
};
export default AddUser;
