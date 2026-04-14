import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_TOKEN,
});

const flashcards = [
  { category: "Civil Service", question: "What does CSC stand for?", answer: "Civil Service Commission — the central personnel agency of the Philippine government.", hint: "Think of the body managing civil servants." },
  { category: "Civil Service", question: "What is PRIME-HRM?", answer: "Program to Institutionalize Meritocracy and Excellence in Human Resource Management — a CSC framework for assessing HRM maturity.", hint: "A CSC framework for HR excellence." },
  { category: "Civil Service", question: "What is RA 11032?", answer: "Ease of Doing Business and Efficient Government Service Delivery Act of 2018 — mandates the Citizen's Charter.", hint: "Related to the Citizen's Charter." },
  { category: "Civil Service", question: "What is an IDP?", answer: "Individual Development Plan — a document outlining an employee's competency gaps and planned learning activities.", hint: "A personal learning roadmap." },
  { category: "Civil Service", question: "What is RA 6713?", answer: "Code of Conduct and Ethical Standards for Public Officials and Employees — requires annual SALN filing.", hint: "Related to SALN filing." },
  { category: "Ethics", question: "What is SALN?", answer: "Statement of Assets, Liabilities and Net Worth — a document all government employees must file annually.", hint: "A financial disclosure document." },
  { category: "Ethics", question: "What is the Citizen's Charter?", answer: "An official document communicating government services, processing times, fees, and requirements to the public.", hint: "A transparency document for government services." },
  { category: "Ethics", question: "What is RA 9485?", answer: "Anti-Red Tape Act of 2007 — the predecessor of RA 11032, aimed at reducing bureaucratic red tape.", hint: "The older anti-red tape law." },
];

const quizQuestions = [
  { category: "Civil Service", question: "Which law mandates the Citizen's Charter for government agencies?", options: ["RA 9485", "RA 11032", "RA 6713", "RA 7160"], correct: 1, explanation: "RA 11032 (Ease of Doing Business Act) mandates the Citizen's Charter." },
  { category: "Civil Service", question: "PRIME-HRM stands for:", options: ["Program to Institutionalize Meritocracy and Excellence in HRM", "Philippine Reform Initiative for Merit-based HRM", "Public Resource Integration for Merit Excellence in HRM", "None of the above"], correct: 0, explanation: "PRIME-HRM = Program to Institutionalize Meritocracy and Excellence in Human Resource Management." },
  { category: "Civil Service", question: "The CSC is headed by a:", options: ["Secretary", "Chairperson", "Director General", "Commissioner"], correct: 1, explanation: "The Civil Service Commission is headed by a Chairperson." },
  { category: "Civil Service", question: "An IDP is primarily used for:", options: ["Payroll processing", "Competency gap analysis and learning planning", "Leave management", "Performance rating"], correct: 1, explanation: "An IDP identifies competency gaps and plans development activities." },
  { category: "Civil Service", question: "Under RA 6713, government employees must file a SALN:", options: ["Every 5 years", "Only upon appointment", "Annually", "Upon retirement only"], correct: 2, explanation: "SALN must be filed annually under RA 6713." },
  { category: "Ethics", question: "Which of the following is NOT a norms of conduct under RA 6713?", options: ["Professionalism", "Justness and Sincerity", "Political Neutrality", "Nepotism"], correct: 3, explanation: "Nepotism is prohibited, not a norm of conduct." },
  { category: "Ethics", question: "The Anti-Red Tape Act of 2007 is:", options: ["RA 11032", "RA 9485", "RA 6713", "RA 7160"], correct: 1, explanation: "RA 9485 is the Anti-Red Tape Act of 2007." },
];

async function main() {
  for (let i = 0; i < flashcards.length; i++) {
    const f = flashcards[i];
    await client.execute({
      sql: `INSERT OR IGNORE INTO flashcards (category, question, answer, hint, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      args: [f.category, f.question, f.answer, f.hint, i],
    });
  }
  console.log("✓ Flashcards seeded");

  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    await client.execute({
      sql: `INSERT OR IGNORE INTO quiz_questions (category, question, options_json, correct_answer, explanation, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      args: [q.category, q.question, JSON.stringify(q.options), q.correct, q.explanation, i],
    });
  }
  console.log("✓ Quiz questions seeded");
  await client.close();
}
main().catch(console.error);
