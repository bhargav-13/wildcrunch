"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

interface Product {
  _id?: string;
  id: string;
  name: string;
  weight: string;
  price: string;
  priceNumeric: number;
  category: string;
  imageSrc: string;
  bgColor: string;
  description: string;
  ingredients: string;
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  inStock: boolean;
  stockQuantity: number;
}

const categories = ["Makhana", "Protein Puffs", "Popcorn", "Combo"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    weight: "",
    price: "",
    priceNumeric: 0,
    category: "Makhana",
    imageSrc: "",
    bgColor: "#F1B213",
    description: "",
    ingredients: "",
    nutritionalInfo: {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    },
    inStock: true,
    stockQuantity: 100,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        nutritionalInfo: product.nutritionalInfo || {
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          fiber: "",
        },
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: `product-${Date.now()}`,
        name: "",
        weight: "",
        price: "",
        priceNumeric: 0,
        category: "Makhana",
        imageSrc: "",
        bgColor: "#F1B213",
        description: "",
        ingredients: "",
        nutritionalInfo: {
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          fiber: "",
        },
        inStock: true,
        stockQuantity: 100,
      });
    }
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate priceNumeric from price string
    const priceValue = parseFloat(formData.price.replace(/[^0-9.]/g, ""));

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "nutritionalInfo") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== "imageSrc" && key !== "_id") {
          submitData.append(key, formData[key as keyof Product] as string);
        }
      });

      // Append priceNumeric
      submitData.append("priceNumeric", priceValue.toString());

      // Append image file if selected
      if (selectedImage) {
        submitData.append("image", selectedImage);
      } else if (formData.imageSrc) {
        // Keep existing image URL if no new file selected
        submitData.append("imageSrc", formData.imageSrc);
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product created successfully");
      }
      setIsDialogOpen(false);
      setSelectedImage(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id || product.id}>
              <CardContent className="p-6">
                <div
                  className="h-40 rounded-lg mb-4 flex items-center justify-center"
                  style={{ backgroundColor: product.bgColor }}
                >
                  {product.imageSrc ? (
                    <img
                      src={product.imageSrc}
                      alt={product.name}
                      className="h-32 object-contain"
                    />
                  ) : (
                    <span className="text-white text-sm">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.weight}</p>
                <p className="text-lg font-bold text-orange-600 mb-2">
                  {product.price}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No products found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Fill in the product details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="e.g., 100g"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., ₹299"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload
              value={formData.imageSrc}
              onChange={(url) => setFormData({ ...formData, imageSrc: url })}
              onFileSelect={setSelectedImage}
            />

            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <Input
                id="bgColor"
                type="color"
                value={formData.bgColor}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Nutritional Information</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Calories"
                  value={formData.nutritionalInfo.calories}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        calories: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Protein"
                  value={formData.nutritionalInfo.protein}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        protein: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Carbs"
                  value={formData.nutritionalInfo.carbs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        carbs: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Fat"
                  value={formData.nutritionalInfo.fat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        fat: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  placeholder="Fiber"
                  value={formData.nutritionalInfo.fiber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalInfo: {
                        ...formData.nutritionalInfo,
                        fiber: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">In Stock</Label>
                <div className="flex items-center h-10">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, inStock: checked })
                    }
                  />
                  <span className="ml-2 text-sm">
                    {formData.inStock ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? "Update" : "Create"} Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
