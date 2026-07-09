/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  className: string;
  section: string;
  rollNo: string;
  academicSession: string;
  attendanceRate: number;
  currentRank: string;
  avatarUrl?: string;
  email: string;
}

export interface UpcomingClass {
  id: string;
  subject: string;
  title: string;
  startTime: string;
  endTime: string;
  room: string;
  borderClass: string;
}

export interface PendingHomework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'High' | 'Normal' | 'Low';
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  icon: string;
}

export interface PaymentTransaction {
  id: string;
  title: string;
  date: string;
  receiptNumber: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface RosterStudent {
  id: string;
  name: string;
  rollNo: string;
  classLevel: string; // e.g. "Class 1" to "Class 10"
  section: string;    // e.g. "A", "B", "C"
  status: 'present' | 'absent';
  avatarUrl: string;
}

export interface RosterTeacher {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface SyllabusItem {
  id: string;
  classLevel: string; // e.g. "Class 6", "Class 7", etc.
  subject: string;
  topic: string;
  chapters: string;
  examWeightage: string;
  description: string;
}

