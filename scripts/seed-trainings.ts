import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_TOKEN,
});

const programs = [
  {
    code: "TR-001",
    title: "Effective Communication Skills",
    catalogType: "in-house",
    competencyType: "core",
    level: "Internal",
    durationText: "3 days",
    description: "Master professional communication techniques for workplace success, including active listening and clear writing.",
    deliveryMode: "In-Person",
    costText: "Sponsored",
  },
  {
    code: "TR-002",
    title: "Human-Centered Leadership: Redefining Success with Well-Being in Mind",
    catalogType: "in-house",
    competencyType: "leadership",
    level: "In-House",
    durationText: "2 days",
    description: "This course empowers leaders to embrace a people-first approach to leadership by integrating well-being, empathy, and purpose into their management style. Participants will explore how human-centered leadership fosters trust, resilience, and sustainable performance.",
    deliveryMode: "Virtual Training",
    costText: "Php 15,000",
  },
  {
    code: "TR-003",
    title: "Industry Conference 2025",
    catalogType: "out-of-house",
    competencyType: "functional",
    level: "In-House",
    durationText: "3 days",
    description: "Network with industry leaders and gain insights into emerging trends impacting the transportation sector.",
    deliveryMode: "Conference",
    costText: "Sponsored",
  },
  {
    code: "TR-004",
    title: "Professional Development Seminar",
    catalogType: "in-house",
    competencyType: "functional",
    level: "In-House",
    durationText: "2 days",
    description: "Enhance your career with cutting-edge professional development strategies.",
    deliveryMode: "Seminar",
    costText: "Free",
  },
  {
    code: "TR-005",
    title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
    catalogType: "self-paced",
    competencyType: "functional",
    level: "In-House",
    durationText: "Self-Paced",
    description: "Master the protocols of the Ease of Doing Business Act to ensure efficient and transparent government service delivery.",
    deliveryMode: "Online",
    costText: "Internal",
  },
  {
    code: "TR-006",
    title: "Team Building & Collaboration",
    catalogType: "in-house",
    competencyType: "core",
    level: "Internal",
    durationText: "1 day",
    description: "Strengthen team dynamics and enhance collaborative work environments through practical exercises and shared problem solving.",
    deliveryMode: "In-Person",
    costText: "Free",
  },
  {
    code: "TR-007",
    title: "The Influence of Digitalization on Psychological Well-Being",
    catalogType: "self-paced",
    competencyType: "core",
    level: "In-House",
    durationText: "Self-Paced",
    description: "Explore the impact of digital technology on mental health and learn strategies for maintaining digital well-being.",
    deliveryMode: "Online",
    costText: "Internal",
  },
];

async function main() {
  await client.execute("DELETE FROM training_programs");
  console.log("Cleared existing training programs.");

  for (const p of programs) {
    await client.execute({
      sql: `INSERT INTO training_programs (code, title, catalog_type, competency_type, level, duration_text, description, delivery_mode, cost_text, is_active, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
      args: [p.code, p.title, p.catalogType, p.competencyType, p.level, p.durationText, p.description, p.deliveryMode, p.costText],
    });
    console.log(`✓ ${p.code} - ${p.title}`);
  }
  console.log(`\n✓ Seeded ${programs.length} training programs.`);
}

main().catch(console.error);
