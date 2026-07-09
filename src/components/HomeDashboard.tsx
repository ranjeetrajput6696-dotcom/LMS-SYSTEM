/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Clock, 
  MapPin, 
  ClipboardList, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { UpcomingClass, PendingHomework, RosterStudent } from '../types';

interface HomeDashboardProps {
  onNavigateToTab: (tab: string) => void;
  students: RosterStudent[];
  currentRole: 'student' | 'teacher';
  loggedInStudent: RosterStudent | null;
  onLoginStudent: (student: RosterStudent) => void;
  onLogoutStudent: () => void;
}

export default function HomeDashboard({ 
  onNavigateToTab, 
  students, 
  currentRole,
  loggedInStudent,
  onLoginStudent,
  onLogoutStudent
}: HomeDashboardProps) {
  // Student Login Form States
  const [loginName, setLoginName] = useState('');
  const [loginClass, setLoginClass] = useState('Class 7');
  const [loginRoll, setLoginRoll] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const activeStudent = loggedInStudent;

  // Mock upcoming classes state
  const [classes] = useState<UpcomingClass[]>([
    {
      id: 'c1',
      subject: 'Mathematics',
      title: 'Calculus Intro',
      startTime: '09:30 AM',
      endTime: '10:30 AM',
      room: 'Room 402',
      borderClass: 'border-indigo-600'
    },
    {
      id: 'c2',
      subject: 'Science',
      title: 'Organic Chem',
      startTime: '10:45 AM',
      endTime: '11:45 AM',
      room: 'Lab 02',
      borderClass: 'border-amber-500'
    },
    {
      id: 'c3',
      subject: 'English',
      title: 'Shakespeare',
      startTime: '12:00 PM',
      endTime: '01:00 PM',
      room: 'Room 105',
      borderClass: 'border-emerald-600'
    }
  ]);

  // Mock homework state with completion toggle
  const [homeworks] = useState<PendingHomework[]>([
    {
      id: 'hw1',
      title: 'Algebraic Expressions',
      subject: 'Mathematics',
      dueDate: 'Due Tomorrow',
      priority: 'High'
    },
    {
      id: 'hw2',
      title: 'Photosynthesis Chart',
      subject: 'Biology',
      dueDate: 'Due in 3 days',
      priority: 'Normal'
    }
  ]);

  const [completedHwIds, setCompletedHwIds] = useState<string[]>([]);

  const handleToggleHomework = (id: string) => {
    if (completedHwIds.includes(id)) {
      setCompletedHwIds(completedHwIds.filter(item => item !== id));
    } else {
      setCompletedHwIds([...completedHwIds, id]);
    }
  };

  const handleStudentLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanName = loginName.trim().toLowerCase();
    const cleanRoll = loginRoll.trim();

    if (!cleanName || !cleanRoll) {
      setLoginError('Please fill in both name and roll number.');
      return;
    }

    const match = students.find(s => 
      s.name.trim().toLowerCase() === cleanName &&
      s.classLevel === loginClass &&
      parseInt(s.rollNo, 10) === parseInt(cleanRoll, 10)
    );

    if (match) {
      onLoginStudent(match);
      setLoginName('');
      setLoginRoll('');
      setLoginError(null);
    } else {
      setLoginError('No matching student profile found. Please contact the administrator or verify Class Level / Roll Number.');
    }
  };

  // If database is completely empty (no students added by admin yet), display a clean welcome panel guiding them to enroll
  if (students.length === 0) {
    return (
      <div className="space-y-6 pb-28">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#1a237e] to-[#3f51b5] text-white p-6 rounded-2xl shadow-md">
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none transform scale-150">
            <GraduationCap size={160} />
          </div>
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-black tracking-tight">BHARAT JUNIOR HIGH SCHOOL</h2>
            <p className="text-sm text-indigo-100 font-light">Centralized Institutional Management Portal</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-amber-950 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Calendar size={12} />
              Session 2026-2027
            </div>
          </div>
        </section>

        {/* Dynamic Empty Slate Notice */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
            <Lock size={28} />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-lg font-extrabold text-[#1a237e]">Institutional Database Empty</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              To guarantee absolute data purity, all default demo data has been cleared. You can now configure this school instance entirely from scratch!
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl max-w-xs mx-auto border border-slate-100 text-left space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Admin Instructions:</p>
            <p className="text-xs font-semibold text-slate-600">
              1. Go to the <span className="font-bold text-[#1a237e]">Profile</span> tab.
            </p>
            <p className="text-xs font-semibold text-slate-600">
              2. Login as Administrator using the secure school passcode.
            </p>
            <p className="text-xs font-semibold text-slate-600">
              3. Manually register students and faculty members.
            </p>
          </div>

          <button 
            onClick={() => onNavigateToTab('profile')}
            className="px-6 py-3 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 mx-auto"
          >
            <PlusCircle size={15} />
            Go to Admin Profile Portal
          </button>
        </section>

        {/* Official School Location Banner */}
        <section className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img 
              alt="Bharat Junior High School Logo" 
              className="h-10 w-10 rounded-md object-contain border border-slate-100 p-0.5" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsJiQ_5hWlgGqY-NeopGUdpWTnSxjXsyRI44SNoKYwRMbzVxPjlh7Vi-35ZYhCHceSBibVa0EUr0_BjFEOLCafGxMpheoAHT-a-wh3KY0gB46qvM0fQZGn32TsY6VaqdUKpV93E1xqwtUAkm6eVPosuZrf2AIUgoHBp34gKObMMvFZ9Ftpurl7Vk_48zEy1b5Yl7nbLkOc6x-rfQ2KaVuOBmYZEaMUidowaKb1eRQ-M3WJ0yiFE8hOmLg"
            />
            <div>
              <h3 className="text-base font-extrabold text-[#1a237e] tracking-tight">BHARAT JUNIOR HIGH SCHOOL</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Affiliated Educational Institution</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 pt-1.5 text-xs text-slate-600 font-medium border-t border-slate-100">
            <div className="flex items-start gap-2">
              <span className="text-[#1a237e] mt-0.5">📍</span>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">School Campus Address</p>
                <p className="text-slate-700 mt-0.5 leading-relaxed">Narayanpur, Rampur, PIN 244901, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (currentRole === 'student' && !activeStudent) {
    return (
      <div className="space-y-6 pb-28">
        {/* Sign In Header */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#1a237e] to-[#3f51b5] text-white p-6 rounded-2xl shadow-md">
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none transform scale-150">
            <GraduationCap size={160} />
          </div>
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-black tracking-tight">BHARAT JUNIOR HIGH SCHOOL</h2>
            <p className="text-sm text-indigo-100 font-light">Student Access Authorization Portal</p>
          </div>
        </section>

        {/* Secure login card */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-5">
          <div className="text-center space-y-1.5 pb-2 border-b border-slate-50">
            <div className="w-12 h-12 bg-indigo-50 text-[#1a237e] rounded-full flex items-center justify-center mx-auto border border-indigo-100">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-extrabold text-[#1a237e]">Student Secure Sign-In</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">
              Please authenticate using your enrolled student credentials to access your academic dashboard.
            </p>
          </div>

          <form onSubmit={handleStudentLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl text-xs font-bold border border-rose-100 leading-relaxed text-center">
                {loginError}
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide px-1">Enrolled Full Name</label>
              <input
                type="text"
                placeholder="e.g. Aryan Rajput"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-xs font-semibold text-slate-800 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Class Level */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide px-1">Class Level</label>
                <select
                  value={loginClass}
                  onChange={(e) => setLoginClass(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-xs font-bold text-slate-700 transition-all"
                >
                  {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Roll Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide px-1">Roll Number</label>
                <input
                  type="text"
                  pattern="\d*"
                  placeholder="e.g. 24"
                  value={loginRoll}
                  onChange={(e) => setLoginRoll(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-xs font-semibold text-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] mt-2"
            >
              Unlock Student Profile
            </button>
          </form>

          {/* Helper details */}
          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-left space-y-2">
            <h4 className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <span>⚠️ Enrollment Notice:</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
              If the administrator has not enrolled you yet, you will not be able to log in. Ask the teacher/admin to register your name, class, and roll number in the active directory roster first.
            </p>
            <button
              type="button"
              onClick={() => onNavigateToTab('profile')}
              className="text-[11px] font-extrabold text-[#1a237e] hover:underline flex items-center gap-1"
            >
              Go to Admin Enrollment Panel &rarr;
            </button>
          </div>
        </section>

        {/* Official School Location Banner */}
        <section className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <img 
              alt="Bharat Junior High School Logo" 
              className="h-10 w-10 rounded-md object-contain border border-slate-100 p-0.5 bg-white" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLsJiQ_5hWlgGqY-NeopGUdpWTnSxjXsyRI44SNoKYwRMbzVxPjlh7Vi-35ZYhCHceSBibVa0EUr0_BjFEOLCafGxMpheoAHT-a-wh3KY0gB46qvM0fQZGn32TsY6VaqdUKpV93E1xqwtUAkm6eVPosuZrf2AIUgoHBp34gKObMMvFZ9Ftpurl7Vk_48zEy1b5Yl7nbLkOc6x-rfQ2KaVuOBmYZEaMUidowaKb1eRQ-M3WJ0yiFE8hOmLg"
            />
            <div>
              <h3 className="text-base font-extrabold text-[#1a237e] tracking-tight">BHARAT JUNIOR HIGH SCHOOL</h3>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Affiliated Educational Institution</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 pt-1.5 text-xs text-slate-600 font-medium border-t border-slate-100">
            <div className="flex items-start gap-2">
              <span className="text-[#1a237e] mt-0.5">📍</span>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">School Campus Address</p>
                <p className="text-slate-700 mt-0.5 leading-relaxed">Narayanpur, Rampur, PIN 244901, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1a237e] to-[#3f51b5] text-white p-6 rounded-2xl shadow-md">
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none transform scale-150">
          <GraduationCap size={160} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Hello, {activeStudent?.name}!</h2>
            <button
              onClick={onLogoutStudent}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1 active:scale-95"
            >
              Sign Out
            </button>
          </div>
          <p className="text-lg text-indigo-100 font-light">{activeStudent?.classLevel}-{activeStudent?.section} • Roll No: {activeStudent?.rollNo}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-amber-950 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
            <Calendar size={14} />
            Academic Session 2026-2027
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* Attendance card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <Calendar size={24} className="text-[#1a237e]" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Attendance</span>
          <span className="text-3xl font-bold text-[#1a237e]">
            {activeStudent?.status === 'present' ? '100%' : '0%'}
          </span>
        </div>

        {/* Current Rank card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <Trophy size={24} className="text-amber-500" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</span>
          <span className={`text-xl font-bold uppercase tracking-wider ${activeStudent?.status === 'present' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {activeStudent?.status}
          </span>
        </div>
      </section>

      {/* Upcoming Classes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1a237e] tracking-tight">Upcoming Classes</h3>
          <button 
            onClick={() => onNavigateToTab('academic')}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            View Timetable
          </button>
        </div>

        {/* Horizontal scrollable slider */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x">
          {classes.map((cls) => (
            <div 
              key={cls.id} 
              className={`min-w-[240px] snap-start bg-white p-5 rounded-2xl border-l-4 ${cls.borderClass} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{cls.subject}</span>
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">{cls.title}</h4>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-slate-400" />
                  <span>{cls.startTime} - {cls.endTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{cls.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Homework */}
      <section className="space-y-3">
        <h3 className="text-xl font-bold text-[#1a237e] tracking-tight">Pending Homework</h3>
        <div className="space-y-3">
          {homeworks.map((hw) => {
            const isCompleted = completedHwIds.includes(hw.id);
            return (
              <div 
                key={hw.id} 
                onClick={() => handleToggleHomework(hw.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCompleted 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${
                  isCompleted 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : hw.priority === 'High' 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-[#e0e0ff] text-[#1a237e]'
                }`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <ClipboardList size={24} />}
                </div>

                <div className="flex-grow">
                  <h4 className={`text-base font-bold tracking-tight transition-all ${
                    isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}>
                    {hw.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {hw.subject} • {hw.dueDate}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800'
                      : hw.priority === 'High' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isCompleted ? 'Done' : hw.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Study Assistant CTA */}
      <section>
        <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-[#1a237e] to-[#3949ab] text-white shadow-lg group hover:shadow-xl transition-all duration-300">
          <div className="absolute -right-8 -bottom-8 opacity-15 transition-transform duration-500 group-hover:scale-110">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 flex flex-col items-start space-y-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-300" />
              AI POWERED
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Stuck on a concept?</h3>
            <p className="text-sm text-indigo-100 max-w-[85%] font-light leading-relaxed">
              Get instant explanations, clear summaries, and personalized practice quizzes with your AI Study Tutor.
            </p>
            <button 
              onClick={() => onNavigateToTab('ai')}
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-200"
            >
              Ask Assistant
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Official School Information & Location Banner */}
      <section className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <img 
            alt="Bharat Junior High School Logo" 
            className="h-10 w-10 rounded-md object-contain border border-slate-100 p-0.5" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLsJiQ_5hWlgGqY-NeopGUdpWTnSxjXsyRI44SNoKYwRMbzVxPjlh7Vi-35ZYhCHceSBibVa0EUr0_BjFEOLCafGxMpheoAHT-a-wh3KY0gB46qvM0fQZGn32TsY6VaqdUKpV93E1xqwtUAkm6eVPosuZrf2AIUgoHBp34gKObMMvFZ9Ftpurl7Vk_48zEy1b5Yl7nbLkOc6x-rfQ2KaVuOBmYZEaMUidowaKb1eRQ-M3WJ0yiFE8hOmLg"
          />
          <div>
            <h3 className="text-base font-extrabold text-[#1a237e] tracking-tight">BHARAT JUNIOR HIGH SCHOOL</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Affiliated Educational Institution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-1.5 text-xs text-slate-600 font-medium border-t border-slate-100">
          <div className="flex items-start gap-2">
            <span className="text-[#1a237e] mt-0.5">📍</span>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">School Campus Address</p>
              <p className="text-slate-700 mt-0.5 leading-relaxed">Narayanpur, Rampur, PIN 244901, Uttar Pradesh, India</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-[#1a237e] mt-0.5">📞</span>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Official Contact Helpline</p>
              <p className="text-slate-700 mt-0.5 font-bold">+91 97593 73728</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
