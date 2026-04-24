# **App Name**: IronZen

## Core Features:

- User Authentication: Secure user login and account management using Google OAuth via Firebase Auth (or NextAuth.js) for frictionless onboarding.
- User Preferences & Profile: Allow users to manage global settings, theme defaults, and configure notification webhooks for a personalized experience.
- Unified Dashboard: Provide a high-level, single-frame visualization (like heat maps or progress rings) to aggregate all habit data and track overall progress.
- Individual Habit Management: Enable users to create, view, and customize each habit with unique themes, icons, emojis, and monitor real-time and all-time high streaks.
- Interactive Logging & Calendar: Offer a dedicated calendar view for each habit, allowing interactive logging, historical back-filling, and instant UI updates with optimistic rendering.
- Telegram Webhook Notifications: Send custom, timed reminders for each habit directly to the user's Telegram bot via webhook integration, replacing standard push notifications.
- AI-Powered Habit Nudging Tool: A tool that provides personalized suggestions for optimizing habit engagement and preventing burnout based on user's progress and predefined goals.

## Style Guidelines:

- Color scheme: Dark. Embodying discipline and a futuristic feel with cool, vibrant accents against a deep background.
- Primary color: A luminous, high-tech cyan (#00DBE9), chosen for its energetic and precise quality that contrasts brilliantly with the dark theme.
- Background color: A very dark, subtle cyan-tinged grey (#111718), providing depth and allowing brighter elements to stand out, subtly echoing the primary hue.
- Accent color: A vibrant, clear blue-green (#44E2BF), serving as an analogous complement to the primary, adding visual interest and highlighting key interactions.
- Body and headline font: 'Lexend' (sans-serif), a versatile choice for a modern, strong, and highly readable interface, suitable for both headlines and longer text. Note: currently only Google Fonts are supported.
- Utilize 'Material Symbols Outlined' for all icons, leveraging their flexibility in styling (fill, weight) to maintain a cohesive, sharp, and modern aesthetic. Specific icons can be color-coded to individual habit themes.
- A fixed left sidebar navigation and a fluid main content area, with a maximum-width content container to ensure readability and focus. Habit cards will feature dynamic glow effects to represent progress or status.
- Implement subtle transition effects on interactive elements like buttons and cards for a snappy, responsive feel. Use soft glow animations on key elements to draw attention to progress and achievements.