import React from "react";
import { useField } from "formik";
import styles from "../CustomCheckBox/checkBox.module.scss";

const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  return (
    <div className={styles.inputDiv}>
      <label
        htmlFor="active"
        style={{
          marginBottom: "5px",
          textTransform: "uppercase",
        }}
      >
        Featured
      </label>
      <label className={styles.switch}>
        <input {...field} {...props} type="checkbox" />
        <span className={`${styles.round} ${styles.slider}`} />
      </label>
    </div>
  );
};
export default MyCheckbox;
