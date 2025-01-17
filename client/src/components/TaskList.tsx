"use client";

import DeleteButton from "@/components/DeleteButton";
import TaskContent from "@/components/TaskContent";
import { useQuery } from "@tanstack/react-query";
import ScaleLoader from "react-spinners/ScaleLoader";
import Link from "next/link";

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log(data);
      return data;
    },
  });

  if (isPending)
    return (
      <div className="text-center mt-3">
        <ScaleLoader />
        <p>Loading...</p>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-b-2 text-center mx-auto mt-3">
        <thead>
          <tr className="border-b-2">
            <th className="px-1 min-w-48 w-1/2">Task</th>
            <th>Created Time</th>
            <th>Creator</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dotted">
          {tasks.map((task: Task, index: number) => (
            <tr key={index}>
              <td>
                <TaskContent
                  id={task.id}
                  content={task.content}
                  status={task.status}
                />
              </td>
              <td className="text-sm md:text-base">{task.created_at}</td>
              <td>
                <Link href={`/user/${task.creator_id}`}>
                  <span className="underline decoration-1 decoration-dashed decoration-gray-400 underline-offset-4">
                    {task.creator}
                  </span>
                </Link>
              </td>
              <td>
                <DeleteButton id={task.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
