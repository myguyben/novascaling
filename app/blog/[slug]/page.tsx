import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug) ?? null;
  return <BlogPostClient post={post} />;
}
