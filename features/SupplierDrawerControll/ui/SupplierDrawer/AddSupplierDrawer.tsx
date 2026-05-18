import { Drawer, App } from 'antd';
import { useState } from 'react';
import { AddSupplierForm } from '../SupplierForm';
import { useSupplierDrawerController } from '@/features/SupplierDrawerControll/model/supplierDrawer.store';
import { useUpdateSupplierMutation } from '../../api/mutations/useUpdateSupplierMutation';
import { useCreateSupplierMutation } from '../../api/mutations/useCreateSupplierMutation';
import { useDeleteSupplierMutation } from '../../api/mutations/useDeleteSupplierMutation';
import { SupplierForm } from '../../model/supplier.types';
import { SupplierView, INVOICE_DATA } from '../SupplierView';
import { useMarkersQuery } from '@/features/Map/hooks/queries/useMarkersQuery';

export function AddSupplierDrawer() {
  const { message } = App.useApp();
  const {
    isOpen,
    mode,
    data,
    initialData,
    closeSupplierDrawer,
    openEditSupplier,
    openViewSupplier,
  } = useSupplierDrawerController();

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const { mutateAsync: updateSupplier, isPending: updatePending } =
    useUpdateSupplierMutation();
  const { mutateAsync: createSupplier, isPending: createPending } =
    useCreateSupplierMutation();
  const { mutateAsync: deleteSupplier, isPending: deletePending } =
    useDeleteSupplierMutation();

  const { data: markersData } = useMarkersQuery();
  const allMarkers = markersData?.features || [];

  const isLoading = updatePending || createPending || deletePending;

  const titles = {
    create:
      data?.type === 'constructionSite'
        ? 'Добавить строй площадку'
        : 'Добавить поставщика',
    edit:
      data?.type === 'constructionSite'
        ? 'Редактировать строй площадку'
        : 'Редактировать поставщика',
    view:
      data?.type === 'constructionSite'
        ? 'Информация о строй площадке'
        : 'Информация о поставщике',
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
        message.success(
          data.type === 'constructionSite'
            ? 'Строительная площадка удалена'
            : 'Поставщик удалён'
        );
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
    if (data) {
      openViewSupplier(data);
    }
  };
  const handleClose = () => {
    setIsInvoiceOpen(false);
    closeSupplierDrawer();
  };

  return (
    <Drawer
      title={title}
      placement="right"
      open={isOpen}
      onClose={handleClose}
      size={isInvoiceOpen ? 960 : 420}
      destroyOnHidden
      mask
      rootClassName="glass-drawer"
    >
      {mode === 'view' && data ? (
        <div className="flex" style={{ gap: 0, height: '100%' }}>
          <SupplierView
            initialValues={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deleteLoading={deletePending}
            allMarkers={allMarkers}
            isInvoiceOpen={isInvoiceOpen}
            onToggleInvoice={setIsInvoiceOpen}
          />
          {data.type === 'constructionSite' && isInvoiceOpen && (
            <InvoicePanel />
          )}
        </div>
      ) : (
        <AddSupplierForm
          initialValues={data || (initialData as SupplierForm | null)}
          loading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </Drawer>
  );
}

type InvoiceItem = {
  num: number;
  name: string;
  unit: string;
  quantity: number;
};

function InvoicePanel() {
  return (
    <div
      style={{
        width: 520,
        flexShrink: 0,
        borderLeft: '1px solid #e8e8e8',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '24px' }}>
        <h4 className="text-base font-semibold text-gray-800" style={{ marginBottom: 16 }}>
          Смета
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '36px 1fr 56px 56px',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 600,
            paddingBottom: 8,
            borderBottom: '2px solid #e8e8e8',
          }}
        >
          <span>№</span>
          <span>Наименование</span>
          <span style={{ textAlign: 'right' }}>Ед. изм.</span>
          <span style={{ textAlign: 'right' }}>Кол-во</span>
        </div>
        {INVOICE_DATA.map((item: InvoiceItem) => (
          <div
            key={item.num}
            style={{
              display: 'grid',
              gridTemplateColumns: '36px 1fr 56px 56px',
              gap: '8px',
              padding: '6px 0',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '13px',
              color: '#262626',
            }}
          >
            <span>{item.num}</span>
            <span>{item.name}</span>
            <span style={{ textAlign: 'right' }}>{item.unit}</span>
            <span style={{ textAlign: 'right' }}>{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
