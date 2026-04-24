export type HabitType = 'boolean' | 'number' | 'duration' | 'photo';

export type HabitCategory = 'Health' | 'Focus' | 'Mindset' | 'General';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string;
  habitType: HabitType;
  targetValue?: number;
  unitOfMeasure?: string;
  icon: string;
  emoji?: string;
  themeColorHex: string;
  minDailyValue?: number;
  maxDailyValue?: number;
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  logDate: string; // YYYY-MM-DD
  value: string;
  notes?: string;
  imageUrl?: string;
  loggedAt: string;
  updatedAt: string;
}

export type UserPreferences = {
  theme: 'dark' | 'light';
  telegramWebhook?: string;
  notificationTime?: string;
  globalGoal: string;
};
