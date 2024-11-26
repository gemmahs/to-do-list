"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

type TaskProps = {
  id: number;
  content: string;
  status: string;
};
function TaskCheckbox({ id, content, status }: TaskProps) {
  const [checked, setChecked] = useState(status === "finished");
  const queryClient = useQueryClient();

  async function editStatus(isChecked: boolean) {
    const updatedStatus = {
      id,
      status: isChecked ? "finished" : "unfinished",
    };
    const url = `http://localhost:5000/edit/${id}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStatus),
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log(data.message);
    } catch (error) {
      console.error("Error", error);
    }
  }

  // mutate是一个函数
  const { mutate } = useMutation({
    mutationFn: editStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const debounceMutate = debounce(mutate, 300);
  
  // isChecked indicates whether the checkbox is currently checked or unchecked after the change
  function onToggle(isChecked: boolean) {
    // console.log(isChecked);
    setChecked(isChecked);
    debounceMutate(isChecked);
  }

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        className="my-1"
        checked={checked}
        onCheckedChange={(isChecked) => onToggle(isChecked as boolean)}
      />

      <label
        className={`text-left cursor-pointer ${checked ? "line-through" : ""}`}
      >
        <Link href={`http://localhost:3000/task/${id}`}>{content}</Link>
      </label>
    </div>
  );
}

export default TaskCheckbox;
