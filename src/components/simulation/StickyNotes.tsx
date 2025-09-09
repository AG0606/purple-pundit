import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, X, Quote } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  timestamp: string;
  fromTranscript?: boolean;
  transcriptText?: string;
}

interface StickyNotesProps {
  className?: string;
  onAddFromTranscript?: (text: string) => void;
}

const StickyNotes = ({ className = "", onAddFromTranscript }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addNote = (content: string, fromTranscript = false, transcriptText?: string) => {
    if (!content.trim()) {
      toast.error("Please enter some content for your note");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString(),
      fromTranscript,
      transcriptText
    };

    setNotes(prev => [note, ...prev]);
    setNewNote("");
    setIsAddingNote(false);
    toast.success("Note added successfully!");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success("Note deleted");
  };

  const handleAddFromTranscript = (text: string) => {
    addNote(`Key point: ${text}`, true, text);
  };

  // Expose function to parent component
  if (onAddFromTranscript) {
    // This would be called from the transcript component
  }

  return (
    <Card className={`shadow-card glass ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="w-5 h-5 text-primary" />
          Notes
        </CardTitle>
        <CardDescription>
          Keep track of key points and insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Note Button */}
        {!isAddingNote ? (
          <Button
            variant="outline"
            onClick={() => setIsAddingNote(true)}
            className="w-full border-dashed hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => addNote(newNote)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes yet. Start adding your insights!</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="relative bg-accent/10 border-l-4 border-l-accent">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.timestamp}
                      </Badge>
                      {note.fromTranscript && (
                        <Badge variant="outline" className="text-xs">
                          <Quote className="w-3 h-3 mr-1" />
                          From transcript
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNote(note.id)}
                      className="w-6 h-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                  
                  {note.transcriptText && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground border-l-2 border-accent">
                      <Quote className="w-3 h-3 inline mr-1" />
                      "{note.transcriptText}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StickyNotes;