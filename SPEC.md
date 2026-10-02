# The Book Coast — product spec

Version 1 of the storefront. The owner edits data files and controls the site. Visitors browse books and send an order on WhatsApp. Payment, accounts, and an admin screen are out of scope.

## Purpose

Give The Book Coast a public website that explains the shop, lists books, and turns a cart into a WhatsApp message. The owner confirms price and payment in that chat.

## Audience

- Visitors who want to see what is in the shop and place an order.
- The owner, who updates books, quotes, store details, and sales counts by editing files in the project.

## Layout

The sample dashboard is a structure reference only.

| Region | Behavior |
| --- | --- |
| Side nav | Fixed. Does not scroll. On a small screen it folds into a menu button. |
| Top strip | Sticky. Holds search. On a small screen it also holds the cart icon. On a medium or large screen it holds the dark-mode icon. |
| Center | Scrolls. Holds the banner and the current page. |
| Cart | On a medium or large screen it is an icon at the bottom of the side nav. The browsing area uses the full width of the scrolling center. |
| Footer | Visit: physical address coming soon, email, and social links. Shown at the bottom of every page, on every screen size. |

Do not include a profile, a Live badge, notifications, an achievement card, or ratings. Books sit in 5 rows. Each row slides on its own, so moving one row leaves the others still. A row loops without end: after the last book, the same row continues with its books again. A phone shows two books in each row, with the next book peeking in. Self-Development and Financial Literacy are the exception: those lists do not slide, and a phone shows two books across. On a medium or large screen the rows stay five high, with wider cards. Each cover sits on a colored panel. Under it: the title, a short description, and a heart that saves the book in the browser. Price and stock stay on the card. Hovering a card reveals Add to cart. Touch screens keep that button visible. Out-of-stock cards show a disabled button instead.

## Side nav

Top to bottom:

1. **The Book Coast** — links to Home.
2. **Shop** — every book.
3. **In Stock** — books with `inStock: true`.
4. **Out of Stock** — books with `inStock: false`.
5. **About**
6. **Best Sales** — a button in the place Visit used to occupy. The ranked list stays hidden until that button is clicked. When it is open, scrolling moves only those books. The rest of the nav stays still. Each row links to that book.
7. **Cart** — on a medium or large screen, at the bottom of the nav, with a cart icon and the item count. Hide the count when the cart is empty. On a small screen the cart leaves the nav and sits in the top strip.
8. **Dark mode** — on a small screen, at the bottom of the menu, where the cart sits on a larger screen.

A single book is not a nav item.

## Pages

### Home

- Rotating banner.
- A short note that ordering is: add to cart, then send on WhatsApp.
- Best Sales card.

### Shop

- Every book.
- Each row labeled **In Stock** or **Out of Stock**.
- Category filters above the list.
- Opens with search matches when the visitor submits a search.

### In Stock

- Only books that can be added to the cart.
- Same category filters.

### Out of Stock

- Only unavailable books.
- Same category filters.
- A book can be opened. Add to cart stays off.

### Book

- A back arrow returns to the previous page.
- Cover, title, author, price, description, and stock label.
- In stock: add to cart.
- Out of stock: no add to cart.
- Reached from Shop, In Stock, Out of Stock, search results, the banner, or Best Sales.

### Cart

- A cart icon beside the page heading.
- Line items with quantity controls and remove.
- Total.
- A short thank-you while the visitor fills in the order. It mentions that home delivery may cost extra fees.
- Name (required), address (required), a required home-delivery choice, and an optional note. The address box sits directly under the name. The address and note boxes cannot be resized. Clicking a box to type does not add an extra outline.
- Home delivery is a choice of home delivery or without home delivery. Home delivery means extra fees may apply. The order cannot be sent until a choice is made.
- **Send order on WhatsApp** opens the shop number with the order already written in the message box. It stays off until the cart has books and the name, address, and home-delivery choice are filled in.

### About

- The store story from store config, in short sections: a lead, the mission (easy, accessible, and affordable book ordering for The Gambia and the surrounding region), why ordering from Amazon, Alibaba, and other overseas shops is slow and costly, the shelves, and how to order.

### Visit

- There is no physical address. The page says **Physical address coming soon**.
- No street, opening hours, or map.
- An email address, as a mailto link.
- Social links, each with its icon, in this order: Facebook, Instagram, TikTok, WhatsApp, and Twitter.
- WhatsApp opens a general question. It does not include the cart.

## Banner

- Replaces any greeting such as "Hi, Rahman".
- Changes on its own every 15 seconds through the quote list, so a long list rarely repeats.
- Has no previous, pause, or next controls.
- Each frame shows a real line from a book, then the author and the book title.
- If that book is in the catalog, the frame also shows its cover and links to the book page.
- The owner edits the quote list.

## Dark mode

