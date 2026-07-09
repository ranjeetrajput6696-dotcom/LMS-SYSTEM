/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  BookmarkCheck,
  Search
} from 'lucide-react';
import { RosterStudent } from '../types';

interface MarkAttendanceProps {
  students: RosterStudent[];
  onToggleAttendance: (id: string) => void;
  onMarkAllPresent: (classLevel: string) => void;
}

export default function MarkAttendance({ 
  students, 
  onToggleAttendance, 
  onMarkAllPresent 
}: MarkAttendanceProps) {
  const [selectedClass, setSelectedClass] = useState<string>('Class 8');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Filter roster by selected Class Level (Classes 1st to 10th)
  const classStudents = students.filter(s => s.classLevel === selectedClass);

  // Stats calculation based on filtered class students
  const totalStudentsCount = classStudents.length;
  const presentCount = classStudents.filter(s => s.status === 'present').length;
  const absentCount = totalStudentsCount - presentCount;

  const handleMarkAllPresent = () => {
    onMarkAllPresent(selectedClass);
  };

  const handleSubmitAttendance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1800);
  };

  // Filter by search query
  const filteredStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-36 relative">
      {/* Toast Feedback */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a237e] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold tracking-wide border border-indigo-400/20">
          <BookmarkCheck size={18} className="text-emerald-400" />
          <span>Attendance submitted successfully for {selectedClass}!</span>
        </div>
      )}

      {/* Header & Description */}
      <div className="space-y-1 mt-2">
        <h2 className="text-lg font-bold text-[#1a237e]">BHARAT JUNIOR HIGH SCHOOL</h2>
        <p className="text-xs text-slate-500 font-medium">Class 1st to 10th Official Attendance Gateway</p>
      </div>

      {/* Controls: dropdown class selector and date picker */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Class Selection - Strictly Class 1 to 10 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase px-1">Class Level (1st to 10th)</label>
          <div className="relative">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-14 pl-4 pr-10 bg-white border border-slate-200 focus:border-[#1a237e] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-medium text-slate-800 transition-all appearance-none"
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
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold">
              ▼
            </div>
          </div>
        </div>

        {/* Date selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase px-1">Date</label>
          <div className="relative">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-14 px-4 bg-white border border-slate-200 focus:border-[#1a237e] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 font-medium text-slate-800 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Tonal Layered Summary Stats Bar */}
      <section className="bg-[#f3f3f3] rounded-2xl p-5 flex justify-between items-center shadow-sm border border-slate-100">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered</span>
          <span className="text-3xl font-bold text-[#1a237e]">{totalStudentsCount}</span>
        </div>
        
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present</span>
            <span className="text-3xl font-bold text-emerald-600">{presentCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent</span>
            <span className="text-3xl font-bold text-rose-600">{absentCount}</span>
          </div>
        </div>
      </section>

      {/* Roster student list section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <h2 className="text-base font-bold text-[#1a237e] flex items-center gap-1.5">
            <span>Roster List ({selectedClass})</span>
            <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
              {filteredStudents.length} Students
            </span>
          </h2>
          
          <div className="flex items-center gap-3">
            {/* Roster Search bar */}
            <div className="relative flex-grow sm:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search roll / name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-3 py-1.5 bg-white border border-slate-200 focus:border-[#1a237e] rounded-full text-xs font-semibold text-slate-800 outline-none"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {totalStudentsCount > 0 && (
              <button 
                onClick={handleMarkAllPresent}
                className="text-xs font-bold text-indigo-700 hover:underline flex-shrink-0"
              >
                Mark All Present
              </button>
            )}
          </div>
        </div>

        {totalStudentsCount === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="text-3xl">👨‍🎓</div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-700 text-sm">No Students Registered yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                There are no students added to <strong>{selectedClass}</strong> yet. Register students using the Admin panel in the <strong>Profile</strong> tab.
              </p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No students match your search filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const isPresent = student.status === 'present';
              return (
                <div 
                  key={student.id} 
                  className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Stable Alphabet Monogram Initial Avatars */}
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-lg shadow-inner ${
                      isPresent ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {student.avatarUrl}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 tracking-tight">{student.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Roll No: {student.rollNo} • Sec {student.section}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold tracking-wide transition-colors ${
                      isPresent ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isPresent ? 'Present' : 'Absent'}
                    </span>

                    {/* Accessible attendance toggle switch */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={isPresent}
                        onChange={() => onToggleAttendance(student.id)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-100 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-700"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sticky Bottom Action Submission Bar */}
      {totalStudentsCount > 0 && (
        <div className="fixed bottom-16 left-0 w-full px-6 py-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 flex justify-center">
          <button 
            onClick={handleSubmitAttendance}
            disabled={isSubmitting}
            className="w-full max-w-xl h-14 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-400 text-amber-950 font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting Attendance to Cloud ERP...
              </>
            ) : (
              <>
                <BookmarkCheck size={18} />
                Submit Attendance ({selectedClass})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
