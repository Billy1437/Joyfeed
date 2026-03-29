# Joyfeed

A social media app where posts disappear after 24 hours. Built with React Native (Expo) and Supabase.

## Features

- **Ephemeral Posts** — Share photos with optional descriptions that auto-expire after 24 hours
- **Authentication** — Email/password sign up & sign in via Supabase Auth
- **Onboarding** — New users set up their name, username, and profile image
- **Image Upload** — Take a photo or pick from your library, with a preview before posting
- **User Profiles** — Profile images and usernames displayed on each post

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | [Expo](https://expo.dev) (SDK 55)       |
| Navigation   | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Backend      | [Supabase](https://supabase.com) (Auth, Database, Storage) |
| Language     | TypeScript                              |
| UI           | React Native core components            |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth screens (login, signup, onboarding)
│   ├── (tabs)/          # Main app tabs (feed, profile, settings)
│   ├── hooks/           # Custom hooks (usePosts)
│   ├── _layout.tsx      # Root layout with auth routing
│   └── index.tsx        # Entry redirect
├── components/          # Reusable components
├── context/
│   └── AuthContext.tsx   # Auth state management
└── lib/
    ├── supabase/
    │   ├── client.ts     # Supabase client init
    │   └── storage.ts    # Image upload helpers
    └── datehelper.tsx    # Date utilities
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Supabase](https://supabase.com) project with:
  - `profiles` table (id, name, username, profile_image_uri, onboarding_completed)
  - `posts` table (id, user_id, image_url, description, created_at, expires_at, is_active)
  - Storage buckets: `profiles`, `posts`

### Installation

```bash
# Clone the repo
git clone https://github.com/Billy1437/Joyfeed.git
cd Joyfeed

# Install dependencies
npm install

# Add your Supabase credentials
# Create/update src/lib/supabase/client.ts with your project URL and anon key

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## License

This project is for learning purposes.
