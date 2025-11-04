import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";
import img4 from "@/assets/4.png";
import img5 from "@/assets/5.png";
import img6 from "@/assets/6.png";
import img7 from "@/assets/7.png";
import img8 from "@/assets/8.png";
import img9 from "@/assets/9.png";
import img10 from "@/assets/10.png";
import img11 from "@/assets/11.png";
import img12 from "@/assets/12.png";
import img13 from "@/assets/13.png";
import img14 from "@/assets/14.png";
import img15 from "@/assets/15.png";
import img16 from "@/assets/combo1.png"
import img17 from "@/assets/combo2.png"
import img18 from "@/assets/combo3.png"
import img19 from "@/assets/combo4.png"


export interface Product {
  id: string ;
  name: string;
  weight: string;
  price: string;
  pricing?: {
    individual: {
      price: number;
      originalPrice: number;
    };
    packOf2: {
      price: number;
      originalPrice: number;
      discount: number;
    };
    packOf4: {
      price: number;
      originalPrice: number;
      discount: number;
    };
  };
  category: string;
  imageSrc: string;
  bgColor: string;
}

// Product Data
const products = [
{
    id: "1",
    name: "Salt & Pepper Makhana",
    weight: "80 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img1,
    bgColor: "#F1B213",
},
{
    id: "2",
    name: "Salt & Pepper Makhana",
    weight: "80 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img2,
    bgColor: "#F0C4A7",
},
{
    id: "3",
    name: "Sour Cream & Onion Makhana",
    weight: "80 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img3,
    bgColor: "#9EC417",
},
{
    id: "4",
    name: "Habanero Chilly Makhana",
    weight: "80 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img4,
    bgColor: "#DD815C",
},
{
    id: "5",
    name: "Indian Masala Puffs",
    weight: "40 gram",
    price: "₹40",
    category: "Protein Puffs",
    imageSrc: img5,
    bgColor: "#BE9A5E",
},
{
    id: "6",
    name: "Lime & Mint Puffs",
    weight: "40 gram",
    price: "₹40",
    category: "Protein Puffs",
    imageSrc: img6,
    bgColor: "#AFA70B",
},
{
    id: "7",
    name: "Magic Masala Puffs",
    weight: "40 gram",
    price: "₹40",
    category: "Protein Puffs",
    imageSrc: img7,
    bgColor: "#EF7676",
},
{
    id: "8",
    name: "Pudina Popcorn",
    weight: "30 gram",
    price: "₹40",
    category: "Popcorn",
    imageSrc: img8,
    bgColor: "#4683E9",
},
{
    id: "9",
    name: "Cheese & Herbs Popcorn",
    weight: "30 gram",
    price: "₹40",
    category: "Popcorn",
    imageSrc: img9,
    bgColor: "#DC83BD",
},
{
    id: "10",
    name: "Tomato Protein Puffs",
    weight: "40 gram",
    price: "₹30",
    category: "Protein Puffs",
    imageSrc: img10,
    bgColor: "#31D3F3",
},
{
    id: "11",
    name: "Salted Popcorn",
    weight: "30 gram",
    price: "₹40",
    category: "Popcorn",
    imageSrc: img11,
    bgColor: "#A187DE",
},
{
    id: "12",
    name: "Peri Peri Popcorn",
    weight: "30 gram",
    price: "₹40",
    category: "Popcorn",
    imageSrc: img12,
    bgColor: "#FA6A6A",
},
{
    id: "13",
    name: "Peri Peri Makhana",
    weight: "25 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img13,
    bgColor: "#84CE78",
},
{
    id: "14",
    name: "Sour Cream & Onion Makhana",
    weight: "25 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img14,
    bgColor: "#F49454",
},
{
    id: "15",
    name: "Salted & Pepper Makhana",
    weight: "25 gram",
    price: "₹200",
    category: "Makhana",
    imageSrc: img15,
    bgColor: "#E88E8E",
},
{
    id: "16",
    name: "PROTEIN PUFF COMBO",
    weight: "",
    price: "₹120",
    category: "Combo",
    imageSrc: img16,
    bgColor: "#F1B213",
},
{
    id: "17",
    name: "MAKHANA JAR COMBO",
    weight: "",
    price: "₹600",
    category: "Combo",
    imageSrc: img17,
    bgColor: "#F0C4A7",
},
{
    id: "18",
    name: "POP CORN COMBO",
    weight: "",
    price: "₹2160",
    category: "Combo",
    imageSrc: img17,
    bgColor: "#9EC417",
},
{
    id: "19",
    name: "MAKHANA POUNCH COMBO",
    weight: "",
    price: "₹200",
    category: "Combo",
    imageSrc: img19,
    bgColor: "#84CE78",
}

];


export default products;