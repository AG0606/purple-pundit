import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StickyNote, Plus, X, Quote, Pin, Search, Filter, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  timestamp: string;
  fromTranscript?: boolean;
  transcriptText?: string;
  transcriptSpeaker?: 'AI' | 'User';
  tags?: string[];
  isPinned?: boolean;
  category?: 'argument' | 'counterpoint' | 'evidence' | 'question' | 'insight';
}

interface StickyNotesProps {
  className?: string;
  onAddFromTranscript?: (transcriptId: string, content: string, speaker: 'AI' | 'User') => void;
}

const StickyNotes = ({ className = "", onAddFromTranscript }: StickyNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCompactView, setIsCompactView] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addNote = (
    content: string, 
    fromTranscript = false, 
    transcriptText?: string,
    transcriptSpeaker?: 'AI' | 'User',
    category: Note['category'] = 'insight'
  ) => {
    if (!content.trim()) {
      toast.error("Please enter some content for your note");
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString(),
      fromTranscript,
      transcriptText,
      transcriptSpeaker,
      category,
      isPinned: false,
      tags: []
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

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const addFromTranscript = (transcriptId: string, content: string, speaker: 'AI' | 'User') => {
    const category: Note['category'] = speaker === 'AI' ? 'counterpoint' : 'argument';
    addNote(`${speaker === 'AI' ? 'AI Argument' : 'My Point'}: ${content}`, true, content, speaker, category);
    toast.success(`Added ${speaker} response to notes!`);
  };

  // Expose function to parent component
  useEffect(() => {
    if (onAddFromTranscript) {
      // This allows parent to call this function
      (window as any).addTranscriptToNotes = addFromTranscript;
    }
  }, [onAddFromTranscript]);

  // Filter notes based on search and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.transcriptText && note.transcriptText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort notes: pinned first, then by timestamp
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const categories = [
    { value: 'all', label: 'All Notes', icon: BookOpen },
    { value: 'argument', label: 'Arguments', icon: Plus },
    { value: 'counterpoint', label: 'Counterpoints', icon: X },
    { value: 'evidence', label: 'Evidence', icon: Quote },
    { value: 'question', label: 'Questions', icon: Search },
    { value: 'insight', label: 'Insights', icon: StickyNote }
  ];

  return (
    <Card className={`shadow-card glass ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StickyNote className="w-5 h-5 text-primary" />
            Debate Notes
            <Badge variant="secondary" className="text-xs ml-2">
              {notes.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCompactView(!isCompactView)}
            className="w-8 h-8 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="h-6 px-2 text-xs"
              >
                <cat.icon className="w-3 h-3 mr-1" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Quick Add Note */}
        {!isAddingNote ? (
          <Button
            variant="outline"
            onClick={() => {
              setIsAddingNote(true);
              setTimeout(() => textareaRef.current?.focus(), 100);
            }}
            className="w-full border-dashed hover:bg-primary hover:text-primary-foreground transition-smooth h-8 text-sm"
          >
            <Plus className="w-3 h-3 mr-2" />
            Quick Note
          </Button>
        ) : (
          <div className="space-y-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <Textarea
              ref={textareaRef}
              placeholder="Capture your insight..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px] resize-none text-sm border-0 bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  addNote(newNote);
                }
                if (e.key === 'Escape') {
                  setIsAddingNote(false);
                  setNewNote("");
                }
              }}
            />
            <div className="flex gap-2 justify-between">
              <div className="flex gap-1">
                {categories.slice(1).map((cat) => (
                  <Button
                    key={cat.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => addNote(newNote, false, undefined, undefined, cat.value as Note['category'])}
                    className="h-6 px-2 text-xs"
                    disabled={!newNote.trim()}
                  >
                    <cat.icon className="w-3 h-3" />
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => addNote(newNote)}
                  disabled={!newNote.trim()}
                  className="h-6 px-3 text-xs bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote("");
                  }}
                  className="h-6 px-2 text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Ctrl/Cmd + Enter to save • Escape to cancel
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <StickyNote className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No matching notes found' 
                  : 'No notes yet. Start capturing insights!'}
              </p>
            </div>
          ) : (
            sortedNotes.map((note) => {
              const categoryConfig = categories.find(cat => cat.value === note.category);
              const CategoryIcon = categoryConfig?.icon || StickyNote;
              
              return (
                <Card 
                  key={note.id} 
                  className={`relative transition-all duration-200 hover:shadow-sm ${
                    note.isPinned ? 'bg-primary/5 border-primary/20' : 'bg-accent/5'
                  } ${isCompactView ? 'p-2' : 'p-3'}`}
                >
                  <CardContent className={isCompactView ? "p-2" : "p-3"}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3 text-primary" />
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            <Clock className="w-2 h-2 mr-1" />
                            {note.timestamp}
                          </Badge>
                        </div>
                        
                        {note.fromTranscript && (
                          <Badge 
                            variant={note.transcriptSpeaker === 'AI' ? 'default' : 'secondary'} 
                            className="text-xs h-4 px-1"
                          >
                            <Quote className="w-2 h-2 mr-1" />
                            {note.transcriptSpeaker}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePin(note.id)}
                          className={`w-5 h-5 p-0 ${note.isPinned ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          <Pin className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="w-5 h-5 p-0 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className={`leading-relaxed whitespace-pre-wrap ${isCompactView ? 'text-xs' : 'text-sm'}`}>
                      {note.content}
                    </p>
                    
                    {note.transcriptText && !isCompactView && (
                      <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground border-l-2 border-accent/50">
                        <div className="flex items-center gap-1 mb-1">
                          <Quote className="w-3 h-3" />
                          <span className="font-medium">Original transcript:</span>
                        </div>
                        <div className="italic">"{note.transcriptText}"</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StickyNotes;