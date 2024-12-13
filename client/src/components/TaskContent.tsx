"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import EditTaskContent from "@/components/EditTaskContent";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TaskProps = {
  id: number;
  content: string;
  status: string;
};
function TaskContent({ id, content, status }: TaskProps) {
  const [checked, setChecked] = useState(status === "finished");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  }

  // mutate是一个函数
  const { mutate } = useMutation({
    mutationFn: editStatus,
    onError: (error) => {
      toast({
        variant: "destructive",
        description: `${error.message}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        description: "You've successfully changed the status of the task",
      });
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
    <div className="flex items-start gap-3">
      <Checkbox
        disabled={isEditing}
        className="my-1"
        checked={checked}
        onCheckedChange={(isChecked) => onToggle(isChecked as boolean)}
      />

      {!isEditing ? (
        <div className="flex-1 flex justify-between items-start gap-2">
          <label
            className={`text-left cursor-pointer ${
              checked ? "line-through" : ""
            }`}
          >
            <Link href={`http://localhost:3000/task/${id}`}>
              {updatedContent}
            </Link>
          </label>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="text-border opacity-50 cursor-pointer p-[2px] rounded-full hover:text-primary hover:opacity-100 active:text-primary active:opacity-100"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Edit the content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <EditTaskContent
          id={id}
          setIsEditing={setIsEditing}
          content={updatedContent}
          setContent={setUpdatedContent}
        />
      )}
    </div>
  );
}

export default TaskContent;
