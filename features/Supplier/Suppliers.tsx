"use client";

import { useState } from "react";
import { Table, Button, Typography, Rate, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Supplier } from "@/types/supplier.types";
import { useSupplierDrawerController } from '@/features/SupplierDrawerControll/model/supplierDrawer.store';
import { useMarkersQuery } from '@/features/Map/hooks/queries/useMarkersQuery';

const { Title, Link } = Typography;

export function Suppliers() {
  const { openCreateSupplier, openViewSupplier } = useSupplierDrawerController();
  
  // State for zones filter
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  
  // Zone options 1-8
  const zoneOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Зона ${i + 1}`,
  }));

  // Fetch markers as suppliers
  const { data: markersData, isLoading, error } = useMarkersQuery();
  
  // Helper function to map marker types to readable category names
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      'specialTechnique': 'Специальная техника',
      'garbageCollection': 'Мусоровывоз',
      'constructionSite': 'Стройплощадка',
      'nonMetallicMaterials': 'Неметаллические материалы'
    };
    return typeLabels[type] || type;
  };

  // Extract supplier data from markers GeoJSON
  const allSuppliers = markersData?.features?.map((feature: any) => ({
    id: feature.id,
    company: feature.properties.name || '',
    productCategory: getTypeLabel(feature.properties.type || ''),
    phone: feature.properties.phone || '',
    website: feature.properties.website || '',
    reliability: feature.properties.reliability || 3,
    description: feature.properties.description || '',
    createdAt: feature.properties.updatedAt,
    updatedAt: feature.properties.updatedAt,
    zones: feature.properties.zones,
  })) || [];

  // Filter suppliers based on selected zones
  const suppliers = allSuppliers.filter((supplier: any) => {
    if (selectedZones.length === 0) return true; // No filter applied
    
    if (!supplier.zones) return false; // No zones data
    
    // Handle different zones data formats
    let supplierZones: string[] = [];
    if (typeof supplier.zones === 'string') {
      supplierZones = [supplier.zones];
    } else if (Array.isArray(supplier.zones)) {
      supplierZones = supplier.zones.map(String);
    } else if (typeof supplier.zones === 'object') {
      supplierZones = Object.values(supplier.zones).map(String);
    }
    
    // Check if any supplier zone matches selected zones
    return selectedZones.some(selectedZone => 
      supplierZones.some(supplierZone => supplierZone === selectedZone)
    );
  });


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
      title: "Зоны работ",
      dataIndex: "zones",
      key: "zones",
      render: (zones: any) => {
        if (!zones) return "-";
        if (typeof zones === 'string') return zones;
        if (Array.isArray(zones)) return zones.join(", ");
        return JSON.stringify(zones);
      },
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
        <div className="h-screen">

    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          Поставщики
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateSupplier()}>
          Добавить поставщика
        </Button>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">Зоны работ:</span>
          <Select
            mode="multiple"
            placeholder="Выберите зоны"
            style={{ minWidth: 300 }}
            value={selectedZones}
            onChange={setSelectedZones}
            options={zoneOptions}
            allowClear
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-4 text-red-500">
            Error loading suppliers: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={Array.isArray(suppliers) ? suppliers : []}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => {
                // Convert supplier data to SupplierWithId format
                // Find the original feature data to get missing properties
                const originalFeature = markersData?.features?.find((f: any) => f.id === record.id);
                
                const supplierData = {
                  id: record.id,
                  phone: record.phone || '',
                  coordinates: originalFeature?.geometry?.coordinates || [0, 0],
                  name: record.company,
                  description: record.description || '',
                  type: originalFeature?.properties?.type || 'specialTechnique',
                  reliability: record.reliability,
                  zones: Array.isArray(record.zones) ? record.zones : (record.zones ? [record.zones] : []),
                  website: record.website,
                  company: record.company, // Keep for backward compatibility
                  productCategory: record.productCategory, // Keep for backward compatibility
                };
                openViewSupplier(supplierData);
              },
              style: { cursor: 'pointer' },
            })}
          />
        )}
      </div>
    </div>
        </div>

  );
}
