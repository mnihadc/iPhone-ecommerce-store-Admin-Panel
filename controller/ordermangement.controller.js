const Checkout = require("../model/Checkout");
const Product = require("../model/Product");

const getOrders = async (req, res, next) => {
  try {
    const orders = await Checkout.find()
      .populate("userId", "username email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    // Map orders data to include dynamic product prices
    const ordersData = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId._id);
            return {
              productId: item.productId._id,
              productName: item.productName,
              quantity: item.quantity,
              price: `₹${(product.price * item.quantity).toLocaleString()}`,
            };
          })
        );

        const deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        // Calculate if the delivery date is within 7 days from today
        const isHighlighted = new Date() <= deliveryDate;

        return {
          orderId: order._id,
          username: order.userId ? order.userId.username : "Unknown", // Fallback if userId is null
          email: order.userId ? order.userId.email : "Unknown", // Fallback if userId is null
          offerCode: order.offerCode || "N/A",
          deliveryMethod: order.delivery,
          totalPrice: `₹${order.totalPrice.toLocaleString()}`,
          discount: `₹${order.discount.toLocaleString()}`,
          createdAt: order.createdAt.toLocaleDateString(),
          deliveryDate: deliveryDate.toLocaleDateString(),
          products: products,
          highlight: isHighlighted, // Add the highlight flag
        };
      })
    );

    // Render the Order Management page and pass the order data
    res.render("OrderMangements", {
      title: "Order Mangement",
      isOrderManagementPage: true,
      orders: ordersData,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { getOrders };
