import React, { useState, useEffect } from "react";
import { Image, Button, Modal } from "antd";
import { LeftOutlined, RightOutlined, DeleteOutlined } from "@ant-design/icons";
import "./styles/imagePreViewer.css";

export default function ImagePreviewer({
  uploadedImages,
  onDeleteImage,
  defaultWidth = 400,
  defaultHeight = 200,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    setCurrentIndex(0); // Reset the index when images change
  }, [uploadedImages]);

  const handleNext = () => {
    if (currentIndex < uploadedImages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const showDeleteConfirm = () => {
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteImage) {
      onDeleteImage(currentIndex);
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    setIsDeleteConfirmVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmVisible(false);
  };

  if (!uploadedImages || uploadedImages.length === 0) {
    return <p>لا توجد صور للعرض</p>;
  }

  return (
    <div className="image-previewer-container">
      <div className="image-display">
        <Image
          width={defaultWidth}
          height={defaultHeight}
          src={uploadedImages[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="image-preview-item"
        />
      </div>

      <div className="image-pagination-controls">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="pagination-button previous-button">
          السابق
        </Button>
        <span className="pagination-info">
          {currentIndex + 1} / {uploadedImages.length}
        </span>
        <Button
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={currentIndex === uploadedImages.length - 1}
          className="pagination-button next-button">
          التالي
        </Button>
      </div>

      {onDeleteImage && (
        <div className="image-delete-button-container">
          <Button
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            danger
            className="delete-button">
            حذف
          </Button>
        </div>
      )}

      <Modal
        title="تأكيد الحذف"
        visible={isDeleteConfirmVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="نعم"
        cancelText="لا">
        <p>هل أنت متأكد أنك تريد حذف هذه الصورة؟</p>
      </Modal>
    </div>
  );
}
