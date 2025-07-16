import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SleepSession, SleepStats } from '@/types/sleep';
import { calculateDuration, getDateString, getLastSevenDays, getLastThirtyDays } from '@/utils/date';

interface SleepState {
  sessions: SleepSession[];
  activeSleepSession: SleepSession | null;
  isTracking: boolean;
  
  // Actions
  startSleep: (notes?: string) => void;
  endSleep: () => void;
  addSession: (session: SleepSession) => void;
  updateSession: (id: string, updates: Partial<SleepSession>) => void;
  deleteSession: (id: string) => void;
  
  // Stats
  getWeeklyStats: () => SleepStats;
  getMonthlyStats: () => SleepStats;
  getWeeklyData: () => { day: string; duration: number }[];
  getMonthlyData: () => { date: string; duration: number }[];
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSleepSession: null,
      isTracking: false,
      
      startSleep: (notes = '') => {
        const now = new Date();
        const newSession: SleepSession = {
          id: now.getTime().toString(),
          startTime: now.toISOString(),
          endTime: null,
          duration: null,
          notes,
          date: getDateString(now),
        };
        
        set({
          activeSleepSession: newSession,
          isTracking: true,
        });
      },
      
      endSleep: () => {
        const { activeSleepSession } = get();
        if (!activeSleepSession) return;
        
        const now = new Date();
        const endTime = now.toISOString();
        const duration = calculateDuration(activeSleepSession.startTime, endTime);
        
        const completedSession: SleepSession = {
          ...activeSleepSession,
          endTime,
          duration,
        };
        
        set(state => ({
          sessions: [completedSession, ...state.sessions],
          activeSleepSession: null,
          isTracking: false,
        }));
      },
      
      addSession: (session) => {
        set(state => ({
          sessions: [session, ...state.sessions],
        }));
      },
      
      updateSession: (id, updates) => {
        set(state => ({
          sessions: state.sessions.map(session => 
            session.id === id 
              ? { 
                  ...session, 
                  ...updates,
                  // Recalculate duration if start or end time changed
                  duration: updates.startTime || updates.endTime 
                    ? calculateDuration(
                        updates.startTime || session.startTime, 
                        updates.endTime || session.endTime || ''
                      )
                    : session.duration
                } 
              : session
          ),
        }));
      },
      
      deleteSession: (id) => {
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== id),
        }));
      },
      
      getWeeklyStats: () => {
        const { sessions } = get();
        const lastSevenDays = getLastSevenDays();
        
        const weekSessions = sessions.filter(
          session => lastSevenDays.includes(session.date) && session.duration
        );
        
        if (weekSessions.length === 0) {
          return {
            averageDuration: 0,
            totalSessions: 0,
            longestSession: 0,
            shortestSession: 0,
          };
        }
        
        const durations = weekSessions.map(s => s.duration || 0);
        
        return {
          averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
          totalSessions: weekSessions.length,
          longestSession: Math.max(...durations),
          shortestSession: Math.min(...durations),
        };
      },
      
      getMonthlyStats: () => {
        const { sessions } = get();
        const lastThirtyDays = getLastThirtyDays();
        
        const monthSessions = sessions.filter(
          session => lastThirtyDays.includes(session.date) && session.duration
        );
        
        if (monthSessions.length === 0) {
          return {
            averageDuration: 0,
            totalSessions: 0,
            longestSession: 0,
            shortestSession: 0,
          };
        }
        
        const durations = monthSessions.map(s => s.duration || 0);
        
        return {
          averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
          totalSessions: monthSessions.length,
          longestSession: Math.max(...durations),
          shortestSession: Math.min(...durations),
        };
      },
      
      getWeeklyData: () => {
        const { sessions } = get();
        const lastSevenDays = getLastSevenDays();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return lastSevenDays.map(date => {
          const daySessions = sessions.filter(
            session => session.date === date && session.duration
          );
          
          const totalDuration = daySessions.reduce(
            (total, session) => total + (session.duration || 0), 
            0
          );
          
          const dayOfWeek = new Date(date).getDay();
          
          return {
            day: days[dayOfWeek],
            duration: totalDuration,
          };
        });
      },
      
      getMonthlyData: () => {
        const { sessions } = get();
        const lastThirtyDays = getLastThirtyDays();
        
        return lastThirtyDays.map(date => {
          const daySessions = sessions.filter(
            session => session.date === date && session.duration
          );
          
          const totalDuration = daySessions.reduce(
            (total, session) => total + (session.duration || 0), 
            0
          );
          
          return {
            date,
            duration: totalDuration,
          };
        });
      },
    }),
    {
      name: 'sleep-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);