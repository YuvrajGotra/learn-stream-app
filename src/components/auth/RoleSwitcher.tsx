import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen } from 'lucide-react';

interface RoleSwitcherProps {
  userRole: 'student' | 'teacher';
  onRoleChange: (role: 'student' | 'teacher') => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ userRole, onRoleChange }) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Demo Mode</h3>
          <p className="text-sm text-muted-foreground">Switch between roles to explore features</p>
        </div>

        <div className="space-y-3">
          <Button 
            variant={userRole === 'student' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => onRoleChange('student')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Student View
          </Button>
          
          <Button 
            variant={userRole === 'teacher' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => onRoleChange('teacher')}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Teacher View
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          {userRole === 'student' 
            ? 'Experience personalized learning activities and attendance tracking'
            : 'Manage classroom attendance with QR codes and face recognition'
          }
        </div>
      </div>
    </Card>
  );
};