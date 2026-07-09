/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Bot, 
  CreditCard, 
  User as UserIcon, 
  Bell, 
  Search,
  School,
  Sparkles,
  Lock,
  Calendar
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Import our custom modular screens
import HomeDashboard from './components/HomeDashboard';
import FeeManagement from './components/FeeManagement';
import AITutor from './components/AITutor';
import MarkAttendance from './components/MarkAttendance';
import ProfileView from './components/ProfileView';
import SyllabusView from './components/SyllabusView';

// Import correct types
import { RosterStudent, RosterTeacher, SyllabusItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher'>('student');
  const [showSearchAlert, setShowSearchAlert] = useState<boolean>(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState<boolean>(false);

  // Stateful list of students with local storage persistence
  const [students, setStudents] = useState<RosterStudent[]>(() => {
    const saved = localStorage.getItem('bharat_students_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored students", e);
      }
    }
    // Set default empty array as requested to remove default data
    return [];
  });

  // Stateful list of teachers with local storage persistence
  // Stateful list of teachers with local storage persistence
  const [teachers, setTeachers] = useState<RosterTeacher[]>(() => {
    const saved = localStorage.getItem('bharat_teachers_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored teachers", e);
      }
    }
    // Set default empty array as requested to remove default data
    return [];
  });

  // Admin authentication state hoisted to top-level
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('bharat_admin_logged_v3') === 'true';
  });

  // Stateful logged-in student state
  const [loggedInStudent, setLoggedInStudent] = useState<RosterStudent | null>(() => {
    const saved = localStorage.getItem('bharat_logged_in_student_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored logged-in student", e);
      }
    }
    return null;
  });

  const handleLoginStudent = (student: RosterStudent) => {
    setLoggedInStudent(student);
    localStorage.setItem('bharat_logged_in_student_v3', JSON.stringify(student));
  };

  const handleLogoutStudent = () => {
    setLoggedInStudent(null);
    localStorage.removeItem('bharat_logged_in_student_v3');
  };

  const handleAdminLoginStateChange = (loggedIn: boolean) => {
    setIsAdminLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem('bharat_admin_logged_v3', 'true');
    } else {
      localStorage.removeItem('bharat_admin_logged_v3');
    }
  };

  // If the admin is logged out, secure role-based restrictions by resetting currentRole to student
  useEffect(() => {
    if (!isAdminLoggedIn && currentRole === 'teacher') {
      setCurrentRole('student');
    }
  }, [isAdminLoggedIn, currentRole]);

  // Security: Auto-logout current student session if they are deleted or database is cleared
  useEffect(() => {
    if (loggedInStudent) {
      const exists = students.find(s => s.id === loggedInStudent.id);
      if (!exists) {
        setLoggedInStudent(null);
        localStorage.removeItem('bharat_logged_in_student_v3');
      }
    }
  }, [students, loggedInStudent]);

  // Stateful syllabus entries with local storage persistence and elegant initial defaults
  const [syllabusItems, setSyllabusItems] = useState<SyllabusItem[]>(() => {
    const saved = localStorage.getItem('bharat_syllabus_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored syllabus items", e);
      }
    }
    // High-quality defaults
    return [
      {
        id: 'sb1',
        classLevel: 'Class 7',
        subject: 'Mathematics',
        topic: 'Integers & Fractions',
        chapters: 'Chapters 1 to 3',
        examWeightage: '25% Midterm, 10% Periodic',
        description: 'Properties of addition, subtraction, multiplication, and division of integers. Fractions and decimals basics, multiplication and division of fractional numbers.'
      },
      {
        id: 'sb2',
        classLevel: 'Class 7',
        subject: 'Science',
        topic: 'Nutrition & Heat',
        chapters: 'Chapters 1, 2 & 4',
        examWeightage: '20% Midterm, 15% Final Exam',
        description: 'Mode of nutrition in plants, photosynthesis. Digestion in humans, grass-eating animals, and amoeba. Concept of temperature, conduction, convection, and radiation.'
      },
      {
        id: 'sb3',
        classLevel: 'Class 8',
        subject: 'Mathematics',
        topic: 'Linear Equations in One Variable',
        chapters: 'Chapter 2',
        examWeightage: '15% Midterm, 20% Annual Exam',
        description: 'Solving linear equations with variables on one side and both sides. Real-word applications and reduction of equations to simpler forms.'
      },
      {
        id: 'sb4',
        classLevel: 'Class 9',
        subject: 'Science',
        topic: 'Matter in Our Surroundings & Atoms',
        chapters: 'Chapters 1 & 3',
        examWeightage: '30% Annual Exam, 10% Midterm',
        description: 'Physical nature of matter, characteristics of particles, states of matter, and chemical laws of combination.'
      }
    ];
  });

  // Handler to clear all data
  const handleClearAllData = () => {
    setStudents([]);
    setTeachers([]);
    setSyllabusItems([]);
    setLoggedInStudent(null);
    localStorage.removeItem('bharat_students_v3');
    localStorage.removeItem('bharat_teachers_v3');
    localStorage.removeItem('bharat_syllabus_v3');
    localStorage.removeItem('bharat_logged_in_student_v3');
  };

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem('bharat_students_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bharat_teachers_v3', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('bharat_syllabus_v3', JSON.stringify(syllabusItems));
  }, [syllabusItems]);

  const handleAddSyllabusItem = (newItem: Omit<SyllabusItem, 'id'>) => {
    const item: SyllabusItem = {
      ...newItem,
      id: `sb-${Date.now()}`
    };
    setSyllabusItems(prev => [...prev, item]);
  };

  const handleDeleteSyllabusItem = (id: string) => {
    setSyllabusItems(prev => prev.filter(item => item.id !== id));
  };

  // Handler to add a student dynamically via the Admin console
  const handleAddStudent = (newStudent: Omit<RosterStudent, 'id' | 'status' | 'avatarUrl'>) => {
    const student: RosterStudent = {
      ...newStudent,
      id: `s-${Date.now()}`,
      status: 'present',
      avatarUrl: newStudent.name.charAt(0).toUpperCase()
    };
    setStudents(prev => [...prev, student]);
  };

  // Handler to add a teacher dynamically via the Admin console
  const handleAddTeacher = (newTeacher: Omit<RosterTeacher, 'id' | 'avatarUrl'>) => {
    const teacher: RosterTeacher = {
      ...newTeacher,
      id: `t-${Date.now()}`,
      avatarUrl: newTeacher.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    };
    setTeachers(prev => [...prev, teacher]);
  };

  // Handler to toggle student attendance status
  const handleToggleAttendance = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'present' ? 'absent' : 'present'
        };
      }
      return s;
    }));
  };

  // Handler to mark all students present for a specific class level
  const handleMarkAllPresent = (classLevel: string) => {
    setStudents(prev => prev.map(s => {
      if (s.classLevel === classLevel) {
        return {
          ...s,
          status: 'present'
        };
      }
      return s;
    }));
  };

  // Toggle user role handler
  const handleToggleRole = () => {
    setCurrentRole(prev => prev === 'student' ? 'teacher' : 'student');
  };

  // Switch tab from inside child components
  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans select-none max-w-none md:max-w-7xl mx-auto md:shadow-2xl relative md:border-x border-slate-200/50">
      
      {/* Left Sidebar for Laptop/Desktop layout */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0 z-30">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
          <img 
            alt="Bharat Junior High School Logo" 
            className="h-9 w-9 rounded-md object-contain border border-slate-100 p-0.5 bg-white" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLsJiQ_5hWlgGqY-NeopGUdpWTnSxjXsyRI44SNoKYwRMbzVxPjlh7Vi-35ZYhCHceSBibVa0EUr0_BjFEOLCafGxMpheoAHT-a-wh3KY0gB46qvM0fQZGn32TsY6VaqdUKpV93E1xqwtUAkm6eVPosuZrf2AIUgoHBp34gKObMMvFZ9Ftpurl7Vk_48zEy1b5Yl7nbLkOc6x-rfQ2KaVuOBmYZEaMUidowaKb1eRQ-M3WJ0yiFE8hOmLg"
          />
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wider text-[#1a237e] uppercase leading-none">BHARAT SCHOOL</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">LMS & ERP SYSTEM</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {/* Home */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'home' 
                ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <HomeIcon size={18} className={activeTab === 'home' ? 'text-amber-400' : ''} />
            <span className="tracking-wider">HOME PORTAL</span>
          </button>

          {/* Academic */}
          <button 
            onClick={() => setActiveTab('academic')}
            className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'academic' 
                ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <BookOpen size={18} className={activeTab === 'academic' ? 'text-amber-400' : ''} />
            <span className="tracking-wider">ACADEMIC LOG</span>
          </button>

          {/* Attendance */}
          {isAdminLoggedIn && (
            <button 
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'attendance' 
                  ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Calendar size={18} className={activeTab === 'attendance' ? 'text-amber-400' : ''} />
              <span className="tracking-wider">MARK ATTENDANCE</span>
            </button>
          )}

          {/* AI Tutor */}
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'ai' 
                ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Bot size={18} className={activeTab === 'ai' ? 'text-amber-400' : ''} />
            <span className="tracking-wider">AI TUTOR ASSIST</span>
          </button>

          {/* Payments */}
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'payments' 
                ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <CreditCard size={18} className={activeTab === 'payments' ? 'text-amber-400' : ''} />
            <span className="tracking-wider">FEE MANAGEMENT</span>
          </button>

          {/* Profile */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-900/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <UserIcon size={18} className={activeTab === 'profile' ? 'text-amber-400' : ''} />
            <span className="tracking-wider">USER PROFILE</span>
          </button>
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          {loggedInStudent ? (
            <div className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-xs font-extrabold">
                {loggedInStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-extrabold text-slate-800 truncate leading-tight">{loggedInStudent.name}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{loggedInStudent.classLevel}</p>
              </div>
            </div>
          ) : (
            <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide">No Enrolled Session</span>
            </div>
          )}
          <div className="text-[10px] text-slate-400 text-center font-bold">
            © 2026 Bharat Junior High
          </div>
        </div>
      </aside>

      {/* Main Inner Content Area - Cozy centered on mobile, full width on laptop */}
      <div className="flex-1 flex flex-col min-h-screen max-w-lg md:max-w-none w-full mx-auto bg-slate-50 relative overflow-x-hidden">
      
      {/* Top Application Header Bar */}
      <header className="sticky top-0 left-0 w-full z-40 flex items-center justify-between px-5 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {/* Official Hotlinked Bharat School Logo */}
          <img 
            alt="Bharat Junior High School Logo" 
            className="h-9 w-9 rounded-md object-contain border border-slate-100 p-0.5 bg-white" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLsJiQ_5hWlgGqY-NeopGUdpWTnSxjXsyRI44SNoKYwRMbzVxPjlh7Vi-35ZYhCHceSBibVa0EUr0_BjFEOLCafGxMpheoAHT-a-wh3KY0gB46qvM0fQZGn32TsY6VaqdUKpV93E1xqwtUAkm6eVPosuZrf2AIUgoHBp34gKObMMvFZ9Ftpurl7Vk_48zEy1b5Yl7nbLkOc6x-rfQ2KaVuOBmYZEaMUidowaKb1eRQ-M3WJ0yiFE8hOmLg"
          />
          <h1 className="text-xl font-extrabold tracking-tight text-[#1a237e]">
            {activeTab === 'home' && 'BHARAT JUNIOR HIGH SCHOOL'}
            {activeTab === 'academic' && 'Academic Log'}
            {activeTab === 'attendance' && 'Mark Attendance'}
            {activeTab === 'ai' && 'AI Tutor'}
            {activeTab === 'payments' && 'Fee Management'}
            {activeTab === 'profile' && 'User Profile'}
          </h1>
        </div>

        {/* Action icons: Search & Notifications */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => {
              setShowSearchAlert(true);
              setTimeout(() => setShowSearchAlert(false), 2500);
            }}
            className="p-2 rounded-full hover:bg-slate-50 active:scale-90 transition-all text-slate-500 relative"
            title="Search records"
          >
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => {
              setShowNotificationAlert(true);
              setTimeout(() => setShowNotificationAlert(false), 2500);
            }}
            className="p-2 rounded-full hover:bg-slate-50 active:scale-90 transition-all text-slate-500 relative"
            title="Notifications"
          >
            <Bell size={20} />
            {/* Soft pulsing green badge for high attention */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </header>

      {/* Floating Action Alerts */}
      <AnimatePresence>
        {showSearchAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 z-50 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Search size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Search ERP</p>
              <p className="text-sm font-bold text-slate-800">Global institutional search loaded.</p>
            </div>
          </motion.div>
        )}

        {showNotificationAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-4 right-4 z-50 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl animate-pulse">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Alert Updates</p>
              <p className="text-sm font-bold text-slate-800">
                {currentRole === 'student' 
                  ? 'Midterm prep schedules are now live.' 
                  : 'Bharat Faculty roster and attendance is active.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Main Screen Container */}
      <main className="flex-grow px-5 md:px-8 pt-5 pb-24 md:pb-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${currentRole}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'home' && (
              <HomeDashboard 
                onNavigateToTab={handleNavigateToTab} 
                students={students} 
                currentRole={currentRole}
                loggedInStudent={loggedInStudent}
                onLoginStudent={handleLoginStudent}
                onLogoutStudent={handleLogoutStudent}
              />
            )}

            {activeTab === 'academic' && (
              !loggedInStudent && !isAdminLoggedIn ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 max-w-sm mx-auto my-8">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-800">Syllabus Access Locked</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      To view authorized curriculum plans and exam schedules, please log in with your student credentials on the home tab, or unlock as Administrator / Faculty on the profile tab first.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-5 py-2.5 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Go to Home Login Portal
                  </button>
                </div>
              ) : (
                <SyllabusView 
                  syllabusItems={syllabusItems}
                  onAddSyllabusItem={handleAddSyllabusItem}
                  onDeleteSyllabusItem={handleDeleteSyllabusItem}
                  isAdminLoggedIn={isAdminLoggedIn}
                />
              )
            )}

            {activeTab === 'attendance' && (
              <MarkAttendance 
                students={students}
                onToggleAttendance={handleToggleAttendance}
                onMarkAllPresent={handleMarkAllPresent}
              />
            )}

            {activeTab === 'ai' && (
              !loggedInStudent && !isAdminLoggedIn ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 max-w-sm mx-auto my-8">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-800">AI Tutor Locked</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Get personalized practice quizzes and study help. Log in with your student profile on the home tab, or unlock as Administrator / Faculty on the profile tab to start chatting with AI.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-5 py-2.5 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Go to Home Login Portal
                  </button>
                </div>
              ) : (
                <AITutor />
              )
            )}

            {activeTab === 'payments' && (
              !loggedInStudent && !isAdminLoggedIn ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 max-w-sm mx-auto my-8">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-800">Fee Ledgers Locked</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Review outstanding balances, fee breakdowns, and download receipts securely after logging in with your enrolled student profile, or unlock as Administrator / Faculty.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-5 py-2.5 bg-[#1a237e] hover:bg-indigo-900 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Go to Home Login Portal
                  </button>
                </div>
              ) : (
                <FeeManagement />
              )
            )}

            {activeTab === 'profile' && (
              <ProfileView 
                currentRole={currentRole} 
                onToggleRole={handleToggleRole}
                students={students}
                onAddStudent={handleAddStudent}
                teachers={teachers}
                onAddTeacher={handleAddTeacher}
                onClearAllData={handleClearAllData}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={handleAdminLoginStateChange}
                loggedInStudent={loggedInStudent}
                onLogoutStudent={handleLogoutStudent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 max-w-lg w-full z-40 flex justify-around items-center px-1 pb-safe h-16 bg-white border-t border-slate-100 rounded-t-2xl shadow-2xl">
        {/* Home Tab */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            activeTab === 'home' 
              ? 'text-amber-500 scale-105' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <HomeIcon size={20} className={activeTab === 'home' ? 'fill-amber-500/10' : ''} />
          <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Home</span>
        </button>

        {/* Academic Tab */}
        <button 
          onClick={() => setActiveTab('academic')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            activeTab === 'academic' 
              ? 'text-amber-500 scale-105' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen size={20} className={activeTab === 'academic' ? 'fill-amber-500/10' : ''} />
          <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">
            Academic
          </span>
        </button>

        {/* Attendance Tab (Only shown if admin is logged in) */}
        {isAdminLoggedIn && (
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
              activeTab === 'attendance' 
                ? 'text-amber-500 scale-105' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar size={20} className={activeTab === 'attendance' ? 'fill-amber-500/10' : ''} />
            <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">
              Attendance
            </span>
          </button>
        )}

        {/* AI Tab */}
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            activeTab === 'ai' 
              ? 'text-amber-500 scale-105' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-0.5 rounded-full transition-all ${
            activeTab === 'ai' ? 'bg-amber-100 text-amber-600 shadow-sm' : ''
          }`}>
            <Bot size={20} className={activeTab === 'ai' ? 'fill-amber-500/10' : ''} />
          </div>
          <span className="text-[9px] font-bold mt-0.5 tracking-wider uppercase">AI Tutor</span>
        </button>

        {/* Payments Tab */}
        <button 
          onClick={() => setActiveTab('payments')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            activeTab === 'payments' 
              ? 'text-amber-500 scale-105' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard size={20} className={activeTab === 'payments' ? 'fill-amber-500/10' : ''} />
          <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Payments</span>
        </button>

        {/* Profile Tab */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            activeTab === 'profile' 
              ? 'text-amber-500 scale-105' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <UserIcon size={20} className={activeTab === 'profile' ? 'fill-amber-500/10' : ''} />
          <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">Profile</span>
        </button>
      </nav>
      </div> {/* closing the main inner content area */}
    </div>
  );
}
