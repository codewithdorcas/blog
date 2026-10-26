import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { deletePostAction } from "@/app/actions";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { id } = await params;
  const session = await getSession();

  let post = null;
  try {
    post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post) {
    notFound();
  }

  const isAuthor = session?.id === post.author.id;
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all stories
        </Link>
      </div>

      <article className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-sm">
        {/* Post Metadata */}
        <header className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                {(post.author.name || post.author.email)[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {post.author.name || post.author.email}
                </p>
                <p className="text-xs text-slate-500">
                  Published on {dateStr}
                </p>
              </div>
            </div>

            {/* Author Controls */}
            {isAuthor && (
              <form action={deletePostAction}>
                <input type="hidden" name="postId" value={post.id} />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  Delete Post
                </button>
              </form>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  );
}
