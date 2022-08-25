import { createContext, useState } from "react";

interface BookData {
  id: number;
  title: string;
  description: string;
  author: string[];
  smallThumbnail: string;
  thumbnail: string;
}
interface BookContextType {
  book: {
    id: number;
    title: string;
    description: string;
    author: string[];
    smallThumbnail: string;
    thumbnail: string;
  };
  setBook: (book: BookData) => void;
}
export const defaultBookData: BookData = {
  id: 0,
  title: "",
  description: "",
  author: [],
  smallThumbnail: "",
  thumbnail: "",
};
export const BookContext = createContext<BookContextType>({
  book: defaultBookData,
  setBook: (_) => console.warn("No book set"),
});

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [book, setBook] = useState(defaultBookData);
  return (
    <BookContext.Provider value={{ book, setBook }}>
      {children}
    </BookContext.Provider>
  );
}
