import { Button, Drawer } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import password from "../../assets/images/password-icon.svg";
import eye from "../../assets/images/show-eye.svg";
import { changeAPFee, changePassword } from "../../store/actions/walletActions";
import {
  changePasswordSchema,
  changeAPFeeSchema,
} from "../../validations/validations";
import edit from "../../assets/coins/edit.svg";
import styles from "./Settings.module.scss";
import { LoadingOutlined } from "@ant-design/icons";

const Settings = () => {
  const dispatch = useDispatch();
  const [change, setChange] = useState("Change Password");
  const [value, setValue] = useState("5%");
  const [revealOldPassword, setRevealOldPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);
  const [active, setActive] = useState(0);
  const {
    passwordChanged: changePasswordSuccess,
    aPFeeChanged: changeAPFeeSuccess,
    changeAPFeeError,
    changePasswordError,
    merchantSettings: { apFee },
  } = useSelector((state) => state.wallet);

  const changePasswordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, onSubmitProps) => {
      // onSubmitProps.resetForm();
      dispatch(changePassword(values.oldPassword, values.password));
    },
  });

  const changeAPFeeFormik = useFormik({
    initialValues: {
      apFee: "",
    },
    validationSchema: changeAPFeeSchema,
    onSubmit: async (values) => {
      // onSubmitProps.resetForm();
      dispatch(changeAPFee(values.apFee));
    },
  });

  const [changePasswordDrawer, setChangePasswordDrawer] = useState(false);
  const showChangePasswordDrawer = (name) => {
    if (name === "changePassword") {
      setChangePasswordDrawer(true);
      setActive(1);
      setChange("Change Password");
    } else if (name === "Merchant’s") {
      setChange(" Change Merchant’s Algorithmic Protection Fee");
      setActive(2);
      setChangePasswordDrawer(true);
    }
  };
  const closeChangePasswordDrawer = () => {
    setChangePasswordDrawer(false);
  };
  const appUpdateHandler = () => {
    try {
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: userLoginSchema,
    onSubmit: async (values, onSubmitProps) => {
      console.log("Login Form Values: ", values);
      dispatch(userLogIn(values.username, values.password));
      onSubmitProps.resetForm();
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Settings</div>
      <div className={styles.divider} />
      <div className={styles.settingsContainer}>
        <div className={styles.settingCard}>
          <div className={styles.settingInfo}>
            <div className={styles.settingInfoTop}>
              <div className={styles.settingIcon}>
                <img src={password} alt="password" />
              </div>
              <div className={styles.settingName}>
                Change your account password
              </div>
            </div>
          </div>
          <button
            onClick={() => showChangePasswordDrawer("changePassword")}
            className={styles.settingButton}
          >
            Change Password
          </button>
        </div>
        <div className={styles.settingCard}>
        <div className={styles.editDrawer}>
          {/* <form onSubmit={formik.handleSubmit}>
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

            <button className={styles.button} type="submit">
              {isUpdating ? (
                <LoadingOutlined style={{ fontSize: 24 }} spin />
              ) : (
                "Save"
              )}
            </button>
            {settingUpdateError && (
              <div className={styles.error}>
                Updating {coins[coinIndex]?.coin?.toUpperCase()} Detail Failed!
              </div>
            )}
            {settingUpdateSuccess && (
              <div className={styles.success}>
                {coins[coinIndex]?.coin?.toUpperCase()} Details Updated
                Successfully!
              </div>
            )}
          </form> */}
        </div>
        </div>
      </div>
      
      <Modal
        title="Alert"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <div style={{ display: "flex" }}>
            <Button key="back" onClick={() => setShowModal(false)}>
              Cancel
            </Button>

            <Button
              key="submit"
              type="primary"
              onClick={() => appUpdateHandler()}
            >
              OK
            </Button>
          </div>,
        ]}
      >
        <h3>This will enable the force update in App</h3>
        <p>
          If you press <strong>OK</strong> this will enable force update and
          user will be unable to use BlockMerchants App until he/she updates to
          the latest version of application.
        </p>
      </Modal>
    </div>
  );
};

export default Settings;
