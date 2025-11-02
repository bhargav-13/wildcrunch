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
import { Plus, Edit, Trash2, Copy, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface Coupon {
  _id?: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableCategories: string[];
}

const categories = ["All", "Makhana", "Protein Puffs", "Popcorn", "Combo"];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<Coupon>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    usedCount: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    isActive: true,
    applicableCategories: ["All"],
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons");
      setCoupons(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        ...coupon,
        validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
        validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minPurchaseAmount: 0,
        maxDiscountAmount: null,
        usageLimit: null,
        usedCount: 0,
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        isActive: true,
        applicableCategories: ["All"],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon._id}`, formData);
        toast.success("Coupon updated successfully");
      } else {
        await api.post("/coupons", formData);
        toast.success("Coupon created successfully");
      }
      setIsDialogOpen(false);
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/coupons/${couponId}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggleActive = async (couponId: string) => {
    try {
      await api.post(`/coupons/${couponId}/toggle`);
      toast.success("Coupon status updated");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update coupon status");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  const isCouponValid = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    return (
      coupon.isActive &&
      validFrom <= now &&
      validUntil >= now &&
      (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 mt-2">Manage discount coupons</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon._id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="px-3 py-1 bg-orange-100 text-orange-700 rounded font-mono font-bold text-lg">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-base">
                      {coupon.description}
                    </CardTitle>
                  </div>
                  {isCouponValid(coupon) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </span>
                </div>
                {coupon.minPurchaseAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Min Purchase:</span>
                    <span className="font-semibold">
                      ₹{coupon.minPurchaseAmount}
                    </span>
                  </div>
                )}
                {coupon.maxDiscountAmount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Max Discount:</span>
                    <span className="font-semibold">
                      ₹{coupon.maxDiscountAmount}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="font-semibold">
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </span>
                </div>
                {coupon.usageLimit && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-semibold">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={coupon.isActive}
                    onCheckedChange={() => handleToggleActive(coupon._id!)}
                  />
                  <span className="text-sm text-gray-600">
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(coupon)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(coupon._id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && coupons.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No coupons found</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </DialogTitle>
            <DialogDescription>
              Fill in the coupon details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SAVE20"
                  required
                  disabled={!!editingCoupon}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Get 20% off on all products"
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value *{" "}
                  {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPurchaseAmount">Min Purchase (₹)</Label>
                <Input
                  id="minPurchaseAmount"
                  type="number"
                  min="0"
                  value={formData.minPurchaseAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minPurchaseAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Max Discount (₹)</Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  min="0"
                  value={formData.maxDiscountAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscountAmount: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="0"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.applicableCategories.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            applicableCategories: [
                              ...formData.applicableCategories,
                              cat,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            applicableCategories:
                              formData.applicableCategories.filter(
                                (c) => c !== cat
                              ),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
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
                {editingCoupon ? "Update" : "Create"} Coupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
