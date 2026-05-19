import { Drawer, App, Button, Modal } from 'antd';
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  const isConstructionSite = data?.type === 'constructionSite';

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
        setIsDeleteModalOpen(false);
        closeSupplierDrawer();
      },
      onError: () => {
        message.error('Ошибка при удалении');
      },
    });
  };

  const handleDrawerHeaderDelete = () => {
    setIsDeleteModalOpen(true);
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
    setIsDeleteModalOpen(false);
    closeSupplierDrawer();
  };

  const drawerHeader = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <span style={{ fontWeight: 500 }}>{title}</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {isConstructionSite && (
          <Button
            type="text"
            size="small"
            onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
            title={isInvoiceOpen ? 'Закрыть смету' : 'Открыть смету'}
            style={{ color: isInvoiceOpen ? '#1890ff' : 'inherit' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </Button>
        )}
        <Button
          type="text"
          size="small"
          onClick={handleEdit}
          title="Редактировать"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </Button>
        <Button
          type="text"
          size="small"
          danger
          onClick={handleDrawerHeaderDelete}
          loading={deletePending}
          title="Удалить"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Drawer
        title={drawerHeader}
        placement="right"
        open={isOpen}
        onClose={handleClose}
        size={isInvoiceOpen ? 1200 : 440}
        destroyOnHidden
        mask
        rootClassName="glass-drawer"
      >
        {mode === 'view' && data ? (
          <div className="flex" style={{ gap: 0, height: '100%' }}>
            <SupplierView
              initialValues={data}
              onEdit={handleEdit}
              allMarkers={allMarkers}
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
      <Modal
        title="Удалить?"
        open={isDeleteModalOpen}
        onOk={async () => {
          await handleDelete();
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: deletePending }}
        zIndex={1080}
      >
        <p>Вы уверены?</p>
      </Modal>
    </>
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
        <h4
          className="text-base font-semibold text-gray-800"
          style={{ marginBottom: 12 }}
        >
          Смета
        </h4>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
              {['№', 'Наименование', 'Ед. изм.', 'Кол-во'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign:
                      h === 'Кол-во' || h === 'Ед. изм.' ? 'right' : 'left',
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
                  <td style={{ padding: '6px 8px', color: '#8c8c8c' }}>
                    {item.num}
                  </td>
                  <td style={{ padding: '6px 8px', color: '#262626' }}>
                    {item.name}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '6px 8px',
                      color: '#595959',
                    }}
                  >
                    {item.unit}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '6px 8px',
                      color: '#262626',
                      fontWeight: 500,
                    }}
                  >
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
