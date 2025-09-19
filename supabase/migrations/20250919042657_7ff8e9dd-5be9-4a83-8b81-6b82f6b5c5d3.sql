-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL,
  class_id UUID,
  due_date TIMESTAMP WITH TIME ZONE,
  max_marks INTEGER DEFAULT 100,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity submissions table
CREATE TABLE public.activity_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL,
  student_id UUID NOT NULL,
  submission_text TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  marks_awarded INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(activity_id, student_id)
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL,
  subject TEXT NOT NULL,
  teacher_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  room TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activities
CREATE POLICY "Teachers can manage their activities" 
ON public.activities 
FOR ALL 
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view activities for their classes" 
ON public.activities 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = activities.class_id
  )
);

-- RLS Policies for activity submissions
CREATE POLICY "Students can manage their own submissions" 
ON public.activity_submissions 
FOR ALL 
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their activities" 
ON public.activity_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.id = activity_submissions.activity_id 
    AND activities.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can update grades for their activities" 
ON public.activity_submissions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.id = activity_submissions.activity_id 
    AND activities.teacher_id = auth.uid()
  )
);

-- RLS Policies for schedules
CREATE POLICY "Teachers can manage their schedules" 
ON public.schedules 
FOR ALL 
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view all schedules" 
ON public.schedules 
FOR SELECT 
USING (true);

-- Create storage bucket for activity attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('activity-attachments', 'activity-attachments', false);

-- Storage policies for activity attachments
CREATE POLICY "Users can upload their own activity attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'activity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view activity attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'activity-attachments');

-- Add triggers for updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_submissions_updated_at
BEFORE UPDATE ON public.activity_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();