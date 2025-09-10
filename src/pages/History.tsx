import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Award, Clock, MessageSquare, Trash2, Eye, Plus, Filter } from "lucide-react";
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

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<DebateSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    try {
      const existingSessions = JSON.parse(localStorage.getItem('debateSessions') || '[]');
      setSessions(existingSessions);
    } catch (error) {
      toast.error("Failed to load session history");
    }
  };

  const deleteSession = (sessionId: string) => {
    try {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem('debateSessions', JSON.stringify(updatedSessions));
      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  const viewSessionDetails = (session: DebateSession) => {
    // Create URL params to navigate to report page with session data
    const params = new URLSearchParams({
      topic: session.topic,
      duration: session.duration.toString(),
      userMessages: session.transcript.filter(m => m.speaker === 'User').length.toString(),
      transcript: JSON.stringify(session.transcript),
      userRole: session.userRole,
      difficulty: session.difficulty,
      sessionId: session.id
    });
    navigate(`/report?${params}`);
  };

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = session.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === "all" || session.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "performance":
          return b.analysis.overallPerformance - a.analysis.overallPerformance;
        case "topic":
          return a.topic.localeCompare(b.topic);
        case "duration":
          return b.duration - a.duration;
        default: // date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getPerformanceBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

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
            Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Debate Session History
            </h1>
            <p className="text-muted-foreground">
              Review your past performances and track improvement
            </p>
          </div>

          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Debate
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-card glass mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest First)</SelectItem>
                  <SelectItem value="performance">Performance Score</SelectItem>
                  <SelectItem value="topic">Topic (A-Z)</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center justify-center">
                {filteredSessions.length} of {sessions.length} sessions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <Card className="shadow-card glass">
            <CardContent className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              {sessions.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">No Debate Sessions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first debate to see your session history here
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-primary hover:opacity-90 transition-smooth"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start First Debate
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">No Sessions Match Your Filters</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="shadow-card glass hover:shadow-primary transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getPerformanceBadgeVariant(session.analysis.overallPerformance)}>
                      {session.analysis.overallPerformance}% - {getPerformanceLabel(session.analysis.overallPerformance)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {session.topic}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(session.createdAt).toLocaleDateString()} at{' '}
                    {new Date(session.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span>{session.transcript.filter(m => m.speaker === 'User').length} responses</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Arguments</span>
                      <span>{session.analysis.argumentStrength}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all" 
                        style={{ width: `${session.analysis.argumentStrength}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewSessionDetails(session);
                      }}
                      className="flex-1 hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {sessions.length > 0 && (
          <Card className="shadow-card glass mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Performance Summary
              </CardTitle>
              <CardDescription>
                Your overall debate performance statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round(sessions.reduce((acc, s) => acc + s.analysis.overallPerformance, 0) / sessions.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {Math.max(...sessions.map(s => s.analysis.overallPerformance))}%
                  </div>
                  <div className="text-sm text-muted-foreground">Best Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Total Practice Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;