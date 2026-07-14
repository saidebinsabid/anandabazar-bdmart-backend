import { Category } from './category.model';
import { Product } from '../product/product.model';
import AppError from '../../utils/AppError';

// Attach real-time product counts (active, not deleted) to each category
const attachProductCounts = async (categories: any[]) => {
    const counts = await Product.aggregate([
        { $match: { isDeleted: false, status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => { if (c._id) countMap[String(c._id)] = c.count; });

    return categories.map((cat: any) => ({
        ...cat,
        id: String(cat._id),
        productCount: countMap[String(cat._id)] || 0,
    }));
};

const CategoryService = {
    async getAllCategories(parent?: string) {
        const filter: any = { isDeleted: false, isActive: true };
        // Optional ?parent=<id> filter → return only that parent's sub-categories
        if (parent !== undefined) filter.parent = parent === 'null' ? null : parent;
        const categories = await Category.find(filter)
            .populate('parent', 'name slug')
            .sort({ level: 1, order: 1, name: 1 })
            .lean();
        return attachProductCounts(categories);
    },

    async getSubCategories(parentId: string) {
        const parent = await Category.findById(parentId);
        if (!parent || parent.isDeleted) throw new AppError(404, 'Parent category not found');
        const categories = await Category.find({ parent: parentId, isDeleted: false, isActive: true })
            .populate('parent', 'name slug')
            .sort({ order: 1, name: 1 })
            .lean();
        return attachProductCounts(categories);
    },

    async getAllCategoriesAdmin() {
        const categories = await Category.find({ isDeleted: false })
            .populate('parent', 'name slug')
            .sort({ level: 1, order: 1 })
            .lean();
        return attachProductCounts(categories);
    },

    async getCategoryById(id: string) {
        const category = await Category.findById(id).populate('parent', 'name slug');
        if (!category || category.isDeleted) throw new AppError(404, 'Category not found');
        return category;
    },

    async createCategory(payload: any) {
        // Set level based on parent
        if (payload.parent) {
            const parent = await Category.findById(payload.parent);
            if (!parent) throw new AppError(404, 'Parent category not found');
            payload.level = parent.level + 1;
        } else {
            payload.level = 0;
        }

        // Auto-generate slug from name
        payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const existing = await Category.findOne({ slug: payload.slug });
        if (existing) payload.slug = `${payload.slug}-${Date.now()}`;

        return await Category.create(payload);
    },

    async updateCategory(id: string, payload: any) {
        if (payload.name) {
            payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        if (!category) throw new AppError(404, 'Category not found');
        return category;
    },

    async deleteCategory(id: string) {
        const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!category) throw new AppError(404, 'Category not found');
        return category;
    },
};

export default CategoryService;
