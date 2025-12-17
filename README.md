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

### 🔍 **Engineering Terms Search** 
- **Elasticsearch Integration**: Fast, full-text search across 900+ engineering terms
- **Search-as-You-Type**: Instant results with `match_phrase_prefix` queries
- **Multi-Category Support**: System Design, DBMS, OS, Networking, DevOps, Machine Learning, Security, and more
- **Related Terms**: Discover related concepts by matching tags
- **Graceful Fallback**: Works with local data when Elasticsearch is unavailable
- **Category Badges**: Color-coded badges for easy visual identification
- **Detail Pages**: Full term definitions with related concepts

### ✍️ **Collaborative Editor**
- **Real-Time Collaboration**: Multiple users can edit documents simultaneously with live updates
- **Yjs & WebSocket**: Powered by Yjs CRDT for conflict-free synchronization via WebSocket
- **User Presence**: See who's online with color-coded avatars and smart awareness (adaptive display based on user count)
- **Rich Text Editing**: TipTap editor with markdown support, code blocks, syntax highlighting, and formatting tools
- **Document Management**: Create, fork, save drafts, and submit documents for review
- **Status Workflow**: Draft → Review → Approved/Rejected workflow with admin controls
- **Auto-Save**: Automatic saving with localStorage backup and Supabase persistence
- **MDX Preview**: Live preview of markdown content with syntax highlighting
- **Authentication**: Secure access with NextAuth integration
- **Rate Limiting**: API rate limiting for read/write operations

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
# Add your environment variables to .env:
# - RESEND_API_KEY (for newsletter)
# - ELASTICSEARCH_URL (for engineering terms search)
# - ELASTICSEARCH_API_KEY (for engineering terms search)
# - ELASTICSEARCH_INDEX (optional, defaults to 'engineering-terms')
# - NEXT_PUBLIC_SUPABASE_URL (for collaborative editor database)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (for collaborative editor)
# - SUPABASE_SERVICE_ROLE_KEY (for server-side operations)
# - NEXTAUTH_SECRET (for authentication)
# - NEXTAUTH_URL (your app URL, e.g., http://localhost:3000)
# - NEXT_PUBLIC_WS_URL (WebSocket server URL for real-time collaboration)
# - GOOGLE_CLIENT_ID (for Google OAuth)
# - GOOGLE_CLIENT_SECRET (for Google OAuth)

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
│   │   │   ├── documents/        # Document CRUD operations
│   │   │   ├── admin/            # Admin document management
│   │   │   ├── auth/             # Authentication routes
│   │   │   ├── engineering-terms/ # Engineering terms search
│   │   │   └── subscribe/        # Newsletter subscription
│   │   ├── collaborative-editor/ # Collaborative editor pages
│   │   │   ├── [id]/             # Document editor route
│   │   │   └── page.tsx          # Editor landing page
│   │   ├── docs/                 # Documentation pages
│   │   │   ├── [topic]/          # Dynamic topic routes
│   │   │   └── page.tsx          # Docs landing page
│   │   ├── flashcards/           # Flashcard pages
│   │   │   ├── [category]/       # Dynamic category routes
│   │   │   └── page.tsx          # Flashcards landing
│   │   ├── admin/                # Admin dashboard
│   │   ├── profile/              # User profile
│   │   ├── types/                # TypeScript types
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/               # React components
│   │   ├── editor/               # Collaborative editor components
│   │   │   ├── CollaborativeEditor.tsx  # Main editor with Yjs
│   │   │   ├── EditorToolbar.tsx        # Formatting toolbar
│   │   │   ├── UserPresence.tsx         # User avatars & presence
│   │   │   ├── DocumentActions.tsx      # Save, fork, submit actions
│   │   │   ├── DocumentCard.tsx         # Document grid card
│   │   │   ├── DocumentsGrid.tsx        # Documents listing
│   │   │   ├── DocumentTitleInput.tsx   # Title input field
│   │   │   ├── MDXPreview.tsx           # Markdown preview
│   │   │   ├── NewDocumentButton.tsx    # Create new document
│   │   │   └── ShareButton.tsx          # Share document link
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
│   │   ├── elasticsearch.ts      # Elasticsearch client & queries
│   │   ├── icon-map.ts           # Icon mapping
│   │   ├── resend.ts             # Email client
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── supabase.ts           # Supabase client
│   │   └── rate-limit-config.ts  # Rate limiting config
│   └── hooks/                    # Custom React hooks
├── content/                      # Documentation content
│   ├── dbms/                     # Database docs
│   ├── operating-systems/        # OS docs
│   ├── networking/               # Networking docs
│   ├── system-design/            # System design docs
│   └── devops/                   # DevOps docs
├── data/                         # Data files
│   ├── flashcard/                # Flashcard JSON files
│   │   ├── dbms.json
│   │   ├── operating-systems.json
│   │   ├── networking.json
│   │   ├── system-design.json
│   │   └── devops.json
│   ├── flashcard_category/       # Category metadata
│   │   └── category.json
│   ├── sample-terms.ts           # Local engineering terms fallback
│   └── elasticsearch.ndjson      # Elasticsearch bulk import data
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

### Collaborative Editor
- **[Yjs](https://github.com/yjs/yjs)** - CRDT framework for real-time collaboration
- **[TipTap](https://tiptap.dev/)** - Headless rich text editor
- **[y-websocket](https://github.com/yjs/y-websocket)** - WebSocket provider for Yjs
- **[y-prosemirror](https://github.com/yjs/y-prosemirror)** - ProseMirror binding for Yjs

### Database & Authentication
- **[Supabase](https://supabase.com/)** - PostgreSQL database and authentication
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js

### Search
- **[Elasticsearch](https://www.elastic.co/)** - Full-text search engine for engineering terms

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

### Engineering Terms Search

1. **Elasticsearch Backend**: Full-text search using `match_phrase_prefix` for autocomplete
2. **Data Import**: Use `data/elasticsearch.ndjson` to bulk import terms
3. **Normalization**: ES results normalized to `EngineeringTerm` interface with auto-generated slugs
4. **Related Terms**: Tag-based matching finds related concepts
5. **Graceful Fallback**: Uses local `sample-terms.ts` when Elasticsearch is unavailable

### Collaborative Editor

1. **Authentication**: NextAuth with Google OAuth for secure user access
2. **Document Creation**: Users create new documents or fork existing ones
3. **Real-Time Sync**: Yjs CRDT ensures conflict-free collaborative editing via WebSocket
4. **User Presence**: Smart awareness system shows active collaborators:
   - ≤4 users: Show all avatars with color-coded cursors
   - 5-8 users: Show names only
   - \>8 users: Show count only
5. **Auto-Save**: Documents auto-save to localStorage and Supabase
6. **Workflow**: Draft → Submit for Review → Admin Approval/Rejection
7. **Document Forking**: Collaborators can fork documents to create their own versions
8. **MDX Support**: Rich text editing with markdown preview and syntax highlighting

---

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start Next.js dev server only
npm run dev:ws       # Start WebSocket server only
npm run dev:all      # Start both Next.js and WebSocket server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📧 Newsletter Setup

1. Sign up at [Resend](https://resend.com/)
2. Verify your sending domain
3. Add `RESEND_API_KEY` to `.env`
4. Update sender email in `src/app/api/subscribe/route.ts`


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
