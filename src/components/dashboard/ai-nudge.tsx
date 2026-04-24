"use client";

import React, { useState, useEffect } from 'react';
import { Habit } from '@/lib/types';
import { habitNudgeSuggestion, HabitNudgeSuggestionOutput } from '@/ai/flows/habit-nudge-suggestion';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface AINudgeProps {
  habit: Habit;
  userGoals: string;
}

export function AINudge({ habit, userGoals }: AINudgeProps) {
  const [nudge, setNudge] = useState<HabitNudgeSuggestionOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNudge() {
      setLoading(true);
      try {
        const result = await habitNudgeSuggestion({
          habitName: habit.name,
          completionHistory: habit.records.map(r => ({ date: r.date, completed: r.completed })),
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          targetFrequency: habit.frequency,
          userGoals: userGoals,
        });
        setNudge(result);
      } catch (err) {
        console.error("AI Nudge failed:", err);
      } finally {
        setLoading(false);
      }
    }

    if (habit) fetchNudge();
  }, [habit, userGoals]);

  if (loading) {
    return (
      <Card className="p-4 glass-card flex items-center justify-center gap-3 animate-pulse">
        <Loader2 className="animate-spin text-primary" />
        <span className="text-sm font-medium">IronZen AI is analyzing your discipline...</span>
      </Card>
    );
  }

  if (!nudge) return null;

  return (
    <Card className="p-4 glass-card border-l-4 border-l-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Sparkles size={48} className="text-primary" />
      </div>
      <div className="flex gap-4">
        <div className="mt-1">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Info size={16} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary italic uppercase tracking-wider">Protocol Adjustment</p>
          <p className="text-sm font-medium leading-relaxed">{nudge.nudge}</p>
          <p className="text-xs text-muted-foreground mt-2">{nudge.suggestion}</p>
        </div>
      </div>
    </Card>
  );
}