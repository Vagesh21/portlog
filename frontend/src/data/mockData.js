// Mock data for Vagesh Anagani's Cybersecurity Portfolio

export const personalInfo = {
  name: "Vagesh Anagani",
  title: "Cybersecurity Specialist",
  subtitle: "Master's Candidate in Business Information Systems (Cybersecurity)",
  location: "Melbourne, Australia",
  email: "vagesh.anagani@gmail.com",
  phone: "0412 037 261",
  bio: "Ambitious cybersecurity professional with expertise in penetration testing, network security, and secure application development. Passionate about protecting digital infrastructure and building resilient systems.",
  github: "https://github.com/vagesh",
  linkedin: "https://linkedin.com/in/vagesh-anagani",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vagesh"
};

export const skills = [
  { category: "Penetration Testing", level: 85 },
  { category: "Network Security", level: 90 },
  { category: "Web Development", level: 75 },
  { category: "Cloud Security", level: 70 },
  { category: "Risk Assessment", level: 80 },
  { category: "DevOps & Containers", level: 75 }
];

export const projects = [
  {
    id: 1,
    title: "Secure Blockchain Transactions",
    description: "Bachelor's capstone project implementing secure transaction protocols using blockchain technology",
    category: "Blockchain Security",
    duration: "Dec 2023 - May 2024",
    technologies: ["Blockchain", "Cryptography", "Smart Contracts", "Python"],
    metrics: {
      security_score: 95,
      vulnerabilities_fixed: 12,
      performance: 88
    },
    status: "Completed",
    highlights: [
      "Implemented secure consensus mechanisms",
      "Performed security audits on smart contracts",
      "Reduced transaction vulnerabilities by 95%"
    ]
  },
  {
    id: 2,
    title: "Enterprise Cybersecurity Infrastructure",
    description: "Virtual internship project focusing on enterprise-level security implementations",
    category: "Network Security",
    duration: "May 2023 - July 2023",
    technologies: ["ISO 27001", "Metasploit", "Vulnerability Scanning", "Risk Assessment"],
    metrics: {
      security_score: 92,
      vulnerabilities_fixed: 28,
      performance: 85
    },
    status: "Completed",
    highlights: [
      "Conducted comprehensive security audits",
      "Implemented ISO 27001 controls",
      "Reduced attack surface by 40%"
    ]
  },
  {
    id: 3,
    title: "Self-Hosted Security Lab",
    description: "Raspberry Pi-based security testing environment with Docker containerization",
    category: "DevOps & Security",
    duration: "2023 - Present",
    technologies: ["Docker", "Nginx", "Raspberry Pi", "Linux", "SSL/TLS"],
    metrics: {
      security_score: 90,
      vulnerabilities_fixed: 15,
      performance: 92
    },
    status: "Active",
    highlights: [
      "Configured secure reverse proxy with SSL/TLS",
      "Automated backup and monitoring systems",
      "Implemented secure authentication mechanisms"
    ]
  },
  {
    id: 4,
    title: "Secure PHP Authentication System",
    description: "Custom authentication system with 2FA, email verification, and session management",
    category: "Web Security",
    duration: "2023",
    technologies: ["PHP", "MariaDB", "2FA", "PHPMailer", "Session Security"],
    metrics: {
      security_score: 88,
      vulnerabilities_fixed: 10,
      performance: 90
    },
    status: "Completed",
    highlights: [
      "Implemented secure password hashing",
      "Built two-factor authentication system",
      "Prevented common web vulnerabilities (XSS, CSRF, SQL Injection)"
    ]
  }
];

export const certifications = [
  { name: "CyberOps Associate", issuer: "Cisco", year: 2024, verified: true, color: "#00d4ff" },
  { name: "Cybersecurity Essentials", issuer: "Cisco", year: 2024, verified: true, color: "#10b981" },
  { name: "Cyber Threat Management", issuer: "Cisco", year: 2024, verified: true, color: "#06b6d4" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco", year: 2024, verified: true, color: "#0ea5e9" },
  { name: "Ethical Hacking From Scratch", issuer: "Udemy", year: 2023, verified: true, color: "#f59e0b" },
  { name: "Cloud Computing", issuer: "NPTEL", year: 2023, verified: true, color: "#8b5cf6" },
  { name: "PMP Certification", issuer: "Udemy", year: 2023, verified: true, color: "#ec4899" },
  { name: "Android App Development", issuer: "A.P.S.S.D.C", year: 2023, verified: true, color: "#14b8a6" }
];

export const threatMapData = [
  { id: 1, country: "USA", lat: 37.0902, lng: -95.7129, threats: 1247, severity: "high" },
  { id: 2, country: "China", lat: 35.8617, lng: 104.1954, threats: 892, severity: "high" },
  { id: 3, country: "Russia", lat: 61.5240, lng: 105.3188, threats: 756, severity: "critical" },
  { id: 4, country: "Brazil", lat: -14.2350, lng: -51.9253, threats: 543, severity: "medium" },
  { id: 5, country: "India", lat: 20.5937, lng: 78.9629, threats: 634, severity: "medium" },
  { id: 6, country: "UK", lat: 55.3781, lng: -3.4360, threats: 421, severity: "medium" },
  { id: 7, country: "Germany", lat: 51.1657, lng: 10.4515, threats: 389, severity: "low" },
  { id: 8, country: "Australia", lat: -25.2744, lng: 133.7751, threats: 298, severity: "low" },
  { id: 9, country: "Japan", lat: 36.2048, lng: 138.2529, threats: 512, severity: "medium" },
  { id: 10, country: "France", lat: 46.2276, lng: 2.2137, threats: 367, severity: "low" }
];

export const stats = {
  projectsCompleted: 12,
  certificationsEarned: 10,
  vulnerabilitiesFixed: 65,
  securityScore: 92
};

export const experience = [
  {
    title: "Cybersecurity Intern",
    company: "EduSkills",
    duration: "May 2023 - July 2023",
    description: "Virtual internship focusing on enterprise security implementations and risk assessment",
    achievements: [
      "Conducted security audits for enterprise systems",
      "Implemented ISO 27001 security controls",
      "Performed vulnerability assessments and penetration testing"
    ]
  },
  {
    title: "AI & ML Intern",
    company: "TeamYuva Techno Solutions",
    duration: "Aug 2022 - Sep 2022",
    location: "Hyderabad",
    description: "Worked on AI and machine learning projects using Python",
    achievements: [
      "Developed machine learning models for data analysis",
      "Implemented AI algorithms for pattern recognition",
      "Collaborated on cross-functional tech projects"
    ]
  }
];

export const education = [
  {
    degree: "Master of Business Information Systems in Cybersecurity",
    institution: "Australian Institute of Higher Education (AIH)",
    location: "Melbourne, VIC",
    expected: "July 2026",
    current: true
  },
  {
    degree: "B.Tech in Information Technology",
    institution: "SRK Institute of Technology",
    completed: "May 2024",
    current: false
  }
];