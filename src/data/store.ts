export const store = {
  name: "The Book Coast",
  /** Country code plus digits, no plus sign or spaces. Replace before taking real orders. */
  whatsappNumber: "2200000000",
  currency: "USD",
  locale: "en-US",
  /** Shown until a shop address exists. There is no physical address yet. */
  physicalAddress: "Physical address coming soon",
  /** Replace with the shop email before sharing the site. */
  email: "hello@thebookcoast.com",
  /**
   * Replace each URL with the real profile before sharing the site.
   * WhatsApp uses whatsappNumber above, not a separate link.
   */
  social: {
    facebook: "https://facebook.com/thebookcoast",
    instagram: "https://instagram.com/thebookcoast",
    tiktok: "https://www.tiktok.com/@thebookcoast",
    twitter: "https://twitter.com/thebookcoast",
  },
  about: {
    lead: "The Book Coast exists to make ordering books easy, accessible, and affordable for people in The Gambia and the places around it.",
    mission: [
      "Our mission is straightforward. A reader here should be able to find a book, ask for it, and hear a clear price, without waiting on a long and costly shipment from overseas.",
      "The shop is built for a phone. You browse what is on hand, add it to a cart, and send the order on WhatsApp. In that chat the shop confirms the book and the price.",
      "Easy means the steps are few. Accessible means you do not need a foreign account to begin. Affordable means the cost should stay within reach of the average Gambian, not swell once a parcel has to cross an ocean.",
    ],
    why: [
      "Ordering from Amazon, Alibaba, and other shops abroad often means waiting days, sometimes longer, and paying a shipping fee that can cost more than the book itself.",
      "A title that looks cheap on a foreign site is no longer cheap after that journey. For many readers, that is enough to put the book out of reach.",
      "The Book Coast keeps the path shorter. Books are offered through this shop, for The Gambia and the surrounding region, so ordering does not have to mean an overseas shipment every time.",
    ],
    shelves: [
      "The shelves hold fiction and non-fiction. Under non-fiction you will also find self-development and financial literacy.",
      "A book that is out of stock stays listed, so you can still open it and read about it. It can be ordered again when it is back.",
    ],
    categories: [
      { name: "Fiction", detail: "Novels and stories." },
      { name: "Non-fiction", detail: "The rest of the shelves, outside of novels." },
      { name: "Self-development", detail: "Books on habits, work, and how you live." },
      { name: "Financial literacy", detail: "Books on money, saving, and how people decide." },
    ],
    steps: [
      "Add the books you want to your cart.",
      "Send the order on WhatsApp, with your name, address, home delivery choice, and any note. Home delivery may cost extra fees.",
      "The shop confirms what is on hand, and the final price, in that chat.",
    ],
  },
};
