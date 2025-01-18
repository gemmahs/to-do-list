import { Bell, CircleCheckBig } from "lucide-react";
import { notFound } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Task = {
  id: number;
  content: string;
  created_at: string;
  status: "finished" | "unfinished";
};
export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const num = Number(id);
  if (isNaN(num) || !Number.isInteger(num)) {
    notFound();
  }

  try {
    const res = await fetch(`${baseUrl}/user/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log(data);
    const { creator, tasks } = data;
    return (
      <div className="my-2">
        {tasks.length > 0 ? (
          <>
            <h2 className="text-center text-xl py-1">
              <span>Tasks of </span>
              <span className="px-2 py-1 bg-accent rounded-md font-semibold">
                {creator.name}
              </span>
            </h2>

            <div className="overflow-x-auto mt-1">
              <table className="w-full max-w-[750px] border-b-2 text-center mx-auto">
                <thead>
                  <tr className="border-b-2">
                    <th className="px-1 font-normal">Id</th>
                    <th className="min-w-40 font-normal">Content</th>
                    <th className="font-normal">Status</th>
                    <th className="font-normal">Created Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted">
                  {tasks.map((task: Task, index: number) => (
                    <tr key={index}>
                      <td>{task.id}</td>
                      <td className="text-left">{task.content}</td>
                      <td>
                        {task.status === "finished" ? (
                          <div className="flex justify-center items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div>
                                    <CircleCheckBig color="limegreen" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>finished</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div>
                                    <Bell color="tomato" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>unfinished</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </td>
                      <td>{task.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center my-4 text-xl font-semibold">
            {creator.name} hasn't created any task
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      return (
        <div className="text-center">
          <div className="my-4 text-xl font-semibold">{e.message}</div>
        </div>
      );
    }
  }
}
