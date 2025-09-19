import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceData {
  present: number;
  absent: number;
  late: number;
  total: number;
}

interface AttendanceWidgetProps {
  data: AttendanceData | null;
  userRole: 'student' | 'teacher';
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({ data, userRole }) => {
  // Provide default values if data is null or undefined
  const attendanceData = data || { present: 0, absent: 0, late: 0, total: 0 };
  const attendanceRate = attendanceData.total > 0 ? Math.round((attendanceData.present / attendanceData.total) * 100) : 0;
  
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {userRole === 'student' ? 'My Attendance' : 'Class Attendance'}
        </h3>
        <Users className="h-5 w-5 text-primary" />
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {attendanceRate}%
          </div>
          <p className="text-sm text-muted-foreground">Attendance Rate</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-success">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="font-semibold">{attendanceData.present}</span>
            </div>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-warning">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-semibold">{attendanceData.late}</span>
            </div>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center text-destructive">
              <XCircle className="h-4 w-4 mr-1" />
              <span className="font-semibold">{attendanceData.absent}</span>
            </div>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>
        
        {userRole === 'teacher' && (
          <Button variant="academic" className="w-full" size="sm">
            View Detailed Report
          </Button>
        )}
      </div>
    </Card>
  );
};