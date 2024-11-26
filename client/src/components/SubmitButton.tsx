"use client";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TaskProps {
  content: string;
  username: string;
}
function SubmitButton({ content, username }: TaskProps) {
  const queryClient = useQueryClient();
  const url = `http://localhost:5000/add`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content.trim(),
      username: capitalize(username.trim()),
    }),
  };

  async function onSubmit() {
    if (content.trim() && username.trim()) {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);
    } else {
      alert("Task content and user must not be empty");
    }
  }

  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div>
      <Button onClick={() => mutation.mutate()}>Add</Button>
    </div>
  );
}

export default SubmitButton;
