import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  BusItem,
  BusStop,
  CampusAlert,
  TimetableClass,
  SubjectAttendance,
  AssignmentItem,
  EmergencyRecord,
  EmergencyContact,
  LostFoundItem,
  CampusEvent,
  InAppNotification,
  BusStatus,
  SmsDeliveryRecord,
  StudentRecord,
} from '../types';
import { calculateHaversineDistance, calculateSimilarity } from '../utils/haversine';
import { sendEmergencySOS, testSmsDispatch } from '../services/api';

// Initial Mock Bus Stops & Locations (Campus coordinates centered near realistic university layout)
// Campus Center: 12.9716° N, 77.5946° E (or realistic college coords)
const CAMPUS_COORDS = { lat: 12.9725, lng: 77.5950, name: 'Campus Central Complex' };

const INITIAL_STOPS_BUS_03: BusStop[] = [
  { id: 'stop-1', name: 'Downtown Central', lat: 12.9450, lng: 77.5750, order: 1, scheduledTime: '08:00 AM' },
  { id: 'stop-2', name: 'North Crossing', lat: 12.9550, lng: 77.5830, order: 2, scheduledTime: '08:15 AM' },
  { id: 'stop-3', name: 'Metro Interchange', lat: 12.9650, lng: 77.5890, order: 3, scheduledTime: '08:30 AM' },
  { id: 'stop-4', name: 'Main Gate', lat: 12.9705, lng: 77.5925, order: 4, scheduledTime: '08:42 AM', isCampusStop: true },
  { id: 'stop-5', name: 'Science Complex', lat: 12.9720, lng: 77.5945, order: 5, scheduledTime: '08:48 AM', isCampusStop: true },
  { id: 'stop-6', name: 'Central Library', lat: 12.9740, lng: 77.5960, order: 6, scheduledTime: '08:52 AM', isCampusStop: true }
];

const INITIAL_STOPS_BUS_07: BusStop[] = [
  { id: 'stop-21', name: 'Tech Park Metro', lat: 12.9300, lng: 77.5600, order: 1, scheduledTime: '08:10 AM' },
  { id: 'stop-22', name: 'Innovation Hub', lat: 12.9480, lng: 77.5720, order: 2, scheduledTime: '08:25 AM' },
  { id: 'stop-23', name: 'South Gate Terminal', lat: 12.9690, lng: 77.5910, order: 3, scheduledTime: '08:45 AM', isCampusStop: true },
  { id: 'stop-24', name: 'Engineering Quad', lat: 12.9735, lng: 77.5935, order: 4, scheduledTime: '08:55 AM', isCampusStop: true }
];

const INITIAL_BUSES: BusItem[] = [
  {
    id: 'bus-03',
    number: 'Bus 03',
    routeName: 'Downtown Central ➔ Campus Hub',
    direction: 'Town → Campus',
    driverName: 'Ramesh Gowda',
    driverPhone: '+1 (555) 839-2041',
    status: 'Near campus',
    capacity: 50,
    occupancy: 34,
    currentLat: 12.9680,
    currentLng: 77.5908,
    speedKmh: 38.5,
    etaMinutes: 4,
    lastUpdated: 'Just now',
    stops: INITIAL_STOPS_BUS_03
  },
  {
    id: 'bus-07',
    number: 'Bus 07',
    routeName: 'Metro Terminal ➔ Engineering Quad',
    direction: 'Metro → Campus',
    driverName: 'Michael Chen',
    driverPhone: '+1 (555) 728-1192',
    status: 'On route',
    capacity: 55,
    occupancy: 42,
    currentLat: 12.9490,
    currentLng: 77.5730,
    speedKmh: 45.0,
    etaMinutes: 14,
    lastUpdated: '2 mins ago',
    stops: INITIAL_STOPS_BUS_07
  },
  {
    id: 'bus-12',
    number: 'Bus 12',
    routeName: 'East Suburb Ring ➔ Hostels',
    direction: 'Suburbs → Campus',
    driverName: 'Kavita Nair',
    driverPhone: '+1 (555) 482-9904',
    status: 'On route',
    capacity: 45,
    occupancy: 28,
    currentLat: 12.9380,
    currentLng: 77.6150,
    speedKmh: 32.0,
    etaMinutes: 24,
    lastUpdated: '3 mins ago',
    stops: [
      { id: 'stop-31', name: 'East Ring Road', lat: 12.9350, lng: 77.6100, order: 1, scheduledTime: '08:15 AM' },
      { id: 'stop-32', name: 'Lake Junction', lat: 12.9520, lng: 77.6040, order: 2, scheduledTime: '08:35 AM' },
      { id: 'stop-33', name: 'North Hostel Circle', lat: 12.9750, lng: 77.5980, order: 3, scheduledTime: '08:58 AM', isCampusStop: true }
    ]
  }
];

