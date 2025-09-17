import React from 'react';
import { Button } from './button';
import { 
  GraduationCap, 
  Calendar, 
  QrCode, 
  User, 
  BarChart3,
  Clock
} from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole: 'student' | 'teacher';
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeView, 
  onViewChange, 
  userRole 
}) => {
  const navItems = userRole === 'student' 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'attendance', label: 'Attendance', icon: QrCode },
        { id: 'activities', label: 'Activities', icon: Clock },
        { id: 'profile', label: 'Profile', icon: User },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'classroom', label: 'Classroom', icon: GraduationCap },
        { id: 'attendance', label: 'Attendance', icon: QrCode },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
      ];

  return (
    <nav className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            EduSmart
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "academic" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};