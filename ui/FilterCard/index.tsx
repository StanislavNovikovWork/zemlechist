import { Checkbox } from 'antd';
import styles from './FilterCard.module.css';

/**
 * Интерфейс для пропсов FilterCard
 * @property icon - Иконка фильтра (React элемент)
 * @property label - Название фильтра
 * @property count - Количество элементов
 * @property checked - Состояние выбора
 * @property onChange - Callback при изменении состояния
 * @property color - Цветовая тема карточки (blue, green, orange, purple)
 */
interface FilterCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

const checkboxStyles: Record<string, React.CSSProperties> = {
  blue: { '--ant-color-primary': '#1890ff' } as React.CSSProperties,
  green: { '--ant-color-primary': '#52c41a' } as React.CSSProperties,
  orange: { '--ant-color-primary': '#fa8c16' } as React.CSSProperties,
  purple: { '--ant-color-primary': '#722ed1' } as React.CSSProperties,
};

export function FilterCard({
  icon,
  label,
  count,
  checked,
  onChange,
  color = 'blue',
}: FilterCardProps) {
  return (
    <div
      className={`${styles.card} ${styles[color]} ${checked ? styles.checked : ''}`}
      onClick={() => onChange(!checked)}
    >
      <div className={styles.leftSection}>
        <span style={{ color: checked ? undefined : '#8c8c8c' }}>
          <Checkbox
            checked={checked}
            className={styles.checkbox}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange(e.target.checked)}
          />
        </span>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <span className={styles.count}>{count}</span>
    </div>
  );
}
