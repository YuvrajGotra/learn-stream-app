import React, { useState } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { AttendanceWidget } from './AttendanceWidget';
import { QRAttendance } from './QRAttendance';
import { ScheduleWidget } from './ScheduleWidget';
import { ActivitySuggestions } from './ActivitySuggestions';
import { FaceRecognition } from './FaceRecognition';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  BookOpen, 
  Target, 
  Award,
  BarChart3,
  Clock
} from 'lucide-react';

interface DashboardProps {
  userRole: 'student' | 'teacher';
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [activeView, setActiveView] = useState('dashboard');

  // Mock data - in a real app, this would come from API
  const mockAttendanceData = {
    present: userRole === 'student' ? 18 : 25,
    absent: userRole === 'student' ? 2 : 3,
    late: userRole === 'student' ? 1 : 2,
    total: userRole === 'student' ? 21 : 30,
  };

  const mockSchedule = [
    { id: '1', subject: 'Mathematics', time: '9:00 AM', room: 'Room 101', teacher: 'Dr. Smith', status: 'completed' as const },
    { id: '2', subject: 'Computer Science', time: '10:30 AM', room: 'Lab 201', teacher: 'Prof. Johnson', status: 'current' as const },
    { id: '3', subject: 'Free Period', time: '12:00 PM', room: '', teacher: '', status: 'free' as const },
    { id: '4', subject: 'Physics', time: '1:30 PM', room: 'Room 103', teacher: 'Dr. Wilson', status: 'upcoming' as const },
    { id: '5', subject: 'Literature', time: '3:00 PM', room: 'Room 205', teacher: 'Ms. Davis', status: 'upcoming' as const },
  ];

  const mockStudentInterests = ['programming', 'mathematics', 'digital art'];

  const DashboardContent = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-xl p-8 text-white shadow-academic">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to your Dashboard!
            </h1>
            <p className="text-white/90">
              {userRole === 'student' 
                ? "Let's make today productive with personalized learning activities."
                : "Manage your classroom and track student progress efficiently."
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Classes</p>
              <p className="text-2xl font-bold text-primary">5</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-bold text-success">
                {Math.round((mockAttendanceData.present / mockAttendanceData.total) * 100)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-success/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {userRole === 'student' ? 'Goals Completed' : 'Active Students'}
              </p>
              <p className="text-2xl font-bold text-warning">
                {userRole === 'student' ? '3/5' : '28'}
              </p>
            </div>
            {userRole === 'student' ? (
              <Target className="h-8 w-8 text-warning/50" />
            ) : (
              <User className="h-8 w-8 text-warning/50" />
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {userRole === 'student' ? 'Points Earned' : 'Classes Today'}
              </p>
              <p className="text-2xl font-bold text-secondary-accent">
                {userRole === 'student' ? '285' : '6'}
              </p>
            </div>
            <Award className="h-8 w-8 text-secondary-accent/50" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ScheduleWidget schedule={mockSchedule} userRole={userRole} />
          
          {userRole === 'student' && (
            <ActivitySuggestions 
              studentInterests={mockStudentInterests}
              freePeriodDuration={90}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AttendanceWidget data={mockAttendanceData} userRole={userRole} />
          <QRAttendance userRole={userRole} />
          <FaceRecognition userRole={userRole} />
          
          {userRole === 'teacher' && (
            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="academic" className="w-full" size="sm">
                  Take Class Attendance
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View Student Reports
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Schedule Announcement
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeView={activeView} 
        onViewChange={setActiveView} 
        userRole={userRole}
      />
      
      {activeView === 'dashboard' ? (
        <DashboardContent />
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
            <p className="text-muted-foreground">
              This section is under development. The full {activeView} functionality will be available soon.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};