import { Drawer, message } from "antd";
import { AddSupplierForm } from "../AddSupplierForm";
import { useSupplierDrawerController, type SupplierForm } from "@/store/addMarkerDrawerStore";
import { useUpdateSupplierMutation } from "../../hooks/mutations/useUpdateSupplierMutation";
import { useCreateSupplierMutation } from "../../hooks/mutations/useCreateSupplierMutation";
import { useDeleteSupplierMutation } from "../../hooks/mutations/useDeleteSupplierMutation";

export function AddSupplierDrawer() {
  const {
    isOpen,
    mode,
    data,
    close,
    openEditSupplier,
  } = useSupplierDrawerController();

  const { mutateAsync: updateSupplier, isPending: updatePending } = useUpdateSupplierMutation();
  const { mutateAsync: createSupplier, isPending: createPending } = useCreateSupplierMutation();
  const { mutateAsync: deleteSupplier, isPending: deletePending } = useDeleteSupplierMutation();

  const isLoading = updatePending || createPending || deletePending;

const titles = {
  create: "Добавить поставщика",
  edit: "Редактировать поставщика",
  view: "Информация о поставщике",
} as const;

const title = titles[mode]

const handleSubmit = (values: SupplierForm) => {
  const isEdit = mode === "edit" && data?.id;

  const action = isEdit ? updateSupplier : createSupplier;
  const payload = isEdit
    ? { id: data!.id, ...values }
    : values;

  action(payload, {
    onSuccess: () => {
      message.success("Сохранено");
      close();
    },
    onError: () => {
      message.error("Ошибка при сохранении");
    },
  });
};

const handleDelete = () => {
  if (mode !== "view" || !data) return;

  deleteSupplier(data.id, {
    onSuccess: () => {
      message.success("Поставщик удалён");
      close();
    },
    onError: () => {
      message.error("Ошибка при удалении");
    },
  });
};

  const handleCancel = () => {
    close();
  };

  const handleEdit = () => {
    if (data) {
      openEditSupplier(data);
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      open={isOpen}
      onClose={close}
      size="default"
    >
      <AddSupplierForm
        initialValues={data}
        mode={mode}
        loading={isLoading}
        deleteLoading={deletePending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={mode === "view" ? handleDelete : undefined}
        onEdit={mode === "view" ? handleEdit : undefined}
      />
    </Drawer>
  );
}