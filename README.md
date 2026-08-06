# The Camel Road

A simple clothing store app: Express + Pug views + MongoDB (Mongoose).

## Structure

```
app.js                    Express entrypoint
models/schema.js          Mongoose models: Product, Category, ProductVariant
routes/camel-road.js      All site routes
controllers/routerController.js   Route handlers / DB queries
views/                    Pug templates (layout.pug is the shared shell)
views/mixins/             navbar + product-card mixins
public/styles/global.css  Site styles
public/favicon/           Logo
seed/seed.js              Populates sample categories/products/variants
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and point `MONGODB_URI` at your database
   (local MongoDB or a MongoDB Atlas connection string):
   ```
   cp .env.example .env
   ```
3. Seed some sample data (creates Men/Women/Kids categories, 5 products,
   and variants with randomized stock so you can see the in/low/out-of-stock
   badges):
   ```
   npm run seed
   ```
4. Run the app:
   ```
   npm run dev     # with nodemon, auto-restarts on change
   # or
   npm start
   ```
5. Visit http://localhost:3000

## Routes

- `GET /` — home page with featured products
- `GET /products` — full catalog
- `GET /men`, `/women`, `/kids` — category pages (matched by Category name)
- `GET /products/:id` — product detail with variant/size table
- `GET /about`
- `GET /contact` (`POST /contact` just logs the submission and redirects —
  wire it up to an email service or a Message model if you need real
  persistence)

## Notes / things to extend next

- There's no cart or checkout flow yet — the "Add to cart" button on the
  detail page is a placeholder.
- No auth. If you add an admin area for managing products, protect it.
- Stock badges are computed by summing `ProductVariant.quantity` per
  product (`in` > 5, `low` 1-5, `zero` at 0).
- Product images are plain URL strings in `images: [String]`. For real
  uploads you'd want a file upload step (e.g. to S3/Cloudinary) that saves
  the resulting URL here.
