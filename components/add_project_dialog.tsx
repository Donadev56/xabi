import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const AddProjectDialog = ({
  open,
  onOpenChange,
  onConfirm,
  nameValue,
  setNameValue,
  contractName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  nameValue: string;
  setNameValue: (v: string) => void;
  contractName: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>
            Do you want to save this project to your workspace?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder={contractName || "Project Name"}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="gap-2">
              Save Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
