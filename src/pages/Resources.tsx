import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Star, Search, ExternalLink, BookOpen, FileText, Video, Globe, StarIcon } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'research' | 'website';
  source: string;
  isStarred: boolean;
  relevanceScore: number;
}

const Resources = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Parameters from setup
  const topic = searchParams.get('topic') || 'Default topic';
  const duration = searchParams.get('duration') || '15';
  const userRole = searchParams.get('userRole') || 'pro';
  const difficulty = searchParams.get('difficulty') || 'intermediate';
  
  // State
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Generate mock resources based on topic
  useEffect(() => {
    const generateResources = () => {
      const mockResources: Resource[] = [
        {
          id: "1",
          title: `Academic Research on "${topic.slice(0, 50)}..."`,
          description: "Comprehensive peer-reviewed studies and meta-analyses providing empirical evidence for both sides of the debate.",
          url: `https://scholar.google.com/scholar?q=${encodeURIComponent(topic)}`,
          type: 'research',
          source: 'Google Scholar',
          isStarred: false,
          relevanceScore: 95
        },
        {
          id: "2",
          title: `Statistical Data and Trends`,
          description: "Latest statistical analysis, surveys, and data visualization related to the debate topic.",
          url: `https://data.gov/search?q=${encodeURIComponent(topic)}`,
          type: 'website',
          source: 'Government Data',
          isStarred: false,
          relevanceScore: 88
        },
        {
          id: "3",
          title: `Expert Opinion Analysis`,
          description: "Collection of expert opinions, interviews, and thought leadership articles from industry professionals.",
          url: `https://www.ted.com/search?q=${encodeURIComponent(topic)}`,
          type: 'video',
          source: 'TED Talks',
          isStarred: false,
          relevanceScore: 82
        },
        {
          id: "4",
          title: `News Coverage and Current Events`,
          description: "Recent news articles, editorials, and media coverage providing contemporary perspectives.",
          url: `https://news.google.com/search?q=${encodeURIComponent(topic)}`,
          type: 'article',
          source: 'Google News',
          isStarred: false,
          relevanceScore: 76
        },
        {
          id: "5",
          title: `Historical Context and Background`,
          description: "Historical timeline, precedents, and foundational information to understand the topic's evolution.",
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/\s+/g, '_'))}`,
          type: 'article',
          source: 'Wikipedia',
          isStarred: false,
          relevanceScore: 71
        },
        {
          id: "6",
          title: `Policy Papers and White Papers`,
          description: "Government and institutional policy documents, proposals, and regulatory frameworks.",
          url: `https://www.congress.gov/search?q=${encodeURIComponent(topic)}`,
          type: 'research',
          source: 'Congressional Records',
          isStarred: false,
          relevanceScore: 84
        }
      ];

      // Add topic-specific resources based on keywords
      if (topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('artificial intelligence')) {
        mockResources.push({
          id: "ai1",
          title: "AI Ethics and Society Research Center",
          description: "Comprehensive research on artificial intelligence impacts, ethics, and societal implications.",
          url: "https://aiethics.princeton.edu/",
          type: 'research',
          source: 'Princeton University',
          isStarred: false,
          relevanceScore: 92
        });
      }

      if (topic.toLowerCase().includes('climate') || topic.toLowerCase().includes('environment')) {
        mockResources.push({
          id: "climate1",
          title: "IPCC Climate Change Reports",
          description: "Authoritative scientific reports on climate change impacts, mitigation, and adaptation strategies.",
          url: "https://www.ipcc.ch/reports/",
          type: 'research',
          source: 'IPCC',
          isStarred: false,
          relevanceScore: 96
        });
      }

      return mockResources;
    };

    setTimeout(() => {
      setResources(generateResources());
      setLoading(false);
      toast.success("Resources loaded successfully!");
    }, 1500);
  }, [topic]);

  const toggleStar = (resourceId: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, isStarred: !resource.isStarred }
        : resource
    ));
    
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      toast.success(`${resource.isStarred ? 'Removed from' : 'Added to'} starred resources`);
    }
  };

  const handleStartSimulation = () => {
    const starredResources = resources.filter(r => r.isStarred);
    
    if (starredResources.length > 0) {
      // Store starred resources in localStorage for the simulation
      localStorage.setItem('starredResources', JSON.stringify(starredResources));
      toast.success(`Starting simulation with ${starredResources.length} starred resources`);
    } else {
      toast.info("Starting simulation without starred resources");
    }
    
    // Navigate to simulation with parameters
    const params = new URLSearchParams({
      topic,
      duration,
      userRole,
      difficulty
    });
    
    navigate(`/simulation?${params}`);
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedResources = filteredResources.sort((a, b) => {
    // Starred items first, then by relevance
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return b.relevanceScore - a.relevanceScore;
  });

  const resourceTypes = [
    { value: 'all', label: 'All Types', icon: Globe },
    { value: 'research', label: 'Research', icon: FileText },
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'website', label: 'Websites', icon: ExternalLink }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return FileText;
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'website': return ExternalLink;
      default: return Globe;
    }
  };

  const starredCount = resources.filter(r => r.isStarred).length;

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
            Back to Setup
          </Button>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Resource Research
            </Badge>
            <h1 className="text-xl font-bold text-foreground max-w-md">
              Research Materials for: {topic}
            </h1>
          </div>

          <Button
            onClick={handleStartSimulation}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-primary"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Start Debate ({starredCount} starred)
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 shadow-card glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Find Resources
              </CardTitle>
              <Badge variant="secondary">
                {filteredResources.length} resources found
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {resourceTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                    className="h-8 px-3 text-xs"
                  >
                    <type.icon className="w-3 h-3 mr-1" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        {loading ? (
          <Card className="shadow-card glass">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading resources for your topic...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedResources.length === 0 ? (
              <Card className="shadow-card glass">
                <CardContent className="py-12 text-center">
                  <Search className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No resources found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              sortedResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                
                return (
                  <Card 
                    key={resource.id} 
                    className={`shadow-card glass transition-all duration-200 hover:shadow-lg ${
                      resource.isStarred ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <TypeIcon className="w-4 h-4 text-primary flex-shrink-0" />
                            <Badge variant="outline" className="text-xs">
                              {resource.source}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {resource.relevanceScore}% relevant
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight mb-1">
                            {resource.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(resource.id)}
                          className={`ml-3 flex-shrink-0 w-8 h-8 p-0 ${
                            resource.isStarred 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-muted-foreground hover:text-yellow-500'
                          }`}
                        >
                          {resource.isStarred ? 
                            <StarIcon className="w-4 h-4 fill-current" /> : 
                            <Star className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed mb-4">
                        {resource.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            resource.type === 'research' ? 'border-blue-500/30 text-blue-600' :
                            resource.type === 'article' ? 'border-green-500/30 text-green-600' :
                            resource.type === 'video' ? 'border-red-500/30 text-red-600' :
                            'border-gray-500/30 text-gray-600'
                          }`}
                        >
                          {resource.type}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resource.url, '_blank')}
                          className="h-7 px-3 text-xs hover:bg-primary hover:text-primary-foreground"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open Resource
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-6 shadow-card glass border-l-4 border-l-accent">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <StarIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">How to use resources:</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click the star icon to bookmark important resources. Starred resources will be available in your notes during the debate simulation for quick reference.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;