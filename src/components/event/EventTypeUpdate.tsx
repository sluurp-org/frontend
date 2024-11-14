import { OrderStatus, OrderStatusMap } from "@/types/orders";
import { EditOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useState } from "react";

interface EventTypeUpdateProps {
  orderStatus: OrderStatus;
  onSave: (orderStatus: OrderStatus) => void;
}

const EventTypeUpdate: React.FC<EventTypeUpdateProps> = ({
  orderStatus,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderStatus, setEventTypeUpdate] =
    useState<OrderStatus>(orderStatus);

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    onSave(editOrderStatus);
    setIsEditing(false); // 수정 모드 종료
  };

  return (
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <>
          <span>{OrderStatusMap[orderStatus]}</span>
          <EditOutlined
            className="cursor-pointer text-gray-500 hover:text-blue-500"
            onClick={toggleEdit}
          />
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Select value={editOrderStatus} onChange={setEventTypeUpdate}>
            {Object.entries(OrderStatusMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
          <button
            className="text-blue-500 hover:underline"
            onClick={saveChanges}
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
};

export default EventTypeUpdate;
