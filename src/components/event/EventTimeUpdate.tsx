import { EditOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import { useState } from "react";

interface EventTimeUpdateProps {
  delayDays: number | null;
  sendHour: number | null;
  onSave: (delayDays: number | null, sendHour: number | null) => void;
}

const EventTimeUpdate: React.FC<EventTimeUpdateProps> = ({
  delayDays,
  sendHour,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDelayDays, setEditDelayDays] = useState<number | null>(delayDays);
  const [editSendHour, setEditSendHour] = useState<number | null>(sendHour);

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveChanges = () => {
    onSave(editDelayDays, editSendHour);
    setIsEditing(false); // 수정 모드 종료
  };

  return (
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <>
          <span>
            {!delayDays && !sendHour && "구매 후 즉시"}
            {delayDays && !sendHour && `구매 ${delayDays}일 후`}
            {!delayDays && sendHour && `구매 당일 ${sendHour}시`}
            {delayDays && sendHour && `구매 ${delayDays}일 후 ${sendHour}시`}
          </span>
          <EditOutlined
            className="cursor-pointer text-gray-500 hover:text-blue-500"
            onClick={toggleEdit}
          />
        </>
      ) : (
        <div className="flex items-center gap-2">
          <InputNumber
            value={editDelayDays}
            min={0}
            placeholder="일"
            onChange={(value) => setEditDelayDays(value)}
            suffix="일 후"
          />
          <InputNumber
            value={editSendHour}
            min={0}
            max={23}
            placeholder="시"
            onChange={(value) => setEditSendHour(value)}
            suffix="시"
          />
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

export default EventTimeUpdate;
