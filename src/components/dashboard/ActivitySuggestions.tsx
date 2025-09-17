import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen, Code, Palette, Calculator } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ActivitySuggestionsProps {
  studentInterests: string[];
  freePeriodDuration: number; // in minutes
}

export const ActivitySuggestions: React.FC<ActivitySuggestionsProps> = ({ 
  studentInterests, 
  freePeriodDuration 
}) => {
  const getIcon = (iconName: string) => {
    const icons = {
      'code': Code,
      'book': BookOpen,
      'art': Palette,
      'math': Calculator,
      'lightbulb': Lightbulb,
    };
    return icons[iconName as keyof typeof icons] || Lightbulb;
  };

  // Mock personalized activities based on interests and available time
  const suggestedActivities: Activity[] = [
    {
      id: '1',
      title: 'Python Programming Challenge',
      description: 'Complete a coding challenge to improve your algorithm skills',
      duration: '30 min',
      category: 'Programming',
      icon: 'code',
      difficulty: 'intermediate' as const
    },
    {
      id: '2',
      title: 'Career Planning Worksheet',
      description: 'Explore different career paths in your field of interest',
      duration: '20 min',
      category: 'Career Development',
      icon: 'lightbulb',
      difficulty: 'beginner' as const
    },
    {
      id: '3',
      title: 'Digital Art Tutorial',
      description: 'Learn new digital design techniques and tools',
      duration: '40 min',
      category: 'Creative Arts',
      icon: 'art',
      difficulty: 'beginner' as const
    }
  ].filter(activity => {
    const activityDuration = parseInt(activity.duration);
    return activityDuration <= freePeriodDuration;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success';
      case 'intermediate': return 'bg-warning/10 text-warning';
      case 'advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Suggested Activities</h3>
        <Lightbulb className="h-5 w-5 text-primary" />
      </div>
      
      <div className="space-y-3">
        {suggestedActivities.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              You have {freePeriodDuration} minutes of free time. Here are some personalized activities:
            </p>
            
            {suggestedActivities.map((activity) => {
              const IconComponent = getIcon(activity.icon);
              
              return (
                <div key={activity.id} className="p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">{activity.duration}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {activity.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                        </div>
                        
                        <Button variant="academic" size="sm">
                          Start Activity
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No suggested activities for this time period.</p>
          </div>
        )}
      </div>
    </Card>
  );
};