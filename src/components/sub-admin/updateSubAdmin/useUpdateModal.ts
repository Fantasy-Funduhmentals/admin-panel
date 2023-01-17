import React, { useEffect, useState } from "react";

import * as Yup from "yup";

import { useFormik } from "formik";
import { useAppDispatch } from "../../../store/hooks";
import { createSubAdminUser } from "../../../services/userService";
import { getNormalizedError } from "../../../utils/helpers";
import { getAdminUserData } from "../../../services/tokenService";
import { saveAdminUser } from "../../../store/reducers/adminSlice";

const useUpdateModal = (open, onClose, editData) => {
  const dispatch = useAppDispatch();
  const [statusData, setStatusData] = useState(null);
  const [selectedPermission, setSelectedPermission]: any[] = useState([]);
  const [toggleCheck, settoggleCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState(false);
  const [selectItems, setSelectItems] = useState("");

  const handleDurationChange = (event) => {
    setSelectItems(event.target.value);
  };

  const handleChange = (value) => {
    setSelectedPermission(value.target.value);
  };

  useEffect(() => {
    getAdminUsers();
  }, [Data]);

  const formik = useFormik({
    initialValues: {
      name: editData?.name ? editData?.name : "",
      email: editData?.email ? editData?.email : "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Enter Your Name").min(2).max(50).trim(),
      email: Yup.string()
        .email("Please Enter a Valid Email")
        .trim()
        .required("Enter Your Email"),

      password: Yup.string()
        .required("Enter Your password")
        .min(8)
        .max(33)
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        )
        .label("Password")
        .trim(),
    }),
    onSubmit: (values, actions) => {
      handleSubmit(values, actions);
    },
  });

  const handleSubmit = async (values, actions) => {
    if (selectedPermission?.length === 0) {
      setStatusData({
        type: "error",
        message: "Please select admin permission first",
      });
      return;
    }

    try {
      setStatusData(null);
      setLoading(true);

      // if (editData) {
      //   let params = {
      //     _id: editData?._id,
      //     name: values.name,
      //     email: values.email,
      //     password: values.password,
      //     adminPermissions: selectedPermission,
      //   };
      // await UpdateSubAdminData(params);
      // } else {
      let params = {
        name: values.name,
        email: values.email,
        password: values.password,
        adminPermissions: selectedPermission,
        role: selectItems,
      };
      await createSubAdminUser(params);
      // }
      setData(!Data);
      formik.resetForm();
      setSelectedPermission([]);
      onClose();
      setStatusData({
        type: "success",
        message: "User has been created successfully",
      });
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  const getAdminUsers = async () => {
    try {
      setLoading(true);
      const AdminUser = await getAdminUserData();
      dispatch(saveAdminUser(AdminUser?.data));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  return {
    loading,
    formik,
    statusData,
    setStatusData,
    handleDurationChange,
    selectItems,
    selectedPermission,
    handleChange,
  };
};

export default useUpdateModal;
