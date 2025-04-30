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
}