# DSA Revision Tracker

![DSA Revision Tracker](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)

**Live Demo:** [https://dsa-revision-tracker-dsa-tracker-two.vercel.app/](https://dsa-revision-tracker-dsa-tracker-two.vercel.app/)

## 🚀 Overview

**DSA Revision Tracker** is a beautifully designed, highly interactive web application tailored for developers and students preparing for technical interviews. It helps you manage and track your Data Structures and Algorithms (DSA) practice. By leveraging confidence-based spaced repetition, the app intelligently schedules your next revision, ensuring you focus on the problems that need the most attention and build unshakeable muscle memory.

## ✨ Features

- **🧠 Confidence-Based Spaced Repetition**: Rate your confidence level after solving a problem, and the app automatically calculates when you should revise it next.
- **🔐 Secure Authentication**: Integrated with Clerk for seamless, secure user sign-up and sign-in experiences.
- **📊 Comprehensive Dashboard**: A clean, intuitive dashboard to view your progress, tracked questions, and upcoming revisions.
- **🔍 Advanced Filtering & Sorting**: Easily search through your questions, filter by platform, tags, or confidence levels, and sort them by the next scheduled revision date.
- **🎨 Modern & Responsive UI**: Built with Radix UI, shadcn/ui, and Tailwind CSS. Features dynamic ambient backgrounds, dark/light mode toggling, and smooth Framer Motion animations.
- **⚡ Blazing Fast Performance**: Powered by Vite and optimized data fetching with TanStack React Query.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components & Accessibility**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [Wouter](https://github.com/molefrog/wouter)
- **State Management & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Authentication**: [Clerk](https://clerk.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd dsa-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Clerk API keys and other configurations:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

## 📐 Project Structure

- `/src/pages`: Contains the main application views (Home, Landing, Add/Edit Question, Authentication pages).
- `/src/components`: Reusable UI components (Dashboard, Question Table, Theme Toggle, etc.).
- `/src/lib`: Utility functions, type definitions, and the core revision calculation logic.
- `/src/App.tsx`: Main application component, defining routing and providers.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
