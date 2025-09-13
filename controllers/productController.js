import {
  createProductValidator,
  updateProductValidator,
} from "../validation/productValidation.js";
import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      supplier,
      sortBy,
      sortOrder,
      page,
      limit,
    } = req.query;

    const filters = {};

    filters.is_deleted = false;

    if (name) {
      filters.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    let categoryArray = [];
    if (category) {
      categoryArray = Array.isArray(category)
        ? category
        : category.split(",").map((c) => c.trim());
    }
    console.log("Category Array:", categoryArray);
    if (categoryArray.length > 0) {
      filters.OR = categoryArray.map((cat) => ({
        productType: {
          name: {
            contains: cat,
            mode: "insensitive",
          },
        },
      }));
    }

    if (minPrice || maxPrice) {
      filters.sell_price = {};
      if (minPrice) filters.sell_price.gte = parseFloat(minPrice);
      if (maxPrice) filters.sell_price.lte = parseFloat(maxPrice);
    }

    if (supplier) {
      filters.supplier = {
        name: {
          contains: supplier,
          mode: "insensitive",
        },
      };
    }

    const validSortFields = ["name", "sell_price", "createdAt"];
    const orderBy = {};

    if (sortBy && validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    }

    // 👇 Pagination logic
    const take = limit ? parseInt(limit) : undefined;
    const skip =
      page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const products = await prisma.products.findMany({
      where: filters,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      skip,
      take,
      include: {
        inventory_report_details: true,
        supplier: true,
        productType: true,
        purchase_order_details: true,
        sales_order_details: true,
      },
    });

    const totalCount = await prisma.products.count({ where: filters });

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: totalCount,
        page: page ? parseInt(page) : null,
        limit: limit ? parseInt(limit) : null,
        totalPages: limit ? Math.ceil(totalCount / parseInt(limit)) : 1,
      },
    });
  } catch (error) {
    console.error("Error get all products:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const product_id = req.params.id;

  try {
    const product = await prisma.products.findUnique({
      where: { product_id },
      include: {
        inventory_report_details: true,
        supplier: true,
        productType: true,
        purchase_order_details: true,
        sales_order_details: true,
      },
    });

    if (product) {
      return res.status(200).json({ success: true, data: product });
    }

    return res
      .status(404)
      .json({ success: false, message: "No product was found" });
  } catch (error) {
    console.log("Error get details product", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, buy_price, type, unit, supplier_id } = req.body;
  const imageFile = req.file;
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await createProductValidator.validateAsync(req.body);

    const [checkType, checkUnit, checkSupplier] = await Promise.all([
      prisma.product_types.findUnique({ where: { name: type } }),
      prisma.units.findUnique({ where: { name: unit } }),
      prisma.suppliers.findUnique({ where: { supplier_id } }),
    ]);

    if (!checkType)
      return res
        .status(404)
        .json({ success: false, message: "Product type was not valid" });
    if (!checkUnit)
      return res
        .status(404)
        .json({ success: false, message: "Unit was not valid" });
    if (!checkSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier was not valid" });

    const sell_price = (1 + checkType.profit_rate) * buy_price;
    let imageUrl = { secure_url: "" };
    if (imageFile) {
      const imageBase64 = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;
      imageUrl = await cloudinary.uploader.upload(imageBase64);
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        image: imageUrl.secure_url || "",
        description,
        buy_price,
        type,
        unit,
        sell_price,
        supplier_id,
      },
    });

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error creating product:", error);
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const product_id = req.params.id;
  try {
    const checkProduct = await prisma.products.findUnique({
      where: { product_id },
    });

    console.log("checkProduct", checkProduct);
    if (checkProduct) {
      await prisma.products.update({
        where: { product_id },
        data: { is_deleted: true },
      });
      return res
        .status(200)
        .json({ success: true, message: "Delete product successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No product was found" });
    }
  } catch (error) {
    console.log("Error delete product", error);
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error.toString(),
    });
  }
};

export const updateProduct = async (req, res) => {
  const product_id = req.params.id;
  const { name, description, buy_price, type, unit, supplier_id } = req.body;
  const imageFile = req.file;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await updateProductValidator.validateAsync(req.body);

    const oldProduct = await prisma.products.findUnique({
      where: { product_id },
    });
    if (!oldProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const [checkType, checkUnit, checkSupplier] = await Promise.all([
      type ? prisma.product_types.findUnique({ where: { name: type } }) : null,
      unit ? prisma.units.findUnique({ where: { name: unit } }) : null,
      supplier_id
        ? prisma.suppliers.findUnique({ where: { supplier_id } })
        : null,
    ]);

    if (type && !checkType)
      return res
        .status(404)
        .json({ success: false, message: "Product type was not valid" });
    if (unit && !checkUnit)
      return res
        .status(404)
        .json({ success: false, message: "Unit was not valid" });
    if (supplier_id && !checkSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier was not valid" });

    const profit_rate = checkType?.profit_rate ?? oldProduct.profit_rate;
    const new_buy_price = buy_price ?? oldProduct.buy_price;
    const sell_price = (1 + profit_rate) * new_buy_price;

    let image = oldProduct.image;
    if (imageFile) {
      const imageBase64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const imageUrl = await cloudinary.uploader.upload(imageBase64);

      image = imageUrl.secure_url;
    }
    const updatedProduct = await prisma.products.update({
      where: { product_id },
      data: {
        name: name ?? oldProduct.name,
        image: image ?? oldProduct.image,
        description: description ?? oldProduct.description,
        buy_price: new_buy_price,
        type: type ?? oldProduct.type,
        unit: unit ?? oldProduct.unit,
        sell_price,
        supplier_id: supplier_id ?? oldProduct.supplier_id,
      },
    });

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
