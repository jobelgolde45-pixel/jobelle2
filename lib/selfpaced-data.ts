export type Course = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  rating: number;
  reviews: string;
  learners: string;
  price: string;
  badge?: string;
  image?: string;
  link?: string;
  instructor: {
    name: string;
    role: string;
    bio: string;
  };
  outcomes: string[];
  syllabus: Array<{
    title: string;
    description: string;
  }>;
};

export const categories = [
  "Public Service",
  "Leadership",
  "Technical",
  "Compliance",
  "Wellness",
];

export const levels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courses: Course[] = [
  {
    slug: "citizens-charter",
    title: "Service Excellence: A Guide to RA 11032 Citizen's Charter",
    summary:
      "Master the protocols of the Ease of Doing Business Act to ensure efficient and transparent government service delivery.",
    category: "Public Service",
    level: "All Levels",
    duration: "Self-Paced",
    rating: 4.9,
    reviews: "1,240",
    learners: "12k learners",
    price: "Free",
    badge: "Required",
    image: "https://lh3.googleusercontent.com/d/1up9Yd6ztQT6QHmglkK_tLqyK4aPviOEb",
    link: "https://hrdd-ldu.github.io/dotr_citizen-s_charter/",
    instructor: {
      name: "DOTr-HRDD",
      role: "Human Resource Development Division",
      bio: "Official training module developed by the DOTr Human Resource Development Division for all government employees.",
    },
    outcomes: [
      "Understand the provisions of RA 11032 and its IRR",
      "Apply citizen's charter standards in daily operations",
      "Identify and streamline bureaucratic processes",
      "Ensure compliance with ease of doing business requirements",
    ],
    syllabus: [
      {
        title: "Introduction to RA 11032",
        description:
          "Overview of the Ease of Doing Business and Efficient Government Service Delivery Act of 2018.",
      },
      {
        title: "Citizen's Charter Development",
        description:
          "Guidelines for crafting effective citizen's charters for government offices.",
      },
      {
        title: "Compliance and Monitoring",
        description:
          "Mechanisms for ensuring adherence to citizen's charter standards.",
      },
    ],
  },
  {
    slug: "digital-wellness",
    title: "The Influence of Digitalization on Psychological Well-Being",
    summary:
      "Explore the impact of digital technology on mental health and learn strategies for maintaining digital well-being.",
    category: "Wellness",
    level: "All Levels",
    duration: "Self-Paced",
    rating: 4.7,
    reviews: "890",
    learners: "8k learners",
    price: "Free",
    image: "https://lh3.googleusercontent.com/d/1kZ1xFHEQcAQu29gcwCawLRIjlSaNP7oU",
    link: "https://hrdd-ldu.github.io/dotr_digital_wellness/",
    instructor: {
      name: "DOTr-HRDD",
      role: "Human Resource Development Division",
      bio: "Wellness module developed to support employees in maintaining mental health in the digital age.",
    },
    outcomes: [
      "Recognize signs of digital burnout and fatigue",
      "Apply digital wellness strategies in the workplace",
      "Maintain healthy boundaries with technology",
      "Support colleagues in digital well-being practices",
    ],
    syllabus: [
      {
        title: "Digital Stress and Mental Health",
        description:
          "Understanding how constant connectivity affects our psychological state.",
      },
      {
        title: "Healthy Digital Habits",
        description:
          "Practical techniques for managing screen time and digital interactions.",
      },
      {
        title: "Creating Digital Balance",
        description:
          "Strategies for achieving work-life balance in a digital environment.",
      },
    ],
  },
  {
    slug: "gender-sensitivity",
    title: "Gender Sensitivity and Inclusion in the Workplace",
    summary:
      "Learn to create an inclusive environment that respects gender diversity and promotes equal opportunities.",
    category: "Compliance",
    level: "All Levels",
    duration: "Self-Paced",
    rating: 4.8,
    reviews: "2,150",
    learners: "15k learners",
    price: "Free",
    badge: "Mandatory",
    instructor: {
      name: "DOTr-HRDD",
      role: "Human Resource Development Division",
      bio: "Compliance training developed to ensure gender sensitivity awareness across all DOTr offices.",
    },
    outcomes: [
      "Understand gender concepts and terminology",
      "Apply gender-inclusive language and behavior",
      "Recognize and prevent gender-based discrimination",
      "Foster an inclusive workplace culture",
    ],
    syllabus: [
      {
        title: "Gender Concepts and Frameworks",
        description:
          "Foundational understanding of gender, sex, and related concepts.",
      },
      {
        title: "Gender in the Workplace",
        description:
          "Practical application of gender sensitivity in daily interactions.",
      },
      {
        title: "Policy and Compliance",
        description:
          "Overview of gender-related laws and organizational policies.",
      },
    ],
  },
  {
    slug: "data-privacy",
    title: "Data Privacy and Protection Fundamentals",
    summary:
      "Understand the principles of data privacy and learn how to protect personal information in compliance with the Data Privacy Act.",
    category: "Compliance",
    level: "Beginner",
    duration: "Self-Paced",
    rating: 4.6,
    reviews: "1,430",
    learners: "10k learners",
    price: "Free",
    instructor: {
      name: "DOTr-ISD",
      role: "Information Systems Division",
      bio: "Technical compliance training on data privacy regulations and best practices.",
    },
    outcomes: [
      "Understand the Data Privacy Act of 2012",
      "Identify personal and sensitive personal information",
      "Apply data protection principles in daily work",
      "Respond appropriately to data breaches",
    ],
    syllabus: [
      {
        title: "Introduction to Data Privacy",
        description:
          "Overview of the Data Privacy Act and its key provisions.",
      },
      {
        title: "Data Classification",
        description:
          "Understanding different types of data and their sensitivity levels.",
      },
      {
        title: "Practical Data Protection",
        description:
          "Hands-on techniques for securing information in the workplace.",
      },
    ],
  },
  {
    slug: "financial-literacy",
    title: "Financial Literacy for Government Employees",
    summary:
      "Build essential financial management skills for personal and professional money matters.",
    category: "Wellness",
    level: "Beginner",
    duration: "Self-Paced",
    rating: 4.5,
    reviews: "720",
    learners: "6k learners",
    price: "Free",
    instructor: {
      name: "DOTr-Finance",
      role: "Finance Division",
      bio: "Financial education module to help employees manage their finances effectively.",
    },
    outcomes: [
      "Understand basic financial planning concepts",
      "Manage personal budget and expenses",
      "Make informed financial decisions",
      "Plan for long-term financial security",
    ],
    syllabus: [
      {
        title: "Budgeting Basics",
        description:
          "Creating and maintaining a personal budget.",
      },
      {
        title: "Savings and Investments",
        description:
          "Introduction to savings strategies and investment options.",
      },
      {
        title: "Financial Goal Setting",
        description:
          "Planning for short-term and long-term financial objectives.",
      },
    ],
  },
  {
    slug: "workplace-safety",
    title: "Occupational Safety and Health Awareness",
    summary:
      "Learn to identify workplace hazards and maintain a safe working environment in accordance with OSHS standards.",
    category: "Compliance",
    level: "All Levels",
    duration: "Self-Paced",
    rating: 4.8,
    reviews: "1,890",
    learners: "11k learners",
    price: "Free",
    badge: "Required",
    instructor: {
      name: "DOTr-GSD",
      role: "General Services Division",
      bio: "Safety training module developed to ensure compliance with occupational health standards.",
    },
    outcomes: [
      "Identify common workplace hazards",
      "Apply safety protocols and procedures",
      "Respond appropriately to workplace incidents",
      "Promote a culture of safety in the office",
    ],
    syllabus: [
      {
        title: "OSHS Fundamentals",
        description:
          "Overview of occupational safety and health standards.",
      },
      {
        title: "Hazard Identification",
        description:
          "Recognizing potential hazards in the workplace.",
      },
      {
        title: "Emergency Procedures",
        description:
          "Proper response protocols for workplace emergencies.",
      },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function filterCourses(filters: {
  q?: string;
  category?: string;
  level?: string;
}) {
  return courses.filter((course) => {
    const matchesQuery = filters.q
      ? `${course.title} ${course.summary} ${course.category}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      : true;

    const matchesCategory = filters.category
      ? course.category === filters.category
      : true;
    const matchesLevel = filters.level ? course.level === filters.level : true;

    return matchesQuery && matchesCategory && matchesLevel;
  });
}
