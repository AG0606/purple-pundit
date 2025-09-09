import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Trophy, Sparkles, ArrowRight, Play } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import SimulationSetup from "@/components/simulation/SimulationSetup";

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setIsSetupOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const features = [
    {
      icon: Mic,
      title: "AI Debate Partner",
      description: "Practice with our advanced AI that adapts to your skill level and provides challenging arguments."
    },
    {
      icon: Users,
      title: "Real-time Feedback",
      description: "Get instant analysis of your arguments, speaking patterns, and debate techniques."
    },
    {
      icon: Trophy,
      title: "Performance Analytics",
      description: "Track your progress with detailed reports and personalized improvement recommendations."
    },
    {
      icon: Sparkles,
      title: "Smart Notes",
      description: "Take dynamic notes during debates and save key points from transcripts instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DebateCoach</span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsAuthOpen(true)}
            className="hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-gradient-primary text-primary-foreground shadow-glow">
            AI-Powered Debate Training
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
            Master the Art of
            <span className="text-foreground"> Debate</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up">
            Elevate your debating skills with our advanced AI coach. Practice real-time debates, 
            receive instant feedback, and track your progress like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-primary text-lg px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Practicing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground transition-smooth text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need to become a masterful debater.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth glass">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-gradient-primary p-12 rounded-2xl shadow-primary">
            <h2 className="text-4xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Debate Skills?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of debaters who are already improving their skills with our AI-powered coaching platform.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="bg-card text-foreground hover:bg-card/90 text-lg px-8 py-6"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthOpen} 
        onOpenChange={setIsAuthOpen}
        onAuthSuccess={() => {
          setIsAuthenticated(true);
          setIsAuthOpen(false);
          setIsSetupOpen(true);
        }}
      />

      {/* Simulation Setup Dialog */}
      <SimulationSetup 
        open={isSetupOpen} 
        onOpenChange={setIsSetupOpen}
      />
    </div>
  );
};

export default Index;