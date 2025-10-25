import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

// Product data from frontend
const products = [
  {
    id: "1",
    name: "Salt & Pepper Makhana",
    weight: "80 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/1.png",
    bgColor: "#F1B213",
    description: "Crispy and healthy Salt & Pepper flavored Makhana (Fox Nuts), perfect for a guilt-free snacking experience.",
    ingredients: "Fox Nuts, Salt, Black Pepper, Edible Oil",
    nutritionalInfo: {
      calories: "350 kcal",
      protein: "9.7g",
      carbs: "76.9g",
      fat: "0.1g",
      fiber: "14.5g"
    },
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "2",
    name: "Salt & Pepper Makhana",
    weight: "80 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/2.png",
    bgColor: "#F0C4A7",
    description: "Crispy and healthy Salt & Pepper flavored Makhana (Fox Nuts), perfect for a guilt-free snacking experience.",
    ingredients: "Fox Nuts, Salt, Black Pepper, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "3",
    name: "Sour Cream & Onion Makhana",
    weight: "80 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/3.png",
    bgColor: "#9EC417",
    description: "Tangy and creamy Sour Cream & Onion flavored Makhana for a delightful snacking experience.",
    ingredients: "Fox Nuts, Sour Cream Powder, Onion Powder, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "4",
    name: "Habanero Chilly Makhana",
    weight: "80 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/4.png",
    bgColor: "#DD815C",
    description: "Spicy and fiery Habanero Chilly flavored Makhana for those who love the heat.",
    ingredients: "Fox Nuts, Habanero Chilly Powder, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "5",
    name: "Indian Masala Puffs",
    weight: "40 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Protein Puffs",
    imageSrc: "/images/5.png",
    bgColor: "#BE9A5E",
    description: "High-protein puffs with authentic Indian masala flavor.",
    ingredients: "Protein Blend, Indian Spices, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 150
  },
  {
    id: "6",
    name: "Lime & Mint Puffs",
    weight: "40 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Protein Puffs",
    imageSrc: "/images/6.png",
    bgColor: "#AFA70B",
    description: "Refreshing Lime & Mint protein puffs for a zesty snack.",
    ingredients: "Protein Blend, Lime Powder, Mint Powder, Salt",
    inStock: true,
    stockQuantity: 150
  },
  {
    id: "7",
    name: "Magic Masala Puffs",
    weight: "40 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Protein Puffs",
    imageSrc: "/images/7.png",
    bgColor: "#EF7676",
    description: "Magical blend of spices in protein-rich puffs.",
    ingredients: "Protein Blend, Magic Masala Spices, Salt",
    inStock: true,
    stockQuantity: 150
  },
  {
    id: "8",
    name: "Pudina Popcorn",
    weight: "30 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Popcorn",
    imageSrc: "/images/8.png",
    bgColor: "#4683E9",
    description: "Fresh and minty Pudina flavored popcorn.",
    ingredients: "Popcorn, Mint Powder, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 200
  },
  {
    id: "9",
    name: "Cheese & Herbs Popcorn",
    weight: "30 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Popcorn",
    imageSrc: "/images/9.png",
    bgColor: "#DC83BD",
    description: "Cheesy and herby popcorn for cheese lovers.",
    ingredients: "Popcorn, Cheese Powder, Herbs, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 200
  },
  {
    id: "10",
    name: "Tomato Protein Puffs",
    weight: "40 gram",
    price: "₹30",
    priceNumeric: 30,
    category: "Protein Puffs",
    imageSrc: "/images/10.png",
    bgColor: "#31D3F3",
    description: "Tangy tomato flavored protein puffs.",
    ingredients: "Protein Blend, Tomato Powder, Salt",
    inStock: true,
    stockQuantity: 150
  },
  {
    id: "11",
    name: "Salted Popcorn",
    weight: "30 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Popcorn",
    imageSrc: "/images/11.png",
    bgColor: "#A187DE",
    description: "Classic salted popcorn for simple snacking pleasure.",
    ingredients: "Popcorn, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 200
  },
  {
    id: "12",
    name: "Peri Peri Popcorn",
    weight: "30 gram",
    price: "₹40",
    priceNumeric: 40,
    category: "Popcorn",
    imageSrc: "/images/12.png",
    bgColor: "#FA6A6A",
    description: "Spicy Peri Peri flavored popcorn.",
    ingredients: "Popcorn, Peri Peri Spice Mix, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 200
  },
  {
    id: "13",
    name: "Peri Peri Makhana",
    weight: "25 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/13.png",
    bgColor: "#84CE78",
    description: "Spicy Peri Peri flavored Makhana in convenient pack size.",
    ingredients: "Fox Nuts, Peri Peri Spice Mix, Salt, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "14",
    name: "Sour Cream & Onion Makhana",
    weight: "25 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/14.png",
    bgColor: "#F49454",
    description: "Tangy Sour Cream & Onion Makhana in travel-friendly size.",
    ingredients: "Fox Nuts, Sour Cream Powder, Onion Powder, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "15",
    name: "Salted & Pepper Makhana",
    weight: "25 gram",
    price: "₹200",
    priceNumeric: 200,
    category: "Makhana",
    imageSrc: "/images/15.png",
    bgColor: "#E88E8E",
    description: "Classic Salt & Pepper Makhana in handy pack.",
    ingredients: "Fox Nuts, Salt, Black Pepper, Edible Oil",
    inStock: true,
    stockQuantity: 100
  },
  {
    id: "16",
    name: "PROTEIN PUFF COMBO",
    weight: "",
    price: "₹120",
    priceNumeric: 120,
    category: "Combo",
    imageSrc: "/images/combo1.png",
    bgColor: "#F1B213",
    description: "Combo pack of assorted protein puffs - perfect value pack!",
    ingredients: "Assorted Protein Puffs",
    inStock: true,
    stockQuantity: 50
  },
  {
    id: "17",
    name: "MAKHANA JAR COMBO",
    weight: "",
    price: "₹600",
    priceNumeric: 600,
    category: "Combo",
    imageSrc: "/images/combo2.png",
    bgColor: "#F0C4A7",
    description: "Premium Makhana jar combo with multiple flavors.",
    ingredients: "Assorted Makhana Flavors",
    inStock: true,
    stockQuantity: 30
  },
  {
    id: "18",
    name: "POP CORN COMBO",
    weight: "",
    price: "₹2160",
    priceNumeric: 2160,
    category: "Combo",
    imageSrc: "/images/combo3.png",
    bgColor: "#9EC417",
    description: "Ultimate popcorn combo pack with all flavors.",
    ingredients: "Assorted Popcorn Flavors",
    inStock: true,
    stockQuantity: 20
  },
  {
    id: "19",
    name: "MAKHANA POUNCH COMBO",
    weight: "",
    price: "₹200",
    priceNumeric: 200,
    category: "Combo",
    imageSrc: "/images/combo4.png",
    bgColor: "#84CE78",
    description: "Makhana pouch combo for variety lovers.",
    ingredients: "Assorted Makhana Pouches",
    inStock: true,
    stockQuantity: 40
  }
];

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`\n✅ ${createdProducts.length} products seeded successfully!\n`);
    
    console.log('Sample products:');
    createdProducts.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
