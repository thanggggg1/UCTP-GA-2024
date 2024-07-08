import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useCallback, useState } from "react";
import { useCreateStatusMessages } from "@/hooks/useStatusMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useImportInstructorsMutation } from "@/store/APIs/instructors";

export default function ModalImportInstructors({
  open,
  onOpenChange,
  hide,
}: {
  open: boolean;
  hide: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const [
    importEmployeesExcel,
    {
      isLoading: isImporting,
      error: importError,
      isSuccess: isImportSuccess,
      isError: isImportError,
    },
  ] = useImportInstructorsMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDownloadTemplate = useCallback(async () => {
    const fileName = "instructors-template";
    const sheetName = "template";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    //set initial header for the excel file
    worksheet.columns = [
      { header: "Mã giảng viên", key: "code", width: 20 },
      { header: "Tên giảng viên", key: "name", width: 120 },
      { header: "Giờ dạy", key: "hours", width: 20 },
      { header: "Email", key: "email", width: 50 },
      { header: "Mật khẩu", key: "password", width: 50 },
      { header: "Lịch dạy", key: "schedule", width: 50 },
      { header: "Trạng thái", key: "status", width: 20 },
    ];
    //set style for header
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "darkTrellis",
        fgColor: { argb: "FFFFFF00" },
        bgColor: { argb: "FF0000FF" },
      };
      cell.font = {
        size: 14,
        bold: true,
      };
    });
    worksheet.getColumn("code").toString();
    worksheet.getColumn("name").toString();
    worksheet.getColumn("hours").toString();
    worksheet.getColumn("email").toString();
    worksheet.getColumn("password").toString();

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }, []);

  const onSubmit = useCallback(() => {
    if (!file) {
      toast.warning("Please select a file to import");
      return;
    }
    importEmployeesExcel({ file });
    setFile(null);
    hide();
  }, [file, importEmployeesExcel, hide]);

  const onCanceled = useCallback(() => {
    setFile(null);
    hide();
  }, [hide]);

  useCreateStatusMessages({
    isLoading: isImporting,
    isError: isImportError,
    isSuccess: isImportSuccess,
    error: importError,
    title: "Instructors",
    action: "Import",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Instructors</DialogTitle>
          <DialogDescription>
            Import instructors from an Excel file. Please download{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={handleDownloadTemplate}
            >
              the template file
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="xlsxFile" type="file" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
