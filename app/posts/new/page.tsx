import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import NewPostForm from "./NewPostForm";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create a New Post
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Publish your ideas to the blog
        </p>
      </div>

      <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm">
        <NewPostForm />
      </div>
    </div>
  );
}
