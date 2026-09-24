import React, { useState } from 'react';
import {
  ShieldCheck,
  Bus,
  Users,
  AlertTriangle,
  Bell,
  ShieldAlert,
  Calendar,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  Send,
  Sliders,
  CheckCircle,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  Radio,
  RefreshCw,
  Smartphone,
  BookOpen,
  HelpCircle,
  Layers,
  Phone,
  Building,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  BusItem,
  BusStatus,
  CampusAlert,
  AlertCategory,
  AlertPriority,
  TimetableClass,
  LostFoundItem,
  EmergencyRecord,
  StudentRecord
} from '../../types';

export const AdminPortalView: React.FC = () => {
  const {
    buses,
    updateBusDetails,
    addNewBus,
    deleteBus,
    attendanceThreshold,
    setAttendanceThreshold,
    demoStudents,
    updateStudentDetails,
    addNewStudent,
    deleteStudent,
    timetable,
    updateClassDetails,
    addNewClass,
    deleteClass,
    emergencyRecords,
    resolveEmergencyAlert,
    updateEmergencyIncident,
    notices,
    publishNotice,
    updateNotice,
    deleteNotice,
    lostFoundList,
    updateLostFoundItem,
    deleteLostFoundItem,
    addNotification,
    campusStatus,
    setCampusStatus,
    events,
    smsLogs,
    triggerSmsAlert,
    smsGatewayConfig,
    updateSmsGatewayConfig
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    'overview' | 'buses' | 'attendance' | 'timetable' | 'alerts' | 'lostfound' | 'emergency' | 'sms'
  >('overview');

  // -------------------------------------------------------------
  // BUS MANAGEMENT STATE
  // -------------------------------------------------------------
  const [editingBus, setEditingBus] = useState<BusItem | null>(null);
  const [newBusModalOpen, setNewBusModalOpen] = useState(false);
  const [newBusForm, setNewBusForm] = useState({
    number: '',
    routeName: '',
    direction: 'City Center Terminal → Campus',
    driverName: 'Ramesh Singh',
    driverPhone: '+1 (555) 019-3300',
    capacity: 50,
    occupancy: 22,
    speedKmh: 42,
    etaMinutes: 12,
    status: 'On route' as BusStatus,
    currentLat: 12.9650,
    currentLng: 77.5850
  });

  const handleSaveBusEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBus) return;
    updateBusDetails(editingBus.id, {
      number: editingBus.number,
      routeName: editingBus.routeName,
      direction: editingBus.direction,
      driverName: editingBus.driverName,
      driverPhone: editingBus.driverPhone,
      capacity: Number(editingBus.capacity),
      occupancy: Number(editingBus.occupancy),
      status: editingBus.status,
      etaMinutes: Number(editingBus.etaMinutes),
      speedKmh: Number(editingBus.speedKmh),
      currentLat: Number(editingBus.currentLat),
      currentLng: Number(editingBus.currentLng),
    });
    setEditingBus(null);
  };

  const handleCreateNewBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusForm.number.trim() || !newBusForm.routeName.trim()) return;

    const newBusObj: BusItem = {
      id: `bus-${Date.now()}`,
      number: newBusForm.number.trim(),
      routeName: newBusForm.routeName.trim(),
      direction: newBusForm.direction,
      driverName: newBusForm.driverName.trim(),
      driverPhone: newBusForm.driverPhone.trim(),
      status: newBusForm.status,
      capacity: Number(newBusForm.capacity),
      occupancy: Number(newBusForm.occupancy),
      currentLat: Number(newBusForm.currentLat),
      currentLng: Number(newBusForm.currentLng),
      speedKmh: Number(newBusForm.speedKmh),
      etaMinutes: Number(newBusForm.etaMinutes),
      lastUpdated: 'Just now',
      stops: [
        { id: `st-${Date.now()}-1`, name: 'City Center Terminal', lat: 12.9450, lng: 77.5750, order: 1, scheduledTime: '08:00 AM' },
        { id: `st-${Date.now()}-2`, name: 'Main Gate', lat: 12.9705, lng: 77.5925, order: 2, scheduledTime: '08:30 AM', isCampusStop: true }
      ]
    };

    addNewBus(newBusObj);
    setNewBusModalOpen(false);
    setNewBusForm({
      number: '',
      routeName: '',
      direction: 'City Center Terminal → Campus',
      driverName: 'Ramesh Singh',
      driverPhone: '+1 (555) 019-3300',
      capacity: 50,
      occupancy: 22,
      speedKmh: 42,
      etaMinutes: 12,
      status: 'On route',
      currentLat: 12.9650,
      currentLng: 77.5850
    });
  };

  // -------------------------------------------------------------
  // STUDENT / USER MANAGEMENT STATE
  // -------------------------------------------------------------
  const [studentSearch, setStudentSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [newStudentModalOpen, setNewStudentModalOpen] = useState(false);
  const [notifiedStudents, setNotifiedStudents] = useState<Set<string>>(new Set());

  const [newStudentForm, setNewStudentForm] = useState<StudentRecord>({
    id: '',
    student_id: '',
    name: '',
    email: '',
    department: 'Computer Science',
    year: '3rd Year',
    attendance: 85.0,
    status: 'active',
    phone: '+1 (555) 392-1084',
    preferred_bus_stop: 'Main Gate'
  });

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudentDetails(editingStudent.id, {
      name: editingStudent.name,
      student_id: editingStudent.student_id,
      email: editingStudent.email,
      phone: editingStudent.phone,
      department: editingStudent.department,
      year: editingStudent.year,
      attendance: Number(editingStudent.attendance),
      status: editingStudent.status,
      preferred_bus_stop: editingStudent.preferred_bus_stop
    });
    setEditingStudent(null);
  };

  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.email.trim()) return;

    const id = `usr-std-${Date.now()}`;
    const generatedStudentId = newStudentForm.student_id.trim() || `CS-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newStd: StudentRecord = {
      ...newStudentForm,
      id,
      student_id: generatedStudentId,
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim(),
      phone: newStudentForm.phone.trim() || '+1 (555) 019-8200'
    };

    addNewStudent(newStd);
    setNewStudentModalOpen(false);
    setNewStudentForm({
      id: '',
      student_id: '',
      name: '',
      email: '',
      department: 'Computer Science',
      year: '1st Year',
      attendance: 90.0,
      status: 'active',
      phone: '+1 (555) 392-1084',
      preferred_bus_stop: 'Main Gate'
    });
  };

  const handleNotifyStudent = (student: StudentRecord) => {
    setNotifiedStudents((prev) => new Set([...prev, student.id]));
    addNotification(
      '⚠️ Attendance Warning Issued by Dean',
      `Official notice issued to ${student.name} (${student.student_id}): Attendance is currently ${student.attendance}% (Below mandatory ${attendanceThreshold}%).`,
      'Academic',
      'study'
    );
    // Also trigger mobile SMS notice to student's phone
    if (student.phone) {
      triggerSmsAlert(
        student.phone,
        `CampusOne Official Warning: Your current attendance is ${student.attendance}%, below campus minimum ${attendanceThreshold}%. Please contact your department coordinator.`
      );
    }
  };

  // -------------------------------------------------------------
  // TIMETABLE / CLASS MANAGEMENT STATE
  // -------------------------------------------------------------
  const [editingClass, setEditingClass] = useState<TimetableClass | null>(null);
  const [newClassModalOpen, setNewClassModalOpen] = useState(false);
  const [newClassForm, setNewClassForm] = useState<TimetableClass>({
    id: '',
    subjectCode: 'CS-606',
    subjectName: 'Distributed Cloud Systems',
    instructor: 'Prof. David Vance',
    room: 'CS-302',
    building: 'Computing Block',
    dayOfWeek: 'Monday',
    startTime: '10:00',
    endTime: '11:00'
  });

  const handleSaveClassEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    updateClassDetails(editingClass.id, {
      subjectCode: editingClass.subjectCode,
      subjectName: editingClass.subjectName,
      instructor: editingClass.instructor,
      room: editingClass.room,
      building: editingClass.building,
      dayOfWeek: editingClass.dayOfWeek,
      startTime: editingClass.startTime,
      endTime: editingClass.endTime
    });
    setEditingClass(null);
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.subjectCode.trim() || !newClassForm.subjectName.trim()) return;

    addNewClass({
      ...newClassForm,
      id: `cls-${Date.now()}`
    });
    setNewClassModalOpen(false);
  };

  // -------------------------------------------------------------
  // NOTICES / CIRCULARS STATE
  // -------------------------------------------------------------
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertCategory, setAlertCategory] = useState<AlertCategory>('Academic');
  const [alertPriority, setAlertPriority] = useState<AlertPriority>('normal');
  const [alertPublishedToast, setAlertPublishedToast] = useState(false);
  const [editingNotice, setEditingNotice] = useState<CampusAlert | null>(null);

  const handlePublishAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) return;

    publishNotice({
      title: alertTitle,
      message: alertMessage,
      category: alertCategory,
      priority: alertPriority,
      author: 'Office of the Dean & Registrar',
      isPinned: alertPriority === 'urgent' || alertPriority === 'high'
    });

    setAlertPublishedToast(true);
    setAlertTitle('');
    setAlertMessage('');
    setTimeout(() => setAlertPublishedToast(false), 3000);
  };

  const handleSaveNoticeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    updateNotice(editingNotice.id, {
      title: editingNotice.title,
      message: editingNotice.message,
      category: editingNotice.category,
      priority: editingNotice.priority,
      author: editingNotice.author
    });
    setEditingNotice(null);
  };

  // -------------------------------------------------------------
  // LOST & FOUND MANAGEMENT STATE
  // -------------------------------------------------------------
  const [editingLostItem, setEditingLostItem] = useState<LostFoundItem | null>(null);

  const handleSaveLostItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLostItem) return;
    updateLostFoundItem(editingLostItem.id, {
      itemName: editingLostItem.itemName,
      category: editingLostItem.category,
      location: editingLostItem.location,
      status: editingLostItem.status,
      contactInfo: editingLostItem.contactInfo,
      description: editingLostItem.description
    });
    setEditingLostItem(null);
  };

  // -------------------------------------------------------------
  // EMERGENCY SOS INCIDENTS STATE
  // -------------------------------------------------------------
  const [editingEmergency, setEditingEmergency] = useState<EmergencyRecord | null>(null);

  const handleSaveEmergencyEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmergency) return;
    updateEmergencyIncident(editingEmergency.id, {
      status: editingEmergency.status,
      responder: editingEmergency.responder,
      notes: editingEmergency.notes
    });
    setEditingEmergency(null);
  };

  // -------------------------------------------------------------
  // SMS GATEWAY DISPATCHER STATE
  // -------------------------------------------------------------
  const [manualSmsPhone, setManualSmsPhone] = useState('+1 (555) 392-1084');
  const [manualSmsBody, setManualSmsBody] = useState(
    'CampusOne Notification: Campus bus schedule updated. Please check the Move tab for route times.'
  );
  const [manualSmsSending, setManualSmsSending] = useState(false);
  const [manualSmsSuccess, setManualSmsSuccess] = useState(false);

  const handleSendManualSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSmsPhone.trim() || !manualSmsBody.trim()) return;

    setManualSmsSending(true);
    try {
      await triggerSmsAlert(manualSmsPhone.trim(), manualSmsBody.trim());
      setManualSmsSuccess(true);
      setTimeout(() => setManualSmsSuccess(false), 3500);
    } finally {
      setManualSmsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner with Neon Glow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#090f20] p-6 rounded-3xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.18)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Administrative Command Center
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              FULL PRIVILEGE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modify bus routes, driver details, student records, academic timetables, campus circulars, and live SMS gateway telemetry.
          </p>
        </div>

        {/* Global Campus Status Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Campus Readiness:</span>
          <select
            value={campusStatus}
            onChange={(e) => setCampusStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/40 text-xs font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] focus:outline-none focus:border-cyan-300 transition"
          >
            <option value="Normal">🟢 Normal Status</option>
            <option value="Advisory">🟡 Advisory Alert</option>
            <option value="Drill">🟠 Scheduled Safety Drill</option>
            <option value="Weather Alert">🔴 Severe Weather Watch</option>
          </select>
        </div>
      </div>

      {/* Modern Neon Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'buses', label: `Transit Fleet (${buses.length})`, icon: Bus },
          { id: 'attendance', label: `Students (${demoStudents.length})`, icon: Users },
          { id: 'timetable', label: `Timetable (${timetable.length})`, icon: BookOpen },
          { id: 'alerts', label: `Notices (${notices.length})`, icon: Bell },
          { id: 'lostfound', label: `Lost & Found (${lostFoundList.length})`, icon: HelpCircle },
          { id: 'emergency', label: `SOS Alerts (${emergencyRecords.length})`, icon: ShieldAlert },
          { id: 'sms', label: `SMS Gateway (${smsLogs.length})`, icon: Smartphone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.45)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              } active:scale-95`}
            >
              <Icon size={14} className={isActive ? 'text-cyan-300' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Fleet</span>
                <Bus size={18} className="text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{buses.length} Buses</div>
              <p className="text-[11px] text-cyan-300 font-mono mt-1">100% telemetry synced</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
                <Users size={18} className="text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">{demoStudents.length} Students</div>
              <p className="text-[11px] text-slate-400 mt-1">Threshold: {attendanceThreshold}%</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">SMS Gateway</span>
                <Smartphone size={18} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{smsLogs.length} Dispatched</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">🟢 Connected & Active</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Emergency Incidents</span>
                <ShieldAlert size={18} className="text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white">{emergencyRecords.length} Incidents</div>
              <p className="text-[11px] text-slate-400 mt-1">Response time: &lt;3 mins</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-[#090f20] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setAdminTab('buses');
                  setNewBusModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={16} className="text-cyan-400 shrink-0" />
                <span>Add New Bus</span>
              </button>

              <button
                onClick={() => {
                  setAdminTab('attendance');
                  setNewStudentModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={16} className="text-cyan-400 shrink-0" />
                <span>Enroll Student</span>
              </button>

              <button
                onClick={() => {
                  setAdminTab('timetable');
                  setNewClassModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={16} className="text-cyan-400 shrink-0" />
                <span>Add Class Slot</span>
              </button>

              <button
                onClick={() => setAdminTab('sms')}
                className="p-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all text-left flex items-center gap-2 cursor-pointer"
              >
                <Smartphone size={16} className="text-cyan-400 shrink-0" />
                <span>Send Mobile SMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BUS FLEET & DRIVERS TAB */}
      {/* ========================================================================= */}
      {adminTab === 'buses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Transit Fleet & Drivers Manager
              </h3>
              <p className="text-xs text-slate-400">Edit driver assignments, phone numbers, routes, capacity and speeds</p>
            </div>
            <button
              onClick={() => setNewBusModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:border-cyan-300 hover:text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Add New Bus</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/30 hover:border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{bus.number}</span>
                    <span className="text-xs text-slate-300 font-semibold truncate max-w-[150px]">{bus.routeName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Radio size={12} className="animate-ping" />
                    <span>{bus.status}</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Driver Name:</span>
                    <strong className="text-white">{bus.driverName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Driver Phone:</span>
                    <span className="font-mono text-cyan-300">{bus.driverPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity / Onboard:</span>
                    <span className="font-mono text-white">{bus.occupancy} / {bus.capacity} seats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Speed & ETA:</span>
                    <span className="font-mono text-cyan-400">{bus.speedKmh} km/h • {bus.etaMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <span className="font-mono text-slate-300">{bus.currentLat.toFixed(4)}, {bus.currentLng.toFixed(4)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingBus(bus)}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit Bus & Driver</span>
                  </button>

                  <button
                    onClick={() => deleteBus(bus.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700/80 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 active:scale-95 transition cursor-pointer"
                    title="Delete Bus from Fleet"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STUDENTS & ATTENDANCE TAB */}
      {/* ========================================================================= */}
      {adminTab === 'attendance' && (
        <div className="space-y-5">
          {/* Threshold setting */}
          <div className="bg-[#090f20] p-5 rounded-3xl border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Mandatory Attendance Regulation Threshold</h3>
              <p className="text-xs text-slate-400">Students below threshold are flagged and warned automatically</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-cyan-300 font-mono">{attendanceThreshold}%</span>
              <input
                type="range"
                min="60"
                max="85"
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                className="accent-cyan-400 cursor-pointer w-36"
              />
            </div>
          </div>

          {/* Student Roster */}
          <div className="bg-[#090f20] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student Enrollment & Attendance Directory
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  {demoStudents.length} ENROLLED
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student or ID..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  onClick={() => setNewStudentModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_22px_rgba(6,182,212,0.65)] hover:text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle size={14} />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Student ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Mobile Phone</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {demoStudents
                    .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.student_id.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map((s) => {
                      const isLow = s.attendance < attendanceThreshold;
                      return (
                        <tr key={s.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-mono font-bold text-cyan-400">{s.student_id}</td>
                          <td className="p-3 font-semibold text-white">{s.name}</td>
                          <td className="p-3 text-slate-300">{s.department} ({s.year})</td>
                          <td className="p-3 font-mono text-slate-400">{s.phone}</td>
                          <td className="p-3 font-mono font-bold">
                            <span className={isLow ? 'text-rose-400' : 'text-emerald-400'}>
                              {s.attendance}%
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isLow ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {isLow ? 'AT RISK' : 'COMPLIANT'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isLow && (
                                <button
                                  onClick={() => handleNotifyStudent(s)}
                                  disabled={notifiedStudents.has(s.id)}
                                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition active:scale-95 disabled:opacity-50"
                                >
                                  {notifiedStudents.has(s.id) ? 'Notified' : 'Send Warning'}
                                </button>
                              )}
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 active:scale-95 transition"
                                title="Edit Student Details"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => deleteStudent(s.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 active:scale-95 transition"
                                title="Delete Student"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TIMETABLE & CLASS SCHEDULE TAB */}
      {/* ========================================================================= */}
      {adminTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Academic Timetable & Class Schedule
              </h3>
              <p className="text-xs text-slate-400">Modify course codes, instructor names, lecture rooms, and timings</p>
            </div>
            <button
              onClick={() => setNewClassModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:border-cyan-300 hover:text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Schedule New Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable.map((cls) => (
              <div
                key={cls.id}
                className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/30 hover:border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-cyan-400">{cls.subjectCode}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {cls.dayOfWeek}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{cls.subjectName}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Instructor: {cls.instructor}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Lecture Room:</span>
                    <strong className="text-cyan-300 font-mono">{cls.room}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Building:</span>
                    <span className="text-white">{cls.building}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Slot:</span>
                    <span className="font-mono text-white">{cls.startTime} - {cls.endTime}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingClass(cls)}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit Class Details</span>
                  </button>

                  <button
                    onClick={() => deleteClass(cls.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700/80 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 active:scale-95 transition cursor-pointer"
                    title="Cancel Class"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CAMPUS CIRCULARS & NOTICES TAB */}
      {/* ========================================================================= */}
      {adminTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Publish Form */}
          <div className="bg-[#090f20] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.2)] space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Publish New Campus Circular
            </h3>

            {alertPublishedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
                Circular published and broadcasted to students!
              </div>
            )}

            <form onSubmit={handlePublishAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Term Exams"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  {['Academic', 'Transport', 'Emergency', 'Event', 'Placement', 'General'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                <select
                  value={alertPriority}
                  onChange={(e) => setAlertPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Circular Content</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Enter official circular text..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 h-28 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.85)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Publish to All Students</span>
              </button>
            </form>
          </div>

          {/* Active Notices list */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Official Releases ({notices.length})
            </h3>
            {notices.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-[#090f20] border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.1)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{n.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                      {n.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingNotice(n)}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition"
                      title="Edit Notice"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="p-1 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
                      title="Delete Notice"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1">
                  <span>Author: {n.author}</span>
                  <span>{n.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LOST & FOUND MANAGER TAB */}
      {/* ========================================================================= */}
      {adminTab === 'lostfound' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Lost & Found Registry Management
              </h3>
              <p className="text-xs text-slate-400">Edit item statuses, locations, and contact information</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">{lostFoundList.length} items logged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lostFoundList.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.1)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.type === 'lost' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{item.status.toUpperCase()}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{item.itemName}</h4>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="text-cyan-300">{item.contactInfo}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingLostItem(item)}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 size={13} />
                    <span>Edit Item</span>
                  </button>

                  <button
                    onClick={() => deleteLostFoundItem(item.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700/80 text-slate-400 hover:text-rose-300 active:scale-95 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EMERGENCY SOS INCIDENTS TAB */}
      {/* ========================================================================= */}
      {adminTab === 'emergency' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Live Campus SOS Incident Log
              </h3>
              <p className="text-xs text-slate-400">Confidential emergency records, response units & status audit</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">
              {emergencyRecords.length} Incidents Logged
            </span>
          </div>

          <div className="space-y-3">
            {emergencyRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-3xl bg-[#090f20] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400">{rec.referenceId}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {rec.alertType}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rec.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rec.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    Student: {rec.studentName} ({rec.studentPhone})
                  </h4>
                  <p className="text-xs text-slate-400">Location: {rec.locationName} • Responder: {rec.responder || 'Campus Quick Response Unit 1'}</p>
                  {rec.notes && <p className="text-xs text-slate-300 italic">Notes: "{rec.notes}"</p>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEmergency(rec)}
                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition cursor-pointer"
                  >
                    Edit Incident
                  </button>
                  {rec.status !== 'resolved' && (
                    <button
                      onClick={() => resolveEmergencyAlert(rec.referenceId)}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SMS GATEWAY & LIVE TELEMETRY LOGS TAB */}
      {/* ========================================================================= */}
      {adminTab === 'sms' && (
        <div className="space-y-6">
          {/* Provider status & Direct Manual SMS Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">SMS Gateway Status</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Active Provider:</span>
                  <div className="font-bold text-cyan-300">{smsGatewayConfig.provider}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Sender ID:</span>
                  <div className="font-mono font-bold text-white">{smsGatewayConfig.senderId}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase">Dispatched Volume:</span>
                  <div className="font-mono font-bold text-emerald-400">{smsLogs.length} Messages Delivered</div>
                </div>
              </div>
            </div>

            {/* Manual SMS Dispatch Form */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#090f20] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Manual SMS Dispatch Console</h3>
                  <p className="text-xs text-slate-400">Broadcast immediate transit or safety SMS to any mobile phone</p>
                </div>
                <span className="text-xs font-mono text-cyan-400">INSTANT TOAST</span>
              </div>

              {manualSmsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle size={15} />
                  <span>SMS Dispatched! Mobile notification toast active at top of screen.</span>
                </div>
              )}

              <form onSubmit={handleSendManualSms} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Recipient Mobile Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={manualSmsPhone}
                    onChange={(e) => setManualSmsPhone(e.target.value)}
                    placeholder="+1 (555) 392-1084"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    SMS Message Content <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={manualSmsBody}
                    onChange={(e) => setManualSmsBody(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 h-20 resize-none font-mono text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={manualSmsSending}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.85)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{manualSmsSending ? 'Dispatched via Telco...' : 'Dispatch Live SMS to Mobile'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* SMS Dispatch History Table */}
          <div className="bg-[#090f20] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live SMS Transmission Logs
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Delivery Code</th>
                    <th className="p-3">To Phone</th>
                    <th className="p-3">Message Preview</th>
                    <th className="p-3">Gateway Carrier</th>
                    <th className="p-3">Time</th>
                    <th className="p-3 rounded-r-xl text-right">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {smsLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-cyan-400">{log.deliveryCode}</td>
                      <td className="p-3 text-white">{log.to}</td>
                      <td className="p-3 text-slate-300 font-sans max-w-xs truncate">{log.message}</td>
                      <td className="p-3 text-slate-400">{log.provider}</td>
                      <td className="p-3 text-slate-500">{log.timestamp}</td>
                      <td className="p-3 text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: BUS DETAILS */}
      {/* ========================================================================= */}
      {editingBus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Bus {editingBus.number} Details</h3>
              <button onClick={() => setEditingBus(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBusEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bus Number</label>
                  <input
                    type="text"
                    value={editingBus.number}
                    onChange={(e) => setEditingBus({ ...editingBus, number: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Route Name</label>
                  <input
                    type="text"
                    value={editingBus.routeName}
                    onChange={(e) => setEditingBus({ ...editingBus, routeName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={editingBus.driverName}
                    onChange={(e) => setEditingBus({ ...editingBus, driverName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={editingBus.driverPhone}
                    onChange={(e) => setEditingBus({ ...editingBus, driverPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editingBus.capacity}
                    onChange={(e) => setEditingBus({ ...editingBus, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Occupancy</label>
                  <input
                    type="number"
                    value={editingBus.occupancy}
                    onChange={(e) => setEditingBus({ ...editingBus, occupancy: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingBus.status}
                    onChange={(e) => setEditingBus({ ...editingBus, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="On route">On route</option>
                    <option value="Near campus">Near campus</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Speed (km/h)</label>
                  <input
                    type="number"
                    value={editingBus.speedKmh}
                    onChange={(e) => setEditingBus({ ...editingBus, speedKmh: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ETA (Minutes)</label>
                  <input
                    type="number"
                    value={editingBus.etaMinutes}
                    onChange={(e) => setEditingBus({ ...editingBus, etaMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingBus.currentLat}
                    onChange={(e) => setEditingBus({ ...editingBus, currentLat: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingBus.currentLng}
                    onChange={(e) => setEditingBus({ ...editingBus, currentLng: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBus(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Save Bus Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW BUS */}
      {/* ========================================================================= */}
      {newBusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Commission New Bus into Fleet</h3>
              <button onClick={() => setNewBusModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewBus} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bus Number *</label>
                  <input
                    type="text"
                    value={newBusForm.number}
                    onChange={(e) => setNewBusForm({ ...newBusForm, number: e.target.value })}
                    placeholder="e.g. Bus 06"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Route Name *</label>
                  <input
                    type="text"
                    value={newBusForm.routeName}
                    onChange={(e) => setNewBusForm({ ...newBusForm, routeName: e.target.value })}
                    placeholder="e.g. Tech Park Shuttle"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={newBusForm.driverName}
                    onChange={(e) => setNewBusForm({ ...newBusForm, driverName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={newBusForm.driverPhone}
                    onChange={(e) => setNewBusForm({ ...newBusForm, driverPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial ETA (Mins)</label>
                  <input
                    type="number"
                    value={newBusForm.etaMinutes}
                    onChange={(e) => setNewBusForm({ ...newBusForm, etaMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Speed (km/h)</label>
                  <input
                    type="number"
                    value={newBusForm.speedKmh}
                    onChange={(e) => setNewBusForm({ ...newBusForm, speedKmh: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewBusModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Add Bus to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: STUDENT DETAILS */}
      {/* ========================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Student: {editingStudent.name}</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student ID</label>
                  <input
                    type="text"
                    value={editingStudent.student_id}
                    onChange={(e) => setEditingStudent({ ...editingStudent, student_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (for SMS)</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={editingStudent.department}
                    onChange={(e) => setEditingStudent({ ...editingStudent, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={editingStudent.year}
                    onChange={(e) => setEditingStudent({ ...editingStudent, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attendance Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editingStudent.attendance}
                    onChange={(e) => setEditingStudent({ ...editingStudent, attendance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Save Student Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENROLL NEW STUDENT */}
      {/* ========================================================================= */}
      {newStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Enroll New Student</h3>
              <button onClick={() => setNewStudentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    placeholder="e.g. Sameerur rahaman"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student ID</label>
                  <input
                    type="text"
                    value={newStudentForm.student_id}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, student_id: e.target.value })}
                    placeholder="e.g. CS-2024-884"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    placeholder="student@campusone.demo"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (for SMS) *</label>
                  <input
                    type="tel"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    placeholder="+1 (555) 392-1084"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newStudentForm.department}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Attendance (%)</label>
                  <input
                    type="number"
                    value={newStudentForm.attendance}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, attendance: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Enroll & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: TIMETABLE CLASS */}
      {/* ========================================================================= */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Timetable Slot</h3>
              <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClassEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={editingClass.subjectCode}
                    onChange={(e) => setEditingClass({ ...editingClass, subjectCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={editingClass.subjectName}
                    onChange={(e) => setEditingClass({ ...editingClass, subjectName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instructor</label>
                  <input
                    type="text"
                    value={editingClass.instructor}
                    onChange={(e) => setEditingClass({ ...editingClass, instructor: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    value={editingClass.room}
                    onChange={(e) => setEditingClass({ ...editingClass, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Day of Week</label>
                  <select
                    value={editingClass.dayOfWeek}
                    onChange={(e) => setEditingClass({ ...editingClass, dayOfWeek: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={editingClass.startTime}
                    onChange={(e) => setEditingClass({ ...editingClass, startTime: e.target.value })}
                    placeholder="10:30"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={editingClass.endTime}
                    onChange={(e) => setEditingClass({ ...editingClass, endTime: e.target.value })}
                    placeholder="11:30"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Save Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SCHEDULE NEW CLASS */}
      {/* ========================================================================= */}
      {newClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Schedule New Timetable Class</h3>
              <button onClick={() => setNewClassModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewClass} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={newClassForm.subjectCode}
                    onChange={(e) => setNewClassForm({ ...newClassForm, subjectCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Name *</label>
                  <input
                    type="text"
                    value={newClassForm.subjectName}
                    onChange={(e) => setNewClassForm({ ...newClassForm, subjectName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instructor</label>
                  <input
                    type="text"
                    value={newClassForm.instructor}
                    onChange={(e) => setNewClassForm({ ...newClassForm, instructor: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    value={newClassForm.room}
                    onChange={(e) => setNewClassForm({ ...newClassForm, room: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Day of Week</label>
                  <select
                    value={newClassForm.dayOfWeek}
                    onChange={(e) => setNewClassForm({ ...newClassForm, dayOfWeek: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newClassForm.startTime}
                    onChange={(e) => setNewClassForm({ ...newClassForm, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={newClassForm.endTime}
                    onChange={(e) => setNewClassForm({ ...newClassForm, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: CAMPUS NOTICE */}
      {/* ========================================================================= */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Official Circular</h3>
              <button onClick={() => setEditingNotice(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNoticeEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={editingNotice.category}
                    onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    {['Academic', 'Transport', 'Emergency', 'Event', 'Placement', 'General'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={editingNotice.priority}
                    onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content</label>
                <textarea
                  value={editingNotice.message}
                  onChange={(e) => setEditingNotice({ ...editingNotice, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white h-24 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: LOST & FOUND ITEM */}
      {/* ========================================================================= */}
      {editingLostItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Lost & Found Item</h3>
              <button onClick={() => setEditingLostItem(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLostItemEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  value={editingLostItem.itemName}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, itemName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingLostItem.location}
                    onChange={(e) => setEditingLostItem({ ...editingLostItem, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingLostItem.status}
                    onChange={(e) => setEditingLostItem({ ...editingLostItem, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="open">Open</option>
                    <option value="matched">Matched</option>
                    <option value="resolved">Resolved / Claimed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Details</label>
                <input
                  type="text"
                  value={editingLostItem.contactInfo}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, contactInfo: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLostItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL: EMERGENCY INCIDENT */}
      {/* ========================================================================= */}
      {editingEmergency && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f20] border border-cyan-400/60 rounded-3xl max-w-lg w-full p-6 shadow-[0_0_35px_rgba(6,182,212,0.4)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Emergency Incident {editingEmergency.referenceId}</h3>
              <button onClick={() => setEditingEmergency(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEmergencyEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={editingEmergency.status}
                    onChange={(e) => setEditingEmergency({ ...editingEmergency, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="dispatched">Dispatched</option>
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Responder</label>
                  <input
                    type="text"
                    value={editingEmergency.responder || ''}
                    onChange={(e) => setEditingEmergency({ ...editingEmergency, responder: e.target.value })}
                    placeholder="e.g. Quick Response Unit 2"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Administrative Notes</label>
                <textarea
                  value={editingEmergency.notes || ''}
                  onChange={(e) => setEditingEmergency({ ...editingEmergency, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white h-20 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmergency(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(6,182,212,0.75)] active:scale-95 transition cursor-pointer"
                >
                  Update Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
