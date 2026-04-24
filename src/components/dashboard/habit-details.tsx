"use client";

import React, { useState } from 'react';
import { Habit, HabitRecord } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { AINudge } from './ai-nudge';
import { Flame, Target, Trophy, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface HabitDetailsProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecord: (habitId: string, date: Date, completed: boolean) => void;
}

export function HabitDetails({ habit, isOpen, onClose, onUpdateRecord }: HabitDetailsProps) {
  if (!habit) return null;

  const completedDates = habit.records
    .filter(r => r.completed)
    .map(r => new Date(r.date));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        <div 
          className="h-32 w-full relative"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-2xl"
              style={{ 
                backgroundColor: habit.color, 
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(0,0,0,0.6)'
              }}
            >
              <Target size={32} />
            </div>
            <div className="pb-1">
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                {habit.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{habit.category}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-white/5">
                <div className="flex items-center gap-2 text-orange-500 mb-1">
                  <Flame size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Current</span>
                </div>
                <div className="text-2xl font-black">{habit.currentStreak}d</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-white/5">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Trophy size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">All-Time</span>
                </div>
                <div className="text-2xl font-black">{habit.longestStreak}d</div>
              </div>
            </div>

            <AINudge habit={habit} userGoals="Become more disciplined and physically fit." />

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock size={12} /> Protocol Stats
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {habit.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Historical Back-fill</h4>
            <div className="p-2 rounded-2xl bg-muted/20 border border-white/5">
              <Calendar
                mode="multiple"
                selected={completedDates}
                onSelect={(dates) => {
                  // This is simplified. In real app, find which date was added or removed
                  // For now, we'll just handle "today" or simple toggles
                }}
                onDayClick={(day) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const existing = habit.records.find(r => r.date === dateStr);
                  onUpdateRecord(habit.id, day, !existing?.completed);
                }}
                className="mx-auto"
              />
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic">
              Select a date to log or correct your entry
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}