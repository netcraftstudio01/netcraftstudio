# TEDx KPRCAS Website

## Project info

**Repository**: https://github.com/netcraftstudio01/TEDxKPRCAS

## How can I edit this code?

There are several ways of editing your application.

**Getting Started**

Clone this repository and run `npm install` to get started with development.

All changes should be committed to this repo.

**Use your preferred IDE**

Work locally using your preferred IDE, make changes, and push to this repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project Structure

```
kprcas-ted-x-splash/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx          # Main landing page with all sections
│   │   ├── LoadingScreen.tsx      # Loading animation screen
│   │   ├── NavLink.tsx            # Navigation link component
│   │   └── ui/                    # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── tooltip.tsx
│   │       └── ... (other UI components)
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── pages/
│   │   ├── Index.tsx              # Index page
│   │   └── NotFound.tsx            # 404 page
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── App.tsx                    # Root app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts              # Vite type definitions
├── public/
│   └── robots.txt
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies
├── eslint.config.js               # ESLint configuration
├── postcss.config.js              # PostCSS configuration
├── components.json                # shadcn/ui configuration
└── README.md                      # This file
```

## Key Features

- **Responsive Design** - Fully responsive layout for mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion animations throughout the site
- **Dark Theme** - Modern dark theme with TEDx red accent color
- **Interactive Components** - Countdown timer, hover effects, scroll animations
- **Loading Screen** - Animated loading sequence with particles and butterflies
- **Navigation** - Fixed navbar with smooth scroll navigation
- **Multiple Sections**:
  - Hero Section with parallax background
  - Event Showcase with countdown timer
  - About TEDx section with statistics
  - Speakers gallery
  - CTA (Call-to-Action) section
  - Team section
  - Contact section with 3 ways to reach out
  - Footer



## How can I deploy this project?

Deploy using your preferred hosting platform (Vercel, Netlify, etc.).

## Can I connect a custom domain?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.github.com/)
