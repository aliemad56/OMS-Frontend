import React, { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const TextFieldForm = forwardRef(
  (
    {
      fields,
      fetchUrl,
      onFormSubmit,
      onReset,
      formClassName,
      inputClassName,
      dropdownClassName,
      fieldWrapperClassName,
      buttonClassName,
      hideButtons = false, // Add a new prop to hide buttons
    },
    ref
  ) => {
    const [formData, setFormData] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});

    useEffect(() => {
      const fetchOptions = async () => {
        if (!fetchUrl) return;
        try {
          const response = await axios.get(fetchUrl);
          setDropdownOptions(response.data);
        } catch (err) {
          console.error("Error fetching dropdown options:", err);
        }
      };

      fetchOptions();
    }, [fetchUrl]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
      if (onFormSubmit) {
        onFormSubmit(formData);
      }
    };

    const handleReset = () => {
      setFormData({});
      if (onReset) {
        onReset();
      }
    };

    React.useImperativeHandle(ref, () => ({
      getFormData: () => formData,
      reset: handleReset,
      submit: handleSubmit,
    }));

    return (
      <form className={formClassName} dir="rtl">
        <div>
          {fields.map((field, index) => (
            <div
              key={index}
              className={`${fieldWrapperClassName} ${
                field.type === "dropdown" ? "dropdown-wrapper" : "input-wrapper"
              }`}
            >
              {field.type === "dropdown" ? (
                <>
                  <label htmlFor={field.name}>{field.label}</label>
                  <select
                    id={field.name}
                    name={field.name}
                    onChange={handleChange}
                    className={dropdownClassName}
                    value={formData[field.name] || ""}
                  >
                    <option value="">{field.placeholder}</option>
                    {(dropdownOptions[field.name] || field.options || []).map(
                      (option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    value={formData[field.name] || ""}
                    className={inputClassName}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Conditional Buttons */}
        {!hideButtons && (
          <div className="filter-buttons">
            <button
              type="button"
              className={`${buttonClassName} apply-button`}
              onClick={handleSubmit}
            >
              تطبيق الفلاتر
            </button>
            <button
              type="button"
              className={`${buttonClassName} reset-button`}
              onClick={handleReset}
            >
              إعادة تعيين
            </button>
          </div>
        )}
      </form>
    );
  }
);

TextFieldForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  fetchUrl: PropTypes.string,
  onFormSubmit: PropTypes.func,
  onReset: PropTypes.func,
  formClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  fieldWrapperClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  hideButtons: PropTypes.bool, // New prop for hiding buttons
};

export default TextFieldForm;
