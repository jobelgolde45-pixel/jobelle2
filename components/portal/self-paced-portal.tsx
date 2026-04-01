"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, PlayCircle, Search, Sparkles } from "lucide-react";
import { courses, categories, type Course } from "@/lib/selfpaced-data";

interface SelfPacedPortalProps {
  onBack: () => void;
}

export function SelfPacedPortal({ onBack }: SelfPacedPortalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesQuery = searchQuery
      ? `${course.title} ${course.summary} ${course.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? course.category === selectedCategory
      : true;
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    return matchesQuery && matchesCategory && matchesLevel;
  });

  return (
    <div className="fixed inset-0 z-[60] min-h-screen bg-[#060816] text-white overflow-auto">
      <style jsx global>{`
        :root {
          --background: #060816;
          --foreground: #f6f7fb;
          --surface: rgba(15, 23, 42, 0.72);
          --surface-strong: rgba(10, 14, 30, 0.9);
          --text-secondary: #c4c9db;
          --text-muted: #8690ad;
          --accent: #6366f1;
          --accent-2: #0ea5e9;
          --accent-soft: #a5b4fc;
          --ring: rgba(129, 140, 248, 0.9);
        }
      `}</style>

      <header className="sticky top-0 z-40 px-4 pt-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[rgba(8,12,28,0.78)] px-4 py-3 shadow-[0_12px_50px_rgba(2,6,23,0.35)] backdrop-blur-2xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white hover:bg-white/10 transition"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <span className="text-lg font-semibold tracking-[0.18em] text-white uppercase">
              Self-Paced Learning
            </span>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="#courses"
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            >
              Courses
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 pb-12 pt-8 md:px-6 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-soft)]" />
              Learn at your own pace
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-5xl">
              Self-Paced Training Programs
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              Explore free self-paced courses designed to help you develop new skills
              and advance your career in government service.
            </p>
            <div className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/8 p-3">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search courses, topics, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-[var(--text-muted)] outline-none"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="rounded-full border border-white/10 bg-[rgba(15,23,42,0.8)] px-4 py-2 text-sm text-[var(--text-secondary)] backdrop-blur-xl cursor-pointer appearance-none pr-10"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0f172a] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="relative">
                <select
                  value={selectedLevel || ""}
                  onChange={(e) => setSelectedLevel(e.target.value || null)}
                  className="rounded-full border border-white/10 bg-[rgba(15,23,42,0.8)] px-4 py-2 text-sm text-[var(--text-secondary)] backdrop-blur-xl cursor-pointer appearance-none pr-10"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner" className="bg-[#0f172a] text-white">Beginner</option>
                  <option value="Intermediate" className="bg-[#0f172a] text-white">Intermediate</option>
                  <option value="All Levels" className="bg-[#0f172a] text-white">All Levels</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.section
            id="courses"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  onExpand={() => setExpandedCourse(course)}
                />
              ))}
            </div>
            {filteredCourses.length === 0 && (
              <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/6 p-12 text-center backdrop-blur-xl">
                <p className="text-[var(--text-secondary)]">
                  No courses found matching your criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </main>

      {expandedCourse && (
        <CourseDetailModal
          course={expandedCourse}
          onClose={() => setExpandedCourse(null)}
        />
      )}
    </div>
  );
}

function CourseCard({
  course,
  onExpand,
}: {
  course: Course;
  onExpand: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-[1.75rem] border border-white/10 bg-white/8 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)]">
            {course.category}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            {course.title}
          </h3>
        </div>
        {course.badge && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white">
            {course.badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
        {course.summary}
      </p>
      <div className="mt-6 flex items-center gap-4 text-sm text-[var(--text-secondary)]">
        <span className="inline-flex items-center gap-1 text-white">
          <Star className="h-4 w-4 fill-current text-amber-300" />
          {course.rating}
        </span>
        <span>{course.duration}</span>
        <span>{course.level}</span>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
        <div>
          <div className="text-sm font-medium text-white">{course.price}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {course.learners}
          </div>
        </div>
        <button
          onClick={onExpand}
          className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[var(--accent-soft)] transition"
        >
          View details
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

function CourseDetailModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#0a0e1a] p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white hover:bg-white/10 transition"
        >
          <span className="text-xl">×</span>
        </button>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {course.category}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {course.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            {course.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1 text-white">
              <Star className="h-4 w-4 fill-current text-amber-300" />
              {course.rating} ({course.reviews})
            </span>
            <span>{course.level}</span>
            <span>{course.duration}</span>
            <span>{course.learners}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.88fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-6 text-center">
              <PlayCircle className="mx-auto h-14 w-14 text-white" />
              <div className="mt-4 text-xl font-semibold text-white">
                Course Preview
              </div>
              <div className="mt-2 text-sm text-[var(--text-secondary)]">
                Click below to start learning
              </div>
              {course.link ? (
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-soft)] hover:text-black"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent-soft)] hover:text-black">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <div className="text-sm text-[var(--text-muted)]">Instructor</div>
            <div className="mt-3 text-xl font-semibold text-white">
              {course.instructor.name}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {course.instructor.role}
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              {course.instructor.bio}
            </p>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
              What you&apos;ll learn
            </div>
            <div className="mt-4 grid gap-3">
              {course.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="rounded-[1rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white"
                >
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
              Syllabus
            </div>
            <div className="mt-4 space-y-3">
              {course.syllabus.map((item, index) => (
                <details key={item.title} className="group rounded-xl border border-white/10 bg-black/20">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 transition group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-white/10 p-4 text-sm leading-6 text-[var(--text-secondary)]">
                    {item.description}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
