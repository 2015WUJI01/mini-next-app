export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Solution {
  id: string;
  code: string;
  language: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  content: string;
  difficulty: Difficulty;
  tags: string[];
  examples: Example[];
  constraints: string;
  solutions: Solution[];
  relatedProblems: string[];
  acceptance: number;
  frequency: number;
  options?: string[];
  answer?: number | number[];
}

export interface UserProgress {
  completed: string[];
  favorites: string[];
  incorrect: string[];
}

export interface UserStatistics {
  totalSolved: number;
  streakDays: number;
  correctRate: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  editorSettings: {
    tabSize: number;
    wordWrap: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  progress: UserProgress;
  statistics: UserStatistics;
  settings: UserSettings;
}

export type SubmissionStatus = 'accepted' | 'wrong' | 'timeout' | 'error';

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  runtime: number;
  memory: number;
  timestamp: Date;
}

export interface StudyMode {
  id: string;
  name: string;
  type: 'random' | 'difficulty' | 'topic' | 'competition';
  problems: string[];
  settings: {
    timeLimit?: number;
    difficulty?: Difficulty;
    topic?: string;
  };
} 