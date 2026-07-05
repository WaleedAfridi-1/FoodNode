import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  onDelete: () => void;
  children: ReactNode; 
}

export default function DeleteDialog({ onDelete, children }: DeleteDialogProps) {
  return (
    <Dialog>
      {/* asChild forwards the click handler perfectly down onto your custom group div */}
      <DialogTrigger asChild>
          {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ">
        <DialogHeader>
          <DialogTitle className="text-red-600 font-black">Delete Food Item</DialogTitle>
          <DialogDescription className="">
            Are you sure you want to delete this item? This action cannot be
            undone and will permanently remove the video from the platform.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="">
              Cancel
            </Button>
          </DialogClose>

          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}