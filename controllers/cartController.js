import { prisma } from "../config/db.js";

export const getCartByUserId = async (req, res) => {
  const { user_id } = req;
  try {
    const cart = await prisma.carts.findUnique({
      where: { user_id },
      include: {
        cart_details: {
          orderBy: { created_at: "desc" },
          include: {
            product: {
              include: {
                inventory_report_details: true,
                supplier: true,
                productType: true,
                purchase_order_details: true,
                sales_order_details: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      data: cart,
    });
  } catch (error) {
    console.log(error.toString());
    res.status(500).json({ error: "Failed to retrieve cart" });
  }
};

export const addToCart = async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;
  const { user_id } = req;

  try {
    let cart = await prisma.carts.findUnique({ where: { user_id } });
    if (!cart) {
      cart = await prisma.carts.create({ data: { user_id } });
    }

    let cart_details = await prisma.cart_details.findUnique({
      where: { cart_id_product_id: { product_id, cart_id: cart.cart_id } },
    });

    const product = await prisma.products.findUnique({
      where: { product_id },
    });
    const price = quantity * product.sell_price;

    if (!cart_details) {
      cart_details = await prisma.cart_details.create({
        data: {
          cart_id: cart.cart_id,
          product_id,
          quantity,
          total_price: price,
        },
      });
    } else {
      cart_details = await prisma.cart_details.update({
        where: { cart_id_product_id: { product_id, cart_id: cart.cart_id } },
        data: {
          quantity: cart_details.quantity + quantity,
          total_price: cart_details.total_price + price,
        },
      });
    }

    const totalQuantity = await prisma.cart_details.aggregate({
      _sum: { quantity: true },
      where: { cart_id: cart.cart_id },
    });

    const totalPrice = await prisma.cart_details.aggregate({
      _sum: { total_price: true },
      where: { cart_id: cart.cart_id },
    });

    cart = await prisma.carts.update({
      where: { cart_id: cart.cart_id },
      data: {
        total_quantity: totalQuantity._sum.quantity,
        total_price: totalPrice._sum.total_price,
      },
      include: { cart_details: { include: { product: true } } },
    });
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log("Error add to cart: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
  const { product_id } = req.params;
  const { user_id } = req;

  try {
    let cart = await prisma.carts.findUnique({ where: { user_id } });
    const cart_id = cart.cart_id;
    await prisma.cart_details.delete({
      where: { cart_id_product_id: { cart_id, product_id } },
    });

    const checkCart = await prisma.cart_details.findMany({
      where: { cart_id },
    });

    const totalQuantity = await prisma.cart_details.aggregate({
      _sum: { quantity: true },
      where: { cart_id },
    });

    const totalPrice = await prisma.cart_details.aggregate({
      _sum: { total_price: true },
      where: { cart_id },
    });

    await prisma.carts.update({
      where: { user_id },
      data: {
        total_quantity: totalQuantity._sum.quantity || 0,
        total_price: totalPrice._sum.total_price || 0,
      },
      include: { cart_details: { include: { product: true } } },
    });
    // }

    cart = await prisma.carts.findUnique({
      where: { user_id },
      include: { cart_details: { include: { product: true } } },
    });

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log("Error removing from cart: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCart = async (req, res) => {
  const { quantity } = req.body;
  const { product_id } = req.params;
  const { user_id } = req;

  try {
    const product = await prisma.products.findUnique({
      where: { product_id },
    });
    const price = quantity * product.sell_price;

    let cart = await prisma.carts.findUnique({ where: { user_id } });
    const cart_id = cart.cart_id;

    let updatedCartDetails = await prisma.cart_details.update({
      where: { cart_id_product_id: { cart_id, product_id } },
      data: { quantity, total_price: price },
    });
    const totals = await prisma.cart_details.aggregate({
      _sum: { quantity: true, total_price: true },
      where: { cart_id },
    });

    cart = await prisma.carts.update({
      where: { user_id },
      data: {
        total_quantity: totals._sum.quantity,
        total_price: totals._sum.total_price,
      },
      include: { cart_details: { include: { product: true } } },
    });

    return res.status(200).json({
      success: true,
      data: cart,
      updatedCartDetails,
    });
  } catch (error) {
    console.log("Error updating cart: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
