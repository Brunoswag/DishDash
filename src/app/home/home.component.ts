import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Recipe {
  id: number;
  title: string;
  image: string;
  likes: string;
  saves: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  recipes: Recipe[] = [
    { id: 1, title: 'Homemade Pizza', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '10k', saves: '500' },
    { id: 2, title: 'Classic Burger', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '10k', saves: '500' },
    { id: 3, title: 'Spaghetti Bolognese', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '8k', saves: '400' },
    { id: 4, title: 'Grilled Cheese Sandwich', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '300' },
    { id: 5, title: 'Chicken Tikka Masala', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '350' },
    { id: 6, title: 'Beef Stroganoff', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '6k', saves: '320' },
    { id: 7, title: 'Tacos al Pastor', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '12k', saves: '600' },
    { id: 8, title: 'Vegan Buddha Bowl', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '9k', saves: '450' },
    { id: 9, title: 'Chocolate Chip Cookies', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '15k', saves: '700' },
    { id: 10, title: 'Avocado Toast', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '11k', saves: '480' },
    { id: 11, title: 'Pancakes with Maple Syrup', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '10k', saves: '500' },
    { id: 12, title: 'Shrimp Scampi', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '300' },
    { id: 13, title: 'Caesar Salad', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '8k', saves: '400' },
    { id: 14, title: 'French Onion Soup', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '6k', saves: '250' },
    { id: 15, title: 'Fried Rice', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '9k', saves: '420' },
    { id: 16, title: 'Baked Salmon', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '330' },
    { id: 17, title: 'Eggplant Parmesan', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '200' },
    { id: 18, title: 'Buffalo Wings', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '13k', saves: '600' },
    { id: 19, title: 'Steak Fajitas', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '8k', saves: '400' },
    { id: 20, title: 'Chili Con Carne', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '9k', saves: '450' },
    { id: 21, title: 'Ramen Noodles', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '11k', saves: '480' },
    { id: 22, title: 'Grilled Vegetables', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '210' },
    { id: 23, title: 'Meatball Subs', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '320' },
    { id: 24, title: 'Fish Tacos', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '9k', saves: '450' },
    { id: 25, title: 'Chicken Alfredo', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '10k', saves: '500' },
    { id: 26, title: 'Lamb Gyros', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '6k', saves: '280' },
    { id: 27, title: 'BBQ Pulled Pork', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '12k', saves: '580' },
    { id: 28, title: 'Vegetarian Lasagna', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '330' },
    { id: 29, title: 'Tomato Basil Soup', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '220' },
    { id: 30, title: 'Stuffed Bell Peppers', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '8k', saves: '400' },
    { id: 31, title: 'Butternut Squash Risotto', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '6k', saves: '300' },
    { id: 32, title: 'Sweet Potato Casserole', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '230' },
    { id: 33, title: 'Mac and Cheese', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '11k', saves: '490' },
    { id: 34, title: 'Pesto Pasta', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '7k', saves: '320' },
    { id: 35, title: 'Chicken Quesadillas', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '10k', saves: '510' },
    { id: 36, title: 'Banana Bread', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '12k', saves: '600' },
    { id: 37, title: 'Greek Salad', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '6k', saves: '260' },
    { id: 38, title: 'Shrimp Tacos', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '8k', saves: '370' },
    { id: 39, title: 'Quiche Lorraine', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '5k', saves: '200' },
    { id: 40, title: 'Peach Cobbler', image: 'https://placehold.co/600x400/png?text=Recipe', likes: '9k', saves: '450' }
  ];
  
}
