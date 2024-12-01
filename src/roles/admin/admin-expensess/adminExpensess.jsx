import React from "react";
import { useLocation } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import { ActionIcon, Group } from "@mantine/core";
import { Icon } from "@iconify/react";
import Dashboard from "../../../pages/dashBoard.jsx";
import './adminExpensess.css';
const Admin = () => {
  const location = useLocation();

  const expenseRecords = [
    {
      id: 1,
      governorate: "بغداد", // المحافظة
      office: "الرصافة", // المكتب
      supervisorName: "محمد علي", // اسم المشرف
      cost: "500000 دينار", // الكلفة
      date: "2024-11-30", // التاريخ
    },
    {
      id: 2,
      governorate: "نينوى",
      office: "الموصل",
      supervisorName: "احمد كريم",
      cost: "300000 دينار",
      date: "2024-11-29",
    },
  ];

  const showModal = ({ expense, action }) => {
    alert(`Action: ${action}, Expense: ${JSON.stringify(expense)}`);
  };

  return (
    <>
      <Dashboard />
      <div className="admin-container" dir="rtl">
        <h1 className="admin-header">قائمة المصاريف</h1>
        <DataTable
          withTableBorder
          withColumnBorders
          highlightOnHover
          records={expenseRecords}
          key="id"
          noRecordsText=""
          columns={[
            { accessor: "governorate", title: "المحافظة" }, // Only one "المحافظة" column
            { accessor: "office", title: "المكتب" },
            { accessor: "supervisorName", title: "اسم المشرف" },
            { accessor: "cost", title: "الكلفة" },
            { accessor: "date", title: "التاريخ" },
            {
              accessor: "actions",
              title: "العمليات",
              render: (expense) => (
                <Group gap={4} wrap="nowrap">
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="green"
                    onClick={() => showModal({ expense, action: "view" })}
                  >
                    <Icon icon="mdi:eye" width="16" />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => showModal({ expense, action: "edit" })}
                  >
                    <Icon icon="mdi:pencil" width="16" />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => showModal({ expense, action: "delete" })}
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

export default Admin;
