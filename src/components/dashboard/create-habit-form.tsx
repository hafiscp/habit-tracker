
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Zap, Activity, Wind, Book, Coffee, Dumbbell, Target } from 'lucide-react';

const habitFormSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(5, "Provide a bit more detail"),
  habitType: z.enum(['boolean', 'number', 'duration', 'photo']),
  targetValue: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  unitOfMeasure: z.string().default(''),
  minDailyValue: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  maxDailyValue: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  icon: z.string().default('Activity'),
  themeColorHex: z.string().default('#14f1d9'),
});

interface CreateHabitFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const icons = [
  { name: 'Activity', icon: Activity },
  { name: 'Zap', icon: Zap },
  { name: 'Wind', icon: Wind },
  { name: 'Book', icon: Book },
  { name: 'Coffee', icon: Coffee },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Target', icon: Target },
];

export function CreateHabitForm({ isOpen, onClose }: CreateHabitFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof habitFormSchema>>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: '',
      description: '',
      habitType: 'boolean',
      icon: 'Activity',
      themeColorHex: '#14f1d9',
      targetValue: 0,
      unitOfMeasure: '',
      minDailyValue: 0,
      maxDailyValue: 100,
    },
  });

  const onSubmit = (values: z.infer<typeof habitFormSchema>) => {
    if (!user || !firestore) return;

    const habitsRef = collection(firestore, 'users', user.uid, 'habits');
    const newHabitRef = doc(habitsRef); // Generate ID on client
    const now = new Date().toISOString();

    setDocumentNonBlocking(newHabitRef, {
      ...values,
      id: newHabitRef.id,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
      archived: false,
    }, { merge: true });

    form.reset();
    onClose();
  };

  const selectedType = form.watch('habitType');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0F1115] border-white/10 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Initialize Protocol</DialogTitle>
          <DialogDescription className="text-white/40 font-medium">Define the parameters for your new daily discipline.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Protocol Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Blitz" {...field} value={field.value ?? ""} className="bg-white/5 border-white/10 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Objectives</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5km run at Zone 2" {...field} value={field.value ?? ""} className="bg-white/5 border-white/10 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="habitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Data Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F1115] border-white/10">
                        <SelectItem value="boolean">Checkmark</SelectItem>
                        <SelectItem value="number">Numeric Count</SelectItem>
                        <SelectItem value="duration">Time Duration</SelectItem>
                        <SelectItem value="photo">Photo Proof</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Iconify</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                          <SelectValue placeholder="Icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F1115] border-white/10">
                        {icons.map((i) => (
                          <SelectItem key={i.name} value={i.name}>
                            <div className="flex items-center gap-2">
                              <i.icon size={14} />
                              <span>{i.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedType !== 'boolean' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minDailyValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Min Floor</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ""} className="bg-white/5 border-white/10 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxDailyValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Max Cap</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ""} className="bg-white/5 border-white/10 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="themeColorHex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/60">Core Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} value={field.value ?? "#14f1d9"} className="w-12 h-10 p-1 bg-transparent border-none" />
                      <Input {...field} value={field.value ?? "#14f1d9"} className="flex-1 bg-white/5 border-white/10 rounded-xl font-mono" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl h-12">
                Commit Protocol
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
