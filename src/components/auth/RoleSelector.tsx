import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, User, BookOpen } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'teacher', name: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      description: 'Access your personalized schedule, activities, and attendance tracking',
      icon: BookOpen,
      features: ['Smart attendance marking', 'Personalized activities', 'Goal tracking', 'Schedule management'],
      mockName: 'Alex Student'
    },
    {
      id: 'teacher' as const,
      title: 'Teacher',
      description: 'Manage classroom attendance, generate QR codes, and track student progress',
      icon: GraduationCap,
      features: ['Class management', 'Attendance tracking', 'Student reports', 'QR code generation'],
      mockName: 'Dr. Sarah Johnson'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">EduSmart</h1>
          </div>
          <p className="text-xl text-white/90">
            Smart Curriculum Activity & Attendance Management
          </p>
          <p className="text-white/80 mt-2">
            Choose your role to get started with the demo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            
            return (
              <Card key={role.id} className="p-8 bg-card/95 backdrop-blur-sm shadow-academic hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center mb-6">
                  <div className="bg-gradient-primary rounded-full p-4 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {role.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {role.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="academic" 
                  className="w-full"
                  onClick={() => onRoleSelect(role.id, role.mockName)}
                >
                  Continue as {role.title}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-white/70 text-sm">
            This is a demonstration of the Smart Education platform. 
            In production, this would integrate with your institution's authentication system.
          </p>
        </div>
      </div>
    </div>
  );
};