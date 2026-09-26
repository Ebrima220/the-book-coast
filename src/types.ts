export type Category = "fiction" | "nonfiction";

export type Topic = "self-development" | "financial-literacy";

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  unitsSold: number;
  category: Category;
  topic: Topic | null;
};

export type Quote = {
  text: string;
  author: string;
  book: string;
};

export type CartItem = {
  bookId: string;
  quantity: number;
};
