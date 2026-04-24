import { Habit } from './types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Run',
    description: '5.0 km • Zone 2',
    icon: 'Activity',
    color: '#FFB59A',
    category: 'Health',
    frequency: 'daily',
    currentStreak: 14,
    longestStreak: 25,
    createdAt: '2024-01-01',
    records: [
      { date: '2024-05-20', completed: true },
      { date: '2024-05-19', completed: true },
      { date: '2024-05-18', completed: true },
    ]
  },
  {
    id: '2',
    name: 'Meditation',
    description: '20 Mins • Vipassana',
    icon: 'Wind',
    color: '#ABD600',
    category: 'Mindset',
    frequency: 'daily',
    currentStreak: 42,
    longestStreak: 42,
    createdAt: '2024-01-01',
    records: [
      { date: '2024-05-20', completed: true },
      { date: '2024-05-19', completed: true },
    ]
  },
  {
    id: '3',
    name: 'Deep Work',
    description: '4 Hours • Uninterrupted',
    icon: 'Zap',
    color: '#00DBE9',
    category: 'Focus',
    frequency: 'daily',
    currentStreak: 5,
    longestStreak: 12,
    createdAt: '2024-01-01',
    records: [
      { date: '2024-05-20', completed: true },
    ]
  }
];