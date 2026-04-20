# Easy Budget

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/leogrigs/easy-budget)
![Coverage Badge](./badge.svg)

**Easy Budget** is a focused, minimalist expense tracker. Log what you spend, organize it your way, and understand the pattern — without income side-quests, complex flows, or hidden costs.

## Description

Easy Budget started as a free alternative to bloated personal-finance tools. It is intentionally narrow in scope: **expenses only**. No income, no net-worth tracking, no paywall. Just the cleanest way to write down where your money went and see it back in charts, filters, and totals.

## Motivation

> **"I need to organize my finances, but I haven't found a good, free solution for that yet..."**

Budget apps are either overwhelming or locked behind subscriptions. Easy Budget keeps the surface area small — add an expense, categorize it, review the totals — and makes every interaction feel modern and fast.

## Features

- 💸 **Expense tracking** — add, edit, delete in seconds; sort by any column; paginate at your pace
- 🗂️ **Configurable categories** — pick a name, color, and icon; reassign expenses when you delete a category
- 🔍 **Powerful filters** — combine text search, category multi-select, and date range in one pass
- ✅ **Bulk actions** — select multiple rows to delete or re-categorize from a floating action bar
- 🔁 **Recurring expenses** — set it once; Easy Budget backfills missed occurrences on login
- 📥 **CSV import & export** — export the filtered view, or bring in a year of expenses with per-category mapping
- 🌓 **Light & dark mode** — tuned design tokens, consistent across every surface
- 🔐 **Private by design** — Firestore security rules scope every read/write to the owner

## Technologies

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)
- ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white&style=flat)
- ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat)
- ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat)
- ![shadcn/ui](https://img.shields.io/badge/-shadcn%2Fui-000000?logo=shadcnui&logoColor=white&style=flat) + ![Radix UI](https://img.shields.io/badge/-Radix%20UI-161618?logo=radixui&logoColor=white&style=flat)
- ![TanStack Table](https://img.shields.io/badge/-TanStack%20Table-FF4154?logo=reactquery&logoColor=white&style=flat)
- ![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white&style=flat) + ![Zod](https://img.shields.io/badge/-Zod-3068B7?logo=zod&logoColor=white&style=flat)
- ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?logo=reactrouter&logoColor=white&style=flat)
- ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=white&style=flat)
- ![Vitest](https://img.shields.io/badge/-Vitest-6E9F18?logo=vitest&logoColor=white&style=flat) + React Testing Library

## Data model

Firestore is organized as subcollections scoped to the authenticated user:

```
users/{uid}
  /expenses/{docId}    { name, amount, date, categoryId, recurringId?, createdAt, updatedAt }
  /categories/{docId}  { name, color, icon, order, createdAt }
  /recurring/{docId}   { name, amount, categoryId, frequency, startDate, endDate?, lastGeneratedAt }
```

Security rules live in [`firestore.rules`](./firestore.rules) and reject anything that isn't owned by the signed-in user or doesn't match the expected shape.

## Getting started

```bash
# install
npm install

# run the dev server
npm run dev

# run the test suite (vitest + RTL)
npm run test

# lint + build
npm run lint
npm run build
```

Firebase credentials live in [`src/services/firebase.ts`](./src/services/firebase.ts). To point the app at your own Firebase project, replace the config and deploy [`firestore.rules`](./firestore.rules) to match.

## Preview

![Preview of Easy Budget Interface](https://github.com/user-attachments/assets/73b6a93a-f32f-4343-a549-946c8ad4cbb5)

## Author

**Leonardo Grigorio Ferreira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?logo=linkedin&logoColor=white&style=flat)](https://www.linkedin.com/in/leonardo-grigorio-ferreira/)  
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white&style=flat)](mailto:leo.grigorio16@gmail.com)

Thank you for exploring Easy Budget!
