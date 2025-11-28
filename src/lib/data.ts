import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
  SiGit,
  SiVercel,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiPython,
  SiC,
  SiFirebase,
  SiSupabase,
  SiFlask,
  SiRedis,
  SiGithub,
  SiNetlify,
  SiFramer,
  SiOpenai,
  SiAnthropic,
  SiGoogle,
  SiSpring,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { DiJava } from 'react-icons/di';
import { FaLightbulb, FaUsers, FaComments } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Certifications', href: '#certifications' },
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/HakkanShah', icon: Github },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hakkan/', icon: Linkedin },
  { name: 'Google Developer Profile', url: 'https://g.dev/hakkan', icon: SiGoogle },
  { name: 'Gmail', url: 'mailto:hakkanparbej@gmail.com', icon: Mail },
];

export type Project = {
  title: string;
  description: string;
  longDescription: string;
  why: string;
  thumbnail: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  aiHint: string;
};

export const PROJECTS: Project[] = [
  {
    title: 'MockHick',
    description: 'Voice-Driven AI-powered web app that simulates mock interviews.',
    longDescription: 'MockHick is an innovative, AI-powered web application designed to help users prepare for job interviews. Inspired by the Hindi word "Maukhik" (मौखिक), which means oral or spoken, the app simulates a realistic interview experience. It leverages Gemini AI to dynamically generate questions, provide real-time transcription, and deliver detailed, personalized feedback to help users build confidence and land their dream job.',
    why: 'I built MockHick to help students and job seekers practice interviews in a realistic way without needing another person. Many people feel underconfident or don’t always have someone available to take their mock interviews. MockHick uses AI, voice interaction (Web Speech API), and clean UI (ShadCN UI) to simulate real interview scenarios, provide feedback, and build communication confidence. The main goal is to make interview preparation more accessible, interactive, and less stressful.',
    thumbnail: '/project-images/mockhick.png',
    tags: ['Next.js', 'Gemini AI', 'TypeScript', 'Firebase', 'Web Speech API', 'TailwindCSS', 'ShadCN'],
    liveUrl: 'https://mockhick.vercel.app/',
    repoUrl: 'https://github.com/HakkanShah/mockhick',
    aiHint: 'ai interview coach',
  },
  {
    title: 'ConfessCode',
    description: 'An anonymous confession platform ensuring user privacy and secure messaging.',
    longDescription: 'ConfessCode is a secure and anonymous platform where users can freely share their thoughts, confessions, and secrets without revealing their identity. It uses robust authentication and encryption to ensure that all messages are private and untraceable.',
    why: 'I built this project to explore secure authentication methods and to create a safe online space for open expression, something I feel is increasingly important in today\'s digital world.',
    thumbnail: '/project-images/confesscode.png',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'tailwind', 'ShadCN'],
    liveUrl: 'https://concode.vercel.app/',
    repoUrl: 'https://github.com/HakkanShah/ConfessCode',
    aiHint: 'anonymous confession',
  },
  {
    title: 'MemeMate',
    description: 'A prototype for a meme-based social and dating application.',
    longDescription: 'MemeMate is a conceptual dating app that matches users based on their sense of humor. It allows users to share and react to memes, creating a fun and lighthearted way to connect with new people.',
    why: 'This was a fun project to prototype a unique app idea and practice my UI/UX design skills. It combines social media elements with a dating-app framework to create a novel user experience.',
    thumbnail: '/project-images/mememate.png',
    tags: ['React', 'NextJS', 'TypeScript', 'Tailwind'],
    liveUrl: 'https://mememate.netlify.app/',
    repoUrl: 'https://github.com/HakkanShah/MemeMate',
    aiHint: 'meme dating app',
  },
  {
    title: 'AluChat',
    description: 'A dual-personality AI chatbot that can switch between being sweet and savage.',
    longDescription: 'AluChat is an interactive AI chatbot with a twist. Users can toggle its personality from a friendly, helpful assistant to a witty and savage companion. It\'s built to showcase the versatility of modern language models.',
    why: 'I wanted to experiment with AI and prompt engineering to create a more engaging and entertaining chatbot experience than the typical customer service bots.',
    thumbnail: '/project-images/aluchat.png',
    tags: ['JavaScript', 'Tailwind', 'Next', 'Gemini API'],
    liveUrl: 'https://aluchat.netlify.app/',
    repoUrl: 'https://github.com/HakkanShah/AluChat',
    aiHint: 'ai chatbot',
  },
  {
    title: 'VerifyAI',
    description: 'An AI tool for detecting fake news, deepfakes, and AI-generated content.',
    longDescription: 'VerifyAI is a powerful tool designed to combat misinformation. It analyzes text, images, and videos to detect signs of manipulation or AI generation, providing a trust score for online content.',
    why: 'With the rise of AI-generated content, I saw a need for a tool that could help users distinguish between authentic and fake information. This project was my attempt to address that challenge using machine learning.',
    thumbnail: '/project-images/verifyai.png',
    tags: ['JavaScript', 'Python', 'Next.js', 'Gemini API', 'TensorFlow'],
    liveUrl: 'https://verifyai-nine.vercel.app/',
    repoUrl: 'https://github.com/HakkanShah/VerifyAI',
    aiHint: 'deepfake detection',
  },
  {
    title: 'BuildMyCV',
    description: 'An AI-powered resume builder for creating professional CVs in minutes.',
    longDescription: 'BuildMyCV uses AI to help users craft the perfect resume. It suggests powerful action verbs, formats content professionally, and tailors the resume to specific job descriptions, making job applications faster and more effective.',
    why: 'I wanted to simplify the often-tedious process of resume writing. By leveraging AI, this tool empowers users to present their skills and experience in the best possible light with minimal effort.',
    thumbnail: '/project-images/buildmycv.png',
    tags: ['React', 'TypeScript', 'Nextjs', 'PDF Generation', 'Genkit'],
    liveUrl: 'https://cvbanao.netlify.app/',
    repoUrl: 'https://github.com/HakkanShah/BuildMyCV',
    aiHint: 'resume builder',
  },
  {
    title: 'ReelXtract',
    description: 'Intagram Reels Downloader.',
    longDescription: 'ReelXtract is a simple and fast tool to download Instagram Reels instantly. Just paste the Reel URL, click download, and save the video with a sleek Instagram-themed UI.',
    why: 'One-click download of Instagram Reels',
    thumbnail: '/project-images/reelxtract.png',
    tags: ['JavaScript', 'Python', 'Flask', 'yt-dlp'],
    liveUrl: 'https://hakkanshah.github.io/ReelXtract/',
    repoUrl: 'https://github.com/HakkanShah/ReelXtract',
    aiHint: 'reels downloader',
  },
  {
    title: 'Math-O-Matic',
    description: 'A Multipurpose Calculator',
    longDescription: 'A scientific calculator with Unit Convertor',
    why: 'testing javascipt logic ',
    thumbnail: '/project-images/calculator.png',
    tags: ['html', 'css', 'javascript'],
    liveUrl: 'https://hakkanshah.github.io/Math-o-Matic/',
    repoUrl: 'https://github.com/HakkanShah/Math-o-Matic',
    aiHint: 'calculator',
  },
  {
    title: 'Hit-The-Jhatu',
    description: 'whack-a-mole style browser game',
    longDescription: 'A fun and addictive whack-a-mole style browser game featuring my friends as Jhatu and Gandu characters, inspired by trending Indian dank memes! Hit the Jhatu to score points while avoiding the Gandu. Test your reflexes and challenge your friends to beat your high score in this desi-themed game.',
    why: 'it is a prank and experimental game to check my logical reasoning skills',
    thumbnail: '/project-images/jhatugame.png',
    tags: ['Node.js', 'HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://hakkanshah.github.io/Hit-The-Jhatu/',
    repoUrl: 'https://github.com/HakkanShah/Hit-The-Jhatu',
    aiHint: 'hit the jhatu',
  },
];

