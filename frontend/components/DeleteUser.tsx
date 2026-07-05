"use client";

import { ReactNode, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface AlertDialogDemoProps {
  handleDeleteUser: () => Promise<{ error?: string } | undefined>;
  children: ReactNode;
  userRole : String;
}

export function AlertDialogDemo({
  userRole,
  handleDeleteUser,
  children,
}: AlertDialogDemoProps) {
  const [isPending, startTransition] = useTransition();

  const onConfirm = () => {
    startTransition(async () => {
      const res = await handleDeleteUser();
      if (res?.error) {
        console.log("response error:",res)
        toast.error(res.error);
      } else {
        toast.success("Account permanently deleted.");
        userRole === 'food-partner' ? (
          setTimeout(() => {
            window.location.href = `/food-partner/register`
          },1000)
        ) : (
          setTimeout(() => {
            window.location.href = `/user/register`
          },1000)
        )
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="p-2 bg-zinc-900 border cursor-pointer border-zinc-800 rounded-full text-zinc-500 hover:text-red-500 hover:bg-zinc-800/60 transition active:scale-90 flex items-center justify-center outline-none"
          title="Delete Account"
        >
          {children}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 mt-4">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
