import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, message, Upload } from "antd";
import axios from "axios";
import "./superVisorDevicesAdd.css";
import Url from "./../../../store/url.js";
import useAuthStore from "../../../store/store"; // Import the store
import moment from "moment";
import ImagePreviewer from "./../../../reusable/ImagePreViewer.jsx";

const { Dragger } = Upload;

const SuperVisorDammagePassportAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); // State for image previews
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState([]); // State for device types
  const [damagedTypes, setDamagedTypes] = useState([]); // State for damaged device types
  const { accessToken, profile } = useAuthStore();
  const { profileId, governorateId, officeId } = profile || {};
  const { isSidebarCollapsed } = useAuthStore(); // Access sidebar collapse state

  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        const response = await axios.get(`${Url}/api/devicetype`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const options = response.data.map((deviceType) => ({
          value: deviceType.id,
          label: deviceType.name,
        }));
        setDeviceTypes(options);
      } catch (error) {
        console.error("Error fetching device types:", error);
        message.error("خطأ في جلب أنواع الأجهزة");
      }
    };

    const fetchDamagedTypes = async () => {
      try {
        const response = await axios.get(`${Url}/api/damageddevicetype/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const options = response.data.map((damagedType) => ({
          value: damagedType.id,
          label: damagedType.name,
        }));
        setDamagedTypes(options);
      } catch (error) {
        console.error("Error fetching damaged device types:", error);
        message.error("خطأ في جلب أنواع التلف");
      }
    };

    fetchDeviceTypes();
    fetchDamagedTypes();
  }, [accessToken]);

  const handleBack = () => {
    navigate(-1);
  };

  const attachFiles = async (entityId) => {
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file.originFileObj);
      formData.append("entityId", entityId);
      formData.append("EntityType", "DamagedDevice"); // Updated entity type

      try {
        await axios.post(`${Url}/api/Attachment/add-attachment`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        throw new Error("Failed to attach files. Operation aborted.");
      }
    }
  };

  const handleFormSubmit = async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Step 1: Submit the form to create a new damaged device
      const payload = {
        serialNumber: values.serialNumber, // Use serialNumber field
        date: values.date
          ? values.date.format("YYYY-MM-DDTHH:mm:ss.SSSZ") // Format the date
          : moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"), // Default to current date
        damagedDeviceTypeId: values.damagedTypeId, // Use "damagedTypeId"
        deviceTypeId: values.deviceTypeId, // Use selected deviceTypeId
        officeId: officeId, // Static office ID
        governorateId: governorateId, // Static governorate ID
        profileId: profileId, // Static profile ID
      };

      console.log("Submitting Payload:", payload);

      const damagedDeviceResponse = await axios.post(
        `${Url}/api/DamagedDevice`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Add JWT token
          },
        }
      );

      console.log("Damaged Device Response:", damagedDeviceResponse);

      // Extract entity ID from the response
      const entityId =
        damagedDeviceResponse.data?.id || damagedDeviceResponse.data;

      if (!entityId) {
        console.error(
          "DamagedDevice response does not contain 'id'. Full response:",
          damagedDeviceResponse.data
        );
        throw new Error("Failed to retrieve entity ID from the response.");
      }

      console.log("Entity ID:", entityId);

      // Step 2: Attach files if there are any
      if (fileList.length > 0) {
        try {
          await attachFiles(entityId); // Attach files using the retrieved entity ID
          message.success("تم إرسال البيانات والمرفقات بنجاح"); // Success message
        } catch (attachmentError) {
          console.error("Attachment Error:", attachmentError);
          throw new Error("Failed to attach files. Operation aborted.");
        }
      } else {
        message.success("تم إرسال البيانات بنجاح بدون مرفقات"); // Success message if no files
      }

      navigate(-1); // Navigate back on successful submission
    } catch (error) {
      console.error("Submission Error:", error);
      message.error(
        error.message || "حدث خطأ أثناء إرسال البيانات أو المرفقات"
      ); // Show error message
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  const handleFileChange = (info) => {
    const updatedFiles = info.fileList;
    setFileList(updatedFiles);

    const previews = updatedFiles.map((file) =>
      file.originFileObj ? URL.createObjectURL(file.originFileObj) : null
    );
    setPreviewUrls(previews);
  };

  const handleDeleteImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index)); // Remove the selected image from preview
    setFileList((prev) => prev.filter((_, i) => i !== index)); // Remove the corresponding file from fileList
  };

  return (
    <div
      className={`supervisor-damaged-passport-add-containe ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
      dir="rtl">
      <h1 className="SuperVisor-title-conatiner">إضافة جهاز تالف</h1>
      <div className="add-details-container">
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          className="add-details-form">
          <div className="add-passport-fields-container">
            <Form.Item
              name="serialNumber"
              label="الرقم التسلسلي"
              rules={[{ required: true, message: "يرجى إدخال الرقم التسلسلي" }]}>
              <Input placeholder="أدخل الرقم التسلسلي" />
            </Form.Item>
            <Form.Item
              name="damagedTypeId"
              label="سبب التلف"
              rules={[{ required: true, message: "يرجى اختيار سبب التلف" }]}>
              <Select
                options={damagedTypes}
                placeholder="اختر سبب التلف"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="deviceTypeId"
              label="نوع الجهاز"
              rules={[{ required: true, message: "يرجى اختيار نوع الجهاز" }]}>
              <Select
                options={deviceTypes}
                placeholder="اختر نوع الجهاز"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="date"
              label="التاريخ"
              rules={[{ required: true, message: "يرجى اختيار التاريخ" }]}>
              <DatePicker style={{ width: "267px", height: "45px" }} />
            </Form.Item>
          </div>
          <h1 className="SuperVisor-title-conatiner">
            إضافة صورة الجهاز التالف
          </h1>
          <div className="add-image-section">
            <div className="dragger-container">
              <Dragger
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
                showUploadList={false} // Hide default file list
              >
                <p className="ant-upload-drag-icon">📂</p>
                <p>قم بسحب الملفات أو الضغط هنا لتحميلها</p>
              </Dragger>
            </div>

            <div className="image-previewer-container">
              <ImagePreviewer
                uploadedImages={previewUrls}
                onDeleteImage={handleDeleteImage}
              />
            </div>
          </div>
          <div className="image-previewer-section">
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              loading={isSubmitting}
              disabled={isSubmitting}>
              حفظ
            </Button>
            <Button
              danger
              onClick={handleBack}
              className="add-back-button"
              disabled={isSubmitting}>
              رجوع
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SuperVisorDammagePassportAdd;
