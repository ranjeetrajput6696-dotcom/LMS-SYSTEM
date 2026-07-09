/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Filter, 
  Award, 
  Hash, 
  BookmarkCheck,
  PlusCircle,
  X,
  FileText
} from 'lucide-react';
import { SyllabusItem } from '../types';

interface SyllabusViewProps {
  syllabusItems: SyllabusItem[];
  onAddSyllabusItem: (item: Omit<SyllabusItem, 'id'>) => void;
  onDeleteSyllabusItem: (id: string) => void;
  isAdminLoggedIn: boolean;
}

export default function SyllabusView({
  syllabusItems,
  onAddSyllabusItem,
  onDeleteSyllabusItem,
  isAdminLoggedIn
}: SyllabusViewProps) {
  // Filter States
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Form states for adding new syllabus (Admin Only)
  const [isAdding, setIsAdding] = useState(false);
  const [classLevel, setClassLevel] = useState('Class 7');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [chapters, setChapters] = useState('');
  const [examWeightage, setExamWeightage] = useState('');
  const [description, setDescription] = useState('');

  // Toast / Form feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Available classes and subjects based on existing data + standard list
  const classesList = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const subjectsList = ['All', 'Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setFormError('Topic title is required.');
      return;
    }
    if (!chapters.trim()) {
      setFormError('Please specify chapters covered.');
      return;
    }
    if (!description.trim()) {
      setFormError('Syllabus description is required.');
      return;
    }

    onAddSyllabusItem({
      classLevel,
      subject,
      topic: topic.trim(),
      chapters: chapters.trim(),
      examWeightage: examWeightage.trim() || 'General Weightage',
      description: description.trim()
    });

    // Reset Form
    setTopic('');
    setChapters('');
    setExamWeightage('');
    setDescription('');
    setFormError(null);
    setIsAdding(false);
  };

  // Filtered syllabus items list
  const filteredItems = syllabusItems.filter(item => {
    const matchClass = selectedClass === 'All' || item.classLevel === selectedClass;
    const matchSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    return matchClass && matchSubject;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#1a237e] tracking-tight flex items-center gap-2">
            <BookOpen size={20} className="text-[#1a237e]" />
            <span>Academic Curriculum & Syllabus</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Authorized lesson plans, topics, and term weightages for BHARAT JUNIOR HIGH SCHOOL.
          </p>
        </div>

        {isAdminLoggedIn && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full md:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus size={16} />
            Add Syllabus Entry
          </button>
        )}
      </div>

      {/* Admin Add Syllabus Modal-like Collapse Form */}
      {isAdminLoggedIn && isAdding && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <PlusCircle size={18} className="text-emerald-600" />
              <span>Create New Syllabus Assignment</span>
            </h4>
            <button 
              type="button" 
              onClick={() => { setIsAdding(false); setFormError(null); }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
            >
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold border border-rose-100">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Class Level</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-bold text-slate-700"
              >
                {classesList.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-bold text-slate-700"
              >
                {subjectsList.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Topic Name</label>
              <input
                type="text"
                placeholder="e.g. Quadratic Equations, Cellular Respiration"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Chapters Covered */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Chapters Covered</label>
              <input
                type="text"
                placeholder="e.g. Chapter 4 & 5, Unit 2"
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Exam Weightage */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Exam Weightage / Grading Scheme</label>
              <input
                type="text"
                placeholder="e.g. 25% Midterm, 10% Homework Assignment"
                value={examWeightage}
                onChange={(e) => setExamWeightage(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Description Details */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">Detailed Objectives & Syllabus Outlines</label>
              <textarea
                rows={3}
                placeholder="Describe key learning outcomes, important questions, and reference materials..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none text-xs font-semibold text-slate-800 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => { setIsAdding(false); setFormError(null); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Save Syllabus Details
            </button>
          </div>
        </form>
      )}

      {/* Live Interactive Filters */}
      <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
        <div className="flex items-center gap-2 text-slate-500 flex-shrink-0">
          <Filter size={16} />
          <span className="text-xs font-extrabold uppercase tracking-wider">Filter Syllabus:</span>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          {/* Class Filter */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-slate-700 appearance-none focus:border-[#1a237e]"
            >
              {classesList.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-3 text-slate-400 pointer-events-none">
              <Filter size={12} />
            </div>
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-slate-700 appearance-none focus:border-[#1a237e]"
            >
              {subjectsList.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-3 text-slate-400 pointer-events-none">
              <Filter size={12} />
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
              <FileText size={22} />
            </div>
            <div className="max-w-xs mx-auto space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800">No Syllabus Items Found</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                There are no syllabus details uploaded for {selectedClass === 'All' ? 'this class' : selectedClass} under the {selectedSubject === 'All' ? 'selected' : selectedSubject} category.
              </p>
            </div>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all space-y-3 relative overflow-hidden group"
            >
              {/* Badge row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-50">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-indigo-50 text-[#1a237e] text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                    {item.classLevel}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                    {item.subject}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    <Hash size={11} />
                    <span>{item.chapters}</span>
                  </div>

                  {isAdminLoggedIn && (
                    <div className="flex items-center">
                      {deletingId === item.id ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn bg-rose-50 border border-rose-100 rounded-lg px-2 py-0.5">
                          <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-wider">Delete?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteSyllabusItem(item.id);
                              setDeletingId(null);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded transition-all"
                            title="Yes, Delete"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded transition-all"
                            title="Cancel"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Syllabus Entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Main content */}
              <div className="space-y-1.5">
                <h4 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <BookmarkCheck size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{item.topic}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Exam weightage footnote */}
              {item.examWeightage && (
                <div className="flex items-center gap-1.5 pt-2.5 mt-2 border-t border-slate-50 text-[11px] text-[#1a237e] font-bold bg-indigo-50/40 p-2 rounded-xl">
                  <Award size={13} className="text-[#1a237e]" />
                  <span>Exam Weightage:</span>
                  <span className="text-slate-600 font-semibold">{item.examWeightage}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
