// Spencer Lommel 4/28/25

export interface Recipe {
  id?: string;
  userId: string;
  name: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  directions: string[];
  createdAt: Date;
  likes: number;
  saves: number;
  likedBy: string[]; // Array of user IDs who liked the recipe
  savedBy: string[]; // Array of user IDs who saved the recipe
  // We may not want to store the likedBy and savedBy here forever. May remove this in the furure.
}