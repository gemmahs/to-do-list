import { notFound } from "next/navigation";
import { Bell, CircleCheckBig } from "lucide-react";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const num = Number(id);
  if (isNaN(num) || !Number.isInteger(num)) {
    notFound();
  }

  try {
    const res = await fetch(`${baseUrl}/task/${id}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch the task");
    }

    const task = await res.json();
    // console.log(task);

    return (
      <div className="py-6">
        <ul className="max-w-[500px] mx-auto text-lg p-4 border-1 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.3)] space-y-1 divide-y-[1px] divide-dashed">
          <li className="flex justify-between gap-2 flex-wrap py-1">
            <span className="font-semibold">ID: </span>
            <span>{task.id}</span>
          </li>
          <li className="flex justify-between gap-2 flex-wrap py-1">
            <span className="font-semibold">Content:</span>
            <span>{task.content}</span>
          </li>
          <li className="flex justify-between gap-2 flex-wrap py-1">
            <span className="font-semibold">Status:</span>
            <div className="flex gap-1">
              {task.status === "finished" ? (
                <span className="p-[2px]">
                  <CircleCheckBig color="limegreen" />
                </span>
              ) : (
                <span className="p-[2px]">
                  <Bell color="tomato" />
                </span>
              )}
              <span>{task.status}</span>
            </div>
          </li>
          <li className="flex justify-between gap-2 flex-wrap py-1">
            <span className="font-semibold">Creator:</span>
            <span>{task.creator}</span>
          </li>
          <li className="flex justify-between gap-2 flex-wrap py-1">
            <span className="font-semibold">Created Time:</span>
            <span>{task.created_at}</span>
          </li>
        </ul>
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      // console.error(error.message);
      return (
        <div className="text-center">
          <p>{error.message}</p>
        </div>
      );
    }
    return <p>An unknown error occurred</p>;
  }
}
