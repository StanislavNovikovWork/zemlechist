import { Drawer } from "antd";
import { AddSupplierForm } from "../AddSupplierForm";
import { useAddSupplierDrawerStore } from "@/store/addMarkerDrawerStore";
import { message } from "antd";
import { useEffect } from "react";

/**
 * Пропсы компонента AddSupplierDrawer
 * @property open - Состояние открытия drawer
 * @property onClose - Callback при закрытии drawer
 */
interface AddSupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function AddSupplierDrawer({ open, onClose }: AddSupplierDrawerProps) {
  const store = useAddSupplierDrawerStore();
  const { mode, coordinates, properties, onSuccess, onSave, onDelete, onCancel, loading, deleteLoading, setMode } = store;

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Добавить поставщика';
      case 'edit':
        return 'Редактировать поставщика';
      case 'view':
        return 'Информация о поставщике';
      default:
        return 'Поставщик';
    }
  };

  const handleSave = (values: any) => {
    if (onSave) {
      onSave(values);
    } else {
      // Для обратной совместимости с созданием маркера
      message.success('Сохранено');
      onSuccess?.();
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleEdit = () => {
    setMode('edit', {
      onSave,
      onDelete,
      onCancel: () => setMode('view'),
      loading,
      deleteLoading,
    });
  };

  return (
    <Drawer
      title={getTitle()}
      placement="right"
      open={open}
      onClose={onClose}
      size="default"
    >
      <AddSupplierForm
        onSave={handleSave}
        onCancel={handleCancel}
        loading={loading}
        initialCoordinates={coordinates}
        onSuccess={onSuccess}
        properties={properties}
        isEditing={mode === 'edit'}
        isViewMode={mode === 'view'}
        onDelete={onDelete}
        deleteLoading={deleteLoading}
        onEdit={mode === 'view' ? handleEdit : undefined}
      />
    </Drawer>
  );
}
