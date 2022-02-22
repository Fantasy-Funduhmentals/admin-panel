import React, { useState } from "react";
import styles from "./Login.module.scss";
import logo from "../../assets/images/login-logo.png";
import eye from "../../assets/images/show-eye.svg";
import { useFormik } from "formik";
import { userLoginSchema } from "../../validations/validations";
import { useDispatch, useSelector } from "react-redux";
import { userLogIn } from "../../store/actions/authActions";

const Login = () => {
  const dispatch = useDispatch();
  const [reveal, setReveal] = useState(false);
  const loginError = useSelector((state) => state.auth.loginError);

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
      <div className={styles.login}>
        <div className={styles.logo}>
          <img src={"https://development.cqrvault.org/static/media/logo.0bdeaa77.svg"} alt="logo" />
        </div>
        <div className={styles.logoText}>Admin Panel</div>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputDiv}>
            <label htmlFor="username">Username</label>
            <div className={styles.input}>
              <input type="text" {...formik.getFieldProps("username")} />
            </div>
          </div>
          {formik.touched.username && formik.errors.username ? (
            <div className={styles.error}>{formik.errors.username}</div>
          ) : null}
          <div className={styles.inputDiv}>
            <label htmlFor="password">Password</label>
            <div className={styles.input}>
              <input
                type={reveal ? "text" : "password"}
                {...formik.getFieldProps("password")}
              />
              <div
                className={styles.inputIcon}
                onMouseDown={() => setReveal(true)}
                onMouseUp={() => setReveal(false)}
              >
                <img src={eye} alt="check" />
              </div>
            </div>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.error}>{formik.errors.password}</div>
          ) : null}
          {loginError && <div className={styles.error}>Wrong credentials!</div>}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={styles.passwordButton}
            style={formik.isSubmitting ? { opacity: 0.3 } : null}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