const INITIAL_TIMETABLE: TimetableClass[] = [
  {
    id: 'cls-1',
    subjectCode: 'CS-601',
    subjectName: 'Machine Learning',
    instructor: 'Prof. Anita Roy',
    room: 'CSE-204',
    dayOfWeek: 'Thursday',
    startTime: '10:30',
    endTime: '11:30',
    building: 'Science & Computing Complex'
  },
  {
    id: 'cls-2',
    subjectCode: 'CS-602',
    subjectName: 'Computer Networks',
    instructor: 'Dr. Vikram Seth',
    room: 'NW-102',
    dayOfWeek: 'Thursday',
    startTime: '11:45',
    endTime: '12:45',
    building: 'Telecom Block'
  },
  {
    id: 'cls-3',
    subjectCode: 'CS-603',
    subjectName: 'Operating Systems Lab',
    instructor: 'Prof. Deepak Sen',
    room: 'LAB-3',
    dayOfWeek: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    building: 'Computing Annex'
  },
  {
    id: 'cls-4',
    subjectCode: 'CS-604',
    subjectName: 'Software Engineering & Agile',
    instructor: 'Dr. Sarah Jenkins',
    room: 'CSE-101',
    dayOfWeek: 'Friday',
    startTime: '09:30',
    endTime: '10:30',
    building: 'Main Academic Hall'
  },
  {
    id: 'cls-5',
    subjectCode: 'CS-605',
    subjectName: 'Cybersecurity Fundamentals',
    instructor: 'Prof. Amit Mehra',
    room: 'SEC-305',
    dayOfWeek: 'Friday',
    startTime: '11:00',
    endTime: '12:00',
    building: 'Information Security Center'
  }
];

const INITIAL_ATTENDANCE: SubjectAttendance[] = [
  { id: 'att-1', subjectCode: 'CS-601', subjectName: 'Machine Learning', attended: 35, total: 40, percentage: 87.5, instructor: 'Prof. Anita Roy' },
  { id: 'att-2', subjectCode: 'CS-602', subjectName: 'Computer Networks', attended: 29, total: 38, percentage: 76.3, instructor: 'Dr. Vikram Seth' },
  { id: 'att-3', subjectCode: 'CS-603', subjectName: 'Operating Systems Lab', attended: 18, total: 20, percentage: 90.0, instructor: 'Prof. Deepak Sen' },
  { id: 'att-4', subjectCode: 'CS-604', subjectName: 'Software Engineering', attended: 31, total: 39, percentage: 79.5, instructor: 'Dr. Sarah Jenkins' },
  { id: 'att-5', subjectCode: 'CS-605', subjectName: 'Cybersecurity Fundamentals', attended: 26, total: 34, percentage: 76.5, instructor: 'Prof. Amit Mehra' },
];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    title: 'Convolutional Neural Networks Implementation',
    subjectCode: 'CS-601',
    subjectName: 'Machine Learning',
    dueDate: '2026-09-26T23:59:00',
    priority: 'high',
    status: 'In progress',
    instructions: 'Implement PyTorch model for CIFAR-10 classification with >85% validation accuracy.'
  },
  {
    id: 'asg-2',
    title: 'Wireshark Packet Analysis & Subnetting',
    subjectCode: 'CS-602',
    subjectName: 'Computer Networks',
    dueDate: '2026-09-28T17:00:00',
    priority: 'urgent',
    status: 'Pending',
    instructions: 'Capture 3-way TCP handshake and answer questionnaire in PDF format.'
  },
  {
    id: 'asg-3',
    title: 'Deadlock Detection Algorithm in C++',
    subjectCode: 'CS-603',
    subjectName: 'Operating Systems',
    dueDate: '2026-10-02T23:59:00',
    priority: 'medium',
    status: 'Pending',
    instructions: 'Simulate Bankers algorithm with dynamic resource allocation.'
  },
  {
    id: 'asg-4',
    title: 'SRS Document for Smart Parking System',
    subjectCode: 'CS-604',
    subjectName: 'Software Engineering',
    dueDate: '2026-09-20T23:59:00',
    priority: 'low',
    status: 'Completed',
    instructions: 'IEEE format SRS document submission.'
  }
];

const INITIAL_NOTICES: CampusAlert[] = [
  {
    id: 'not-1',
    title: 'Mid-Semester Examinations Schedule Released',
    message: 'The official schedule for Odd Semester Mid-term Examinations 2026 has been uploaded to the portal. Exams commence from October 12.',
    category: 'Academic',
    priority: 'high',
    author: 'Controller of Examinations',
    timestamp: '2 hours ago',
    isPinned: true
  },
  {
    id: 'not-2',
    title: 'Bus 03 Route Diversion due to North Flyover Repair',
    message: 'Bus 03 will temporarily bypass Commercial St and reroute via Ring Road. Expect +5 mins transit time until Friday.',
    category: 'Transport',
    priority: 'normal',
    author: 'Campus Transit Authority',
    timestamp: 'Today, 08:15 AM'
  },
  {
    id: 'not-3',
    title: 'Campus-wide Safety & Fire Drill Scheduled',
    message: 'Mandatory evacuation and fire safety drill will occur tomorrow at 11:30 AM across all academic buildings.',
    category: 'Emergency',
    priority: 'urgent',
    author: 'Campus Security & Health Dept',
    timestamp: 'Yesterday'
  },
  {
    id: 'not-4',
    title: 'Google & Microsoft Campus Recruitment Drive',
    message: 'Pre-placement talks for final and pre-final year students scheduled for Saturday 10:00 AM in Main Auditorium.',
    category: 'Placement',
    priority: 'high',
    author: 'Placement & Career Development Cell',
    timestamp: '2 days ago'
  }
];

const INITIAL_CONTACTS: EmergencyContact[] = [
  { name: 'Campus Quick Response Unit', department: 'Emergency Security', phone: '+1 (555) 019-2001', description: '24/7 Rapid on-campus dispatch & patrol', iconName: 'ShieldAlert' },
  { name: 'Medical Health Center', department: 'Health Services', phone: '+1 (555) 019-2002', description: 'Doctors, paramedics, and triage ward', iconName: 'HeartPulse' },
  { name: 'Transport Dispatch Control', department: 'Transit Authority', phone: '+1 (555) 019-2003', description: 'Bus breakdowns, route queries & delays', iconName: 'Bus' },
  { name: 'Women Safety / Student Support', department: 'Student Welfare', phone: '+1 (555) 019-2004', description: 'Confidential counseling & safe escort', iconName: 'Users' },
  { name: 'Central Administration Desk', department: 'Dean of Student Affairs', phone: '+1 (555) 019-2005', description: 'Campus office and lost credentials support', iconName: 'Building' }
];

const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'lost',
    itemName: 'Black Casio Scientific Calculator (fx-991EX)',
    category: 'Electronics',
    description: 'Black Casio ClassWiz calculator with my name sticker on back. Left on desk during CS-601 lecture.',
    location: 'CSE-204 Lecture Hall',
    date: '2026-09-23',
    photoUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80',
    contactInfo: 'student@campusone.demo (Sameerur)',
    reportedBy: 'usr-student-01',
    status: 'matched'
  },
  {
    id: 'lf-2',
    type: 'found',
    itemName: 'Casio Scientific Calculator with protective cover',
    category: 'Electronics',
    description: 'Found black solar scientific calculator on desk in CSE block 2nd floor.',
    location: 'Science Complex Corridor 2nd Floor',
    date: '2026-09-23',
    photoUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80',
    contactInfo: 'Staff Desk - CSE Dept',
    reportedBy: 'usr-staff-09',
    status: 'matched'
  },
  {
    id: 'lf-3',
    type: 'lost',
    itemName: 'Sony WH-1000XM5 Navy Headphones',
    category: 'Electronics',
    description: 'Dark blue wireless headphones in gray zipper case. Left near library cubicles.',
    location: 'Central Library 3rd Floor',
    date: '2026-09-22',
    photoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    contactInfo: 'arun.k@campusone.demo',
    reportedBy: 'usr-student-02',
    status: 'open'
  },
  {
    id: 'lf-4',
    type: 'found',
    itemName: 'Silver Hydro Flask Water Bottle',
    category: 'Personal Belongings',
    description: '32oz insulated water bottle with university stickers.',
    location: 'Cafeteria Seating Area',
    date: '2026-09-24',
    photoUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
    contactInfo: 'Cafeteria Manager Desk',
    reportedBy: 'usr-staff-12',
    status: 'open'
  }
];

const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'HackCampus 2026: 48-Hour AI Superhackathon',
    description: 'Build cutting-edge full-stack and generative AI solutions with $15,000 in prizes, mentorship from leading tech giants, and round-the-clock catering.',
    category: 'Hackathon',
    date: '2026-09-27',
    startTime: '09:00',
    endTime: '21:00',
    location: 'Innovation Center & Main Auditorium',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    totalSeats: 250,
    registeredCount: 218,
    organizer: 'Computer Science Society',
    isRegistered: true
  },
  {
    id: 'ev-2',
    title: 'National Robotics & Autonomous Systems Symposium',
    description: 'Keynotes from top aerospace and drone robotics engineers, followed by live autonomous drone demonstrations on Central Ground.',
    category: 'Symposium',
    date: '2026-10-04',
    startTime: '10:00',
    endTime: '16:30',
    location: 'Convention Hall A',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    totalSeats: 180,
    registeredCount: 142,
    organizer: 'Dept. of Mechatronics & IEEE',
    isRegistered: false
  },
  {
    id: 'ev-3',
    title: 'Cyber Defense & Ethical Hacking Hands-on Workshop',
    description: 'Learn live penetration testing, capture-the-flag methodologies, and zero-day defense strategies directly from certified security researchers.',
    category: 'Workshop',
    date: '2026-10-08',
    startTime: '14:00',
    endTime: '18:00',
    location: 'Cyber Lab 4, Tech Building',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    totalSeats: 60,
    registeredCount: 54,
    organizer: 'Cyber Security Club',
    isRegistered: false
  },
  {
    id: 'ev-4',
    title: 'Annual Inter-Collegiate Cultural Festival: TARANG 26',
    description: 'Three days of music, dance, theater, art exhibitions, and celebrity artist performances on the grand campus amphitheater.',
    category: 'Cultural',
    date: '2026-10-18',
    startTime: '16:00',
    endTime: '22:30',
    location: 'Open Air Amphitheater',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    totalSeats: 1200,
    registeredCount: 890,
    organizer: 'Student Cultural Council',
    isRegistered: false
  }
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: '🚌 Bus 03 Approaching',
    message: 'Bus 03 is approximately 420m from your stop: Main Gate.',
    category: 'Transport',
    timestamp: '4 mins ago',
    isRead: false,
    linkTab: 'move'
  },
  {
    id: 'notif-2',
    title: '📅 Next Class: Machine Learning',
    message: 'Class starts at 10:30 AM in CSE-204 with Prof. Anita Roy.',
    category: 'Academic',
    timestamp: '25 mins ago',
    isRead: false,
    linkTab: 'study'
  },
  {
    id: 'notif-3',
    title: '⚠️ Midterm Schedule Published',
    message: 'Examination timetable is now available for download.',
    category: 'Notices',
    timestamp: '2 hours ago',
    isRead: true,
    linkTab: 'notices'
  }
];

interface AppContextType {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (user: UserProfile) => void;
  register: (user: UserProfile) => void;
  logout: () => void;
  // Bus & Proximity
  buses: BusItem[];
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
  preferredStop: string;
  setPreferredStop: (stop: string) => void;
  proximityThreshold: number;
  setProximityThreshold: (threshold: number) => void;
  proximityAlertActive: boolean;
  busDistanceToPreferredStop: number;
  userCoords: { lat: number; lng: number } | null;
  locationPermission: 'prompt' | 'granted' | 'denied' | 'unavailable';
  requestUserLocation: () => Promise<void>;
  updateBusDetails: (busId: string, updates: Partial<BusItem>) => void;
  addNewBus: (bus: BusItem) => void;
  deleteBus: (busId: string) => void;
  // Safety
  emergencyRecords: EmergencyRecord[];
  triggerEmergencySOS: (type: any, notes?: string) => Promise<EmergencyRecord>;
  resolveEmergencyAlert: (referenceId: string) => void;
  updateEmergencyIncident: (incidentId: string, updates: Partial<EmergencyRecord>) => void;
  emergencyContacts: EmergencyContact[];
  // Study & Attendance
  timetable: TimetableClass[];
  updateClassDetails: (classId: string, updates: Partial<TimetableClass>) => void;
  addNewClass: (newClass: TimetableClass) => void;
  deleteClass: (classId: string) => void;
  attendanceThreshold: number;
  setAttendanceThreshold: (threshold: number) => void;
  subjectAttendance: SubjectAttendance[];
  updateSubjectAttendance: (subjectId: string, attended: number, total: number) => void;
  assignments: AssignmentItem[];
  toggleAssignmentComplete: (id: string) => void;
  // Notices
  notices: CampusAlert[];
  publishNotice: (notice: Omit<CampusAlert, 'id' | 'timestamp'>) => void;
  updateNotice: (noticeId: string, updates: Partial<CampusAlert>) => void;
  deleteNotice: (noticeId: string) => void;
  // Lost & Found
  lostFoundList: LostFoundItem[];
  reportLostFound: (item: Omit<LostFoundItem, 'id'>) => void;
  updateLostFoundItem: (itemId: string, updates: Partial<LostFoundItem>) => void;
  deleteLostFoundItem: (itemId: string) => void;
  getMatchesForItem: (item: LostFoundItem) => { item: LostFoundItem; score: number }[];
  // Events
  events: CampusEvent[];
  registerForEvent: (eventId: string) => void;
  // Notifications
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, category: string, linkTab?: string) => void;
  // SMS Gateway & Mobile Notifications
  smsLogs: SmsDeliveryRecord[];
  activeIncomingSms: SmsDeliveryRecord | null;
  dismissIncomingSms: () => void;
  triggerSmsAlert: (to: string, message: string) => Promise<SmsDeliveryRecord>;
  smsGatewayConfig: { provider: string; senderId: string; status: 'active' | 'configured' };
  updateSmsGatewayConfig: (config: { provider?: string; senderId?: string }) => void;
  // Push Notification state
  pushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
  // Campus Status
  campusStatus: 'Normal' | 'Advisory' | 'Drill' | 'Weather Alert';
  setCampusStatus: (status: 'Normal' | 'Advisory' | 'Drill' | 'Weather Alert') => void;
  // AI assistant drawer toggle
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  // Quick Help/About Modal
  isAboutModalOpen: boolean;
  setIsAboutModalOpen: (open: boolean) => void;
  // Student & User Management for Admin view
  demoStudents: StudentRecord[];
  updateStudentDetails: (studentId: string, updates: Partial<StudentRecord>) => void;
  addNewStudent: (student: StudentRecord) => void;
  deleteStudent: (studentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current logged in user (defaults to student Sameerur Rahaman for preview convenience, but user can log out or switch)
  const [user, setUser] = useState<UserProfile | null>(() => {
    return {
      id: 'usr-student-01',
      student_id: 'CS-2023-884',
      name: 'Sameerur Rahaman',
      email: 'student@campusone.demo',
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year (Semester 6)',
      attendance: 82.4,
      preferred_bus_stop: 'Main Gate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      phone: '+1 (555) 392-1084'
    };
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [buses, setBuses] = useState<BusItem[]>(INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-03');
  const [preferredStop, setPreferredStop] = useState<string>('Main Gate');
  const [proximityThreshold, setProximityThreshold] = useState<number>(500); // 500 meters
  const [proximityAlertFired, setProximityAlertFired] = useState<boolean>(false);
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);

  const [emergencyRecords, setEmergencyRecords] = useState<EmergencyRecord[]>([
    {
      id: 'rec-1',
      referenceId: 'SOS-K92A-4401',
      studentId: 'usr-student-01',
      studentName: 'Sameerur Rahaman',
      studentPhone: '+1 (555) 392-1084',
      alertType: 'Medical',
      status: 'resolved',
      timestamp: '2 days ago',
      locationName: 'Sports Complex Court 2',
      notes: 'Ankle sprain during basketball practice. Treated by medical clinic.',
      responder: 'Nurse Angela - Health Unit'
    }
  ]);

  const [timetable, setTimetable] = useState<TimetableClass[]>(INITIAL_TIMETABLE);
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(75);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>(INITIAL_ATTENDANCE);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [notices, setNotices] = useState<CampusAlert[]>(INITIAL_NOTICES);
  const [lostFoundList, setLostFoundList] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [campusStatus, setCampusStatus] = useState<'Normal' | 'Advisory' | 'Drill' | 'Weather Alert'>('Normal');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // SMS Gateway state
  const [smsLogs, setSmsLogs] = useState<SmsDeliveryRecord[]>([
    {
      id: 'sms-init-01',
      to: '+1 (555) 392-1084',
      message: 'CampusOne Telco Gateway Active: Real-time transit proximity & emergency SOS alerts armed for student account.',
      senderId: 'CAMPUSONE',
      provider: 'CampusOne Direct Telco Gateway',
      status: 'Delivered',
      timestamp: 'Today, 08:30 AM',
      deliveryCode: 'DEL-TELCO-9801'
    }
  ]);
  const [activeIncomingSms, setActiveIncomingSms] = useState<SmsDeliveryRecord | null>(null);
  const [smsGatewayConfig, setSmsGatewayConfig] = useState<{ provider: string; senderId: string; status: 'active' | 'configured' }>({
    provider: 'CampusOne Direct Telco Gateway',
    senderId: 'CAMPUSONE',
    status: 'active'
  });

  // Geolocation
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');

  // Demo students for Admin Attendance & Users
  const [demoStudents, setDemoStudents] = useState([
    { id: 'usr-student-01', student_id: 'CS-2023-884', name: 'Sameerur Rahaman', email: 'sameerur@campusone.demo', department: 'Computer Science', year: '3rd Year', attendance: 82.4, status: 'active', phone: '+1 (555) 392-1084' },
    { id: 'usr-student-02', student_id: 'CS-2023-885', name: 'Arun Kumar', email: 'arun@campusone.demo', department: 'Computer Science', year: '3rd Year', attendance: 68.0, status: 'active', phone: '+1 (555) 441-2098' },
    { id: 'usr-student-03', student_id: 'EC-2023-412', name: 'Aisha Siddiqui', email: 'aisha@campusone.demo', department: 'Electronics', year: '3rd Year', attendance: 91.5, status: 'active', phone: '+1 (555) 602-9912' },
    { id: 'usr-student-04', student_id: 'ME-2023-109', name: 'Vikram Joshi', email: 'vikram@campusone.demo', department: 'Mechanical', year: '2nd Year', attendance: 64.2, status: 'active', phone: '+1 (555) 819-3344' },
    { id: 'usr-student-05', student_id: 'CS-2023-902', name: 'Priya Sharma', email: 'priya@campusone.demo', department: 'Computer Science', year: '4th Year', attendance: 89.0, status: 'active', phone: '+1 (555) 773-1200' },
  ]);

  // Request browser geolocation with clear user consent & handling
  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationPermission('granted');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationPermission('denied');
        } else {
          setLocationPermission('unavailable');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Push notification permission request
  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setPushEnabled(granted);
    if (granted && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('🚌 CampusOne Notifications Enabled', {
          body: 'You will receive real-time bus arrival and safety alerts.',
          icon: '/icon.svg'
        });
      } catch (e) {
        console.warn('SW notification error:', e);
      }
    }
    return granted;
  };

  // Calculate live distance between Bus 03 (or selected bus) and student's preferred stop
  const selectedBus = useMemo(() => {
    return buses.find((b) => b.id === selectedBusId) || buses[0];
  }, [buses, selectedBusId]);

  const preferredStopObj = useMemo(() => {
    const allStops = selectedBus?.stops || [];
    return allStops.find((s) => s.name.toLowerCase() === preferredStop.toLowerCase()) || allStops[3] || {
      lat: 12.9705,
      lng: 77.5925,
      name: 'Main Gate'
    };
  }, [selectedBus, preferredStop]);

  const busDistanceToPreferredStop = useMemo(() => {
    if (!selectedBus || !preferredStopObj) return 1200;
    return calculateHaversineDistance(
      selectedBus.currentLat,
      selectedBus.currentLng,
      preferredStopObj.lat,
      preferredStopObj.lng
    );
  }, [selectedBus, preferredStopObj]);

  // Proximity alert trigger
  const proximityAlertActive = busDistanceToPreferredStop <= proximityThreshold;

  // Real-time bus simulation loop (gently moves Bus 03 towards Campus every few seconds to show live telemetry)
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.id === 'bus-03') {
            // Move subtly towards Main Gate (12.9705, 77.5925)
            const targetLat = 12.9705;
            const targetLng = 77.5925;
            const deltaLat = (targetLat - bus.currentLat) * 0.08;
            const deltaLng = (targetLng - bus.currentLng) * 0.08;

            const nextLat = bus.currentLat + deltaLat;
            const nextLng = bus.currentLng + deltaLng;
            const dist = calculateHaversineDistance(nextLat, nextLng, targetLat, targetLng);
            const nextEta = Math.max(1, Math.round(dist / 220));

            return {
              ...bus,
              currentLat: nextLat,
              currentLng: nextLng,
              etaMinutes: nextEta,
              status: dist < 200 ? 'Arrived' : dist < 600 ? 'Near campus' : 'On route',
              lastUpdated: 'Just now'
            };
          }
          return bus;
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // When proximity triggers for the first time, send notifications
  useEffect(() => {
    if (proximityAlertActive && !proximityAlertFired) {
      setProximityAlertFired(true);
      // In-app notification
      addNotification(
        '🚌 Bus Approaching',
        `${selectedBus.number} is approximately ${busDistanceToPreferredStop}m from ${preferredStop}.`,
        'Transport',
        'move'
      );
      // Native Web Notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('🚌 CampusOne Alert', {
            body: `${selectedBus.number} is approaching ${preferredStop} (~${busDistanceToPreferredStop}m away).`,
            icon: '/icon.svg'
          });
        } catch (e) {
          // ignore notification block
        }
      }
    }
  }, [proximityAlertActive, proximityAlertFired, busDistanceToPreferredStop, preferredStop, selectedBus.number]);

  // Auth actions
  const login = (newUser: UserProfile) => {
    setUser(newUser);
    if (newUser.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }
  };

  const register = (newUser: UserProfile) => {
    setUser(newUser);
    if (newUser.role === 'student') {
      setDemoStudents((prev) => {
        const exists = prev.some((s) => s.id === newUser.id || s.email === newUser.email);
        if (exists) return prev;
        return [
          {
            id: newUser.id,
            student_id: newUser.student_id,
            name: newUser.name,
            email: newUser.email,
            department: newUser.department,
            year: newUser.year,
            attendance: newUser.attendance,
            status: 'active',
            phone: newUser.phone
          },
          ...prev
        ];
      });
      setActiveTab('home');
    } else {
      setActiveTab('admin');
    }

    addNotification(
      '🎉 Account Successfully Created',
      `Welcome to CampusOne, ${newUser.name}! Your ${newUser.role.toUpperCase()} profile is fully configured.`,
      'General',
      newUser.role === 'admin' ? 'admin' : 'home'
    );

    // Immediate real mobile SMS notification dispatched to the user's mobile number
    if (newUser.phone) {
      triggerSmsAlert(
        newUser.phone,
        `CampusOne: Welcome, ${newUser.name}! Your ${newUser.role.toUpperCase()} profile (${newUser.student_id}) is active. Stop: ${newUser.preferred_bus_stop}. Emergency SOS armed.`
      );
    }
  };

  const logout = () => {
    setUser(null);
    setActiveTab('home');
  };

  // Notification helper
  const addNotification = (title: string, message: string, category: string, linkTab?: string) => {
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      category,
      timestamp: 'Just now',
      isRead: false,
      linkTab
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Emergency SOS Trigger
  const triggerEmergencySOS = async (type: any, notes?: string): Promise<EmergencyRecord> => {
    try {
      const res = await sendEmergencySOS({
        alertType: type,
        coordinates: userCoords,
        studentId: user?.id || 'usr-student-01',
        studentName: user?.name || 'Sameerur Rahaman',
        notes
      });

      const newRecord: EmergencyRecord = {
        ...res.alert,
        id: `rec-${Date.now()}`,
        referenceId: res.referenceId,
        studentPhone: user?.phone || '+1 (555) 392-1084',
        locationName: userCoords ? 'GPS Live Coordinates Shared' : 'Main Campus Premises'
      };

      setEmergencyRecords((prev) => [newRecord, ...prev]);
      addNotification(
        '🚨 Emergency SOS Dispatched',
        `Alert Ref ${res.referenceId} dispatched to Campus Response Unit.`,
        'Emergency',
        'safety'
      );
      return newRecord;
    } catch (err) {
      // Fallback local dispatch
      const refId = `SOS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackRecord: EmergencyRecord = {
        id: `rec-${Date.now()}`,
        referenceId: refId,
        studentId: user?.id || 'usr-student-01',
        studentName: user?.name || 'Sameerur Rahaman',
        studentPhone: user?.phone || '+1 (555) 392-1084',
        alertType: type,
        status: 'dispatched',
        timestamp: 'Just now',
        locationName: 'Campus Center Zone',
        notes: notes || 'Immediate security dispatch requested.',
        responder: 'Campus Security Unit 1'
      };
      setEmergencyRecords((prev) => [fallbackRecord, ...prev]);
      return fallbackRecord;
    }
  };

  const resolveEmergencyAlert = (refId: string) => {
    setEmergencyRecords((prev) =>
      prev.map((rec) => (rec.referenceId === refId ? { ...rec, status: 'resolved' } : rec))
    );
  };

  // Bus Management
  const updateBusDetails = (busId: string, updates: Partial<BusItem>) => {
    setBuses((prev) =>
      prev.map((bus) => (bus.id === busId ? { ...bus, ...updates, lastUpdated: 'Just now' } : bus))
    );
    addNotification('🚍 Transit Telemetry Updated', `Bus details for ID ${busId} have been updated.`, 'Transport', 'buses');
  };

  const addNewBus = (bus: BusItem) => {
    setBuses((prev) => [bus, ...prev]);
    addNotification('🚍 New Bus Added', `${bus.number} (${bus.routeName}) has been commissioned into campus transit.`, 'Transport', 'buses');
  };

  const deleteBus = (busId: string) => {
    setBuses((prev) => prev.filter((b) => b.id !== busId));
    addNotification('🚍 Transit Fleet', 'Bus removed from active transit registry.', 'Transport', 'admin');
  };

  // Student Management for Admin & User directory
  const updateStudentDetails = (studentId: string, updates: Partial<StudentRecord>) => {
    setDemoStudents((prev) =>
      prev.map((s) => (s.id === studentId || s.student_id === studentId ? { ...s, ...updates } : s))
    );
    // Keep user state in sync if modifying active user
    if (user && (user.id === studentId || user.student_id === studentId)) {
      setUser((prev) => (prev ? ({ ...prev, ...updates } as UserProfile) : null));
    }
    addNotification('👤 Student Profile Updated', `Administrative records updated for ${studentId}.`, 'Academic', 'admin');
  };

  const addNewStudent = (student: StudentRecord) => {
    setDemoStudents((prev) => [student, ...prev]);
    addNotification('👤 New Student Enrolled', `${student.name} (${student.student_id}) enrolled.`, 'Academic', 'admin');
  };

  const deleteStudent = (studentId: string) => {
    setDemoStudents((prev) => prev.filter((s) => s.id !== studentId && s.student_id !== studentId));
    addNotification('👤 Student Directory', 'Student dossier removed from database.', 'Academic', 'admin');
  };

  // Class Timetable Management
  const updateClassDetails = (classId: string, updates: Partial<TimetableClass>) => {
    setTimetable((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, ...updates } : c))
    );
    addNotification('📅 Timetable Updated', 'Academic class schedule slot modified.', 'Academic', 'study');
  };

  const addNewClass = (newClass: TimetableClass) => {
    setTimetable((prev) => [...prev, newClass]);
    addNotification('📅 New Class Scheduled', `${newClass.subjectName} (${newClass.room}) added to timetable.`, 'Academic', 'study');
  };

  const deleteClass = (classId: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== classId));
    addNotification('📅 Class Cancelled', 'Lecture slot removed from campus schedule.', 'Academic', 'study');
  };

  // Emergency Incident Management
  const updateEmergencyIncident = (incidentId: string, updates: Partial<EmergencyRecord>) => {
    setEmergencyRecords((prev) =>
      prev.map((r) => (r.id === incidentId || r.referenceId === incidentId ? { ...r, ...updates } : r))
    );
  };

  // SMS Gateway Real Dispatch & Mobile Notification
  const dismissIncomingSms = () => {
    setActiveIncomingSms(null);
  };

  const triggerSmsAlert = async (to: string, message: string): Promise<SmsDeliveryRecord> => {
    const targetPhone = to || user?.phone || '+1 (555) 392-1084';
    let deliveryCode = `DEL-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    let provider = smsGatewayConfig.provider;

    try {
      const res = await testSmsDispatch(targetPhone, message);
      if (res.deliveryCode) deliveryCode = res.deliveryCode;
      if (res.provider) provider = res.provider;
    } catch (e) {
      console.warn('SMS dispatch handled locally:', e);
    }

    const record: SmsDeliveryRecord = {
      id: `sms-${Date.now()}`,
      to: targetPhone,
      message,
      senderId: smsGatewayConfig.senderId,
      provider,
      status: 'Delivered',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryCode
    };

    setSmsLogs((prev) => [record, ...prev]);
    setActiveIncomingSms(record);

    // Auto-dismiss after 7 seconds
    setTimeout(() => {
      setActiveIncomingSms((curr) => (curr?.id === record.id ? null : curr));
    }, 7000);

    return record;
  };

  const updateSmsGatewayConfig = (config: { provider?: string; senderId?: string }) => {
    setSmsGatewayConfig((prev) => ({
      ...prev,
      provider: config.provider || prev.provider,
      senderId: config.senderId || prev.senderId
    }));
  };

  // Attendance update
  const updateSubjectAttendance = (subjectId: string, attended: number, total: number) => {
    setSubjectAttendance((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          const pct = Math.round((attended / total) * 1000) / 10;
          return { ...sub, attended, total, percentage: pct };
        }
        return sub;
      })
    );
  };

  // Assignments toggle
  const toggleAssignmentComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === id
          ? {
              ...asg,
              status: asg.status === 'Completed' ? 'Pending' : 'Completed'
            }
          : asg
      )
    );
  };

  // Publish Notice
  const publishNotice = (notice: Omit<CampusAlert, 'id' | 'timestamp'>) => {
    const newNotice: CampusAlert = {
      ...notice,
      id: `not-${Date.now()}`,
      timestamp: 'Just now'
    };
    setNotices((prev) => [newNotice, ...prev]);
    addNotification(`📢 New Notice: ${notice.title}`, notice.message.slice(0, 80) + '...', notice.category, 'notices');
  };

  const updateNotice = (noticeId: string, updates: Partial<CampusAlert>) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, ...updates } : n))
    );
    addNotification('📢 Notice Updated', 'Campus circular announcement has been revised.', 'General', 'notices');
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
    addNotification('📢 Notice Removed', 'Circular announcement was taken down.', 'General', 'admin');
  };

  // Lost & Found
  const reportLostFound = (item: Omit<LostFoundItem, 'id'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`
    };
    setLostFoundList((prev) => [newItem, ...prev]);
    addNotification(`🔍 ${item.type === 'lost' ? 'Lost' : 'Found'} Item Logged`, item.itemName, 'Lost & Found', 'lost-found');
  };

  const updateLostFoundItem = (itemId: string, updates: Partial<LostFoundItem>) => {
    setLostFoundList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
    addNotification('🔍 Item Updated', 'Lost & Found item registry has been updated.', 'Lost & Found', 'lost-found');
  };

  const deleteLostFoundItem = (itemId: string) => {
    setLostFoundList((prev) => prev.filter((item) => item.id !== itemId));
    addNotification('🔍 Item Removed', 'Lost & Found entry deleted.', 'Lost & Found', 'admin');
  };

  const getMatchesForItem = (target: LostFoundItem) => {
    const oppositeType = target.type === 'lost' ? 'found' : 'lost';
    const candidates = lostFoundList.filter((item) => item.type === oppositeType && item.id !== target.id);

    return candidates
      .map((item) => {
        const titleScore = calculateSimilarity(target.itemName, item.itemName);
        const descScore = calculateSimilarity(target.description, item.description);
        const locScore = calculateSimilarity(target.location, item.location);
        const totalScore = Math.round(titleScore * 0.5 + descScore * 0.3 + locScore * 0.2);
        return { item, score: Math.max(titleScore, totalScore) };
      })
      .filter((res) => res.score >= 35)
      .sort((a, b) => b.score - a.score);
  };

  // Events Registration
  const registerForEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isReg = !ev.isRegistered;
          return {
            ...ev,
            isRegistered: isReg,
            registeredCount: isReg ? ev.registeredCount + 1 : Math.max(0, ev.registeredCount - 1)
          };
        }
        return ev;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        login,
        register,
        logout,
        buses,
        selectedBusId,
        setSelectedBusId,
        preferredStop,
        setPreferredStop,
        proximityThreshold,
        setProximityThreshold,
        proximityAlertActive,
        busDistanceToPreferredStop,
        userCoords,
        locationPermission,
        requestUserLocation,
        updateBusDetails,
        addNewBus,
        deleteBus,
        emergencyRecords,
        triggerEmergencySOS,
        resolveEmergencyAlert,
        updateEmergencyIncident,
        emergencyContacts: INITIAL_CONTACTS,
        timetable,
        updateClassDetails,
        addNewClass,
        deleteClass,
        attendanceThreshold,
        setAttendanceThreshold,
        subjectAttendance,
        updateSubjectAttendance,
        assignments,
        toggleAssignmentComplete,
        notices,
        publishNotice,
        updateNotice,
        deleteNotice,
        lostFoundList,
        reportLostFound,
        updateLostFoundItem,
        deleteLostFoundItem,
        getMatchesForItem,
        events,
        registerForEvent,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        addNotification,
        smsLogs,
        activeIncomingSms,
        dismissIncomingSms,
        triggerSmsAlert,
        smsGatewayConfig,
        updateSmsGatewayConfig,
        pushEnabled,
        requestPushPermission,
        campusStatus,
        setCampusStatus,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isAboutModalOpen,
        setIsAboutModalOpen,
        demoStudents,
        updateStudentDetails,
        addNewStudent,
        deleteStudent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
