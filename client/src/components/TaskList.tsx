"use client";

import { Pencil } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";
import TaskCheckbox from "@/components/TaskCheckbox";
import { useQuery } from "@tanstack/react-query";

export interface Task {
  id: number;
  status: string;
  content: string;
  created_at: string;
  creator: string;
  creator_id: number;
}

function TaskList() {
  const {
    data: tasks,
    isPending,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000");
      const data = res.json();
      console.log("React Query fetched the data");
      console.log(data);
      return data;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <table className="w-full border-b-2 text-center mx-auto mt-3">
      <thead>
        <tr className="border-b-2">
          <th className="px-1 min-w-40 w-1/2">Task</th>
          <th className="">Created Time</th>
          <th className="">Creator</th>
          <th className="">Operation</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-dotted">
        {tasks.map((task: Task, index: number) => (
          <tr key={index}>
            <td>
              <div className="flex justify-between items-center gap-3">
                <TaskCheckbox
                  id={task.id}
                  content={task.content}
                  status={task.status}
                />

                <div>
                  <Pencil size={20} />
                </div>
              </div>
            </td>
            <td className="text-xs sm:text-sm lg:text-base">
              {task.created_at}
            </td>
            <td className="">{task.creator}</td>
            <td>
              <DeleteButton id={task.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;
