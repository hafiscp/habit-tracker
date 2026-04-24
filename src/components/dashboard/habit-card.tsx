"use client";

import React from 'react';
import { Habit } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Check, LucideIcon, Activity, Wind, Zap, Book, Coffee, Dumbbell, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Wind,
  Zap,
  Book,
  Coffee,
  Dumbbell,
  Target
};

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onClick: (habit: Habit) => void;
}

export function HabitCard({ habit, onToggle, onClick }: HabitCardProps) {
  const Icon = iconMap[habit.icon] || Activity;
  
  // Note: Streak calculation would come from the habit object in Firestore
  // updated by a cloud function or periodic background check.
  const currentStreak = 0; 
  const isCompletedToday = false; // This should be synced with today's logs

  return (
    <Card 
      className="glass-card p-6 group cursor-pointer hover:border-primary/50 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
      onClick={() => onClick(habit)}
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none -mr-10 -mt-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: habit.themeColorHex }}
      />
      
      <div className="flex justify-between items-start mb-6 z-10">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all"
          style={{ 
            backgroundColor: `${habit.themeColorHex}15`, 
            borderColor: `${habit.themeColorHex}40`,
            color: habit.themeColorHex,
            boxShadow: `0 0 20px ${habit.themeColorHex}10`
          }}
        >
          <Icon size={28} />
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-white/5">
          <Flame size={14} className={cn("fill-current", currentStreak > 0 ? "text-orange-500" : "text-muted-foreground")} />
          <span className="text-xs font-bold">{currentStreak} Day Streak</span>
        </div>
      </div>

      <div className="flex-1 z-10">
        <h3 className="text-xl font-bold tracking-tight text-foreground uppercase italic">{habit.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{habit.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-white/40">
            Type: {habit.habitType}
          </div>
          {habit.minDailyValue !== undefined && (
            <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-white/40">
              Floor: {habit.minDailyValue}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end z-10">
        <Button
          size="icon"
          className={cn(
            "w-12 h-12 rounded-full border-2 transition-all duration-300",
            isCompletedToday 
              ? "bg-primary/20 border-primary text-primary glow-primary" 
              : "bg-muted/20 border-white/10 text-muted-foreground hover:border-primary/50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id);
          }}
        >
          <Check size={24} className={cn(isCompletedToday && "stroke-[3px]")} />
        </Button>
      </div>
    </Card>
  );
}
