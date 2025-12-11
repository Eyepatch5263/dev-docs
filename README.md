# 📚 System Design Docs

A modern, minimal documentation website built with Next.js 15+ and MDX for technical documentation. Perfect for developer guides, API references, and system design resources.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![MDX](https://img.shields.io/badge/MDX-3.0-yellow?style=flat-square&logo=mdx)

## ✨ Features

- **⚡ Next.js 15+ App Router** - Latest React Server Components architecture
- **📝 MDX Support** - Write documentation in Markdown with JSX components
- **🎨 Syntax Highlighting** - Beautiful code blocks with [rehype-pretty-code](https://github.com/rehype-pretty/rehype-pretty-code) and dual theme support
- **🖥️ Mac-Style Code Blocks** - Elegant code presentation with title bar and language labels
- **🌗 Dark Mode** - Seamless light/dark theme switching with next-themes
- **📑 Auto-Generated Navigation** - Sidebar automatically generated from content folder structure
- **📖 Table of Contents** - Auto-generated TOC from H2/H3 headings
- **🎯 shadcn/ui Components** - Clean, accessible UI components
- **📱 Responsive Design** - Works beautifully on all devices
- **🔍 SEO Optimized** - Meta tags and static generation for better discoverability

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Eyepatch5263/dev-docs.git
cd dev-docs

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

## 📁 Project Structure

```
├── content/                    # MDX documentation files
│   ├── intro.mdx              # Getting started guide
│   └── system-design/         # Topic category folder
│       ├── scalability.mdx
│       ├── load-balancing.mdx
│       ├── caching.mdx
│       ├── database-sharding.mdx
│       └── message-queues.mdx
├── src/
│   ├── app/
│   │   ├── docs/
│   │   │   ├── [...slug]/     # Dynamic doc pages
│   │   │   ├── layout.tsx     # Docs layout with sidebar
│   │   │   └── page.tsx       # Docs home page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home redirect
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Header.tsx         # Site header
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── TableOfContents.tsx
│   │   ├── ThemeToggle.tsx    # Dark mode toggle
│   │   ├── ThemeProvider.tsx
│   │   └── mdx-components.tsx # Custom MDX components
│   └── lib/
│       ├── docs.ts            # Documentation utilities
│       ├── toc.ts             # Table of contents extraction
│       └── utils.ts           # Utility functions
├── next.config.ts             # Next.js configuration
├── components.json            # shadcn/ui configuration
└── package.json
```

## 📝 Writing Documentation

### Creating a New Page

1. Create a new `.mdx` file in the `content/` directory:

```mdx
---
title: Your Page Title
description: A brief description of the page
order: 1
category: Category Name
---

# Your Page Title

Your content here...
```

### Frontmatter Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `description` | string | Brief description for SEO and preview |
| `order` | number | Sort order in navigation (lower = higher) |
| `category` | string | Category name for grouping |

### Adding Code Blocks

Use fenced code blocks with language identifiers:

````mdx
```typescript
function hello(name: string): string {
  return `Hello, ${name}!`;
}
```
````

Supported languages include: JavaScript, TypeScript, Python, Go, Rust, SQL, Bash, JSON, YAML, and more.

### Organizing Content

- **Root level files** (`content/*.mdx`) appear in "Getting Started" section
- **Subdirectories** (`content/topic/*.mdx`) create category groups
- Files are sorted by the `order` frontmatter field

## 🎨 Customization

### Theming

The project uses CSS variables for theming. Modify `src/app/globals.css` to customize colors:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). Add new components with:

```bash
npx shadcn@latest add [component-name]
```

### Custom MDX Components

Extend `src/components/mdx-components.tsx` to add custom components available in MDX files.

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |

## 📦 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Content**: [MDX](https://mdxjs.com/)
- **Syntax Highlighting**: [rehype-pretty-code](https://github.com/rehype-pretty/rehype-pretty-code) + [Shiki](https://shiki.style/)
- **Dark Mode**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Linting**: [Biome](https://biomejs.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/)

---

Built with ❤️ for developers, by developers.
