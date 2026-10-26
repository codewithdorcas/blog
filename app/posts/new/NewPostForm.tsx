"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPostAction } from "@/app/actions";

export default function NewPostForm() {
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    {} as { error?: string }
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Post Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Getting Started with Next.js & Supabase"
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-base font-medium"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          placeholder="Write your article content here..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          {isPending ? "Publishing..." : "Publish Article"}
        </button>
      </div>
    </form>
  );
}
