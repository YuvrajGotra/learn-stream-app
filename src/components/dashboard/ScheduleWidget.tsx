import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin } from 'lucide-react';

interface ClassSchedule {
  id: string;
  subject: string;
  time: string;
  room: string;
  teacher: string;
  status: 'upcoming' | 'current' | 'completed' | 'free';
}

interface ScheduleWidgetProps {
  schedule: ClassSchedule[];
  userRole: 'student' | 'teacher';
}

export const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ schedule, userRole }) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-primary bg-primary/10';
      case 'upcoming': return 'text-warning bg-warning/10';
      case 'completed': return 'text-muted-foreground bg-muted';
      case 'free': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      
      <div className="space-y-3">
        {schedule.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background border border-border">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status).split(' ')[1]}`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground truncate">
                  {item.status === 'free' ? 'Free Period' : item.subject}
                </p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              
              {item.status !== 'free' && (
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.room}
                  </div>
                  {userRole === 'student' && (
                    <span>{item.teacher}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" size="sm" className="w-full mt-4">
        View Full Schedule
      </Button>
    </Card>
  );
};