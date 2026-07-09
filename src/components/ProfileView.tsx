/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Award, 
  BookOpen, 
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  Users,
  GraduationCap,
  Lock,
  Unlock,
  Trash2,
  KeyRound,
  LogOut
} from 'lucide-react';
import { RosterStudent, RosterTeacher } from '../types';

interface ProfileViewProps {
  currentRole: 'student' | 'teacher';
  onToggleRole: () => void;
  students: RosterStudent[];
  onAddStudent: (newStudent: Omit<RosterStudent, 'id' | 'status' | 'avatarUrl'>) => void;
  teachers: RosterTeacher[];
  onAddTeacher: (newTeacher: Omit<RosterTeacher, 'id' | 'avatarUrl'>) => void;
  onClearAllData: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  loggedInStudent: RosterStudent | null;
  onLogoutStudent: () => void;
}

export default function ProfileView({ 
  currentRole, 
  onToggleRole,
  students,
  onAddStudent,
  teachers,
  onAddTeacher,
  onClearAllData,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  loggedInStudent,
  onLogoutStudent
}: ProfileViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local administrative states
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Admin section states
  const [adminTab, setAdminTab] = useState<'student' | 'teacher'>('student');
  
  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentClass, setStudentClass] = useState('Class 1');
  const [studentSection, setStudentSection] = useState('A');

  // Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [teacherDept, setTeacherDept] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('9759373728');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcodeInput.trim();
    if (cleanPass === '244901' || cleanPass === 'admin123') {
      setIsAdminLoggedIn(true);
      setPasscodeError(null);
      setPasscodeInput('');
      triggerToast("Admin portal unlocked successfully!");
    } else {
      setPasscodeError("Invalid administration passcode. Please check instructions.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    triggerToast("Logged out of Admin Portal.");
  };

  const handleClearDatabase = () => {
    if (window.confirm("Are you absolutely sure you want to delete all students, teachers, and clear all local storage roster databases? This cannot be undone.")) {
      onClearAllData();
      triggerToast("All institutional roster data cleared successfully!");
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRoll.trim()) {
      triggerToast("Please fill in all student details!");
      return;
    }
    
    onAddStudent({
      name: studentName.trim(),
      rollNo: studentRoll.trim().padStart(2, '0'),
      classLevel: studentClass,
      section: studentSection
    });

    triggerToast(`Successfully enrolled ${studentName} to ${studentClass}-${studentSection}!`);
    setStudentName('');
    setStudentRoll('');
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !teacherDept.trim()) {
      triggerToast("Please fill in all teacher details!");
      return;
    }

    onAddTeacher({
      name: teacherName.trim(),
      department: teacherDept.trim(),
      email: teacherEmail.trim() || `${teacherName.toLowerCase().replace(/\s+/g, '')}@bharatschool.com`,
      phone: teacherPhone.trim() || '9759373728'
    });

    triggerToast(`Successfully registered instructor ${teacherName}!`);
    setTeacherName('');
    setTeacherDept('');
    setTeacherEmail('');
    setTeacherPhone('9759373728');
  };

  return (
    <div className="space-y-6 pb-28 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a237e] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold tracking-wide border border-indigo-400/20">
          <CheckCircle size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Profile Summary */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
        {/* Monogram initials badge */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3949ab] text-white flex items-center justify-center text-3xl font-bold shadow-md">
          {currentRole === 'student' ? (
            loggedInStudent ? loggedInStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'
          ) : 'AL'}
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#1a237e] tracking-tight">
            {currentRole === 'student' ? (
              loggedInStudent ? loggedInStudent.name : 'No Enrolled Session'
            ) : 'Prof. Alex Mercer'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {currentRole === 'student' ? (
              loggedInStudent ? `Class ${loggedInStudent.classLevel}-${loggedInStudent.section} • Roll No: ${loggedInStudent.rollNo}` : 'Please log in on the Home tab'
            ) : 'Department of Physics • Head Instructor'}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentRole.toUpperCase()} PORTAL
          </span>
          {currentRole === 'student' && loggedInStudent && (
            <button
              onClick={onLogoutStudent}
              className="block mt-3 px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all mx-auto active:scale-95"
            >
              Sign Out Student Session
            </button>
          )}
        </div>
      </section>

      {/* Official School Admin Panel (Interactive registration) */}
      <section className="bg-white rounded-2xl p-6 shadow-md border-2 border-indigo-50 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold text-[#1a237e] flex items-center gap-1.5">
              <span>🏫 Admin Roster Management</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Enroll students and register faculty</p>
          </div>
          <span className="text-[10px] bg-indigo-100 text-[#1a237e] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Admin Mode
          </span>
        </div>

        {!isAdminLoggedIn ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
              <div className="w-10 h-10 bg-[#1a237e]/10 text-[#1a237e] rounded-full flex items-center justify-center mx-auto">
                <Lock size={18} />
              </div>
              <h4 className="text-sm font-extrabold text-[#1a237e]">Administrative Lock Active</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Authorized staff only. Enter the secure school passcode to unlock enrollment controls, clear registers, or register new faculty.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Institutional Admin Passcode</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all pl-9"
                />
                <KeyRound size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
              {passcodeError && (
                <p className="text-[10px] text-rose-600 font-bold mt-1 px-1">{passcodeError}</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full h-11 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Unlock size={14} />
              Authenticate & Unlock Admin Panel
            </button>
          </form>
        ) : (
          <>
            {/* Authenticated header indicators with database action controls */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Unlock size={14} className="animate-bounce" /> Portal Unlocked
              </span>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleClearDatabase}
                  className="px-2.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all"
                  title="Wipe database rosters"
                >
                  <Trash2 size={12} /> Wipe All Records
                </button>
                <button 
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all"
                >
                  <LogOut size={12} /> Lock Panel
                </button>
              </div>
            </div>

            {/* Dynamic metrics */}
            <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Students Enrolled</p>
                <p className="text-xl font-extrabold text-slate-800">{students.length}</p>
              </div>
              <div className="text-center border-l border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Faculty</p>
                <p className="text-xl font-extrabold text-slate-800">{teachers.length}</p>
              </div>
            </div>

            {/* Form selection tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button 
                type="button"
                onClick={() => setAdminTab('student')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  adminTab === 'student' 
                    ? 'bg-white text-[#1a237e] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                + Add New Student
              </button>
              
              <button 
                type="button"
                onClick={() => setAdminTab('teacher')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  adminTab === 'teacher' 
                    ? 'bg-white text-[#1a237e] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                + Add New Teacher
              </button>
            </div>

            {/* Form Bodies */}
            {adminTab === 'student' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Full Student Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Rajput" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Roll Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 25" 
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Section</label>
                    <select 
                      value={studentSection}
                      onChange={(e) => setStudentSection(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Class Level (Strictly 1st to 10th)</label>
                  <select 
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                  >
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full h-11 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <PlusCircle size={15} />
                  Add Student to {studentClass} Roster
                </button>
              </form>
            ) : (
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Full Faculty Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Ramesh Kumar" 
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Department / Subject Specialty</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Social Science, Mathematics, English" 
                    value={teacherDept}
                    onChange={(e) => setTeacherDept(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="ramesh@bharatschool.com" 
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Helpline Phone (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="9759373728" 
                      value={teacherPhone}
                      onChange={(e) => setTeacherPhone(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 focus:border-[#1a237e] rounded-xl outline-none text-sm font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <PlusCircle size={15} />
                  Register Faculty Member
                </button>
              </form>
            )}
          </>
        )}
      </section>

      {/* Directory Viewer */}
      {isAdminLoggedIn && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-base font-extrabold text-[#1a237e] flex items-center gap-1.5">
            <Users size={18} />
            <span>Active Directories</span>
          </h3>
          
          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {adminTab === 'student' ? (
              students.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No students enrolled yet.</p>
              ) : (
                students.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-xs font-black">
                        {s.avatarUrl}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{s.classLevel} • Sec {s.section} • Roll: {s.rollNo}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      s.status === 'present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))
              )
            ) : (
              teachers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No teachers registered yet.</p>
              ) : (
                teachers.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                        {t.avatarUrl}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{t.department} Specialty</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-bold">{t.phone}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{t.email}</p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </section>
      )}

      {/* Official Contact & Institutional Map Info */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-base font-extrabold text-[#1a237e]">Campus Location & Contacts</h3>
        
        <div className="space-y-3.5 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-[#1a237e]" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Official Email Address</p>
              <p className="font-semibold text-slate-800">
                contact@bharatjuniorhigh.edu.in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} className="text-[#1a237e]" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Official Contact Helpline</p>
              <p className="font-semibold text-[#1a237e] text-base">+91 97593 73728</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-[#1a237e]" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Institution Physical Address</p>
              <p className="font-semibold text-slate-800 leading-relaxed">
                Narayanpur, Rampur, PIN 244901, Uttar Pradesh, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Academic Grades overview (Only shown for Student view) */}
      {currentRole === 'student' && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-[#1a237e]">Academic Record (Grade Card)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 flex items-center gap-3">
              <BookOpen size={20} className="text-indigo-700" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">Mathematics</p>
                <p className="text-xl font-black text-[#1a237e]">A+ (96%)</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 flex items-center gap-3">
              <Award size={20} className="text-amber-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">Science</p>
                <p className="text-xl font-black text-amber-600">A (91%)</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 flex items-center gap-3">
              <Award size={20} className="text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">English Lit.</p>
                <p className="text-xl font-black text-emerald-700">A- (88%)</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 flex items-center gap-3">
              <ShieldAlert size={20} className="text-rose-500" />
              <div>
                <p className="text-xs text-slate-500 font-semibold">Overall CGPA</p>
                <p className="text-xl font-black text-rose-700">9.2 / 10</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
