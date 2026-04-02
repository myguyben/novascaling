"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import AnimatedSection from "@/components/animations/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import { BLOG_POSTS, BLOG_CATEGORIES, getBlogPostsByCategory } from "@/lib/blog";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const filteredPosts = getBlogPostsByCategory(activeCategory);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "10rem" }}>
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              label="Blog"
              title="Business Automation"
              titleHighlight="Insights"
              subtitle="Expert strategies, real-world playbooks, and growth frameworks for SMBs embracing workflow automation."
            />
          </AnimatedSection>

          {/* Category Filter */}
          <AnimatedSection delay={0.2}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "3rem",
              }}
            >
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "100px",
                    border: `1px solid ${
                      activeCategory === category
                        ? "rgba(245, 158, 11, 0.5)"
                        : "rgba(255, 255, 255, 0.06)"
                    }`,
                    background:
                      activeCategory === category
                        ? "rgba(245, 158, 11, 0.12)"
                        : "rgba(255, 255, 255, 0.03)",
                    color:
                      activeCategory === category
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Blog Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} style={{ display: "block" }}>
                  <GlassCard
                    className="p-8 h-full"
                    hoverEffect="glow"
                  >
                    {/* Category Badge */}
                    <div style={{ marginBottom: "1.25rem" }}>
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
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "1.35rem",
                        fontWeight: 600,
                        lineHeight: 1.3,
                        marginBottom: "0.75rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        marginBottom: "1.5rem",
                      }}
                    >
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          color: "var(--text-tertiary)",
                          fontSize: "0.8rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <Calendar size={14} />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      </div>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "var(--accent)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        Read more <ArrowRight size={14} />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
