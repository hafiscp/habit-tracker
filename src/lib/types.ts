export type HabitCategory = 'Health' | 'Focus' | 'Mindset' | 'General';

export type HabitRecord = {
  date: string; // YYYY-MM-DD
  completed: boolean;
};

export type Habit = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: string; // e.g. "daily", "3 times a week"
  records: HabitRecord[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
};

export type UserPreferences = {
  theme: 'dark' | 'light';
  telegramWebhook?: string;
  notificationTime?: string;
  globalGoal: string;
};