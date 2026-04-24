'use server';
/**
 * @fileOverview An AI agent that analyzes user habit completion patterns and provides personalized nudges and suggestions.
 *
 * - habitNudgeSuggestion - A function that handles the habit nudging process.
 * - HabitNudgeSuggestionInput - The input type for the habitNudgeSuggestion function.
 * - HabitNudgeSuggestionOutput - The return type for the habitNudgeSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HabitNudgeSuggestionInputSchema = z.object({
  habitName: z.string().describe('The name of the habit.'),
  completionHistory: z.array(z.object({
    date: z.string().describe('The date of the record (YYYY-MM-DD).'),
    completed: z.boolean().describe('Whether the habit was completed on this date.'),
  })).describe('Recent history of habit completion, ordered chronologically (e.g., last 30 days).'),
  currentStreak: z.number().describe('The current consecutive completion streak.'),
  longestStreak: z.number().describe('The longest consecutive completion streak ever achieved.'),
  targetFrequency: z.string().describe('How often the user aims to complete the habit (e.g., "daily", "3 times a week").'),
  userGoals: z.string().describe('The user\'s personal goals related to this habit.'),
  burnoutSigns: z.string().optional().describe('Any self-reported signs of burnout or struggle. Defaults to "None" if not provided.').default('None'),
});
export type HabitNudgeSuggestionInput = z.infer<typeof HabitNudgeSuggestionInputSchema>;

const HabitNudgeSuggestionOutputSchema = z.object({
  nudge: z.string().describe('A short, encouraging, or motivating message.'),
  suggestion: z.string().describe('A detailed and actionable suggestion to help with motivation, routine optimization, or burnout prevention.'),
  category: z.enum(['Motivation', 'Optimization', 'Burnout Prevention', 'General']).describe('The primary category of the suggestion.'),
});
export type HabitNudgeSuggestionOutput = z.infer<typeof HabitNudgeSuggestionOutputSchema>;

export async function habitNudgeSuggestion(input: HabitNudgeSuggestionInput): Promise<HabitNudgeSuggestionOutput> {
  return habitNudgeSuggestionFlow(input);
}

const habitNudgeSuggestionPrompt = ai.definePrompt({
  name: 'habitNudgeSuggestionPrompt',
  input: {schema: HabitNudgeSuggestionInputSchema},
  output: {schema: HabitNudgeSuggestionOutputSchema},
  prompt: `You are an AI assistant specialized in habit optimization and personal well-being. Your goal is to help users maintain their habits, prevent burnout, and achieve their personal goals by providing personalized nudges and actionable suggestions.

Analyze the user's habit completion patterns for the habit "{{{habitName}}}" based on the following data:

Habit Name: {{{habitName}}}
Completion History (YYYY-MM-DD, Completed):
{{#each completionHistory}}
- {{{date}}}: {{#if completed}}Completed{{else}}Not Completed{{/if}}
{{/each}}
Current Streak: {{{currentStreak}}} days
Longest Streak: {{{longestStreak}}} days
Target Frequency: {{{targetFrequency}}}
User Goals: {{{userGoals}}}
Self-reported Burnout Signs: {{{burnoutSigns}}}

Based on this information, provide a personalized nudge and a specific, actionable suggestion. Consider patterns like:
- **Consistent streaks**: Encourage continuation, suggest increasing challenge slightly if appropriate.
- **Recent drops in completion**: Offer gentle encouragement, suggest re-evaluating the habit or finding alternative ways to engage.
- **Struggling to start/maintain**: Provide tips on habit formation, breaking down tasks, or finding accountability.
- **Signs of burnout**: Suggest rest, simplification, or focusing on recovery.
- **Proximity to longest streak**: Motivate to beat previous records.

Your response should directly address the user's situation for the "{{{habitName}}}" habit, focusing on motivation, optimization, or burnout prevention. Ensure the output is a valid JSON object matching the provided schema, with appropriate categorization.
`,
});

const habitNudgeSuggestionFlow = ai.defineFlow(
  {
    name: 'habitNudgeSuggestionFlow',
    inputSchema: HabitNudgeSuggestionInputSchema,
    outputSchema: HabitNudgeSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await habitNudgeSuggestionPrompt(input);
    return output!;
  }
);
