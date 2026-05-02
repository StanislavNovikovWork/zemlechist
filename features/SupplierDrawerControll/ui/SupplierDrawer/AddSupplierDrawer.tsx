import { Drawer, message } from 'antd';
import { AddSupplierForm } from '../SupplierForm';
import { useSupplierDrawerController } from '@/features/SupplierDrawerControll/model/supplierDrawer.store';
import { useUpdateSupplierMutation } from '../../api/mutations/useUpdateSupplierMutation';
import { useCreateSupplierMutation } from '../../api/mutations/useCreateSupplierMutation';
import { useDeleteSupplierMutation } from '../../api/mutations/useDeleteSupplierMutation';
import { SupplierView } from '../SupplierView';
import { SupplierForm } from '../../model/supplier.types';

export function AddSupplierDrawer() {
  const { isOpen, mode, data, closeSupplierDrawer, openEditSupplier, openViewSupplier } =
    useSupplierDrawerController();

  const { mutateAsync: updateSupplier, isPending: updatePending } =
    useUpdateSupplierMutation();
  const { mutateAsync: createSupplier, isPending: createPending } =
    useCreateSupplierMutation();
  const { mutateAsync: deleteSupplier, isPending: deletePending } =
    useDeleteSupplierMutation();

  const isLoading = updatePending || createPending || deletePending;

  const titles = {
    create: data?.type === 'constructionSite' ? 'Добавить строй площадку' : 'Добавить поставщика',
    edit: data?.type === 'constructionSite' ? 'Редактировать строй площадку' : 'Редактировать поставщика',
    view: data?.type === 'constructionSite' ? 'Информация о строй площадке' : 'Информация о поставщике',
  } as const;

  const title = titles[mode];

  const handleSubmit = (values: SupplierForm) => {
    const isEdit = mode === 'edit' && data?.id;
    const action = isEdit ? updateSupplier : createSupplier;
    const payload = isEdit ? { id: data!.id, ...values } : values;

    action(payload, {
      onSuccess: () => {
        message.success('Сохранено');
        closeSupplierDrawer();
      },
      onError: () => {
        message.error('Ошибка при сохранении');
      },
    });
  };

  const handleDelete = async () => {
    if (mode !== 'view' || !data) return;

    await deleteSupplier(data.id, {
      onSuccess: () => {
        message.success(data.type === 'constructionSite' ? 'Строительная площадка удалена' : 'Поставщик удалён');
        closeSupplierDrawer();
      },
      onError: () => {
        message.error('Ошибка при удалении');
      },
    });
  };


  const handleEdit = () => {
    if (data) {
      openEditSupplier(data);
    }
  };

  const handleCancel = () => {
    if(data) {
      openViewSupplier(data);
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      open={isOpen}
      onClose={closeSupplierDrawer}
      size="default"
      destroyOnHidden
    >
      {mode === 'view' && data ? (
        <SupplierView
          initialValues={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteLoading={deletePending}
        />
      ) : (
        <AddSupplierForm
          initialValues={data}
          loading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </Drawer>
  );
}
