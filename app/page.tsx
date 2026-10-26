import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  let posts: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: { name: string | null; email: string };
  }> = [];

  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    // If database is not configured or fails, gracefully default to empty posts
    posts = [];
  }

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-900">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Latest Stories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Thoughts, stories, and ideas from the community.
          </p>
        </div>
        <div>
          {session ? (
            <Link
              href="/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-900 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
            >
              Log in to publish
            </Link>
          )}
        </div>
      </div>

      {/* Posts List or Empty State */}
      {posts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border-2 border-slate-900 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No posts published yet
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {session
              ? "Share your first thought or article with the world."
              : "Sign in or register an account to write the very first blog post."}
          </p>
          <div className="mt-5">
            <Link
              href={session ? "/posts/new" : "/register"}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              {session ? "Write the first post" : "Get started"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => {
            const dateStr = new Date(post.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <article
                key={post.id}
                className="group p-6 rounded-2xl bg-white border-2 border-slate-900 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-medium text-slate-700">
                    {post.author.name || post.author.email}
                  </span>
                  <span>•</span>
                  <span>{dateStr}</span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {post.content}
                </p>

                <Link
                  href={`/posts/${post.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline underline-offset-4"
                >
                  Read full post
                  <svg
                    className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
