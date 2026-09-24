import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText,
  CalendarDays,
  Target,
  Award,
  PlusCircle,
  ExternalLink,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateStudyPlan } from '../../services/api';
import { TimetableClass, SubjectAttendance, AssignmentItem, StudyPlanItem } from '../../types';

export const StudyView: React.FC = () => {
  const {
    timetable,
    subjectAttendance,
    attendanceThreshold,
    assignments,
    toggleAssignmentComplete,
    user
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'attendance' | 'study-planner' | 'assignments'>('timetable');
  const [timetableDay, setTimetableDay] = useState<'Today' | 'Tomorrow' | 'Weekly'>('Today');

  // Study Planner Form State
  const [examDate, setExamDate] = useState('2026-10-12');
  const [availableHours, setAvailableHours] = useState<number>(4);
  const [weakSubjects, setWeakSubjects] = useState('Computer Networks & Subnetting');
  const [completedChapters, setCompletedChapters] = useState('Machine Learning Ch 1-3, OS Memory Mgmt');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [studyPlanResult, setStudyPlanResult] = useState<{
    plan?: string;
    schedule?: StudyPlanItem[];
    tips?: string[];
    generatedBy: string;
    summary?: string;
  } | null>(null);

  // Assignment filter
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Pending' | 'In progress' | 'Completed'>('All');
  const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState<AssignmentItem | null>(null);

  // Current Class calculation
  const currentClass = timetable[0]; // Machine Learning 10:30 - 11:30

  // Overall attendance calculation
  const totalAttended = subjectAttendance.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = subjectAttendance.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 1000) / 10 : 82.4;
  const isAttendanceAtRisk = overallPercentage < attendanceThreshold;

  // Filter timetable for day
  const filteredTimetable = timetable.filter((cls) => {
    if (timetableDay === 'Today') return cls.dayOfWeek === 'Thursday';
    if (timetableDay === 'Tomorrow') return cls.dayOfWeek === 'Friday';
    return true; // Weekly
  });

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);
    try {
      const result = await generateStudyPlan({
        subjects: subjectAttendance.map((s) => s.subjectName),
        examDate,
        availableHours,
        weakSubjects,
        completedChapters
      });
      setStudyPlanResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const filteredAssignments = assignments.filter((asg) => {
    if (assignmentFilter === 'All') return true;
    return asg.status === assignmentFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header and Sub-navigation */}
      <div className="bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">📚 Study & Academic Center</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SEMESTER 6
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live class timetable schedule, attendance compliance tracking, automated AI exam study planner, and coursework submissions.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'timetable', label: 'Timetable', icon: CalendarDays },
            { id: 'attendance', label: 'Attendance', icon: TrendingUp },
            { id: 'study-planner', label: 'AI Study Planner', icon: Sparkles },
            { id: 'assignments', label: 'Assignments', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TIMETABLE */}
      {/* ========================================================================= */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-6">
          {/* Highlight: CURRENT CLASS BANNER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#0b1329] to-cyan-950/50 border-2 border-rose-500/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-rose-500 text-white tracking-wider">
                  🔴 CURRENT CLASS
                </span>
                <span className="text-xs font-mono text-cyan-300">Countdown: 28 mins remaining</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {currentClass?.subjectName} ({currentClass?.subjectCode})
              </h2>
              <p className="text-xs text-slate-300">
                Instructor: <strong className="text-white">{currentClass?.instructor}</strong> • Room:{' '}
                <strong className="text-cyan-400">{currentClass?.room}</strong> ({currentClass?.building})
              </p>
              <div className="text-xs font-mono text-slate-400">
                Time: {currentClass?.startTime} – {currentClass?.endTime}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Up</span>
                <span className="text-sm font-bold text-white block">Computer Networks</span>
                <span className="text-xs text-cyan-400 font-mono">11:45 AM • NW-102</span>
              </div>
            </div>
          </div>

          {/* Timetable Filter & Day Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(['Today', 'Tomorrow', 'Weekly'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setTimetableDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    timetableDay === day
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">Showing {filteredTimetable.length} lecture blocks</span>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTimetable.map((cls, idx) => {
              const isCurrent = cls.id === currentClass?.id && timetableDay === 'Today';
              return (
                <div
                  key={cls.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between shadow-xl ${
                    isCurrent
                      ? 'bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/60'
                      : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {cls.subjectCode}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {cls.startTime} – {cls.endTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{cls.subjectName}</h3>
                    <p className="text-xs text-slate-400">{cls.instructor}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-semibold">{cls.room}</span>
                    <span className="text-slate-400">{cls.dayOfWeek}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ATTENDANCE */}
      {/* ========================================================================= */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          {/* Attendance Risk Banner if below threshold */}
          {isAttendanceAtRisk ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-3">
              <AlertTriangle size={20} className="shrink-0 text-rose-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider">⚠️ LOW ATTENDANCE WARNING</h4>
                <p className="text-xs text-rose-200/90 mt-1">
                  Your cumulative attendance of <strong>{overallPercentage}%</strong> is below the configured campus requirement of{' '}
                  <strong>{attendanceThreshold}%</strong>. Attend upcoming lectures to maintain examination eligibility.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>
                  Attendance is compliant: <strong>{overallPercentage}%</strong> (Required threshold: {attendanceThreshold}%).
                </span>
              </div>
              <span className="font-bold text-emerald-400">Exam Eligible</span>
            </div>
          )}

          {/* Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Overall Attendance</span>
              <div className="text-3xl font-black text-white mt-1">{overallPercentage}%</div>
              <p className="text-[11px] text-slate-400 mt-1">{totalAttended} attended of {totalClasses} classes</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Mandatory Threshold</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">{attendanceThreshold}%</div>
              <p className="text-[11px] text-slate-400 mt-1">Regulated by Dean of Academic Affairs</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase">Margin / Safety Buffer</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">+{(overallPercentage - attendanceThreshold).toFixed(1)}%</div>
              <p className="text-[11px] text-slate-400 mt-1">You can safely miss up to 3 lectures</p>
            </div>
          </div>

          {/* Subject by Subject breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Subject Attendance Registry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectAttendance.map((sub) => {
                const isSubLow = sub.percentage < attendanceThreshold;
                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 shadow-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">{sub.subjectCode}</span>
                        <h4 className="text-base font-bold text-white mt-0.5">{sub.subjectName}</h4>
                        <p className="text-xs text-slate-400">{sub.instructor}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-black ${isSubLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {sub.percentage}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {sub.attended}/{sub.total} classes
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSubLow
                            ? 'bg-rose-500'
                            : sub.percentage >= 85
                            ? 'bg-emerald-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(100, sub.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className={isSubLow ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                        {isSubLow ? '⚠️ Low attendance — attend next classes' : 'Normal Standing'}
                      </span>
                      <span className="text-slate-400">Need {attendanceThreshold}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SMART STUDY PLANNER */}
      {/* ========================================================================= */}
      {activeSubTab === 'study-planner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Configuration Card */}
            <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles size={18} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Generate Custom Study Roadmap</h3>
              </div>

              <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Daily Study Hours</label>
                    <span className="font-mono text-cyan-400 font-bold">{availableHours} hrs/day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weak Subject(s) / Priority Topics</label>
                  <input
                    type="text"
                    value={weakSubjects}
                    onChange={(e) => setWeakSubjects(e.target.value)}
                    placeholder="e.g. Computer Networks, Memory Management"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Completed Chapters</label>
                  <input
                    type="text"
                    value={completedChapters}
                    onChange={(e) => setCompletedChapters(e.target.value)}
                    placeholder="e.g. ML Ch 1-3"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPlan}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isGeneratingPlan ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate AI Schedule</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Plan Output Display */}
            <div className="lg:col-span-2 bg-[#0b1329] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Your Tailored Study Plan</h3>
                </div>
                {studyPlanResult && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Engine: {studyPlanResult.generatedBy}
                  </span>
                )}
              </div>

              {!studyPlanResult ? (
                <div className="py-12 text-center space-y-3">
                  <BookOpen size={36} className="text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No Study Plan Generated Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Fill in your available study hours, weak subjects, and target exam date on the left, then click Generate.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studyPlanResult.summary && (
                    <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                      {studyPlanResult.summary}
                    </div>
                  )}

                  {studyPlanResult.schedule && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Recommended Daily Blocks
                      </h4>
                      <div className="space-y-2.5">
                        {studyPlanResult.schedule.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              <div>
                                <span className="font-bold text-white block">{item.subject}</span>
                                <span className="text-[11px] text-slate-400">{item.activity}</span>
                              </div>
                            </div>
                            <span className="font-mono text-cyan-300 font-semibold">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {studyPlanResult.plan && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                      {studyPlanResult.plan}
                    </div>
                  )}

                  {studyPlanResult.tips && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-400">
                      <strong className="text-slate-200 block text-xs">Productivity Tips:</strong>
                      {studyPlanResult.tips.map((t, idx) => (
                        <p key={idx}>• {t}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ASSIGNMENTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['All', 'Pending', 'In progress', 'Completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    assignmentFilter === filter
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              {filteredAssignments.length} assignments found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((asg) => {
              const isCompleted = asg.status === 'Completed';
              return (
                <div
                  key={asg.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between shadow-xl ${
                    isCompleted
                      ? 'bg-[#0b1329]/60 border-slate-800/80 opacity-75'
                      : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{asg.subjectCode}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          asg.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : asg.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {asg.priority} priority
                      </span>
                    </div>

                    <h4 className={`text-base font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {asg.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{asg.subjectName}</p>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">{asg.instructions}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Due: {new Date(asg.dueDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAssignmentDetails(asg)}
                        className="text-xs text-cyan-400 hover:underline font-medium"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => toggleAssignmentComplete(asg.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        <Check size={12} />
                        <span>{isCompleted ? 'Mark Pending' : 'Mark Complete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {selectedAssignmentDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedAssignmentDetails.subjectCode}</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedAssignmentDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignmentDetails(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div><strong>Subject:</strong> {selectedAssignmentDetails.subjectName}</div>
              <div><strong>Due Date:</strong> {new Date(selectedAssignmentDetails.dueDate).toLocaleString()}</div>
              <div><strong>Status:</strong> {selectedAssignmentDetails.status}</div>
              <div className="pt-2 border-t border-slate-800">
                <strong>Submission Instructions:</strong>
                <p className="mt-1 text-slate-400 leading-relaxed">{selectedAssignmentDetails.instructions}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleAssignmentComplete(selectedAssignmentDetails.id);
                  setSelectedAssignmentDetails(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {selectedAssignmentDetails.status === 'Completed' ? 'Mark Incomplete' : 'Mark as Completed'}
              </button>
              <button
                onClick={() => setSelectedAssignmentDetails(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
