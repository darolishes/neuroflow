import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:px-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          ADHD Organizer
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A modern web application for ADHD organization and task management
        </p>
        <div className="mt-10">
          <a
            href="/login"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/80"
          >
            Get started
          </a>
        </div>
      </main>
    </div>
  );
}
