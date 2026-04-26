import { Drawer } from "antd";
import { AddMarkerForm } from "../AddMarkerForm";
import { useCreateMarkerMutation } from "../../hooks/mutations/useCreateMarkerMutation";
import { useAddMarkerDrawerStore } from "@/store/addMarkerDrawerStore";
import { message } from "antd";

/**
 * Пропсы компонента AddMarkerDrawer
 * @property open - Состояние открытия drawer
 * @property onClose - Callback при закрытии drawer
 */
interface AddMarkerDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AddMarkerDrawer({ open, onClose }: AddMarkerDrawerProps) {
  const createMarkerMutation = useCreateMarkerMutation();
  const coordinates = useAddMarkerDrawerStore((state: any) => state.coordinates);
  const onSuccess = useAddMarkerDrawerStore((state: any) => state.onSuccess);

  const handleCreateMarker = (values: any) => {
    // Парсим координаты из строки "широта, долгота" в массив [долгота, широта]
    const coordsArray = values.coordinates.split(',').map((coord: string) => parseFloat(coord.trim()));
    const coordinatesArray: [number, number] = [coordsArray[1], coordsArray[0]]; // [долгота, широта]

    createMarkerMutation.mutate(
      { ...values, coordinates: coordinatesArray },
      {
        onSuccess: () => {
          message.success('Маркер успешно создан');
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          message.error('Ошибка при создании маркера');
        },
      }
    );
  };

  return (
    <Drawer
      title="Добавить маркер"
      placement="right"
      open={open}
      onClose={onClose}
      size="default"
    >
      <AddMarkerForm
        onSave={handleCreateMarker}
        onCancel={onClose}
        loading={createMarkerMutation.isPending}
        initialCoordinates={coordinates}
      />
    </Drawer>
  );
}
