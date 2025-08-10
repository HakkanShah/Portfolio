import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import wowBubble from '@/assets/wow-bubble.png';

const ProjectsSection = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Sample projects - these would be replaced with real project data
  const projects = [
    {
      title: "E-COMMERCE EMPIRE",
      description: "A full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🛍️",
      status: "COMPLETED"
    },
    {
      title: "SOCIAL NETWORK NEXUS",
      description: "Real-time social media platform with live chat, post sharing, and user profiles. Built with React, Express, and Socket.io.",
      technologies: ["React", "Express", "Socket.io", "PostgreSQL", "JWT"],
      liveUrl: "#",
      githubUrl: "#",
      image: "👥",
      status: "COMPLETED"
    },
    {
      title: "TASK MASTER PRO",
      description: "Advanced project management tool with team collaboration, file sharing, and progress tracking. Perfect for agile development teams.",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
      liveUrl: "#",
      githubUrl: "#",
      image: "📋",
      status: "COMPLETED"
    },
    {
      title: "WEATHER WIZARD",
      description: "Beautiful weather app with location services, 7-day forecasts, and interactive maps. Responsive design for all devices.",
      technologies: ["React", "OpenWeather API", "Leaflet", "CSS3"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🌤️",
      status: "COMPLETED"
    },
    {
      title: "CRYPTO TRACKER",
      description: "Real-time cryptocurrency tracking dashboard with charts, price alerts, and portfolio management features.",
      technologies: ["Vue.js", "Chart.js", "CoinGecko API", "Vuex"],
      liveUrl: "#",
      githubUrl: "#",
      image: "💰",
      status: "COMPLETED"
    },
    {
      title: "RECIPE REALM",
      description: "Food recipe sharing platform where users can upload, share, and discover amazing recipes from around the world.",
      technologies: ["React", "Node.js", "MongoDB", "Cloudinary", "Express"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🍳",
      status: "COMPLETED"
    },
    {
      title: "FITNESS TRACKER",
      description: "Personal fitness tracking app with workout plans, progress monitoring, and social features for motivation.",
      technologies: ["React Native", "Firebase", "Charts.js", "Redux"],
      liveUrl: "#",
      githubUrl: "#",
      image: "💪",
      status: "COMPLETED"
    },
    {
      title: "MUSIC STUDIO",
      description: "Online music collaboration platform where musicians can create, share, and collaborate on tracks together.",
      technologies: ["React", "Web Audio API", "Node.js", "Socket.io"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🎵",
      status: "IN PROGRESS"
    },
    {
      title: "AI CHAT BOT",
      description: "Intelligent chatbot with natural language processing, machine learning capabilities, and multi-platform integration.",
      technologies: ["Python", "OpenAI API", "React", "FastAPI", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🤖",
      status: "PLANNING"
    },
    {
      title: "TRAVEL COMPANION",
      description: "Travel planning and booking platform with itinerary management, local recommendations, and budget tracking.",
      technologies: ["Next.js", "Stripe", "Maps API", "Prisma", "TypeScript"],
      liveUrl: "#",
      githubUrl: "#",
      image: "✈️",
      status: "PLANNING"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-primary text-primary-foreground";
      case "IN PROGRESS": return "bg-accent text-accent-foreground";
      case "PLANNING": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="projects" className="min-h-screen py-20 relative">
      {/* Floating Comic Effects */}
      <img 
        src={wowBubble} 
        alt="WOW!" 
        className="absolute top-16 right-12 w-24 h-24 animate-comic-float opacity-60" 
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-comic-hero text-5xl md:text-6xl text-primary mb-6">
            HEROIC ADVENTURES
          </h2>
          <div className="speech-bubble bg-muted text-muted-foreground max-w-2xl mx-auto">
            <p className="font-comic text-lg">
              Behold! The epic projects I've conquered in my quest to make the web a better place! 
              Each one is a chapter in my superhero journey! 🚀💻
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className={`
                comic-panel p-6 cursor-pointer transition-all duration-300 group
                ${hoveredProject === index ? 'animate-comic-shake scale-105' : ''}
              `}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image/Icon */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-3 group-hover:animate-zoom-pow">
                  {project.image}
                </div>
                <Badge className={`font-comic-display text-xs ${getStatusColor(project.status)}`}>
                  {project.status}
                </Badge>
              </div>

              {/* Project Title */}
              <h3 className="font-comic-display text-xl text-accent mb-3 text-center">
                {project.title}
              </h3>

              {/* Project Description */}
              <div className="speech-bubble bg-background text-foreground mb-4 text-sm">
                <p className="font-comic leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <Badge 
                    key={techIndex}
                    variant="outline" 
                    className="text-xs font-comic"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <Button 
                  size="sm" 
                  variant="default"
                  className="flex-1 font-comic-hero text-xs zoom-pow"
                  asChild
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    LIVE DEMO
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex-1 font-comic-hero text-xs zoom-pow"
                  asChild
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 mr-1" />
                    CODE
                  </a>
                </Button>
              </div>

              {/* Comic Panel Number */}
              <div className="absolute top-2 left-2 bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-comic-hero text-sm">{index + 1}</span>
              </div>

              {/* Hover Burst Effect */}
              {hoveredProject === index && (
                <div className="absolute -inset-2 comic-burst rounded-lg -z-10 animate-burst-appear"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="comic-panel bg-accent text-accent-foreground p-8 max-w-2xl mx-auto">
            <h3 className="font-comic-hero text-3xl mb-4">MORE ADVENTURES AWAIT!</h3>
            <p className="font-comic mb-6">
              These are just some of my greatest victories! Want to see the full collection 
              or team up for a new quest?
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="font-comic-hero zoom-pow"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              LET'S TEAM UP!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;