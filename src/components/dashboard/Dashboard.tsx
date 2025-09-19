import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { AttendanceWidget } from './AttendanceWidget';
import { QRAttendance } from './QRAttendance';
import { ScheduleWidget } from './ScheduleWidget';
import { ActivitiesWidget } from './ActivitiesWidget';
import { FaceRecognition } from './FaceRecognition';
import { supabase } from '@/integrations/supabase/client';
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

  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load attendance data
      if (userRole === 'student') {
        const { data: attendanceRecords } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('student_id', user.id);
        
        const total = attendanceRecords?.length || 0;
        const present = attendanceRecords?.filter(r => r.status === 'present').length || 0;
        const late = attendanceRecords?.filter(r => r.status === 'late').length || 0;
        const absent = total - present - late;
        
        setAttendanceData({ present, absent, late, total });
      } else {
        // For teachers, get overall class attendance
        const { data: attendanceRecords } = await supabase
          .from('attendance_records')
          .select('*');
        
        const total = attendanceRecords?.length || 0;
        const present = attendanceRecords?.filter(r => r.status === 'present').length || 0;
        const late = attendanceRecords?.filter(r => r.status === 'late').length || 0;
        const absent = total - present - late;
        
        setAttendanceData({ present, absent, late, total });
      }

      // Load schedule data
      const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .order('start_time', { ascending: true });
      
      setScheduleData(schedules || []);

      // Load activities data
      if (userRole === 'teacher') {
        const { data: activities } = await supabase
          .from('activities')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });
        
        setActivitiesData(activities || []);
      } else {
        const { data: activities } = await supabase
          .from('activities')
          .select('*')
          .order('due_date', { ascending: true });
        
        setActivitiesData(activities || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-primary">
                {scheduleData.filter(s => {
                  const today = new Date();
                  const scheduleDay = new Date(s.start_time);
                  return scheduleDay.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-primary/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-2xl font-bold text-success">
                {attendanceData && attendanceData.total > 0 
                  ? Math.round((attendanceData.present / attendanceData.total) * 100)
                  : 0
                }%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-success/50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {userRole === 'student' ? 'Active Activities' : 'Total Activities'}
              </p>
              <p className="text-2xl font-bold text-warning">
                {activitiesData.length}
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
                {userRole === 'student' ? 'Pending Submissions' : 'Classes Today'}
              </p>
              <p className="text-2xl font-bold text-secondary-accent">
                {userRole === 'student' 
                  ? activitiesData.filter(a => !a.submitted_at).length 
                  : scheduleData.filter(s => {
                      const today = new Date();
                      const scheduleDay = new Date(s.start_time);
                      return scheduleDay.toDateString() === today.toDateString();
                    }).length
                }
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
          <ScheduleWidget schedule={scheduleData} userRole={userRole} onScheduleUpdate={loadDashboardData} />
          
          {userRole === 'student' ? (
            <ActivitiesWidget activities={activitiesData} userRole={userRole} onActivitiesUpdate={loadDashboardData} />
          ) : (
            <ActivitiesWidget activities={activitiesData} userRole={userRole} onActivitiesUpdate={loadDashboardData} />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AttendanceWidget data={attendanceData} userRole={userRole} />
          <QRAttendance userRole={userRole} onAttendanceUpdate={loadDashboardData} />
          <FaceRecognition userRole={userRole} onAttendanceUpdate={loadDashboardData} />
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