import React from "react";
import { Input, InputNumber, Space } from "antd";

interface DurationInputProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const [days, setDays] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  React.useEffect(() => {
    if (value !== undefined) {
      const totalMinutes = value;
      const d = Math.floor(totalMinutes / (24 * 60));
      const h = Math.floor((totalMinutes % (24 * 60)) / 60);
      const m = totalMinutes % 60;

      setDays(d);
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const handleChange = (field: string, val: number | null) => {
    let d = field === "days" ? val || 0 : days;
    let h = field === "hours" ? val || 0 : hours;
    let m = field === "minutes" ? val || 0 : minutes;

    const totalMinutes = d * 24 * 60 + h * 60 + m;
    onChange && onChange(totalMinutes);
  };

  return (
    <Space className={className}>
      <InputNumber
        min={0}
        value={days}
        onChange={(val) => handleChange("days", val)}
        addonAfter="일"
      />
      <InputNumber
        min={0}
        max={23}
        value={hours}
        onChange={(val) => handleChange("hours", val)}
        addonAfter="시간"
      />
      <InputNumber
        min={10}
        max={59}
        value={minutes}
        onChange={(val) => handleChange("minutes", val)}
        addonAfter="분"
      />
    </Space>
  );
};

export default DurationInput;
