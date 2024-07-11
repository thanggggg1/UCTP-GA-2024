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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useImportCoursesMutation } from "@/store/APIs/courses";
import { useGetCurrentUserQuery } from "@/store/APIs/user";

export default function ModalImportCourses({
  open,
  onOpenChange,
  hide,
}: {
  open: boolean;
  hide: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const { data: currentUser } = useGetCurrentUserQuery();

  const [
    importCoursesExcel,
    {
      isLoading: isImporting,
      error: importError,
      isSuccess: isImportSuccess,
      isError: isImportError,
    },
  ] = useImportCoursesMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDownloadTemplate = useCallback(async () => {
    const fileName = "courses-template";
    const sheetName = "template";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    //set initial header for the excel file
    worksheet.columns = [
      { header: "Mã môn học", key: "code", width: 20 },
      { header: "Mã học phần", key: "code_hp", width: 30 },
      { header: "Tên học phần", key: "name", width: 60 },
      { header: "Thời gian/Số tiết", key: "hours", width: 20 },
      { header: "Mô tả", key: "hours", width: 20 },
      { header: "Lập lịch", key: "divisible", width: 40 },
      { header: "Loại lớp", key: "type", width: 50 },
      { header: "Giảng viên", key: "instructor_ids", width: 50 },
      {
        header: "Sinh viên đăng kí",
        key: "num_of_registrations",
        width: 20,
      },
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
    worksheet.getColumn("code_hp").toString();
    worksheet.getColumn("name").toString();
    worksheet.getColumn("type").toString();

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }, []);

  const onSubmit = useCallback(() => {
    if (!file) {
      toast.warning("Please select a file to import");
      return;
    }
    importCoursesExcel({
      file,
      university_id: currentUser?.UniversityID || "",
    });
    setFile(null);
    hide();
  }, [file, importCoursesExcel, hide, currentUser?.UniversityID]);

  const onCanceled = useCallback(() => {
    setFile(null);
    hide();
  }, [hide]);

  useCreateStatusMessages({
    isLoading: isImporting,
    isError: isImportError,
    isSuccess: isImportSuccess,
    error: importError,
    title: "Courses",
    action: "Import",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Courses</DialogTitle>
          <DialogDescription>
            Import courses from an Excel file. Please download{" "}
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
