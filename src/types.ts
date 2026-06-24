export type SubjectId =
  | 'math'
  | 'physics'
  | 'biology'
  | 'philosophy'
  | 'arabic'
  | 'french'
  | 'english'
  | 'history_geography'
  | 'islamic';

export type SessionType = 'normal' | 'retake' | 'exceptional';

export interface Subject {
  id: SubjectId;
  name: string;
  iconName: string;
  color: string;
  description: string;
}

export interface ExamProblem {
  title: string;
  score: string;
  questions: string[];
  equations?: string[];
  diagramType?: 'none' | 'circuit' | 'projectile' | 'cell' | 'curve';
}

export interface DocumentSection {
  title: string;
  content: string[];
}

export interface Exam {
  id: string;
  subjectId: SubjectId;
  year: number;
  session: SessionType;
  name: string;
  date: string;
  problems: ExamProblem[];
  solutions: ExamProblem[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  pagesCount: number;
  subjectId: SubjectId;
  sections: DocumentSection[];
}

export interface Video {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  title: string;
  youtubeId: string;
  views: string;
  duration: string;
  teacher: string;
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  name: string;
  description: string;
}