export const SKILLS = [
  {
    name: "Frontend",
    skills: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Express.js", icon: SiExpress, color: "#000000" },
      { name: "Flask", icon: SiFlask, color: "#000000" },
    ],
  },
  {
    name: "Database",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" },
    ],
  },
  {
    name: "UI/UX",
    skills: [
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    ],
  },
  {
    name: "Tools",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "VS Code", icon: VscVscode, color: "#007ACC" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
      { name: "Vercel", icon: SiVercel, color: "#000000" },
      { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
    ],
  },
  {
    name: "AI Tools",
    skills: [
      { name: "ChatGPT", icon: SiOpenai, color: "#10A37F" },
      { name: "Claude", icon: SiAnthropic, color: "#FFD700" },
      { name: "Gemini", icon: SiGoogle, color: "#4285F4" },
    ],
  },
  {
    name: "Programming Languages",
    skills: [
      { name: "Java", icon: DiJava, color: "#007396" },
      { name: "C", icon: SiC, color: "#A8B9CC" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
    ],
  },
  {
    name: "Soft Skills",
    skills: [
      { name: "Problem Solving", icon: FaLightbulb, color: "#FFD700" },
      { name: "Teamwork", icon: FaUsers, color: "#228BE6" },
      { name: "Communication", icon: FaComments, color: "#20C997" },
    ],
  }
];

