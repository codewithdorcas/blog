"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, removeSession, getSession } from "@/lib/auth";

export type AuthActionState = {
  error?: string;
};

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    return { error: "Failed to create account. Please check database connection." };
  }

  redirect("/");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return { error: "Failed to log in. Please check database connection." };
  }

  redirect("/");
}

export async function logoutAction() {
  await removeSession();
  redirect("/login");
}

export async function createPostAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to create a post." };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  if (!title || !content) {
    return { error: "Title and content cannot be empty." };
  }

  let newPostId: string;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.id,
      },
    });
    newPostId = post.id;
  } catch (err: unknown) {
    console.error("Create post error:", err);
    return { error: "Failed to save post to the database." };
  }

  revalidatePath("/");
  redirect(`/posts/${newPostId}`);
}

export async function deletePostAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const postId = formData.get("postId") as string;
  if (!postId) return;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId === session.id) {
      await prisma.post.delete({ where: { id: postId } });
    }
  } catch (err: unknown) {
    console.error("Delete post error:", err);
  }

  revalidatePath("/");
  redirect("/");
}
