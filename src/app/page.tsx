"use client";

import React, { useState, useEffect } from 'react';
import { INITIAL_HABITS } from '@/lib/mock-data';
import { Habit, HabitRecord } from '@/lib/types';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { HabitCard } from '@/components/dashboard/habit-card';
import { HabitDetails } from '@/components/dashboard/habit-details';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Plus, 
  Calendar as CalendarIcon, 
  Bell, 
  Search,
  Zap,
  Flame
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function IronZenDashboard() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const completedTodayCount = habits.filter(h => h.records.some(r => r.date === today && r.completed)).length;
  const overallProgress = habits.length > 0 ? (completedTodayCount / habits.length) * 100 : 0;

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const hasToday = h.records.some(r => r.date === today);
        let newRecords: HabitRecord[];
        
        if (hasToday) {
          newRecords = h.records.map(r => r.date === today ? { ...r, completed: !r.completed } : r);
        } else {
          newRecords = [...h.records, { date: today, completed: true }];
        }

        // Simple streak recalc (logic simplified for demo)
        const isCompleted = newRecords.find(r => r.date === today)?.completed;
        const streakChange = isCompleted ? 1 : -1;
        
        return { 
          ...h, 
          records: newRecords,
          currentStreak: Math.max(0, h.currentStreak + streakChange)
        };
      }
      return h;
    }));
  };

  const handleUpdateRecord = (habitId: string, date: Date, completed: boolean) => {
    const dateStr = date.toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const exists = h.records.some(r => r.date === dateStr);
        const newRecords = exists 
          ? h.records.map(r => r.date === dateStr ? { ...r, completed } : r)
          : [...h.records, { date: dateStr, completed }];
        
        return { ...h, records: newRecords };
      }
      return h;
    }));
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full bg-[#0c0e12] overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="border-r border-white/5 bg-[#0F1115]/80 backdrop-blur-2xl">
          <SidebarHeader className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full border border-white/20 bg-primary/10 flex items-center justify-center">
                <Zap className="text-primary fill-primary/20" />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-primary uppercase leading-tight">IronZen</h1>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Relentless Execution</p>
              </div>
            </div>
            
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="bg-primary/10 text-primary border-r-2 border-primary">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className="font-bold">Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white/40 hover:text-white transition-all">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white/40 hover:text-white transition-all">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent className="px-8 mt-auto pb-8">
            <Button className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_hsla(var(--primary),0.3)] hover:scale-[1.02] transition-transform active:scale-95 gap-2">
              <Plus size={20} /> Quick Log
            </Button>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative p-8 md:p-12">
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-5xl font-black italic tracking-tighter text-foreground uppercase">Today's Protocol</h2>
              <p className="text-muted-foreground mt-2 font-medium">
                Stay Relentless. You are <span className="text-primary font-bold">{Math.round(overallProgress)}%</span> complete for the day.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input className="w-64 bg-white/5 border-white/10 pl-10 h-11 rounded-xl focus:ring-primary" placeholder="Search habits..." />
              </div>
              <Button size="icon" variant="ghost" className="h-11 w-11 rounded-xl bg-white/5 border border-white/10">
                <CalendarIcon className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 relative">
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-glow" />
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Progress Overview */}
          <section className="mb-12">
            <div className="glass-card p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
              
              <div className="flex-shrink-0">
                <ProgressRing progress={overallProgress} />
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary glow-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deep Focus</span>
                  </div>
                  <div className="text-4xl font-black">4h 30m</div>
                  <div className="text-xs text-primary font-bold">+12% vs Yesterday</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary glow-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recovery</span>
                  </div>
                  <div className="text-4xl font-black">20m</div>
                  <div className="text-xs text-muted-foreground">On target</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Discipline</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">71</span>
                    <span className="text-sm font-bold text-muted-foreground">Day Streak</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-400 font-bold">
                    <Flame size={12} /> Heat level: Maximum
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Habits Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Active Protocols</h3>
              <Button variant="link" className="text-primary font-bold">Manage Habits</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={handleToggleHabit} 
                  onClick={(h) => {
                    setSelectedHabit(h);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
              
              <button className="glass-card rounded-[2rem] border-dashed border-white/10 p-6 flex flex-col items-center justify-center gap-4 group hover:border-primary/50 transition-all duration-300 min-h-[250px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="text-white/20 group-hover:text-primary transition-colors" size={32} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-white/40 group-hover:text-white transition-colors">Initialize Protocol</p>
                  <p className="text-xs text-white/20">Add a new dimension to your routine</p>
                </div>
              </button>
            </div>
          </section>

          {/* Habit Details Modal */}
          <HabitDetails 
            habit={selectedHabit} 
            isOpen={isDetailsOpen} 
            onClose={() => setIsDetailsOpen(false)}
            onUpdateRecord={handleUpdateRecord}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}