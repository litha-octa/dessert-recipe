# Dessert Recipes Website - Project Structure

```
dessert-recipes/
│
├── public/
│   ├── images/
│   │   ├── recipes/
│   │   │   ├── tiramisu.jpg
│   │   │   ├── chocolate-lava-cake.jpg
│   │   │   ├── creme-brulee.jpg
│   │   │   ├── macarons.jpg
│   │   │   ├── cheesecake.jpg
│   │   │   ├── brownies.jpg
│   │   │   ├── profiteroles.jpg
│   │   │   ├── panna-cotta.jpg
│   │   │   ├── apple-pie.jpg
│   │   │   └── gelato.jpg
│   │   └── logo.svg
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Homepage (recipe grid)
│   │   ├── globals.css                 # Global styles
│   │   │
│   │   ├── recipe/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Recipe detail page
│   │   │
│   │   └── api/
│   │       ├── recipes/
│   │       │   ├── route.ts            # GET all recipes
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET single recipe
│   │       ├── generate-pdf/
│   │       │   └── route.ts            # Generate PDF
│   │       └── send-email/
│   │           └── route.ts            # Send email with PDF
│   │
│   ├── components/
│   │   ├── ui/                         # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── input.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── recipe/
│   │   │   ├── RecipeCard.tsx          # Recipe card for grid
│   │   │   ├── RecipeGrid.tsx          # Grid layout
│   │   │   ├── RecipeDetail.tsx        # Detail view
│   │   │   ├── RecipeHeader.tsx        # Hero section
│   │   │   ├── IngredientsList.tsx     # Ingredients
│   │   │   ├── InstructionsList.tsx    # Steps
│   │   │   └── RecipeInfo.tsx          # Meta info
│   │   │
│   │   ├── features/
│   │   │   ├── SearchBar.tsx           # Search recipes
│   │   │   ├── FilterBar.tsx           # Filter by category
│   │   │   ├── DownloadPDFButton.tsx   # PDF download
│   │   │   ├── ShareButtons.tsx        # Share via WhatsApp/Email
│   │   │   └── FavoriteButton.tsx      # Save to favorites
│   │   │
│   │   └── pdf/
│   │       └── RecipePDFTemplate.tsx   # PDF layout component
│   │
│   ├── lib/
│   │   ├── data/
│   │   │   └── recipes.json            # Recipe database
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                   # Class name utility
│   │   │   ├── pdfGenerator.ts         # PDF generation logic
│   │   │   └── formatters.ts           # Format time, servings, etc.
│   │   │
│   │   └── constants/
│   │       ├── categories.ts           # Recipe categories
│   │       └── colors.ts               # Color mappings
│   │
│   ├── types/
│   │   ├── recipe.ts                   # Recipe types
│   │   └── index.ts                    # Export all types
│   │
│   └── hooks/
│       ├── useRecipes.ts               # Fetch recipes hook
│       ├── useSearch.ts                # Search logic
│       └── useFavorites.ts             # Local storage favorites
│
├── .env.local                          # Environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Files Purpose

### App Directory
- `layout.tsx` - Root layout with global navigation
- `page.tsx` - Homepage with recipe grid and filters
- `recipe/[slug]/page.tsx` - Individual recipe detail page

### API Routes
- `api/recipes/route.ts` - Returns all recipes (with optional filters)
- `api/recipes/[id]/route.ts` - Returns single recipe by ID
- `api/generate-pdf/route.ts` - Generates PDF from recipe data
- `api/send-email/route.ts` - Sends recipe PDF via email

### Components
- **ui/** - Reusable UI components (buttons, cards, etc.)
- **layout/** - Layout components (navbar, footer)
- **recipe/** - Recipe-specific components
- **features/** - Feature components (search, filter, share)
- **pdf/** - PDF template component

### Library
- **data/** - JSON database with recipe data
- **utils/** - Helper functions
- **constants/** - Constant values (categories, colors)

### Types
- TypeScript type definitions for recipes and other data structures

### Hooks
- Custom React hooks for data fetching and state management
