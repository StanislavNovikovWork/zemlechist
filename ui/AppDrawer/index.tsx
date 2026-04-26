import { Drawer, DrawerProps, Space, Button } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

/**
 * Пропсы компонента AppDrawer
 * @property title - Заголовок drawer
 * @property children - Контент drawer
 * @property open - Состояние открытия drawer
 * @property onClose - Callback при закрытии drawer
 * @property placement - Позиция drawer (left, right, top, bottom)
 * @property size - Размер drawer (default, large)
 * @property actions - Дополнительные элементы в заголовке (кнопки и т.д.)
 * @property isEditing - Режим редактирования (показывает кнопку сохранения/редактирования)
 * @property onToggleEdit - Callback при переключении режима редактирования
 */
interface AppDrawerProps extends Omit<DrawerProps, 'title' | 'children'> {
  title: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'default' | 'large';
  actions?: React.ReactNode;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export function AppDrawer({
  title,
  children,
  open,
  onClose,
  placement = 'right',
  size = 'default',
  actions,
  isEditing,
  onToggleEdit,
  ...props
}: AppDrawerProps) {
  const editButton = isEditing !== undefined && onToggleEdit ? (
    <Button
      type="text"
      icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
      onClick={onToggleEdit}
    />
  ) : null;

  const headerContent = (
    <Space>
      {title}
      {editButton}
      {actions}
    </Space>
  );

  return (
    <Drawer
      title={headerContent}
      placement={placement}
      open={open}
      onClose={onClose}
      size={size}
      {...props}
    >
      {children}
    </Drawer>
  );
}
