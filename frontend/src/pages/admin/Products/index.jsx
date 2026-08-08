import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListFilter, Download, Edit, Trash2, Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import './Products.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import StatusBadge from '../../../components/admin/StatusBadge/StatusBadge';
import AdminButton from '../../../components/admin/Button/AdminButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImages } from '../../../services/productService';

const productSchema = z.object({
  name: z.string().trim().min(1, { message: "Product name is required" }),
  price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ required_error: "Price is required", invalid_type_error: "Price must be a number" }).positive({ message: "Price must be greater than 0" })
  ),
  stockQuantity: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" }).nonnegative({ message: "Stock cannot be negative" })
  ),
  category: z.string().trim().min(1, { message: "Category is required" }),
  imageUrl: z.string().trim().min(1, { message: "At least one product image is required" }),
  status: z.enum(["Published", "Draft", "Out of Stock"], {
    required_error: "Status is required",
  }),
  description: z.string().trim().min(1, { message: "Description is required" }),
});

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic Multi-Image States
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stockQuantity: "",
      category: "Dresses",
      imageUrl: "",
      status: "Published",
      description: "",
    },
  });

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const mapped = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl || '/images/product1.jpg',
        category: item.category,
        stockQuantity: item.stockQuantity || 0,
        status: (item.stockQuantity || 0) > 0 ? "Published" : "Out of Stock",
        rating: item.rating || 5.0,
        isNew: item.isNew || false,
        isSale: item.isSale || false,
        fabric: item.fabric || '',
        fit: item.fit || '',
        careInstructions: item.careInstructions || '',
        deliveryInfo: item.deliveryInfo || ''
      }));
      setProductList(mapped);
    } catch (err) {
      toast.error("Failed to load inventory products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setEditingProduct(null);
      setModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        price: editingProduct.price,
        stockQuantity: editingProduct.stockQuantity,
        category: editingProduct.category,
        imageUrl: editingProduct.imageUrl,
        status: editingProduct.status,
        description: editingProduct.description || "",
      });
      // Set image state
      setSelectedImages(editingProduct.imageUrl ? editingProduct.imageUrl.split(',') : []);
    } else {
      reset({
        name: "",
        price: "",
        stockQuantity: "",
        category: "Dresses",
        imageUrl: "",
        status: "Published",
        description: "",
      });
      setSelectedImages([]);
    }
  }, [editingProduct, reset, modalOpen]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    for (let file of files) {
      if (!allowedExtensions.exec(file.name)) {
        toast.error(`Invalid format: ${file.name}. Only .jpg, .jpeg, and .png are allowed.`);
        return;
      }
    }

    if (selectedImages.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading files to boutique backend...");
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      const urls = await uploadProductImages(formData);
      const combined = [...selectedImages, ...urls].slice(0, 5);
      setSelectedImages(combined);
      setValue("imageUrl", combined.join(','));
      toast.dismiss(uploadToast);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      toast.dismiss(uploadToast);
      toast.error(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updated = selectedImages.filter((_, idx) => idx !== indexToRemove);
    setSelectedImages(updated);
    setValue("imageUrl", updated.join(','));
  };

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString('en-IN')}`;
  };

  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      setProductList(prev => prev.filter(p => p.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const onSubmit = async (data) => {
    const productPayload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      imageUrl: data.imageUrl,
      category: data.category,
      rating: editingProduct ? editingProduct.rating : 5.0,
      isNew: editingProduct ? editingProduct.isNew : false,
      isSale: data.category === 'Sale',
      fabric: editingProduct ? editingProduct.fabric : '',
      fit: editingProduct ? editingProduct.fit : '',
      careInstructions: editingProduct ? editingProduct.careInstructions : '',
      deliveryInfo: editingProduct ? editingProduct.deliveryInfo : '',
      stockQuantity: Number(data.stockQuantity)
    };

    const actionToast = toast.loading(editingProduct ? "Updating product..." : "Creating product...");

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
        toast.dismiss(actionToast);
        toast.success("Product updated successfully!");
        fetchProductsData();
      } else {
        await createProduct(productPayload);
        toast.dismiss(actionToast);
        toast.success("Product created successfully!");
        fetchProductsData();
      }
      setModalOpen(false);
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Operation failed");
    }
  };

  const onInvalidSubmit = (errs) => {
    const firstErrorMessage = Object.values(errs)[0]?.message || "Please correct form errors.";
    toast.error(firstErrorMessage);
  };

  const getMainImage = (imageString) => {
    if (!imageString) return '/images/product1.jpg';
    return imageString.includes(',') ? imageString.split(',')[0] : imageString;
  };

  // Filtered list
  const filteredProducts = productList.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category?.toUpperCase() === categoryFilter.toUpperCase();
    const matchesStock = stockFilter === 'All' || 
      (stockFilter === 'In Stock' && p.stockQuantity > 0) || 
      (stockFilter === 'Out of Stock' && p.stockQuantity === 0);
    return matchesCategory && matchesStock;
  });

  // Dynamic Export to CSV
  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      toast.error("No products available to export.");
      return;
    }
    
    const headers = ["Product ID", "Name", "Category", "Price (INR)", "Stock", "Status", "Description"];
    
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.price,
      p.stockQuantity,
      p.stockQuantity > 0 ? "Published" : "Out of Stock",
      `"${(p.description || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Asha_Boutique_Inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Inventory catalog exported to CSV successfully!");
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header">
          <div className="admin-page-header__content">
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span className="admin-breadcrumb__active">Products</span>
            </nav>
            <h2 className="admin-page-header__title">Product Inventory</h2>
            <p className="admin-page-header__description">
              Manage your artisan-crafted collection, update stock levels, and curate your boutique's digital showroom.
            </p>
          </div>
          <div className="admin-page-header__actions">
            <AdminButton 
              variant={showFilters ? "primary" : "outline"} 
              icon={<ListFilter size={18} />} 
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </AdminButton>
            <AdminButton variant="outline" icon={<Download size={18} />} onClick={handleExportCSV}>
              Export
            </AdminButton>
            <AdminButton variant="primary" icon={<Plus size={18} />} onClick={handleOpenNewModal}>
              Add Product
            </AdminButton>
          </div>
        </div>

        {/* Dynamic Filters Toolbar */}
        {showFilters && (
          <div className="admin-filters" style={{ display: "flex", gap: "1.5rem", padding: "1.25rem", borderRadius: "18px", backgroundColor: "#F8F4EF", border: "1px solid #E9E3DD", marginBottom: "1.5rem", alignItems: "center" }}>
            <div className="admin-filters__group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="admin-filters__label" style={{ fontSize: "0.875rem", color: "#7a6a63", fontWeight: "500" }}>Category:</span>
              <select 
                className="admin-filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ backgroundColor: "white", border: "1px solid #E9E3DD", borderRadius: "9999px", padding: "0.4rem 1rem", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}
              >
                <option value="All">All Categories</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Tailoring">Tailoring</option>
                <option value="Accessories">Accessories</option>
                <option value="Sale">Sale</option>
              </select>
            </div>

            <div className="admin-filters__divider" style={{ width: "1px", height: "1.5rem", backgroundColor: "#E9E3DD" }}></div>

            <div className="admin-filters__group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="admin-filters__label" style={{ fontSize: "0.875rem", color: "#7a6a63", fontWeight: "500" }}>Stock Status:</span>
              <select 
                className="admin-filter-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                style={{ backgroundColor: "white", border: "1px solid #E9E3DD", borderRadius: "9999px", padding: "0.4rem 1rem", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}
              >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div style={{ marginLeft: "auto" }}>
              <button 
                onClick={() => {
                  setCategoryFilter('All');
                  setStockFilter('All');
                }}
                style={{ background: "none", border: "none", color: "#E46A53", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer" }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Price</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-[#7A655D]">Loading inventory catalog...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <EmptyState
                      icon={Plus}
                      title="No Products Found"
                      description="Create a product using the button above to begin cataloging."
                    />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="admin-table__row">
                    <td>
                      <div className="product-cell">
                        <div className="product-cell__image">
                          <img src={getMainImage(product.imageUrl)} alt={product.name} />
                        </div>
                        <div className="product-cell__info">
                          <h4>{product.name}</h4>
                          <p className="product-cell__description truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td>
                      <span className="stock-number">{product.stockQuantity} in stock</span>
                    </td>
                    <td className="admin-table__total">{formatPrice(product.price)}</td>
                    <td className="text-right">
                      <div className="admin-table__actions">
                        <button className="admin-table__action-btn" onClick={() => handleOpenEditModal(product)}>
                          <Edit size={18} />
                        </button>
                        <button className="admin-table__action-btn admin-table__action-btn--delete" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Product Creation/Editing Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg bg-[#F6F2EE] border-none rounded-[22px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2B1E1A]">
              {editingProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
            <DialogDescription className="text-[#7A655D]">
              {editingProduct ? "Update product details and save changes." : "Create a new product to publish to your boutique collection."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#2B1E1A]">Product Name</Label>
              <Input
                id="name"
                placeholder="E.g. Silk Scarf"
                {...register("name")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.name ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.name && (
                <span className="text-[#E46A53] text-xs block">{errors.name.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#2B1E1A]">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price"
                  {...register("price")}
                  className={`bg-white border-[#E9E3DD] rounded-xl ${errors.price ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
                />
                {errors.price && (
                  <span className="text-[#E46A53] text-xs block">{errors.price.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity" className="text-[#2B1E1A]">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  placeholder="Quantity"
                  {...register("stockQuantity")}
                  className={`bg-white border-[#E9E3DD] rounded-xl ${errors.stockQuantity ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
                />
                {errors.stockQuantity && (
                  <span className="text-[#E46A53] text-xs block">{errors.stockQuantity.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#2B1E1A]">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`bg-white border-[#E9E3DD] rounded-xl ${errors.category ? "border-[#E46A53] focus:ring-[#E46A53]" : ""}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dresses">Dresses</SelectItem>
                        <SelectItem value="Tops">Tops</SelectItem>
                        <SelectItem value="Tailoring">Tailoring</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <span className="text-[#E46A53] text-xs block">{errors.category.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#2B1E1A]">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`bg-white border-[#E9E3DD] rounded-xl ${errors.status ? "border-[#E46A53] focus:ring-[#E46A53]" : ""}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <span className="text-[#E46A53] text-xs block">{errors.status.message}</span>
                )}
              </div>
            </div>

            {/* Dynamic Multi-Image Upload Area */}
            <div className="space-y-2">
              <Label className="text-[#2B1E1A]">Product Images (Max 5)</Label>
              
              <div className="flex flex-wrap gap-2.5 mb-2">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl border border-[#E9E3DD] overflow-hidden group bg-white">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)} 
                      className="absolute inset-0 bg-[#E46A53]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {selectedImages.length < 5 && (
                  <label 
                    htmlFor="product-images-upload" 
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-[#E9E3DD] flex flex-col items-center justify-center cursor-pointer hover:border-[#E46A53] hover:bg-[#E46A53]/5 transition-all text-[#7A655D]"
                  >
                    <span className="text-xl font-light">{uploading ? "..." : "+"}</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="product-images-upload" 
                  multiple 
                  accept=".jpg,.jpeg,.png" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={uploading} 
                />
              </div>

              <Input
                id="imageUrl"
                placeholder="Comma separated image paths (e.g. /images/product1.jpg)"
                {...register("imageUrl")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.imageUrl ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.imageUrl && (
                <span className="text-[#E46A53] text-xs block">{errors.imageUrl.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#2B1E1A]">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about the fabric, craft, and fit..."
                rows={3}
                {...register("description")}
                className={`bg-white border-[#E9E3DD] rounded-xl ${errors.description ? "border-[#E46A53] focus-visible:ring-[#E46A53]" : ""}`}
              />
              {errors.description && (
                <span className="text-[#E46A53] text-xs block">{errors.description.message}</span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-6 mt-4 font-serif text-lg"
            >
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
