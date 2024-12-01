import React, { useState } from "react";
import { DataTable } from "mantine-datatable";
import { ActionIcon, Group } from "@mantine/core";
import { Icon } from "@iconify/react";
import Dashboard from './../../../pages/dashBoard.jsx';
import TextFieldForm from "./../../../reusable elements/ReuseAbleTextField.jsx";
import "./adminAttendence.css";

const AdminAttendence = () => {
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [attendanceRecords] = useState([
    {
      id: 1,
      employeeName: "محمد علي", // اسم الموظف
      position: "مدير", // الوظيفة
      date: "2024-11-30", // التاريخ
      status: "حاضر", // الحالة
    },
    {
      id: 2,
      employeeName: "أحمد كريم",
      position: "محاسب",
      date: "2024-11-29",
      status: "غائب",
    },
  ]);

  const applyFilters = (filters) => {
    const { governorate, office, fromDate, toDate } = filters;

    const filtered = attendanceRecords.filter((record) => {
      const matchesGovernorate =
        !governorate || record.employeeName.includes(governorate);
      const matchesOffice = !office || record.position.includes(office);
      const matchesDate =
        (!fromDate || new Date(record.date) >= new Date(fromDate)) &&
        (!toDate || new Date(record.date) <= new Date(toDate));

      return matchesGovernorate && matchesOffice && matchesDate;
    });

    setFilteredRecords(filtered);
  };

  const resetFilters = () => {
    setFilteredRecords([]);
  };

  return (
    <>
      <Dashboard />
      <div className="admin-container" dir="rtl">
        <h1 className="admin-header">قائمة الحضور</h1>

        {/* Filters */}
        <div className="filter-row">
          <TextFieldForm
            fields={[
              {
                name: "governorate",
                label: "المحافظة",
                type: "dropdown",
                placeholder: "اختر المحافظة",
                options: [
                  { value: "بغداد", label: "بغداد" },
                  { value: "نينوى", label: "نينوى" },
                ],
              },
              {
                name: "office",
                label: "المكتب",
                type: "dropdown",
                placeholder: "اختر المكتب",
                options: [
                  { value: "مدير", label: "مدير" },
                  { value: "محاسب", label: "محاسب" },
                ],
              },
              {
                name: "fromDate",
                label: "التاريخ من",
                type: "date",
                placeholder: "",
              },
              {
                name: "toDate",
                label: "التاريخ إلى",
                type: "date",
                placeholder: "",
              },
            ]}
            onFormSubmit={applyFilters}
            onReset={resetFilters}
            formClassName="filter-row"
            inputClassName="filter-input"
            dropdownClassName="filter-dropdown"
            fieldWrapperClassName="filter-field-wrapper"
            buttonClassName="filter-button"
            
          />
        </div>

        {/* Data Table */}
        <DataTable
          withTableBorder
          withColumnBorders
          highlightOnHover
          noRecordsText=""
          records={filteredRecords.length > 0 ? filteredRecords : attendanceRecords}
          key="id"
          
          columns={[
            { accessor: "employeeName", title: "اسم الموظف" },
            { accessor: "position", title: "الوظيفة" },
            { accessor: "date", title: "التاريخ" },
            { accessor: "status", title: "الحالة" },
            {
              accessor: "actions",
              title: "العمليات",
              render: (attendance) => (
                <Group gap={4} wrap="nowrap">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="green"
                    onClick={() => alert(`View: ${attendance.employeeName}`)}
                  >
                    <Icon icon="mdi:eye" width="16" />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => alert(`Edit: ${attendance.employeeName}`)}
                  >
                    <Icon icon="mdi:pencil" width="16" />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => alert(`Delete: ${attendance.employeeName}`)}
                  >
                    <Icon icon="mdi:trash-can" width="16" />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default AdminAttendence;
