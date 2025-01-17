"use client";

import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type EditTaskProps = {
  id: number;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

function EditTaskContent({
  id,
  setIsEditing,
  content,
  setContent,
}: EditTaskProps) {
  // 不用 useState搭配onChange的原因是没有必要记录输入框里的每一次变化。我只需要点击确认按钮时输入框里的值
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function editContent(input: string) {
    const updatedTask = {
      id,
      content: input,
    };
    const url = `http://localhost:5000/edit/${id}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  }

  // mutate是一个函数
  const { mutate } = useMutation({
    mutationFn: editContent,
    onError: (error) => {
      toast({
        variant: "destructive",
        description: `${error.message}`,
      });
    },
    onSuccess: () => {
      toast({
        variant: "success",
        description: "You've successfully updated the task",
      });
    },
  });

  function handleInputCancel() {
    setIsEditing(false);
  }

  function handleInputConfirm() {
    if (!inputRef.current) return;
    const trimmedInput = inputRef.current.value.trim();
    if (!trimmedInput) {
      toast({
        variant: "destructive",
        description: "Input must not be empty",
      });
      //   inputRef.current.value = content;
      return;
    }
    if (trimmedInput !== content) {
      // console.log(trimmedInput);
      setContent(trimmedInput);
      mutate(trimmedInput);
    }
    setIsEditing(false);
  }

  return (
    <div className="flex-1 flex justify-between items-start gap-2">
      <Input
        type="text"
        autoComplete="off"
        defaultValue={content}
        ref={inputRef}
        className="text-sm"
      />

      <div className="flex flex-col text-secondary p-[2px] sm:flex-row gap-2 items-center">
        <div
          className="cursor-pointer p-[2px] bg-red-500 rounded"
          onClick={handleInputCancel}
        >
          <X size={18} />
        </div>
        <div
          className="cursor-pointer p-[2px] bg-green-500 rounded"
          onClick={handleInputConfirm}
        >
          <Check size={18} />
        </div>
      </div>
    </div>
  );
}

export default EditTaskContent;
