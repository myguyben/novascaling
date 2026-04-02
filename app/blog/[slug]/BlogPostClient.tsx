"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/animations/AnimatedSection";
import Badge from "@/components/ui/Badge";
import CTABanner from "@/components/ui/CTABanner";
import type { BlogPost } from "@/lib/blog";

function renderContent(content: string) {
  const paragraphs = content.split("\n\n");
  return paragraphs.map((paragraph, i) => {
    const trimmed = paragraph.trim();
    if (!trimmed) return null;

    // Handle h2 headings
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginTop: "2.5rem",
            marginBottom: "1rem",
            lineHeight: 1.3,
          }}
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Handle h3 headings
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginTop: "2rem",
            marginBottom: "0.75rem",
            lineHeight: 1.3,
          }}
        >
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    // Regular paragraph
    return (
      <p
        key={i}
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.1rem",
          lineHeight: 1.8,
          marginBottom: "1.25rem",
        }}
      >
        {trimmed}
      </p>
    );
  });
}

interface BlogPostClientProps {
  post: BlogPost | null;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  if (!post) {
    return (
      <PageLayout>
        <section className="section" style={{ paddingTop: "10rem" }}>
          <div className="section-container" style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Post Not Found
            </h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              The blog post you are looking for does not exist.
            </p>
            <Link
              href="/blog"
              style={{
                color: "var(--accent)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Article Header */}
      <section className="section" style={{ paddingTop: "10rem", paddingBottom: "0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 2rem" }}>
          <AnimatedSection>
            {/* Back Link */}
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-tertiary)",
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "2rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            {/* Meta Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <Badge
                className={
                  post.category === "Operations Strategy"
                    ? "!border-[rgba(234,88,12,0.3)] !bg-[rgba(234,88,12,0.08)] !text-[#ea580c]"
                    : post.category === "Automation Playbooks"
                    ? "!border-[rgba(212,168,83,0.3)] !bg-[rgba(212,168,83,0.08)] !text-[#d4a853]"
                    : undefined
                }
              >
                {post.category}
              </Badge>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--text-tertiary)",
                  fontSize: "0.85rem",
                }}
              >
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--text-tertiary)",
                  fontSize: "0.85rem",
                }}
              >
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "2rem",
                letterSpacing: "-0.03em",
              }}
            >
              {post.title}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Content */}
      <section style={{ padding: "2rem 2rem 4rem" }}>
        <AnimatedSection delay={0.2}>
          <article style={{ maxWidth: 720, margin: "0 auto" }}>
            {renderContent(post.content)}

            {/* Tags */}
            <div
              style={{
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <Tag
                size={16}
                style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
              />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "0.3rem 0.85rem",
                    borderRadius: "100px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                    color: "var(--text-tertiary)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <CTABanner
        title="Ready to eliminate"
        titleHighlight="manual work?"
        subtitle="Lunch is on us. No pitch, no slides — just a real conversation about your business."
        buttonText="Tell Us Your Problems"
        buttonHref="/schedule"
      />
    </PageLayout>
  );
}
