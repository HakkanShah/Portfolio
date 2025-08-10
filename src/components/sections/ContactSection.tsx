import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import powBubble from '@/assets/pow-bubble.png';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: "BAM! Message Sent! 🚀",
        description: "Your heroic message has been delivered! I'll respond faster than a speeding bullet!",
      });
    }, 1000);
  };

  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      url: "mailto:hakkan@example.com",
      color: "text-accent",
      label: "hakkan@example.com"
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/hakkan",
      color: "text-foreground",
      label: "github.com/hakkan"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/hakkan",
      color: "text-primary",
      label: "linkedin.com/in/hakkan"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/hakkan",
      color: "text-secondary",
      label: "@hakkan"
    }
  ];

  return (
    <section id="contact" className="min-h-screen py-20 relative">
      {/* Floating Comic Effects */}
      <img 
        src={powBubble} 
        alt="POW!" 
        className="absolute top-10 left-8 w-32 h-32 animate-comic-float opacity-50" 
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-comic-hero text-5xl md:text-6xl text-primary mb-6">
            TEAM UP WITH ME!
          </h2>
          <div className="speech-bubble bg-muted text-muted-foreground max-w-2xl mx-auto">
            <p className="font-comic text-lg">
              Ready to save the web together? Got a project that needs a superhero? 
              Send me a signal and let's create something AMAZING! 🦸‍♂️⚡
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Comic Postcard Style */}
          <Card className="comic-panel p-8">
            <div className="text-center mb-6">
              <h3 className="font-comic-display text-2xl text-accent mb-2">
                SEND A HERO SIGNAL
              </h3>
              <div className="bg-secondary text-secondary-foreground inline-block px-4 py-2 rotate-1 transform">
                <span className="font-comic text-sm">Digital Postcard to Hero HQ</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-comic font-semibold text-foreground block mb-2">
                  Hero Name: <span className="text-accent">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your superhero alias..."
                  required
                  className="comic-panel-inset font-comic"
                />
              </div>

              <div>
                <label className="font-comic font-semibold text-foreground block mb-2">
                  Communication Channel: <span className="text-accent">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hero@example.com"
                  required
                  className="comic-panel-inset font-comic"
                />
              </div>

              <div>
                <label className="font-comic font-semibold text-foreground block mb-2">
                  Mission Briefing: <span className="text-accent">*</span>
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your epic project! What kind of web adventure are we embarking on? 🚀"
                  required
                  rows={5}
                  className="comic-panel-inset font-comic resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full font-comic-hero text-lg py-6 comic-burst transition-all duration-300
                  ${isSubmitting ? 'animate-pulse' : 'zoom-pow'}
                `}
              >
                {isSubmitting ? 'SENDING SIGNAL...' : 'SEND HERO SIGNAL! 🚀'}
              </Button>
            </form>

            {/* Postcard Stamp */}
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground p-2 rotate-12 transform comic-panel-inset">
              <span className="font-comic-display text-xs">URGENT!</span>
            </div>
          </Card>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {/* Hero Contact Card */}
            <Card className="comic-panel p-6">
              <h3 className="font-comic-display text-2xl text-accent mb-4 text-center">
                HERO CONTACT INFO
              </h3>
              
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 comic-panel-inset hover:zoom-pow transition-all duration-200 group"
                  >
                    <social.icon className={`w-6 h-6 ${social.color} group-hover:animate-comic-float`} />
                    <div>
                      <div className="font-comic-display text-sm text-accent">
                        {social.name}
                      </div>
                      <div className="font-comic text-sm text-muted-foreground">
                        {social.label}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Hero Availability */}
            <Card className="comic-panel p-6">
              <h3 className="font-comic-display text-xl text-accent mb-4 text-center">
                HERO STATUS
              </h3>
              
              <div className="text-center space-y-4">
                <div className="bg-primary text-primary-foreground inline-block px-6 py-3 comic-burst">
                  <span className="font-comic-hero">AVAILABLE FOR HIRE!</span>
                </div>
                
                <div className="font-comic text-sm space-y-2">
                  <p>🕐 <strong>Response Time:</strong> Faster than Flash!</p>
                  <p>🌍 <strong>Location:</strong> Operating globally</p>
                  <p>⚡ <strong>Availability:</strong> Ready for new adventures</p>
                  <p>💼 <strong>Mission Types:</strong> Web development, consulting, collaborations</p>
                </div>
              </div>
            </Card>

            {/* Call to Action */}
            <div className="text-center">
              <div className="speech-bubble bg-secondary text-secondary-foreground">
                <p className="font-comic">
                  "Together, we can build amazing things and make the web a more awesome place! 
                  Let's combine our superpowers!" 
                </p>
                <div className="text-right mt-2">
                  <span className="font-comic-display text-sm text-accent">- Hakkan 🦸‍♂️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;