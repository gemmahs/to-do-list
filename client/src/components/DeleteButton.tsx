"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";

function DeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();

  async function handleDelete(id: number) {
    const url = `${baseUrl}/delete/${id}`;
    const options = {
      method: "DELETE",
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      // console.log(data.message);
      if (!res.ok) throw new Error(data.message);
      toast({
        variant: "success",
        description: data.message,
      });
    } catch (error) {
      // console.error(error);
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message || "An unknown error has occurred",
        });
      }
    }
  }

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <div className="flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer p-[5px] rounded-full hover:bg-accent hover:text-red-500 active:bg-accent active:text-red-500">
            <Trash2 size={20} />
          </div>
        </DialogTrigger>
        <DialogContent className="py-8 sm:py-6">
          <DialogHeader>
            <DialogTitle>Are you sure to delete the task?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={() => mutation.mutate(id)}>
              Delete
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteButton;
