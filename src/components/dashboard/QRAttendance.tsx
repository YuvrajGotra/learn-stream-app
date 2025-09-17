import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Scan, CheckCircle } from 'lucide-react';

interface QRAttendanceProps {
  userRole: 'student' | 'teacher';
  currentClass?: string;
}

export const QRAttendance: React.FC<QRAttendanceProps> = ({ userRole, currentClass = "Computer Science 101" }) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  
  const handleScan = () => {
    setScanStatus('scanning');
    // Simulate QR code scanning
    setTimeout(() => {
      setScanStatus('success');
      setTimeout(() => setScanStatus('idle'), 3000);
    }, 2000);
  };

  const generateQR = () => {
    // In a real app, this would generate a unique QR code for the class
    console.log('Generating QR code for class:', currentClass);
  };

  if (userRole === 'teacher') {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Generate Attendance QR</h3>
          </div>
          
          <div className="bg-muted p-8 rounded-lg">
            <div className="w-32 h-32 mx-auto bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-primary/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Class</p>
            <p className="font-semibold">{currentClass}</p>
          </div>
          
          <Button variant="academic" onClick={generateQR} className="w-full">
            Generate New QR Code
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Scan className="h-8 w-8 text-primary mr-2" />
          <h3 className="text-lg font-semibold">Scan Attendance</h3>
        </div>
        
        {scanStatus === 'success' ? (
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <div>
              <p className="font-semibold text-success">Attendance Marked!</p>
              <p className="text-sm text-muted-foreground">{currentClass}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted p-8 rounded-lg">
              <div className="w-32 h-32 mx-auto bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                {scanStatus === 'scanning' ? (
                  <div className="animate-pulse">
                    <Scan className="h-16 w-16 text-primary" />
                  </div>
                ) : (
                  <Scan className="h-16 w-16 text-primary/50" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ready to scan for</p>
              <p className="font-semibold">{currentClass}</p>
            </div>
            
            <Button 
              variant="academic" 
              onClick={handleScan} 
              disabled={scanStatus === 'scanning'}
              className="w-full"
            >
              {scanStatus === 'scanning' ? 'Scanning...' : 'Scan QR Code'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};