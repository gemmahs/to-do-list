import AddTask from "@/components/AddTask";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 font-[family-name:var(--font-geist-sans)]">
      <AddTask />
      <TaskList />
    </div>
  );
}
