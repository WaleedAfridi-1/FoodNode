import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LogoutDialogProps {
  onLogout: () => void; 
  children: ReactNode; // Accepts the SVG icon passed from the parent
}

export default function LogoutDialog({ onLogout, children }: LogoutDialogProps) {
  return (
    <Dialog>
      {/* This trigger button now uses your custom look and holds the SVG icon */}
      <DialogTrigger asChild>
        <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-red-500 hover:bg-zinc-800 transition active:scale-90 flex items-center justify-center">
          {children}
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          
          <Button variant="destructive" onClick={onLogout}>
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}