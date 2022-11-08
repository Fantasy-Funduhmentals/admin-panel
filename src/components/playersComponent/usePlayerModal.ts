import React, { useEffect, useState } from "react";
import { getAdminUserData } from "../../services/tokenService";
import { createSubAdminUser } from "../../services/userService";
import { saveAdminUser } from "../../store/reducers/adminSlice";
import { getNormalizedError } from "../../utils/helpers";
import * as Yup from "yup";
import ToggleButton from "../toggleButton/toggle";
import { useFormik } from "formik";
import { useAppDispatch } from "../../store/hooks";

const UsePlayerModal = (open, onClose) => {
  const dispatch = useAppDispatch();
  const [statusData, setStatusData] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [toggleCheck, settoggleCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState(false);
  const [selectItems, setSelectItems] = useState("");

  const handleDurationChange = (event) => {
    setSelectItems(event.target.value);
  };

  const onSelect = (selectedList) => {
    console.log(
      "🚀 ~ file: useSubadminModal.ts ~ line 29 ~ onSelect ~ selectedList",
      selectedList
    );
    setSelectedPermission(selectedList);
    settoggleCheck(!toggleCheck);
  };

  const onRemove = (selectedList, selectedItem) => {
    setSelectedPermission(selectedList);
    settoggleCheck(!toggleCheck);
  };

  useEffect(() => {
    getAdminUsers();
  }, [Data]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
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
        .required()
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
    if (selectItems === "") {
      setStatusData({
        type: "error",
        message: "Please select admin roll first",
      });
      return;
    }
    if (selectedPermission?.length === 0) {
      setStatusData({
        type: "error",
        message: "Please select admin Permission first",
      });
      return;
    }

    try {
      setStatusData(null);
      setLoading(true);

      let params = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: selectItems,
        adminPermissions: selectedPermission,
      };
      await createSubAdminUser(params);
      setData(!Data);
      formik.resetForm();
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
    onRemove,
    onSelect,
    loading,
    formik,
    statusData,
    setStatusData,
    handleDurationChange,
    selectItems,
  };
};

export default UsePlayerModal;
