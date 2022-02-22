import { FieldProps } from "formik";
import React from "react";
import Select from "react-select";

export const CustomSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = false,
}) => {
  const onChange = (option) => {

    if(field.name==="country" ){
      // debugger;
      form.setFieldValue("city", "");
    }
    form.setFieldValue(
      field.name,
      isMulti ? option.map((item) => item.value) : option.value
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value?.indexOf(option.value) >= 0)
        : options.find((option) => option?.value === field.value);
    } else {
      return isMulti ? [] : "";
    }
  };

  const CustomStyle = {
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#177ddc" : "",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        color: "white",
        backgroundColor: "#177ddc",
      },
    }),
    singleValue: (provided, state) => {
      const color = 'white'
      return { ...provided,color };
    }
  };
  return (
    <Select
      menuPlacement="auto"
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      styles={CustomStyle}
    />
  );
};

export default CustomSelect;
