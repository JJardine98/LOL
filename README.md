# Level One Lunatics - Guild Website

A website for tracking achievements, leaderboards, and guild stats for the Level One Lunatics challenge guild on Turtle WoW.

## Features

- **Home Page**: Welcome page with guild information
- **Leaderboard**: Displays guild members ranked by total points (HK + Quests + Raids Attended)
- **Achievements**: Shows all available achievements and which members have earned them

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
├── public/
│   └── data/
│       ├── achievements.json    # Achievement definitions
│       └── members.json         # Guild member data
├── src/
│   ├── components/
│   │   ├── Achievements.jsx    # Achievements page component
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Leaderboard.jsx     # Leaderboard component
│   │   └── MemberProfile.jsx   # Individual member profile (not yet routed)
│   ├── pages/
│   │   ├── App.jsx             # Main app with routing
│   │   └── Home.jsx            # Home page
│   ├── index.css               # Global styles with Tailwind
│   └── main.jsx                # Application entry point
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Technologies Used

- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Data Format

### Members JSON

Each member should have:
- `characterName`: Character name
- `class`: Character class
- `race`: Character race
- `stats`: Object with `hk`, `questsCompleted`, `raidsAttended`
- `achievements`: Array of achievement names

### Achievements JSON

Each achievement should have:
- `name`: Achievement name
- `description`: Achievement description
- `category`: Category (e.g., "PvP", "PvE")
- `points`: Point value
- `iconUrl`: Path to icon image

## License

This project is for personal/guild use.

