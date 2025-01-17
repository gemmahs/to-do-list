"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContentProps = {
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
};
function TaskInput({ task, setTask }: ContentProps) {
  function handleTaskInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTask(e.target.value);
    // console.log(`Task: ${task}`);
  }

  return (
    <div className="sm:basis-2/3">
      <Label htmlFor="task">Task</Label>
      <Input
        type="text"
        id="task"
        placeholder="Enter your task"
        autoComplete="off"
        value={task}
        onChange={handleTaskInput}
      />
    </div>
  );
}

export default TaskInput;
