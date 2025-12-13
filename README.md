# 📚 Explain Bytes

> **Deep-dive into system fundamentals with richly illustrated guides. Master databases, operating systems, and distributed architectures through diagrams, examples, and visual breakdowns.**

A modern, full-stack documentation and learning platform built with Next.js 15, featuring interactive flashcards and comprehensive technical documentation.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### 📖 **FlashDocs - Technical Documentation**
- **Rich Markdown Support**: Write documentation in MDX with full component support
- **Automatic Topic Discovery**: Dynamically generates topics from folder structure
- **Visual Learning**: Support for diagrams, code blocks, and illustrations
- **Syntax Highlighting**: Beautiful code snippets with language-specific highlighting
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for all devices from mobile to desktop

### 🎯 **FlashCards - Interactive Learning**
- **Spaced Repetition**: Track known and review cards for effective learning
- **Keyboard Navigation**: Full keyboard shortcuts (Space, Arrow keys, K, R, S)
- **Progress Tracking**: Monitor your learning journey with visual progress indicators
- **Deck Shuffling**: Randomize cards for better retention
- **Category-Based**: Organized by DBMS, OS, Networking, System Design, and DevOps
- **Local Storage**: Your progress is saved automatically

### 📧 **Newsletter Integration**
- **Resend API**: Professional email delivery with verified domain
- **Spam-Optimized**: Plain text + HTML emails with proper authentication
- **Beautiful Templates**: Responsive email design with brand colors
- **Easy Subscription**: Simple, elegant signup form on landing page

### 🎨 **Modern UI/UX**
- **Framer Motion**: Smooth animations and transitions
- **Vercel-Inspired Design**: Clean, professional aesthetic
- **Dynamic Icons**: Lucide React icons with color theming
- **Card-Based Layout**: Beautiful topic cards with hover effects
- **Gradient Accents**: Subtle color gradients for visual hierarchy

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/explain-bytes.git
cd explain-bytes

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your RESEND_API_KEY to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
explain-bytes/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── docs/             # Dynamic docs API
│   │   │   └── subscribe/        # Newsletter subscription
│   │   ├── docs/                 # Documentation pages
│   │   │   ├── [topic]/          # Dynamic topic routes
│   │   │   └── page.tsx          # Docs landing page
│   │   ├── flashcards/           # Flashcard pages
│   │   │   ├── [category]/       # Dynamic category routes
│   │   │   └── page.tsx          # Flashcards landing
│   │   ├── types/                # TypeScript types
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
│   │   ├── CategorySelector.tsx  # Flashcard category grid
│   │   ├── Flashcard.tsx         # Flip card component
│   │   ├── TopicCard.tsx         # Reusable topic card
│   │   ├── Hero.tsx              # Landing hero section
│   │   ├── FeatureSection.tsx    # Feature showcase
│   │   └── ...
│   ├── data/                     # Static data
│   │   └── flashcards.ts         # Flashcard utilities
│   ├── lib/                      # Utilities
│   │   ├── docs.ts               # Documentation utilities
│   │   ├── icon-map.ts           # Icon mapping
│   │   └── resend.ts             # Email client
│   └── hooks/                    # Custom React hooks
├── content/                      # Documentation content
│   ├── dbms/                     # Database docs
│   ├── operating-systems/        # OS docs
│   ├── networking/               # Networking docs
│   ├── system-design/            # System design docs
│   └── devops/                   # DevOps docs
├── data/                         # Flashcard data
│   ├── flashcard/                # Flashcard JSON files
│   │   ├── dbms.json
│   │   ├── operating-systems.json
│   │   ├── networking.json
│   │   ├── system-design.json
│   │   └── devops.json
│   └── flashcard_category/       # Category metadata
│       └── category.json
└── public/                       # Static assets
```

---

## 🛠️ Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 19](https://react.dev/)** - UI library

### Styling
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Content
- **[MDX](https://mdxjs.com/)** - Markdown with JSX support
- **[Gray Matter](https://github.com/jonschlinkert/gray-matter)** - Frontmatter parser
- **[Next MDX Remote](https://github.com/hashicorp/next-mdx-remote)** - MDX rendering

### Email
- **[Resend](https://resend.com/)** - Email API

---

## 📚 How It Works

### Documentation System

1. **Content Structure**: Docs are organized in `/content/[topic]/` folders
2. **Markdown Files**: Write `.mdx` files with frontmatter metadata
3. **Auto-Discovery**: `getAllTopics()` scans folders and generates routes
4. **Dynamic Routing**: `[topic]/[...slug]` handles nested documentation
5. **Metadata**: `_meta.json` files define topic icons, colors, and descriptions

### Flashcard System

1. **JSON Data**: Flashcards stored in `/data/flashcard/[category].json`
2. **Type Safety**: TypeScript types ensure data consistency
3. **Dynamic Categories**: Categories auto-generated from content folders
4. **Progress Tracking**: localStorage saves known/review card states
5. **Keyboard Controls**: Full keyboard navigation for efficient studying

---

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

---

## 🌈 Color System

The app uses **OKLCH color space** for consistent, perceptually uniform colors:

- **DBMS**: `oklch(0.6 0.2 240)` - Blue
- **Operating Systems**: `oklch(0.6 0.2 140)` - Green
- **Networking**: `oklch(0.6 0.2 40)` - Orange
- **System Design**: `oklch(0.6 0.2 280)` - Purple
- **DevOps**: `oklch(0.6 0.2 280)` - Purple

---

## 📧 Newsletter Setup

1. Sign up at [Resend](https://resend.com/)
2. Verify your sending domain
3. Add `RESEND_API_KEY` to `.env`
4. Update sender email in `src/app/api/subscribe/route.ts`

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- How to add new documentation
- How to create flashcards
- Code style guidelines
- Pull request process

---

## � License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by [EyePatch5263](https://github.com/EyePatch5263)
- Inspired by modern documentation platforms
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

## 📬 Contact

- **GitHub**: [@EyePatch5263](https://github.com/EyePatch5263)
- **Website**: [explainbytes.tech](https://explainbytes.tech)

---

<p align="center">Made with 💙 for developers who want to truly understand</p>
