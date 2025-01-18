import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TaskLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="max-w-5xl mx-auto p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="flex">
        <Link
          href="/"
          className="flex gap-3 items-center px-2 py-1 text-lg cursor-pointer rounded hover:bg-secondary"
        >
          <ArrowLeft />
          <span>Back to task list</span>
        </Link>
      </div>
      {children}
    </section>
  );
}
