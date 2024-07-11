import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

export const CustomTableButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="button"
      size={"sm"}
      onClick={onClick}
      className="button text-white bg-red-500 hover:bg-red-700"
    >
      <TrashIcon size={12} />
      Delete Selected
    </Button>
  );
};
