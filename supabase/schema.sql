-- ========================================================================
-- CAMPUSONE SUPABASE POSTGRESQL SCHEMA
-- Production database architecture with Row Level Security (RLS) & Indexes
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Students, Admins, Security, Faculty)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id VARCHAR(50) UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'security', 'faculty')),
  department VARCHAR(100),
  year VARCHAR(20),
  phone VARCHAR(30),
  avatar_url TEXT,
  preferred_bus_stop TEXT DEFAULT 'Main Gate',
  attendance_percentage NUMERIC(5,2) DEFAULT 82.00,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSES
CREATE TABLE IF NOT EXISTS public.buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_number VARCHAR(20) NOT NULL UNIQUE,
  route_name TEXT NOT NULL,
  route_direction TEXT NOT NULL, -- e.g. 'Town → Campus'
  driver_name TEXT,
  driver_phone TEXT,
  status VARCHAR(30) DEFAULT 'On route' CHECK (status IN ('On route', 'Near campus', 'Arrived', 'Delayed', 'Offline')),
  capacity INTEGER DEFAULT 50,
  current_occupancy INTEGER DEFAULT 32,
  current_lat DOUBLE PRECISION NOT NULL,
  current_lng DOUBLE PRECISION NOT NULL,
  speed_kmh NUMERIC(5,2) DEFAULT 38.5,
  eta_minutes INTEGER DEFAULT 4,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUS STOPS
CREATE TABLE IF NOT EXISTS public.bus_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE,
  stop_name TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  scheduled_time TIME,
  is_campus_stop BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUS LOCATIONS (Audit and history tracking for live route analysis)
CREATE TABLE IF NOT EXISTS public.bus_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  speed_kmh NUMERIC(5,2),
  heading NUMERIC(5,2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department VARCHAR(100) NOT NULL,
  credits INTEGER DEFAULT 3,
  instructor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TIMETABLE
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  total_classes INTEGER NOT NULL DEFAULT 40,
  attended_classes INTEGER NOT NULL DEFAULT 33,
  percentage NUMERIC(5,2) GENERATED ALWAYS AS (ROUND((attended_classes::numeric / NULLIF(total_classes,0)) * 100, 2)) STORED,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_code VARCHAR(20) NOT NULL,
  subject_name TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In progress', 'Completed', 'Overdue')),
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('Academic', 'Transport', 'Emergency', 'Event', 'Placement', 'General')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT NOT NULL DEFAULT 'Campus Administration',
  is_pinned BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EMERGENCY ALERTS (SOS events)
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id VARCHAR(30) NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_phone TEXT,
  alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('Medical', 'Security', 'Fire', 'Transport', 'Other')),
  status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'dispatched', 'resolved', 'cancelled')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  location_name TEXT,
  notes TEXT,
  responder_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 11. LOST & FOUND
CREATE TABLE IF NOT EXISTS public.lost_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
  item_name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_occurred DATE NOT NULL,
  photo_url TEXT,
  contact_info TEXT NOT NULL,
  reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'matched', 'resolved')),
  matched_item_id UUID REFERENCES public.lost_found(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CAMPUS EVENTS
CREATE TABLE IF NOT EXISTS public.campus_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('Technical', 'Symposium', 'Hackathon', 'Workshop', 'Sports', 'Cultural', 'Placement')),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 150,
  registered_count INTEGER NOT NULL DEFAULT 0,
  organizer TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.campus_events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, student_id)
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(30) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. STUDENT BUS PREFERENCES
CREATE TABLE IF NOT EXISTS public.student_bus_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
  preferred_stop_name TEXT NOT NULL DEFAULT 'Main Gate',
  proximity_radius_meters INTEGER NOT NULL DEFAULT 500,
  proximity_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_buses_status ON public.buses(status);
CREATE INDEX IF NOT EXISTS idx_bus_stops_bus_id ON public.bus_stops(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON public.bus_locations(bus_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON public.timetable(day_of_week);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON public.assignments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_notices_created ON public.notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON public.emergency_alerts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON public.lost_found(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.campus_events(event_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_bus_preferences ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'security')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: user can read all public profiles, can update only their own, admins can update any
CREATE POLICY "Profiles readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- Buses & Stops: anyone can view buses and stops; only admin can insert/update/delete
CREATE POLICY "Public buses are viewable by all"
  ON public.buses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage buses"
  ON public.buses FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Public bus stops viewable by all"
  ON public.bus_stops FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage bus stops"
  ON public.bus_stops FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Timetable & Subjects: readable by all authenticated, manageable by admin
CREATE POLICY "Timetable viewable by all"
  ON public.timetable FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Subjects viewable by all"
  ON public.subjects FOR SELECT
  TO authenticated
  USING (true);

-- Attendance: Student can read ONLY their own attendance; Admin can view/edit all
CREATE POLICY "Students view own attendance, admin views all"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Only admin can modify attendance"
  ON public.attendance FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Assignments: Student can view & edit their own assignments
CREATE POLICY "Students manage own assignments"
  ON public.assignments FOR ALL
  TO authenticated
  USING (auth.uid() = student_id OR public.is_admin());

-- Notices: Viewable by all; only admin can publish
CREATE POLICY "Notices viewable by all"
  ON public.notices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage notices"
  ON public.notices FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Emergency Alerts: Student sees own alert; Admin sees all
CREATE POLICY "Students create and see own emergency alerts, admin sees all"
  ON public.emergency_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can insert emergency alerts"
  ON public.emergency_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can update emergency alerts"
  ON public.emergency_alerts FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Lost & Found: All can view; creator can update; admin can manage
CREATE POLICY "Lost and found viewable by all"
  ON public.lost_found FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create lost/found reports"
  ON public.lost_found FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update own lost/found reports"
  ON public.lost_found FOR UPDATE
  TO authenticated
  USING (auth.uid() = reported_by OR public.is_admin());

-- Events: viewable by all; manageable by admin
CREATE POLICY "Events viewable by all"
  ON public.campus_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage events"
  ON public.campus_events FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Event Registrations: student can register themselves and view own
CREATE POLICY "Users view own registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can cancel own registration"
  ON public.event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Notifications: user can view and update (mark read) only their own
CREATE POLICY "Users manage own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Student Bus Preferences: user can manage their own
CREATE POLICY "Users manage own bus preferences"
  ON public.student_bus_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = student_id);
