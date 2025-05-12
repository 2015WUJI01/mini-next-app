import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Problem, User, Submission, StudyMode } from '../types';

interface QuizDB extends DBSchema {
  problems: {
    key: string;
    value: Problem;
  };
  submissions: {
    key: string;
    value: Submission;
  };
  studyModes: {
    key: string;
    value: StudyMode;
  };
}

const DB_NAME = 'quiz-db';
const DB_VERSION = 1;

// IndexedDB 操作
export const initDB = async () => {
  const db = await openDB<QuizDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('problems')) {
        db.createObjectStore('problems');
      }
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions');
      }
      if (!db.objectStoreNames.contains('studyModes')) {
        db.createObjectStore('studyModes');
      }
    },
  });
  return db;
};

// 问题相关操作
export const saveProblem = async (problem: Problem) => {
  const db = await initDB();
  await db.put('problems', problem, problem.id);
};

export const getProblem = async (id: string) => {
  const db = await initDB();
  return db.get('problems', id);
};

export const getAllProblems = async () => {
  const db = await initDB();
  return db.getAll('problems');
};

// 提交记录相关操作
export const saveSubmission = async (submission: Submission) => {
  const db = await initDB();
  await db.put('submissions', submission, submission.id);
};

export const getSubmissionsByProblem = async (problemId: string) => {
  const db = await initDB();
  const allSubmissions = await db.getAll('submissions');
  return allSubmissions.filter(sub => sub.problemId === problemId);
};

// 学习模式相关操作
export const saveStudyMode = async (mode: StudyMode) => {
  const db = await initDB();
  await db.put('studyModes', mode, mode.id);
};

export const getStudyMode = async (id: string) => {
  const db = await initDB();
  return db.get('studyModes', id);
};

// LocalStorage 操作
const USER_KEY = 'quiz-user';

export const saveUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// 数据导入导出
export const exportData = async () => {
  const db = await initDB();
  const problems = await db.getAll('problems');
  const submissions = await db.getAll('submissions');
  const studyModes = await db.getAll('studyModes');
  const user = getUser();

  const data = {
    problems,
    submissions,
    studyModes,
    user,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-data-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file: File) => {
  const text = await file.text();
  let data = JSON.parse(text);

  // 兼容直接导入题目数组
  if (Array.isArray(data)) {
    data = { problems: data, submissions: [], studyModes: [], user: null };
  }

  const db = await initDB();
  const tx = db.transaction(['problems', 'submissions', 'studyModes'], 'readwrite');

  // 清除现有数据
  await tx.objectStore('problems').clear();
  await tx.objectStore('submissions').clear();
  await tx.objectStore('studyModes').clear();

  // 导入新数据
  for (const problem of data.problems) {
    await tx.objectStore('problems').put(problem, problem.id);
  }
  for (const submission of data.submissions) {
    await tx.objectStore('submissions').put(submission, submission.id);
  }
  for (const mode of data.studyModes) {
    await tx.objectStore('studyModes').put(mode, mode.id);
  }

  if (data.user) {
    saveUser(data.user);
  }

  await tx.done;
}; 