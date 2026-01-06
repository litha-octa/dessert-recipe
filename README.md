# Sweet Recipes Hub

A delightful, modern dessert recipe web application built with Next.js 16 and React 19. Discover mouthwatering desserts from around the world with step-by-step instructions, nutritional info, and downloadable PDFs.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## What's Cooking?

Sweet Recipes Hub is your go-to destination for international dessert recipes. From the creamy layers of **Italian Tiramisu** to the crackling caramel top of **French Creme Brulee**, we've curated a collection of beloved desserts that will satisfy any sweet tooth.

### Featured Recipes

| Recipe | Origin | Difficulty |
|--------|--------|------------|
| Classic Italian Tiramisu | Italy | Medium |
| Molten Chocolate Lava Cake | France | Medium |
| Classic Creme Brulee | France | Medium |
| French Macarons | France | Hard |
| New York Cheesecake | USA | Medium |
| Ultimate Fudgy Brownies | USA | Easy |
| Chocolate Profiteroles | France | Hard |
| Vanilla Panna Cotta | Italy | Easy |
| Classic Apple Pie | USA | Medium |
| Authentic Italian Gelato | Italy | Medium |

---

## Features

- **Smart Search** - Find recipes by name, ingredients, or tags
- **Category Filters** - Browse by cakes, cookies, puddings, pastries, tarts, and ice cream
- **Difficulty Levels** - Filter by easy, medium, or hard recipes
- **Detailed Instructions** - Step-by-step guidance for every recipe
- **Nutrition Info** - Calories, protein, carbs, and fat per serving
- **PDF Export** - Download recipes to cook offline
- **Social Sharing** - Share via WhatsApp or Email
- **Responsive Design** - Beautiful on desktop, tablet, and mobile
- **Smooth Animations** - Powered by Framer Motion

---

## Tech Stack

```
Frontend       Next.js 16 + React 19 + TypeScript
Styling        Tailwind CSS 4 + tailwindcss-animate
Icons          Lucide React
Animations     Framer Motion
PDF Generation @react-pdf/renderer
Email          Resend
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd dessert-recipes

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start exploring recipes!

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-pdf/    # PDF generation endpoint
│   │   ├── recipes/         # Recipe API routes
│   │   └── send-email/      # Email sharing endpoint
│   ├── recipe/[slug]/       # Dynamic recipe pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── lib/
│   ├── constants/           # Category & difficulty configs
│   ├── data/
│   │   └── recipes.json     # Recipe database
│   └── utils/               # Helper functions
└── types/
    └── recipe.ts            # TypeScript definitions
```

---

## Recipe Categories

- **Cake** - Cheesecakes, lava cakes, and more
- **Cookie** - Brownies, macarons, and crispy treats
- **Pudding** - Tiramisu, creme brulee, panna cotta
- **Pastry** - Profiteroles and choux creations
- **Tart** - Classic fruit tarts and pies
- **Ice Cream** - Gelato and frozen desserts

---

## Contributing

Found a bug or want to add a new recipe? Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-recipe`)
3. Commit your changes (`git commit -m 'Add amazing recipe'`)
4. Push to the branch (`git push origin feature/amazing-recipe`)
5. Open a Pull Request

---

## Deploy

Deploy instantly on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dessert-recipes)

---

## License

MIT License - feel free to use this project for your own sweet creations!

---

<p align="center">
  Made with butter, sugar, and Next.js
</p>