- A crescent moon in light mode, a sun in dark mode.
- On a small screen the control is in the menu. On a medium or large screen it is in the top strip.
- Switches the whole site between light and dark.
- The choice is remembered in the browser.

## Search

- Field in the sticky top strip, only on Shop, In Stock, and Out of Stock. Hidden on every other page.
- Clicking the field or the Search button does not add an extra outline.
- Matches title and author, case-insensitive.
- Submit opens Shop filtered to matches.
- Clearing the query shows the full Shop list again.

## Filters

Shown on Shop, In Stock, and Out of Stock.

- **All** — no category filter.
- **Fiction** — `category` is `fiction`. No sub-filters.
- **Non-fiction** — `category` is `nonfiction`. Opens on **All**, which is every non-fiction book. Clicking Non-fiction reveals:
  - **All** — no topic filter. This is the default.
  - **Self-Development** — `topic` is `self-development`
  - **Financial Literacy** — `topic` is `financial-literacy`

When Self-Development or Financial Literacy is selected, those books do not slide. A small screen shows two books across. The list grows downward. All, Fiction, and All non-fiction keep the sliding rows.

Self-Development and Financial Literacy are subsets of Non-fiction. A book cannot be both fiction and one of those topics.

Filters combine with the current page. In Stock plus Fiction shows fiction that is in stock. Search matches are filtered the same way when the visitor is on Shop.

## Best Sales

- Lives in the side nav, where Visit used to be. It is not the large-screen side card.
- The ranked list stays closed until the Best Sales button is clicked. Clicking it again closes the list.
- An open list scrolls on its own. Shop, In Stock, Out of Stock, About, Cart, and dark mode stay in place.
- Ranks books by `unitsSold`, highest first.
- Omits books with `unitsSold` of 0.
- If every book is 0, the card says no sales are recorded.
- Each row links to that book.
- The owner registers a sale by increasing `unitsSold` on that book in the catalog file. The card updates from that number. There is no sale form in v1.

## Cart and WhatsApp

- Cart items are `{ bookId, quantity }` stored in `localStorage`.
- Quantity is at least 1. Removing the last unit removes the line.
- The cart page lists each book with its quantity and line price. A plus adds another copy when the book is in stock. Minus lowers the quantity, and at 1 it removes the book. Remove takes that book off. Clear all empties the cart.
- Price and title are read from the catalog at render time and again when the WhatsApp message is built.
- Out-of-stock books cannot be added. If a book later becomes out of stock while it is already in the cart, the cart line stays until the visitor removes it, and the book page no longer offers add to cart.
- The order opens in the WhatsApp message box: a short thank-you, the name, the address on its own labeled lines, home delivery as Yes or No, each book as title, quantity, unit price, and line price, the total, and the note when one was entered.
- The click opens `https://wa.me/<digits>?text=<message>` on the number from store config, so the shop chat opens with that text ready to send.
- A general question from Visit still opens `https://wa.me/<digits>?text=<message>`.
- The number and currency come from store config. The number is country code plus digits, with no `+` or spaces.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Shop |
| `/in-stock` | In Stock |
| `/out-of-stock` | Out of Stock |
| `/books/:id` | Book |
| `/cart` | Cart |
| `/about` | About |
| `/visit` | Visit |

Search keeps the visitor on `/shop` and stores the query in `q`. Category filters use `category` and `topic` on Shop, In Stock, and Out of Stock.

## Data

### `src/data/books.ts`

Each book:

| Field | Rule |
| --- | --- |
| `id` | Unique string used in the URL and the cart. |
| `title` | Required. |
| `author` | Required. |
| `price` | Number, in the store currency. |
| `cover` | Path under `public/covers/`. Use a placeholder until a real image exists. |
| `description` | Short text for the book page. |
| `inStock` | `true` = In Stock. `false` = Out of Stock. |
| `featured` | Stored on the book. The banner does not read it. The quote list decides what appears. |
| `unitsSold` | Integer. Starts at 0. The owner edits this to register a sale. |
| `category` | `fiction` or `nonfiction`. |
| `topic` | `self-development`, `financial-literacy`, or none. Only allowed when `category` is `nonfiction`. |

### `src/data/quotes.ts`

Each quote has the line, the author, and the book it comes from. The banner walks this list from start to finish.

### `src/data/store.ts`

Shop name, WhatsApp number, currency, email, Facebook, Instagram, TikTok, and Twitter links, the physical-address line (“Physical address coming soon”), and about copy. No street address, hours, or map link.

## Stack

Vite, React, TypeScript, and Tailwind. Pages are client-side routes with React Router. No database. No user accounts. Data files are TypeScript modules under `src/data/`, imported by the app.

## Out of scope for v1

- Card or mobile-money checkout.
- Customer accounts and order history.
- An admin screen for adding books.
- Exact copy counts beyond in stock / out of stock.
- Profile, Live status, notifications, and achievement tracking.
