import {
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Glasses,
  Shirt,
  ShoppingBag,
  Handbag,
  Wallet,
  Umbrella,
  Key,
  FileText,
  Book,
  BookHeart,
  Cable,
  Plug,
  Gift,
  Bike,
  Music,
  Gamepad2,
  Dumbbell,
  Tag,
  Package,
} from "lucide-react";

// The icons an admin can choose from when creating/editing a category.
// A category stores just the "key" string (e.g. "handbag"), so db.json
// stays plain data and the actual component is looked up here.
export const CATEGORY_ICONS = [
  { key: "cable", label: "Cable", Icon: Cable },
  { key: "plug", label: "Plug", Icon: Plug },
  { key: "smartphone", label: "Phone", Icon: Smartphone },
  { key: "laptop", label: "Laptop", Icon: Laptop },
  { key: "headphones", label: "Headphones", Icon: Headphones },
  { key: "camera", label: "Camera", Icon: Camera },
  { key: "gamepad", label: "Games", Icon: Gamepad2 },
  { key: "watch", label: "Watch", Icon: Watch },
  { key: "glasses", label: "Glasses", Icon: Glasses },
  { key: "shirt", label: "Clothing", Icon: Shirt },
  { key: "handbag", label: "Handbag", Icon: Handbag },
  { key: "shopping-bag", label: "Shopping bag", Icon: ShoppingBag },
  { key: "wallet", label: "Wallet", Icon: Wallet },
  { key: "umbrella", label: "Umbrella", Icon: Umbrella },
  { key: "key", label: "Key", Icon: Key },
  { key: "file-text", label: "Document", Icon: FileText },
  { key: "book", label: "Book", Icon: Book },
  { key: "book-heart", label: "Book (heart)", Icon: BookHeart },
  { key: "gift", label: "Gift", Icon: Gift },
  { key: "bike", label: "Bike", Icon: Bike },
  { key: "music", label: "Music", Icon: Music },
  { key: "dumbbell", label: "Sports", Icon: Dumbbell },
  { key: "tag", label: "Tag", Icon: Tag },
  { key: "package", label: "Package", Icon: Package },
];

export const DEFAULT_CATEGORY_ICON = "tag";

const ICON_BY_KEY = Object.fromEntries(
  CATEGORY_ICONS.map(({ key, Icon }) => [key, Icon]),
);

// Unknown or missing keys fall back to a generic package icon instead
// of crashing the page.
export function getCategoryIcon(key) {
  return ICON_BY_KEY[key] || Package;
}
