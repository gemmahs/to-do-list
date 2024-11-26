"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

function DeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();

  async function handleDelete(id: number) {
    const url = `http://localhost:5000/delete/${id}`;
    const options = {
      method: "DELETE",
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] })
  })

  return (
    <div className="flex justify-center">
      <div
        className="cursor-pointer p-[5px] rounded-full hover:bg-accent hover:text-red-500"
        onClick={() => mutation.mutate(id)}
      >
        <Trash2 size={20} />
      </div>
    </div>
  );
}

export default DeleteButton;
