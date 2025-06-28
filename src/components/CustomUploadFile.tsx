import { ChangeEvent } from "react";
import { FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomUploadFileProps {
  id: string;
  title: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
}

const CustomUploadFile = ({
  id,
  title,
  onFileChange,
  fileName,
}: CustomUploadFileProps) => (
  <div>
    <div className="bg-[#EF5A5A] text-white text-center p-2 rounded-t-lg font-semibold mb-1">
      {title}
    </div>
    <div className="border-2 border-dashed border-gray-300 rounded-b-lg p-6 text-center">
      <label
        htmlFor={id}
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        <FileUp className="w-8 h-8 mb-1" />
        {fileName ? (
          <span className="text-sm font-semibold text-gray-800">
            {fileName}
          </span>
        ) : (
          <div>
            <span className="text-[#EF5A5A] font-semibold">pilih</span>{" "}
            <span className="text-blzck font-semibold">
              file untuk diupload
            </span>
          </div>
        )}
        <p className="text-sm text-[#6E7E9D]">mendukung format pdf dan docx</p>
      </label>
      <Input
        id={id}
        type="file"
        className="hidden" // Input file asli kita sembunyikan
        onChange={onFileChange}
        accept=".pdf,.docx"
      />
    </div>
  </div>
);

export default CustomUploadFile;
