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
      size={isInvoiceOpen ? 1200 : 420}
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
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div
      style={{
        width: 720,
        flexShrink: 0,
        borderLeft: '1px solid #e8e8e8',
        borderRight: '1px solid #e8e8e8',
        overflowY: 'auto',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ padding: '24px' }}>
        <h4 className="text-base font-semibold text-gray-800" style={{ marginBottom: 12 }}>
          Смета
        </h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
              {['№', 'Наименование', 'Ед. изм.', 'Кол-во'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Кол-во' || h === 'Ед. изм.' ? 'right' : 'left',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#595959',
                    padding: '6px 8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICE_DATA.map((item: InvoiceItem) => {
              const evenRow = item.num % 2 === 0;
              const isHovered = hoveredRow === item.num;
              return (
                <tr
                  key={item.num}
                  onMouseEnter={() => setHoveredRow(item.num)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    backgroundColor: isHovered
                      ? '#f0f5ff'
                      : evenRow
                        ? '#fafafa'
                        : '#fff',
                    transition: 'background-color 0.15s ease',
                    cursor: 'default',
                  }}
                >
                  <td style={{ padding: '6px 8px', color: '#8c8c8c' }}>{item.num}</td>
                  <td style={{ padding: '6px 8px', color: '#262626' }}>{item.name}</td>
                  <td style={{ textAlign: 'right', padding: '6px 8px', color: '#595959' }}>{item.unit}</td>
                  <td style={{ textAlign: 'right', padding: '6px 8px', color: '#262626', fontWeight: 500 }}>
                    {item.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
