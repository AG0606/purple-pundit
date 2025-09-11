import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Trophy, Sparkles, ArrowRight, Play, History, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthDialog from "@/components/auth/AuthDialog";
import SimulationSetup from "@/components/simulation/SimulationSetup";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    // Load session count from localStorage
    try {
      const sessions = JSON.parse(localStorage.getItem('debateSessions') || '[]');
      setSessionCount(sessions.length);
    } catch (error) {
      setSessionCount(0);
    }
  }, []);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl opacity-15 animate-morph"></div>
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-accent rounded-full blur-2xl opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Geometric Shapes */}
      <div className="absolute top-20 right-1/4 w-4 h-4 bg-primary rotate-45 animate-float opacity-60"></div>
      <div className="absolute top-1/2 left-10 w-6 h-6 bg-accent rounded-full animate-glow-pulse"></div>
      <div className="absolute bottom-1/3 right-16 w-3 h-16 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-card/50 backdrop-blur-xl glass-strong sticky top-0 z-40 shadow-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary group-hover:shadow-glow transition-all duration-300 hover-lift">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">DebateCoach</span>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/history')}
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-smooth hover-lift backdrop-blur-sm"
            >
              <History className="w-5 h-5 mr-2" />
              View History ({sessionCount})
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setIsAuthOpen(true)}
              className="hover:bg-primary hover:text-primary-foreground transition-smooth hover-scale shadow-inner"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          {/* Floating Badge */}
          <div className="mb-8 inline-block">
            <Badge className="bg-gradient-primary text-white shadow-primary px-6 py-2 text-sm font-medium hover-lift animate-glow-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Debate Training
            </Badge>
          </div>
          
          {/* Main Heading with Effects */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 animate-fade-in-up leading-none">
            Master the Art of
            <div className="mt-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Debate
              </span>
            </div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Elevate your debating skills with our revolutionary AI coach. Practice real-time debates, 
            receive instant feedback, and track your progress like never before.
          </p>

          {/* AI Debate Visualization */}
          <div className="mb-16 relative group" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-all duration-700 animate-glow-pulse"></div>
            <img 
              src="/lovable-uploads/6b593b0c-7cbf-4c0a-9343-a252926c1d14.png"
              alt="AI Debate Interface showing two debate opponents with neural network visualization"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-primary hover-lift relative z-10 border border-primary/20"
            />
            
            {/* Decorative Elements around Image */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-accent rounded-full animate-float opacity-60"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-secondary rounded-full animate-float opacity-80" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -left-8 w-2 h-16 bg-primary rounded-full animate-float opacity-40"></div>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up mb-20" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-primary text-lg px-10 py-6 hover-lift animate-glow-pulse relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <Play className="w-6 h-6 mr-3" />
              Start Practicing
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {sessionCount > 0 && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/history')}
                className="border-primary/30 hover:bg-primary/10 hover:border-primary/60 transition-smooth text-lg px-10 py-6 hover-scale backdrop-blur-sm"
              >
                <History className="w-6 h-6 mr-3" />
                View History ({sessionCount})
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent/30 hover:bg-accent/10 hover:border-accent/60 transition-smooth text-lg px-10 py-6 hover-scale backdrop-blur-sm"
            >
              <Play className="w-6 h-6 mr-3" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {[
              { number: "10K+", label: "Active Debaters", icon: Users },
              { number: "95%", label: "Improvement Rate", icon: Trophy },
              { number: "4.9/5", label: "User Rating", icon: Sparkles }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-secondary rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-card">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-subtle"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <Badge variant="outline" className="border-primary/30 text-primary px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Complete Platform
              </Badge>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6">
              Everything You Need to 
              <span className="bg-gradient-accent bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools and insights you need to become a masterful debater with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:glass-strong transition-all duration-500 hover-lift group border-primary/10 hover:border-primary/30 relative overflow-hidden">
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-accent animate-glow-pulse">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-60 transition-opacity animate-float"></div>
                <div className="absolute bottom-4 left-4 w-1 h-8 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Card>
            ))}
          </div>
          
          {/* Feature Highlight */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 bg-card/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-primary/20 shadow-card">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center animate-glow-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Powered by Advanced AI</div>
                <div className="text-sm text-muted-foreground">Experience debates that adapt to your skill level</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-accent rounded-full blur-3xl opacity-15 animate-morph"></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="bg-gradient-primary/10 backdrop-blur-xl p-16 rounded-3xl shadow-primary border border-primary/20 relative overflow-hidden group hover-lift">
            {/* Inner Glow Effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 w-6 h-6 bg-accent rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-secondary rounded-full animate-glow-pulse opacity-40"></div>
            <div className="absolute top-1/2 left-12 w-2 h-12 bg-primary/30 rounded-full animate-float"></div>
            
            <div className="relative z-10">
              <Badge className="mb-8 bg-white/10 text-white border-white/20 px-6 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Join the Elite
              </Badge>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ready to Transform Your
                <span className="block bg-gradient-accent bg-clip-text text-transparent">
                  Debate Skills?
                </span>
              </h2>
              
              <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of debaters who are already mastering their craft with our revolutionary AI-powered coaching platform. Your journey to debate excellence starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-6 hover-scale shadow-accent group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <Sparkles className="w-6 h-6 mr-3" />
                  Get Started Today
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/60 text-lg px-12 py-6 hover-scale backdrop-blur-sm"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </Button>
              </div>
            </div>
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