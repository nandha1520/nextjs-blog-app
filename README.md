
# Next.js Blog App

A responsive blog application built with Next.js App Router, TypeScript, Tailwind CSS, and React Context API.

## Features

- View blog posts from JSONPlaceholder API
- Real-time search by post title
- View individual blog post details
- Create new blog posts with form validation
- Display newly created posts first
- Save created posts using localStorage
- Handle loading, errors, and invalid post IDs
- Reusable Button, Card, and Input components
- Google-style search bar
- Responsive design for mobile and desktop
- Page-specific browser titles

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Context API
- localStorage
- Lucide React

## Getting Started

Clone the repository:

```bash
git clone https://github.com/nandha1520/nextjs-blog-app.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Routes

| Route | Description |
|---|---|
| `/` | Home page with posts and search |
| `/create` | Create a new blog post |
| `/post/[id]` | View post details |

## API

This project uses JSONPlaceholder:

https://jsonplaceholder.typicode.com

JSONPlaceholder is a mock API. New posts are stored locally in the browser rather than permanently saved on the API server.

## Author

GitHub: https://github.com/nandha1520
