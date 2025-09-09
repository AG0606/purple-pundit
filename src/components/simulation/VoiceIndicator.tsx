import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VoiceIndicatorProps {
  isAISpeaking: boolean;
  isUserMuted: boolean;
  onToggleMute: () => void;
  canUserSpeak: boolean;
}

const VoiceIndicator = ({ isAISpeaking, isUserMuted, onToggleMute, canUserSpeak }: VoiceIndicatorProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border border-border rounded-lg">
      {/* AI Status */}
      <div className="flex items-center gap-3">
        <div className={`relative ${isAISpeaking ? 'animate-pulse-ring' : ''}`}>
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Volume2 className={`w-5 h-5 text-primary-foreground ${isAISpeaking ? 'animate-pulse' : ''}`} />
          </div>
          {isAISpeaking && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
          )}
        </div>
        <div>
          <Badge variant={isAISpeaking ? "default" : "secondary"} className="mb-1">
            {isAISpeaking ? "AI Speaking" : "AI Ready"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isAISpeaking ? "Listen to the argument..." : "Waiting for your response"}
          </p>
        </div>
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <Badge variant={canUserSpeak && !isUserMuted ? "default" : "secondary"} className="mb-1">
            {canUserSpeak ? (isUserMuted ? "Muted" : "Your Turn") : "Wait"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {canUserSpeak ? "Press to speak" : "AI is speaking"}
          </p>
        </div>
        
        <Button
          size="lg"
          variant={isUserMuted ? "secondary" : "default"}
          onClick={onToggleMute}
          disabled={!canUserSpeak}
          className={`w-12 h-12 rounded-full ${
            !isUserMuted && canUserSpeak
              ? 'bg-success text-success-foreground hover:bg-success/90 shadow-glow' 
              : 'bg-secondary text-secondary-foreground'
          } transition-smooth`}
        >
          {isUserMuted ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoiceIndicator;