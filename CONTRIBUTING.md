# 🤝 Contributing to Explain Bytes

Thank you for your interest in contributing to Explain Bytes! This guide will help you understand how the project works and how you can contribute.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Adding Documentation](#adding-documentation)
- [Creating Flashcards](#creating-flashcards)
- [Contributing Engineering Terms](#contributing-engineering-terms)
- [Code Style Guidelines](#code-style-guidelines)
- [Submitting Changes](#submitting-changes)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/explain-bytes.git
   cd explain-bytes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

---

## 🏗️ Project Architecture

### How Documentation Works

Documentation is **file-based** and **automatically discovered**:

```
content/
├── [topic]/              # Each folder = one topic
│   ├── _meta.json        # Topic metadata (REQUIRED)
│   ├── intro.mdx         # Documentation files
│   ├── advanced.mdx
│   └── nested/           # Nested docs supported
│       └── deep.mdx
```

#### Key Functions

| Function | Purpose | Location |
|----------|---------|----------|
| `discoverTopics()` | Scans `/content` folders | `src/lib/docs.ts` |
| `getAllTopics()` | Returns topic metadata | `src/lib/docs.ts` |
| `getDocBySlug()` | Fetches specific doc | `src/lib/docs.ts` |
| `getNavigationForTopic()` | Builds sidebar nav | `src/lib/docs.ts` |

### How Flashcards Work

Flashcards are **JSON-based** with **type safety**:

```
data/
├── flashcard/
│   ├── dbms.json                    # Flashcard data
│   ├── operating-systems.json
│   └── ...
└── flashcard_category/
    └── category.json                # Category metadata
```

#### Key Functions

| Function | Purpose | Location |
|----------|---------|----------|
| `getFlashcardsByCategory()` | Filter by category | `src/data/flashcards.ts` |
| `getCategoryInfo()` | Get category metadata | `src/data/flashcards.ts` |
| `shuffleDeck()` | Randomize cards | `src/data/flashcards.ts` |
| `getCategoriesFromContent()` | Dynamic categories | `src/lib/flashcard-categories.ts` |

---

## 📖 Adding Documentation

### Step 1: Create Topic Folder

```bash
mkdir content/your-topic
```

### Step 2: Create `_meta.json`

This file defines your topic's appearance and metadata:

```json
{
    "id": "your-topic",
    "title": "Your Topic Title",
    "description": "Brief description of what this topic covers",
    "icon": "Database",
    "color": "oklch(0.6 0.2 240)",
    "articles": 0
}
```

**Available Icons**: `Server`, `Network`, `HardDrive`, `Database`, `CloudUploadIcon`, `FileText`

**Color Format**: Use OKLCH for consistent colors
- Format: `oklch(lightness chroma hue)`
- Lightness: 0.0 - 1.0 (0.6 recommended)
- Chroma: 0.0 - 0.4 (0.2 recommended)
- Hue: 0 - 360 (degrees)

### Step 3: Create MDX Files

Create `.mdx` files with frontmatter:

```mdx
---
title: "Introduction to Your Topic"
description: "Learn the basics of your topic"
order: 1
category: "Introduction"
---

# Introduction to Your Topic

Your content here with full MDX support!

## Code Examples

\`\`\`typescript
const example = "Hello World";
\`\`\`

## Images

![Description](/images/your-image.png)
```

**Frontmatter Fields**:
- `title` (required): Page title
- `description` (optional): Meta description
- `order` (optional): Sort order in navigation
- `category` (optional): Groups docs in sidebar
- `image` (optional): Featured image

### Step 4: Test Your Docs

```bash
npm run dev
# Visit http://localhost:3000/docs/your-topic
```

---

## 🎯 Creating Flashcards

### Step 1: Update TypeScript Type

Add your category to `src/app/types/flashcard.type.ts`:

```typescript
export type FlashcardCategory = 
    'dbms' | 
    'operating-systems' | 
    'networking' | 
    'system-design' | 
    'devops' |
    'your-category';  // Add this
```

### Step 2: Create JSON File

Create `data/flashcard/your-category.json`:

```json
[
    {
        "id": "your-category-1",
        "category": "your-category",
        "question": "What is X?",
        "answer": "X is a concept that..."
    },
    {
        "id": "your-category-2",
        "category": "your-category",
        "question": "How does Y work?",
        "answer": "Y works by..."
    }
]
```

**JSON Schema**:
```typescript
{
    id: string;           // Unique identifier (e.g., "dbms-1")
    category: string;     // Must match FlashcardCategory
    question: string;     // The question text
    answer: string;       // The answer text
}
```

### Step 3: Import in `flashcards.ts`

Edit `src/data/flashcards.ts`:

```typescript
import yourCategory from "../../data/flashcard/your-category.json";

export const flashcards: Flashcard[] = [
    ...(dbms as Flashcard[]),
    ...(os as Flashcard[]),
    // ... other imports
    ...(yourCategory as Flashcard[])  // Add this
];
```

### Step 4: Add Category Metadata

Edit `data/flashcard_category/category.json`:

```json
[
    // ... existing categories
    {
        "id": "your-category",
        "name": "Your Category Name",
        "icon": "Database",
        "color": "oklch(0.6 0.2 240)",
        "description": "Brief description"
    }
]
```

### Step 5: Test Flashcards

```bash
npm run dev
# Visit http://localhost:3000/flashcards
# Click on your new category
```

---

## 🔍 Contributing Engineering Terms

We have an Elasticsearch-powered search for engineering terms, but the dataset is still small and needs your contributions!

### Current Dataset

The data file is located at `data/elasticsearch.ndjson`. It contains terms like:
- System Design concepts
- Database terminology
- Networking terms
- Machine Learning concepts
- DevOps and Cloud Computing terms

### How to Add New Terms

#### Step 1: Understand the Format

The file uses **NDJSON** (Newline Delimited JSON) format. Each term requires **2 lines**:

```json
{"index":{"_index":"engineering_terms"}}
{"term":"Your Term","definition":"Clear, concise definition here.","category":"Category Name","tags":["tag1","tag2"]}
```

#### Step 2: Add Your Terms

Open `data/elasticsearch.ndjson` and add new terms at the end:

```json
{"index":{"_index":"engineering_terms"}}
{"term":"Circuit Breaker","definition":"A design pattern that prevents cascading failures in distributed systems by stopping requests to failing services.","category":"System Design","tags":["resilience","fault-tolerance","microservices"]}
{"index":{"_index":"engineering_terms"}}
{"term":"Blue-Green Deployment","definition":"A deployment strategy that reduces downtime by running two identical production environments.","category":"DevOps","tags":["deployment","zero-downtime","infrastructure"]}
```

#### Step 3: Validate Your JSON

Make sure:
- ✅ Each term has an index line before it
- ✅ No trailing commas in JSON
- ✅ Category matches existing categories or add a new one
- ✅ Tags are relevant and lowercase

**Available Categories**:
- System Design
- DBMS
- Operating Systems
- Networking
- DevOps
- Machine Learning
- Security
- Cloud Computing
- Distributed Systems
- Web Technologies
- Algorithms
- Data Structures
- Programming
- Information Retrieval

#### Step 4: Test Your Changes

If you have Elasticsearch running locally:

```bash
# Bulk import to Elasticsearch
curl -X POST "localhost:9200/_bulk" -H "Content-Type: application/x-ndjson" --data-binary @data/elasticsearch.ndjson
```

If not, the app will fall back to local data—just make sure your JSON is valid!

### Tips for Good Terms

- **Be Specific**: Define one concept per term
- **Be Clear**: Write for someone learning the concept
- **Add Context**: Mention when/why the concept is used
- **Use Examples**: Brief examples help understanding
- **Choose Good Tags**: Think about related searches

---

## 🎨 Code Style Guidelines

### TypeScript

- Use **TypeScript** for all new files
- Define proper types and interfaces
- Avoid `any` unless absolutely necessary
- Use descriptive variable names

```typescript
// ✅ Good
interface FlashcardProps {
    question: string;
    answer: string;
}

// ❌ Bad
const data: any = { ... };
```

### React Components

- Use **functional components** with hooks
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Use proper prop types

```tsx
// ✅ Good
interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
    return <button onClick={onClick}>{children}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `TopicCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `flashcards.ts`)
- Types: `camelCase.type.ts` (e.g., `flashcard.type.ts`)
- Hooks: `use*.ts` (e.g., `useLocalStorage.ts`)

### CSS/Styling

- Use **TailwindCSS** utility classes
- Use `className` for Tailwind
- Use inline `style` for dynamic colors (OKLCH)
- Keep styles consistent with existing components

```tsx
// ✅ Good
<div className="p-4 rounded-lg bg-card" style={{ color: cardColor }}>

// ❌ Bad
<div style={{ padding: '16px', borderRadius: '8px' }}>
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(flashcards): add DevOps category
fix(docs): correct navigation links
docs(readme): update setup instructions
```

---

## 🔄 Submitting Changes

### Pull Request Process

1. **Ensure your code works**
   ```bash
   npm run build
   npm run lint
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(topic): add new feature"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

### PR Checklist

- [ ] Code builds without errors
- [ ] No TypeScript errors
- [ ] Follows code style guidelines
- [ ] Documentation updated (if needed)
- [ ] Tested locally
- [ ] Descriptive commit messages

---

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Description**: What happened?
- **Steps to Reproduce**: How to trigger the bug?
- **Expected Behavior**: What should happen?
- **Screenshots**: If applicable
- **Environment**: OS, browser, Node version

### Feature Requests

Include:
- **Problem**: What problem does this solve?
- **Solution**: Your proposed solution
- **Alternatives**: Other solutions you considered
- **Additional Context**: Any other relevant info

---

## 💡 Tips for Contributors

### Documentation Tips

- **Be Clear**: Write for beginners
- **Use Examples**: Code examples help understanding
- **Add Diagrams**: Visual aids improve learning
- **Link Related Topics**: Cross-reference related docs
- **Test Links**: Ensure all links work

### Flashcard Tips

- **One Concept**: Each card should cover one concept
- **Clear Questions**: Make questions unambiguous
- **Concise Answers**: Keep answers focused
- **Avoid Jargon**: Explain technical terms
- **Proofread**: Check for typos and errors

### Code Tips

- **Read Existing Code**: Understand patterns first
- **Small Changes**: Make focused, incremental changes
- **Test Thoroughly**: Test on different screen sizes
- **Ask Questions**: Don't hesitate to ask for help
- **Be Patient**: Reviews may take time

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🙏 Thank You!

Your contributions make Explain Bytes better for everyone. Whether it's fixing a typo, adding documentation, or creating flashcards—every contribution matters!

**Questions?** Open an issue or reach out to [@EyePatch5263](https://github.com/EyePatch5263)

---

<p align="center">Happy Contributing! 🚀</p>
