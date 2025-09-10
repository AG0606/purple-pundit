import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Award, MessageSquare, TrendingUp, Star, Save, History } from "lucide-react";
import { toast } from "sonner";

interface DebateMessage {
  id: string;
  speaker: 'AI' | 'User';
  content: string;
  timestamp: string;
  isVisible: boolean;
}

interface AnalysisMetrics {
  argumentStrength: number;
  evidenceUsage: number;
  logicalStructure: number;
  counterargumentHandling: number;
  overallPerformance: number;
}

interface DebateSession {
  id: string;
  topic: string;
  duration: number;
  userRole: string;
  difficulty: string;
  transcript: DebateMessage[];
  analysis: AnalysisMetrics;
  feedback: string[];
  recommendations: string[];
  createdAt: string;
}

const Report = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<DebateSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      const topic = searchParams.get('topic') || '';
      const duration = parseInt(searchParams.get('duration') || '0');
      const userMessages = parseInt(searchParams.get('userMessages') || '0');
      const transcriptStr = searchParams.get('transcript') || '[]';
      const transcript: DebateMessage[] = JSON.parse(transcriptStr);

      // Simulate AI analysis generation
      setTimeout(() => {
        const analysis = generateAnalysis(transcript, userMessages, duration);
        const feedback = generateFeedback(analysis);
        const recommendations = generateRecommendations(analysis);

        const newSession: DebateSession = {
          id: Date.now().toString(),
          topic,
          duration,
          userRole: searchParams.get('userRole') || 'pro',
          difficulty: searchParams.get('difficulty') || 'intermediate',
          transcript,
          analysis,
          feedback,
          recommendations,
          createdAt: new Date().toISOString()
        };

        setSession(newSession);
        setIsGenerating(false);
        toast.success("Analysis complete!");
      }, 3000);
    } catch (error) {
      toast.error("Failed to generate report");
      setIsGenerating(false);
    }
  };

  const generateAnalysis = (transcript: DebateMessage[], userMessages: number, duration: number): AnalysisMetrics => {
    // Simulate AI analysis based on transcript content
    const avgMessageLength = transcript
      .filter(m => m.speaker === 'User')
      .reduce((acc, m) => acc + m.content.length, 0) / userMessages;

    const argumentStrength = Math.min(90, 60 + Math.floor(avgMessageLength / 20));
    const evidenceUsage = Math.min(85, 50 + Math.floor(userMessages * 5));
    const logicalStructure = Math.min(88, 65 + Math.floor(duration / 60));
    const counterargumentHandling = Math.min(82, 55 + Math.floor(userMessages * 3));
    const overallPerformance = Math.floor((argumentStrength + evidenceUsage + logicalStructure + counterargumentHandling) / 4);

    return {
      argumentStrength,
      evidenceUsage,
      logicalStructure,
      counterargumentHandling,
      overallPerformance
    };
  };

  const generateFeedback = (analysis: AnalysisMetrics): string[] => {
    const feedback = [];
    
    if (analysis.argumentStrength >= 80) {
      feedback.push("Excellent argument construction with clear logical flow");
    } else if (analysis.argumentStrength >= 60) {
      feedback.push("Good argument structure, room for more compelling evidence");
    } else {
      feedback.push("Arguments need more structure and supporting evidence");
    }

    if (analysis.evidenceUsage >= 70) {
      feedback.push("Strong use of evidence to support your position");
    } else {
      feedback.push("Consider incorporating more factual evidence and examples");
    }

    if (analysis.logicalStructure >= 75) {
      feedback.push("Well-organized logical progression of ideas");
    } else {
      feedback.push("Work on creating clearer connections between your points");
    }

    return feedback;
  };

  const generateRecommendations = (analysis: AnalysisMetrics): string[] => {
    const recommendations = [];
    
    if (analysis.argumentStrength < 75) {
      recommendations.push("Practice structuring arguments with clear premises and conclusions");
    }
    
    if (analysis.evidenceUsage < 70) {
      recommendations.push("Research more factual evidence and statistics to support your position");
    }
    
    if (analysis.counterargumentHandling < 70) {
      recommendations.push("Work on acknowledging and addressing opposing viewpoints");
    }

    recommendations.push("Continue practicing with higher difficulty levels");
    
    return recommendations;
  };

  const saveSession = async () => {
    if (!session) return;
    
    setIsSaving(true);
    try {
      // Save to localStorage for now (would be Supabase in production)
      const existingSessions = JSON.parse(localStorage.getItem('debateSessions') || '[]');
      existingSessions.push(session);
      localStorage.setItem('debateSessions', JSON.stringify(existingSessions));
      
      toast.success("Session saved successfully!");
      setTimeout(() => {
        navigate('/history');
      }, 1000);
    } catch (error) {
      toast.error("Failed to save session");
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-card glass">
          <CardHeader className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <CardTitle>Analyzing Your Performance</CardTitle>
            <CardDescription>
              Our AI is reviewing your debate session and generating insights...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={66} className="mb-4" />
            <p className="text-center text-sm text-muted-foreground">
              Evaluating arguments, evidence, and structure...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-card glass">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Failed to generate report</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Session
          </Button>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Debate Analysis Report
            </Badge>
            <h1 className="text-2xl font-bold text-foreground">
              {session.topic}
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
              className="hover:bg-secondary hover:text-secondary-foreground transition-smooth"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button
              onClick={saveSession}
              disabled={isSaving}
              className="bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Session
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Score */}
            <Card className="shadow-card glass border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Overall Performance
                </CardTitle>
                <CardDescription>
                  Your debate performance score and breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {session.analysis.overallPerformance}%
                  </div>
                  <Badge variant={session.analysis.overallPerformance >= 80 ? 'default' : session.analysis.overallPerformance >= 60 ? 'secondary' : 'outline'}>
                    {session.analysis.overallPerformance >= 80 ? 'Excellent' : session.analysis.overallPerformance >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Argument Strength</span>
                      <span className="text-sm text-muted-foreground">{session.analysis.argumentStrength}%</span>
                    </div>
                    <Progress value={session.analysis.argumentStrength} className="mb-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Evidence Usage</span>
                      <span className="text-sm text-muted-foreground">{session.analysis.evidenceUsage}%</span>
                    </div>
                    <Progress value={session.analysis.evidenceUsage} className="mb-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Logical Structure</span>
                      <span className="text-sm text-muted-foreground">{session.analysis.logicalStructure}%</span>
                    </div>
                    <Progress value={session.analysis.logicalStructure} className="mb-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Counterargument Handling</span>
                      <span className="text-sm text-muted-foreground">{session.analysis.counterargumentHandling}%</span>
                    </div>
                    <Progress value={session.analysis.counterargumentHandling} className="mb-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="shadow-card glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Detailed Feedback
                </CardTitle>
                <CardDescription>
                  AI-generated insights on your debate performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.feedback.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border-l-4 border-l-accent">
                      <Star className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-card glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Improvement Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions to enhance your debate skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.recommendations.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border-l-4 border-l-success">
                      <TrendingUp className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="shadow-card glass">
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p className="font-medium">{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Your Role</span>
                  <Badge variant="secondary" className="block w-fit mt-1">
                    {session.userRole === 'pro' ? 'Supporting' : 'Opposing'}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">AI Difficulty</span>
                  <Badge variant="outline" className="block w-fit mt-1">
                    {session.difficulty}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Messages Exchanged</span>
                  <p className="font-medium">{session.transcript.length} total</p>
                  <p className="text-xs text-muted-foreground">
                    {session.transcript.filter(m => m.speaker === 'User').length} from you
                  </p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Completed On</span>
                  <p className="font-medium text-xs">
                    {new Date(session.createdAt).toLocaleDateString()} at{' '}
                    {new Date(session.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-card glass">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
                    onClick={() => navigate('/')}
                  >
                    Start New Debate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-secondary hover:text-secondary-foreground transition-smooth"
                    onClick={() => navigate('/history')}
                  >
                    View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;