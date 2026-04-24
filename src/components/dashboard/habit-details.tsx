"use client";

import React from 'react';
import { Habit } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { AINudge } from './ai-nudge';
import { Flame, Target, Trophy, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

interface HabitDetailsProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRecord: (habitId: string, date: Date, completed: boolean) => void;
}

export function HabitDetails({ habit, isOpen, onClose, onUpdateRecord }: HabitDetailsProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  if (!habit) return null;

  const handleDelete = () => {
    if (!user || !firestore) return;
    const habitRef = doc(firestore, 'users', user.uid, 'habits', habit.id);
    deleteDocumentNonBlocking(habitRef);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        <div 
          className="h-32 w-full relative"
          style={{ backgroundColor: `${habit.themeColorHex}20` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-end justify-between right-6 gap-4">
            <div className="flex items-end gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-2xl"
                style={{ 
                  backgroundColor: habit.themeColorHex, 
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(0,0,0,0.6)'
                }}
              >
                <Target size={32} />
              </div>
              <div className="pb-1">
                <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                  {habit.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{habit.habitType}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/20 hover:text-red-500 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={20} />
            </Button>
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
                <div className="text-2xl font-black">0d</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-white/5">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Trophy size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">All-Time</span>
                </div>
                <div className="text-2xl font-black">0d</div>
              </div>
            </div>

            <AINudge habit={habit} userGoals="Become more disciplined and physically fit." />

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock size={12} /> Protocol Specs
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {habit.description}
              </p>
              {habit.minDailyValue !== undefined && (
                <p className="text-xs text-primary/60 font-medium">Minimum threshold set at {habit.minDailyValue}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Historical Back-fill</h4>
            <div className="p-2 rounded-2xl bg-muted/20 border border-white/5">
              <Calendar
                mode="single"
                onDayClick={(day) => {
                  onUpdateRecord(habit.id, day, true);
                }}
                className="mx-auto"
              />
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic">
              Select a date to manually log progress
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