export const EXPERIENCE = [
  {
    role: 'Full Stack Developer Intern',
    company: 'UDRCRAFTS INDIA PVT. LTD.',
    period: 'Present',
    description: 'Developed full-stack solutions, handling both frontend interfaces and backend logic to deliver robust web products.',
    reality: "Honestly? It's mostly me fighting with CSS to center things while simultaneously praying the database doesn't catch fire. Full stack means full responsibility for the mess.",
    offerLetter: '/UdrCrafts_Internship_Offer_Letter.pdf',
    details: {
      overview: 'Developed a comprehensive e-commerce platform from scratch, handling both frontend and backend development.',
      responsibilities: [
        'Built responsive homepage components with modern UI/UX design',
        'Implemented advanced search functionality and product grid layouts',
        'Created product listing pages with filtering and sorting capabilities',
        'Developed backend APIs for fetching product details, pricing, and owner information',
        'Designed and implemented route handling for seamless navigation',
        'Managed database operations for product details and inventory',
        'Integrated payment gateway for secure transactions',
      ],
      realityResponsibilities: [
        "Spent 3 hours making a button perfectly centered, only for the client to say 'can we make it pop more?'",
        "The search bar works perfectly, as long as you type exactly what I tested with.",
        "Made the product grid responsive. By responsive, I mean it stacks vertically on mobile. Groundbreaking.",
        "Backend logic consisted of 50% actual code and 50% console.log('here?').",
        "Routing was a maze I built myself and then immediately got lost in.",
        "Database operations involved a lot of nervous sweating while running update queries.",
        "Payment integration: The most stressful part of my life. Please don't use real money yet.",
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Payment Gateway APIs', 'RESTful APIs', 'Database Design'],
      achievements: [
        'Delivered a fully functional e-commerce platform',
        'Implemented secure payment processing system',
        'Optimized database queries for improved performance',
      ],
      realityAchievements: [
        "The site didn't crash during the client demo. Huge success.",
        "Payment gateway works (I think). No one has complained about lost money yet.",
        "Made the database faster by adding indexes I should have added on day one.",
      ],
    },
  },
  {
    role: 'React and NextJS Developer Intern',
    company: 'AIKing Solutions',
    period: 'Previous',
    description: 'Working on cutting-edge web applications using React and Next.js, focusing on performance optimization and modern UI/UX practices.',
    reality: "React state management is my personal hell. Also, teaching an AI to interview people is harder than it sounds—mostly it just wants to take over the world or hallucinate.",
    offerLetter: '/AIKing_Solutions_Internship_Offer_Letter.pdf',
    details: {
      overview: 'Built an AI-powered voice/video-driven mock interview system enabling users to practice interviews with real-time AI feedback.',
      responsibilities: [
        'Designed and implemented seamless AI interviewer and user communication system',
        'Developed dynamic question and cross-question generation algorithms',
        'Enhanced AI interviewer voice to sound more human-like, similar to Gemini and other advanced AI models',
        'Implemented live voice transcription using Google TTS and WaveNet',
        'Fixed critical UI, functional, and UX bugs to improve user experience',
        'Enabled one-click download of recorded interview videos with audio',
      ],
      realityResponsibilities: [
        "Built a 'seamless' chat system that only lags when you really need it to work.",
        "The AI generates questions. Sometimes they even make sense.",
        "Spent days tweaking the voice so it doesn't sound like a haunted GPS.",
        "Transcription works great if you speak like a news anchor in a soundproof room.",
        "Squashed bugs. Well, I hid them under the rug with try-catch blocks.",
        "The download button works, but don't ask me how the blob conversion happens.",
      ],
      technologies: ['React', 'Next.js', 'Google TTS', 'WaveNet', 'AI/ML Integration', 'WebRTC', 'Real-time Communication'],
      achievements: [
        'Successfully created a production-ready AI interview platform',
        'Improved voice quality to achieve near-human conversational experience',
        'Reduced user friction with streamlined download functionality',
      ],
      realityAchievements: [
        "It actually works in production! (Most of the time).",
        "The AI voice is now only slightly terrifying.",
        "Users can download videos, and the file size isn't 0 bytes. Progress.",
      ],
    },
  },
];

export const EDUCATION = [
  {
    degree: 'B.Tech CSE',
    institution: 'Greater Kolkata College of Engineering and Management',
    period: '2022 – 2026',
    details: 'CGPA: 7.5/10',
  },
  {
    degree: 'Higher Secondary',
    institution: 'WBCHSE',
    period: '2022',
    details: 'Percentage: 85%',
  },
  {
    degree: 'Secondary',
    institution: 'WBBSE',
    period: '2020',
    details: 'Percentage: 80%',
  }
];

export const CERTIFICATIONS = [
  { name: 'Full-Stack(MERN) BCT Training', issuer: 'Euphoria GenX', url: 'https://drive.google.com/file/d/1EFpyLejBPAHJbNjRSWPk2-EvdYJKpisG/view?usp=sharing' },
  { name: 'AWS AI-ML Virtual Internship', issuer: 'Eduskills Foundation & AWS', url: 'https://drive.google.com/file/d/17ak5Lc2GkG4X2Hh0WGLOOwajs1GQYq5J/view?usp=sharing' },
  { name: 'Palo Alto Cybersecurity', issuer: 'Eduskills Foundation & Palo Alto', url: 'https://drive.google.com/file/d/18Bm-x7BD8kj4-EZnPQYFQt6WbV6I0Jiv/view?usp=sharing' },
  { name: 'Blue Prism Automation', issuer: 'Eduskills Foundation & Blue Prism', url: 'https://drive.google.com/file/d/1S2qRZhRRxTqQg2U6mso1ljgzTKaVRALT/view?usp=sharing' },
  { name: 'Zscaler Zero Trust Security', issuer: 'Eduskills Foundation & Zscaler', url: 'https://drive.google.com/file/d/1V31whUog2M8rhOW69HgZjBil1mazVY13/view?usp=sharing' },
];

export const CONTACT_INFO = [
  { name: 'Email', value: 'hakkanparbej@gmail.com', icon: Mail, href: 'mailto:hakkanparbej@gmail.com', color: '#EA4335' },
  { name: 'Phone', value: '+91-7810843038', icon: Phone, href: 'tel:+917810843038', color: '#43C59E' },
  { name: 'GitHub', value: 'HakkanShah', icon: Github, href: 'https://github.com/HakkanShah', color: '#FFFFFF' },
  { name: 'LinkedIn', value: 'hakkan', icon: Linkedin, href: 'https://www.linkedin.com/in/hakkan/', color: '#0A66C2' },
  { name: 'G.Dev Profile', value: 'hakkan', icon: FcGoogle, href: 'https://g.dev/hakkan' },
];

export const ABOUT_ME = "Innovative and detail-oriented B.Tech CSE student passionate about building impactful web applications, blending creativity with technical expertise. Experienced in frontend & backend development, AI integration, and UI/UX design. Skilled at leading teams, solving complex problems, and delivering high-quality solutions under deadlines ."


