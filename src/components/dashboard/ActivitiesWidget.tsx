import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Clock,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
  attachments: any[];
  created_at: string;
}

interface ActivitiesWidgetProps {
  activities: Activity[];
  userRole: 'student' | 'teacher';
  onActivitiesUpdate: () => void;
}

export const ActivitiesWidget: React.FC<ActivitiesWidgetProps> = ({ 
  activities, 
  userRole, 
  onActivitiesUpdate 
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    due_date: '',
    max_marks: 100
  });

  const handleCreateActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('activities')
        .insert({
          title: newActivity.title,
          description: newActivity.description,
          due_date: newActivity.due_date ? new Date(newActivity.due_date).toISOString() : null,
          max_marks: newActivity.max_marks,
          teacher_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Activity Created",
        description: "Activity has been created successfully.",
      });

      setShowCreateDialog(false);
      setNewActivity({ title: '', description: '', due_date: '', max_marks: 100 });
      onActivitiesUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create activity.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {userRole === 'teacher' ? 'My Activities' : 'Activities & Assignments'}
        </h3>
        {userRole === 'teacher' && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="academic">
                <Plus className="h-4 w-4 mr-2" />
                Create Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Activity title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Activity description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={newActivity.due_date}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="max_marks">Max Marks</Label>
                  <Input
                    id="max_marks"
                    type="number"
                    value={newActivity.max_marks}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, max_marks: parseInt(e.target.value) || 100 }))}
                    min="1"
                    max="1000"
                  />
                </div>
                <Button 
                  onClick={handleCreateActivity} 
                  className="w-full"
                  disabled={!newActivity.title.trim()}
                >
                  Create Activity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {userRole === 'teacher' ? 'No activities created yet' : 'No activities assigned yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  {activity.due_date && (
                    <Badge variant={isOverdue(activity.due_date) ? "destructive" : "secondary"} className="text-xs">
                      {isOverdue(activity.due_date) ? (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {isOverdue(activity.due_date) ? 'Overdue' : 'Due'}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {activity.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(activity.due_date)}
                    </span>
                  )}
                  <span>Max: {activity.max_marks} marks</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {userRole === 'student' ? (
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View
                  </Button>
                ) : (
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {activities.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View All Activities ({activities.length})
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};