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
          <div className={styles.settingInfo}>
            <div className={styles.settingInfoTop}>
              <div className={styles.settingIcon}>
                <img src={password} alt="password" />
              </div>
              <div className={styles.settingName}>
                Change Merchant’s Algorithmic Protection Fee
              </div>
            </div>
          </div>
          <div className={styles.secButton}>
            <div
              className={styles.editButton}
              onClick={() => showChangePasswordDrawer("Merchant’s")}
            >
              <span>{apFee}%</span>
              <img src={edit} alt="" />
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title={change}
        width={500}
        onClose={closeChangePasswordDrawer}
        visible={changePasswordDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        className={styles.changePasswordDrawer}
      >
        {active === 1 ? (
          <form onSubmit={changePasswordFormik.handleSubmit}>
            <div className={styles.inputDiv}>
              <label>Old Password</label>
              <div className={styles.input}>
                <input
                  type={revealOldPassword ? "text" : "password"}
                  {...changePasswordFormik.getFieldProps("oldPassword")}
                />
                <div
                  className={styles.inputIcon}
                  onMouseDown={() => setRevealOldPassword(true)}
                  onMouseUp={() => setRevealOldPassword(false)}
                >
                  <img src={eye} alt="check" />
                </div>
              </div>
            </div>
            {changePasswordFormik.touched.oldPassword &&
            changePasswordFormik.errors.oldPassword ? (
              <div className={styles.passwordError}>
                {changePasswordFormik.errors.oldPassword}
              </div>
            ) : null}
            <div className={styles.inputDiv}>
              <label>Enter New Password</label>
              <div className={styles.input}>
                <input
                  type={revealPassword ? "text" : "password"}
                  {...changePasswordFormik.getFieldProps("confirmPassword")}
                />
                <div
                  className={styles.inputIcon}
                  onMouseDown={() => setRevealPassword(true)}
                  onMouseUp={() => setRevealPassword(false)}
                >
                  <img src={eye} alt="check" />
                </div>
              </div>
            </div>
            {changePasswordFormik.touched.password &&
            changePasswordFormik.errors.password ? (
              <div className={styles.passwordError}>
                {changePasswordFormik.errors.password}
              </div>
            ) : null}
            <div className={styles.inputDiv}>
              <label>Confirm Password</label>
              <div className={styles.input}>
                <input
                  type={revealConfirmPassword ? "text" : "password"}
                  {...changePasswordFormik.getFieldProps("password")}
                />
                <div
                  className={styles.inputIcon}
                  onMouseDown={() => setRevealConfirmPassword(true)}
                  onMouseUp={() => setRevealConfirmPassword(false)}
                >
                  <img src={eye} alt="check" />
                </div>
              </div>
            </div>
            {changePasswordFormik.touched.confirmPassword &&
            changePasswordFormik.errors.confirmPassword ? (
              <div className={styles.passwordError}>
                {changePasswordFormik.errors.confirmPassword}
              </div>
            ) : null}

            <button type="submit" className={styles.passwordButton}>
              SAVE
            </button>

            {changePasswordError ? (
              <div className={styles.passwordError}>
                Change password failed!
              </div>
            ) : null}

            {changePasswordSuccess ? (
              <div className={styles.passwordSuccess}>
                Password changed successfully!
              </div>
            ) : null}
          </form>
        ) : active === 2 ? (
          <form onSubmit={changeAPFeeFormik.handleSubmit}>
            <div className={styles.inputDiv}>
              <label>CHANGE ALGORITHMIC PROTECTION FEE</label>
              <div className={styles.input}>
                <input
                  inputMode="numeric"
                  {...changeAPFeeFormik.getFieldProps("apFee")}
                />
              </div>
            </div>
            {changeAPFeeFormik.touched.apFee &&
            changeAPFeeFormik.errors.apFee ? (
              <div className={styles.passwordError}>
                {changeAPFeeFormik.errors.apFee}
              </div>
            ) : null}

            <button type="submit" className={styles.passwordButton}>
              SAVE
            </button>

            {changeAPFeeError ? (
              <div className={styles.passwordError}>
                Change Algorithmic Protection Fee failed!
              </div>
            ) : null}

            {changeAPFeeSuccess ? (
              <div className={styles.passwordSuccess}>
                Algorithmic Protection Fee changed successfully!
              </div>
            ) : null}
          </form>
        ) : (
          ""
        )}
      </Drawer>
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
