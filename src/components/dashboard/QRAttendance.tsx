import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import QRCode from 'react-qr-code';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, Scan, CheckCircle, Timer, Camera, StopCircle, ClockAlert } from 'lucide-react';

interface QRAttendanceProps {
  userRole: 'student' | 'teacher';
  currentClass?: string;
}

// Simple unique id generator (no external dep)
const generateSessionId = () => {
  const buf = new Uint8Array(8);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
};

interface AttendancePayload {
  type: 'attendance';
  class: string;
  sessionId: string;
  issuedAt: string; // ISO
  expiresAt: string; // ISO
}

export const QRAttendance: React.FC<QRAttendanceProps> = ({ userRole, currentClass = 'Computer Science 101' }) => {
  // Common
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  // Teacher state
  const [expiryMinutes, setExpiryMinutes] = useState<number>(5);
  const [payload, setPayload] = useState<AttendancePayload | null>(null);
  const [remaining, setRemaining] = useState<number>(0);

  // Student state
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Countdown timer for teacher view
  useEffect(() => {
    if (!payload) return;
    const tick = () => {
      const now = Date.now();
      const r = Math.max(0, Math.floor((new Date(payload.expiresAt).getTime() - now) / 1000));
      setRemaining(r);
      if (r <= 0) {
        setPayload(null);
        toast({ title: 'QR expired', description: 'Please generate a new QR code.' });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [payload]);

  const qrValue = useMemo(() => (payload ? JSON.stringify(payload) : ''), [payload]);

  const generateQR = () => {
    if (!currentClass) return;
    const now = new Date();
    const session: AttendancePayload = {
      type: 'attendance',
      class: currentClass,
      sessionId: generateSessionId(),
      issuedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + expiryMinutes * 60 * 1000).toISOString(),
    };
    setPayload(session);
    toast({ title: 'QR generated', description: `Valid for ${expiryMinutes} minute(s).` });
  };

  const handleDecode = (text: string) => {
    try {
      const data: AttendancePayload = JSON.parse(text);
      if (data.type !== 'attendance') throw new Error('Invalid QR type');
      if (data.class !== currentClass) throw new Error('QR does not match this class');
      const now = Date.now();
      const exp = new Date(data.expiresAt).getTime();
      if (isNaN(exp) || now > exp) throw new Error('This QR has expired');

      setScanStatus('success');
      setErrorMsg('');
      setCameraOpen(false);
      toast({ title: 'Attendance marked', description: `${currentClass}` });
      // NOTE: Persisting attendance requires Supabase/backend integration.
    } catch (err: any) {
      setScanStatus('error');
      const message = err?.message || 'Failed to read QR';
      setErrorMsg(message);
      toast({ title: 'Scan failed', description: message });
    }
  };

  if (userRole === 'teacher') {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <QrCode className="h-8 w-8 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Generate Attendance QR</h3>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <label htmlFor="expiry" className="text-sm text-muted-foreground flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Expiry (minutes)
              </label>
              <Input
                id="expiry"
                type="number"
                min={1}
                max={60}
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
                className="w-24"
              />
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <div className="w-40 h-40 mx-auto bg-primary/5 border-2 border-dashed border-primary rounded-lg flex items-center justify-center overflow-hidden">
                {payload ? (
                  <QRCode value={qrValue} size={144} />
                ) : (
                  <QrCode className="h-16 w-16 text-primary/50" />
                )}
              </div>
              <div className="mt-3 text-center space-y-1">
                <p className="text-sm text-muted-foreground">Current Class</p>
                <p className="font-semibold">{currentClass}</p>
                {payload ? (
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <ClockAlert className="h-4 w-4 text-warning" />
                    Expires in {Math.floor(remaining / 60)}m {remaining % 60}s
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Generate a QR to start attendance</p>
                )}
              </div>
            </div>

            <Button variant="academic" onClick={generateQR} className="w-full">
              {payload ? 'Regenerate QR' : 'Generate New QR Code'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Student view
  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-2">
          <Scan className="h-8 w-8 text-primary mr-2" />
          <h3 className="text-lg font-semibold">Scan Attendance</h3>
        </div>

        {scanStatus === 'success' ? (
          <div className="space-y-4 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <div>
              <p className="font-semibold text-success">Attendance Marked!</p>
              <p className="text-sm text-muted-foreground">{currentClass}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted p-4 rounded-lg">
              <div className="relative rounded-md overflow-hidden">
                {cameraOpen ? (
                  <div className="rounded-lg overflow-hidden">
                    <Scanner
                      onScan={(result) => {
                        const text = Array.isArray(result) ? result[0]?.rawValue ?? '' : (result as any)?.rawValue ?? (result as any)?.[0]?.rawValue ?? '';
                        if (text) handleDecode(text);
                      }}
                      components={{
                        audio: false,
                        torch: true,
                        finder: true,
                      }}
                      constraints={{ facingMode: 'environment' }}
                      styles={{ container: { width: '100%' } }}
                      onError={(err) => {
                        console.error(err);
                        setErrorMsg('Camera error. Please allow camera permissions.');
                        setScanStatus('error');
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                    <Scan className="h-16 w-16 text-primary/60" />
                  </div>
                )}
              </div>
            </div>

            {scanStatus === 'error' && (
              <p className="text-xs text-destructive text-center">{errorMsg}</p>
            )}

            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">Ready to scan for</p>
              <p className="font-semibold">{currentClass}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="academic"
                onClick={() => {
                  setCameraOpen((v) => !v);
                  setScanStatus('idle');
                  setErrorMsg('');
                }}
                className="w-full"
              >
                {cameraOpen ? (
                  <span className="inline-flex items-center gap-2"><StopCircle className="h-4 w-4" /> Stop Camera</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4" /> Open Camera Scanner</span>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};