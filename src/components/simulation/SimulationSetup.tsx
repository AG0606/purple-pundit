import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, Target, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SimulationSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SimulationSetup = ({ open, onOpenChange }: SimulationSetupProps) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("15");
  const [userRole, setUserRole] = useState("pro");
  const [difficulty, setDifficulty] = useState("intermediate");

  const suggestedTopics = [
    "Should artificial intelligence replace human teachers?",
    "Is social media more harmful than beneficial to society?",
    "Should nuclear energy be the primary solution to climate change?",
    "Is universal basic income necessary in the modern economy?",
    "Should space exploration be prioritized over ocean exploration?"
  ];

  const handleStartSimulation = () => {
    if (!topic.trim()) {
      toast.error("Please enter a debate topic");
      return;
    }

    toast.success("Starting your debate simulation!");
    
    // Navigate to simulation window with parameters
    const params = new URLSearchParams({
      topic: topic.trim(),
      duration,
      userRole,
      difficulty
    });
    
    navigate(`/simulation?${params}`);
    onOpenChange(false);
  };

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Setup Your Debate</DialogTitle>
          <DialogDescription>
            Configure your debate simulation settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Topic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Debate Topic
              </CardTitle>
              <CardDescription>
                Choose or enter your debate topic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="Enter your debate topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Suggested Topics:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedTopics.map((suggestedTopic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
                      onClick={() => handleTopicSelect(suggestedTopic)}
                    >
                      {suggestedTopic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Configuration */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Your Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">Pro (Supporting)</SelectItem>
                    <SelectItem value="con">Con (Opposing)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* AI Difficulty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Difficulty
              </CardTitle>
              <CardDescription>
                Choose the difficulty level for your AI opponent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - Gentle practice with basic arguments</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Balanced challenge with solid reasoning</SelectItem>
                  <SelectItem value="advanced">Advanced - Professional-level arguments and rebuttals</SelectItem>
                  <SelectItem value="expert">Expert - Harvard-level debate tactics</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Separator />

          {/* Start Button */}
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={handleStartSimulation}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-primary px-8 py-6 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Debate Simulation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimulationSetup;