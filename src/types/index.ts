export type UserRole = 'student' | 'admin' | 'security' | 'faculty';

export interface UserProfile {
  id: string;
  student_id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  year: string;
  attendance: number;
  preferred_bus_stop: string;
  avatar: string;
  phone: string;
}

export type BusStatus = 'On route' | 'Near campus' | 'Arrived' | 'Delayed' | 'Offline';

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  scheduledTime: string;
  isCampusStop?: boolean;
}

export interface BusItem {
  id: string;
  number: string;
  routeName: string;
  direction: string;
  driverName: string;
  driverPhone: string;
  status: BusStatus;
  capacity: number;
  occupancy: number;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  etaMinutes: number;
  lastUpdated: string;
  stops: BusStop[];
}

export type AlertCategory = 'Emergency' | 'Transport' | 'Academic' | 'Events' | 'Placement' | 'General';
export type AlertPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface CampusAlert {
  id: string;
  title: string;
  message: string;
  category: AlertCategory;
  priority: AlertPriority;
  author: string;
  timestamp: string;
  isPinned?: boolean;
}

export interface TimetableClass {
  id: string;
  subjectCode: string;
  subjectName: string;
  instructor: string;
  room: string;
  dayOfWeek: string;
  startTime: string; // e.g. "10:30"
  endTime: string;   // e.g. "11:30"
  building: string;
}

export interface SubjectAttendance {
  id: string;
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  instructor: string;
}

export type AssignmentStatus = 'Pending' | 'In progress' | 'Completed' | 'Overdue';
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AssignmentItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  dueDate: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  instructions: string;
}

export type EmergencyType = 'Medical' | 'Security' | 'Fire' | 'Transport' | 'Other';
export type SOSStatus = 'active' | 'dispatched' | 'resolved' | 'cancelled';

export interface EmergencyRecord {
  id: string;
  referenceId: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  alertType: EmergencyType;
  status: SOSStatus;
  lat?: number | null;
  lng?: number | null;
  locationName?: string;
  timestamp: string;
  notes?: string;
  responder?: string;
}

export interface EmergencyContact {
  name: string;
  department: string;
  phone: string;
  description: string;
  iconName: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  category: string;
  description: string;
  location: string;
  date: string;
  photoUrl: string;
  contactInfo: string;
  reportedBy: string;
  status: 'open' | 'matched' | 'resolved';
}

export type EventCategory = 'Technical' | 'Symposium' | 'Hackathon' | 'Workshop' | 'Sports' | 'Cultural' | 'Placement';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  totalSeats: number;
  registeredCount: number;
  organizer: string;
  isRegistered?: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface SmsDeliveryRecord {
  id: string;
  to: string;
  message: string;
  senderId: string;
  provider: string;
  status: 'Delivered' | 'Pending' | 'Failed';
  timestamp: string;
  deliveryCode: string;
}

export interface StudentRecord {
  id: string;
  student_id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  attendance: number;
  status: string;
  phone: string;
  preferred_bus_stop?: string;
}

export interface StudyPlanItem {
  time: string;
  subject: string;
  activity: string;
  type: string;
}
