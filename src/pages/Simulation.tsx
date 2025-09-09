import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, MessageSquare, Target, BarChart } from "lucide-react";
import VoiceIndicator from "@/components/simulation/VoiceIndicator";
import TypewriterText from "@/components/simulation/TypewriterText";
import StickyNotes from "@/components/simulation/StickyNotes";
import { toast } from "sonner";

interface DebateMessage {
  id: string;
  speaker: 'AI' | 'User';
  content: string;
  timestamp: string;
  isVisible: boolean;
}

const Simulation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Simulation parameters
  const topic = searchParams.get('topic') || 'Default debate topic';
  const duration = parseInt(searchParams.get('duration') || '15');
  const userRole = searchParams.get('userRole') || 'pro';
  const difficulty = searchParams.get('difficulty') || 'intermediate';

  // Simulation state
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);

  // Sample AI responses based on difficulty
  const aiResponses = {
    beginner: [
      "I believe this topic is important because it affects many people. Let me share a simple argument to support my position...",
      "That's an interesting point, but I think there are some counterarguments we should consider...",
      "Based on basic research, I can provide evidence that shows a different perspective..."
    ],
    intermediate: [
      "Drawing from established research and empirical evidence, I would argue that the fundamental premise requires deeper analysis. Consider the socioeconomic implications...",
      "Your point raises valid concerns, however, we must examine the long-term consequences and statistical trends that contradict this position...",
      "The data suggests a more nuanced approach. Studies from leading institutions indicate that this issue involves multiple variables..."
    ],
    advanced: [
      "The epistemological foundation of this argument rests on several key assumptions that warrant critical examination. The empirical evidence, particularly from longitudinal studies...",
      "While your argument demonstrates logical coherence, it fails to address the systemic implications and externalities. Meta-analytical research indicates...",
      "This position, though rhetorically compelling, suffers from confirmation bias and cherry-picked data. Comprehensive peer-reviewed literature suggests..."
    ],
    expert: [
      "The fundamental flaw in this reasoning lies in its failure to account for the complex interplay between institutional frameworks and market dynamics, as evidenced by Nobel laureate research...",
      "Your argument, while sophisticated, commits the fallacy of false dichotomy. The Hegelian dialectic approach reveals multiple synthesis possibilities...",
      "Drawing from game theory and behavioral economics, the optimal solution requires understanding stakeholder incentives and information asymmetries..."
    ]
  };

  // Start simulation
  useEffect(() => {
    if (!isSimulationActive) {
      setTimeout(() => {
        setIsSimulationActive(true);
        startAITurn();
        toast.success("Debate simulation started!");
      }, 1000);
    }
  }, [isSimulationActive]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulationActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSimulationActive, timeRemaining]);

  const startAITurn = () => {
    setIsAISpeaking(true);
    setIsUserMuted(true);
    
    // Get AI response based on difficulty
    const responses = aiResponses[difficulty as keyof typeof aiResponses] || aiResponses.intermediate;
    const response = responses[aiMessageIndex % responses.length];
    
    setCurrentMessage(response);
    
    // Simulate AI speaking duration (longer for more complex responses)
    const speakingDuration = response.length * 50; // 50ms per character
    
    setTimeout(() => {
      addMessage('AI', response);
      setIsAISpeaking(false);
      setIsUserMuted(false);
      setCurrentMessage("");
    }, speakingDuration);
  };

  const handleUserSpeak = () => {
    setIsUserMuted(false);
    toast.info("You can now speak your argument");
  };

  const handleUserMute = () => {
    setIsUserMuted(true);
    
    // Simulate user response (in real app, this would be from STT)
    const userResponse = "Thank you for that argument. I respectfully disagree and here's my counterpoint based on different evidence and reasoning...";
    
    setTimeout(() => {
      addMessage('User', userResponse);
      setAiMessageIndex(prev => prev + 1);
      
      // Start next AI turn after short pause
      setTimeout(() => {
        if (timeRemaining > 30) { // Continue if enough time left
          startAITurn();
        }
      }, 2000);
    }, 1500);
  };

  const addMessage = (speaker: 'AI' | 'User', content: string) => {
    const message: DebateMessage = {
      id: Date.now().toString(),
      speaker,
      content,
      timestamp: new Date().toLocaleTimeString(),
      isVisible: true
    };
    
    setMessages(prev => [...prev, message]);
  };

  const endSimulation = () => {
    setIsSimulationActive(false);
    setIsAISpeaking(false);
    setIsUserMuted(true);
    
    // Check if simulation qualifies for report (2+ minutes, 2+ user messages)
    const userMessages = messages.filter(m => m.speaker === 'User').length;
    const simulationDuration = duration * 60 - timeRemaining;
    
    if (simulationDuration >= 120 && userMessages >= 2) {
      toast.success("Generating your debate analysis report...");
      // Navigate to report page
      setTimeout(() => {
        const reportParams = new URLSearchParams({
          topic,
          duration: simulationDuration.toString(),
          userMessages: userMessages.toString(),
          transcript: JSON.stringify(messages)
        });
        navigate(`/report?${reportParams}`);
      }, 2000);
    } else {
      toast.info("Simulation too short for analysis. Need 2+ minutes and 2+ responses.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canUserSpeak = !isAISpeaking && isSimulationActive;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            End Session
          </Button>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              {userRole === 'pro' ? 'Supporting' : 'Opposing'} Position
            </Badge>
            <h1 className="text-xl font-bold text-foreground max-w-md">
              {topic}
            </h1>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Time Remaining</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {formatTime(timeRemaining)}
            </div>
            <Progress 
              value={((duration * 60 - timeRemaining) / (duration * 60)) * 100} 
              className="w-32 mt-2"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Debate Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Voice Controls */}
            <VoiceIndicator
              isAISpeaking={isAISpeaking}
              isUserMuted={isUserMuted}
              onToggleMute={isUserMuted ? handleUserSpeak : handleUserMute}
              canUserSpeak={canUserSpeak}
            />

            {/* Current AI Message Display */}
            {currentMessage && (
              <Card className="shadow-card glass border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-primary-foreground" />
                    </div>
                    AI Opponent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypewriterText
                    text={currentMessage}
                    speed={30}
                    className="text-lg leading-relaxed"
                    onComplete={() => {
                      // Optional: Do something when typing completes
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Transcript */}
            <Card className="shadow-card glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Debate Transcript
                </CardTitle>
                <CardDescription>
                  Live transcript of your debate session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Transcript will appear here as the debate progresses...</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={message.speaker === 'AI' ? 'default' : 'secondary'}>
                            {message.speaker === 'AI' ? 'AI Opponent' : 'You'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed p-3 rounded-lg bg-muted/30 border-l-4 border-l-accent">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="shadow-card glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-primary" />
                  Session Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge variant="outline" className="text-xs">
                    {difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Role:</span>
                  <Badge variant="secondary" className="text-xs">
                    {userRole === 'pro' ? 'Pro' : 'Con'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages:</span>
                  <span>{messages.filter(m => m.speaker === 'User').length} / {messages.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sticky Notes */}
            <StickyNotes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;