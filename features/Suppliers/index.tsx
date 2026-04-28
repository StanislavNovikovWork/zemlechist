"use client";

import { useState } from "react";
import { Table, Button, message, Typography, Rate } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/types/supplier.types";
import { useSupplierDrawer } from "@/features/AddSupplierDrawer/hooks/useAddMarkerDrawer";

const { Title, Link } = Typography;

export function Suppliers() {
  const queryClient = useQueryClient();
  const { open } = useSupplierDrawer();

  // Fetch suppliers
  const { data: suppliers = [], isLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      return response.json();
    },
  });

  // Create supplier mutation
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create supplier");
      return response.json();
    },
    onSuccess: () => {
      message.success("Поставщик успешно добавлен");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: () => {
      message.error("Ошибка при добавлении поставщика");
    },
  });

  const handleAddSupplier = () => {
    open('create', {
      onSave: (values: any) => {
        createMutation.mutate(values);
      },
    });
  };

  const columns = [
    {
      title: "Компания",
      dataIndex: "company",
      key: "company",
      sorter: (a: Supplier, b: Supplier) => a.company.localeCompare(b.company),
    },
    {
      title: "Категория продукции",
      dataIndex: "productCategory",
      key: "productCategory",
      sorter: (a: Supplier, b: Supplier) => (a.productCategory || "").localeCompare(b.productCategory || ""),
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Сайт",
      dataIndex: "website",
      key: "website",
      render: (website: string) =>
        website ? (
          <Link href={website} target="_blank">
            {website}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      title: "Надежность",
      dataIndex: "reliability",
      key: "reliability",
      render: (reliability: number) => <Rate disabled value={reliability} />,
      sorter: (a: Supplier, b: Supplier) => a.reliability - b.reliability,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Поставщики
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSupplier}>
          Добавить поставщика
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          dataSource={suppliers}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
