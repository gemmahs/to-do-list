"use client";

import TaskInput from "@/components/TaskInput";
import UserSearchBar from "@/components/UserSearchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [user, setUser] = useState("");

  const queryClient = useQueryClient();
  const url = `http://localhost:5000/add`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: task.trim(),
      username: capitalize(user.trim()),
    }),
  };

  async function onSubmit() {
    if (task.trim() && user.trim()) {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);
      setTask("");
      setUser("");
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
    <div className="flex flex-col sm:flex-row gap-4 py-2 px-3">
      <TaskInput task={task} setTask={setTask} />

      <div className="flex justify-between items-end gap-4">
        <UserSearchBar searchTerm={user} setSearchTerm={setUser} />

        <div>
          <Button onClick={() => mutation.mutate()}>Add</Button>
        </div>
      </div>
    </div>
  );
}
