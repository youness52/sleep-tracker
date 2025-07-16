export interface SleepSession {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null; // in minutes
  notes: string;
  date: string; // YYYY-MM-DD format for easy grouping
}

export interface SleepStats {
  averageDuration: number; // in minutes
  totalSessions: number;
  longestSession: number; // in minutes
  shortestSession: number; // in minutes
}