import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export default function InfoRow({
  label,
  copyable,
  copytext,
  className,
  children,
}: {
  label: string;
  copyable?: boolean;
  copytext?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`sm:flex pt-4 ${className}`}>
      <div className="w-40 font-bold sm:font-medium">{label}</div>
      <div className="mt-1 flex items-center sm:mt-0">
        {children}

        {copyable && (
          <CopyToClipboard
            text={copytext || (children as string)}
            onCopy={() => toast.success("복사되었습니다.")}
          >
            <CopyOutlined className="ml-2 text-gray-400 cursor-pointer" />
          </CopyToClipboard>
        )}
      </div>
    </div>
  );
}
