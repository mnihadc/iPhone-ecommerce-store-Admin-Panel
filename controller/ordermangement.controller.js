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

const getSalesResportPage = async (req, res, next) => {
  try {
    // Fetch all checkout records
    const checkouts = await Checkout.find().populate("items.productId");

    // Initialize metrics
    let totalSales = 0;
    let totalOrders = 0;
    let productSalesMap = {};
    let dateSalesMap = {};
    let monthSalesMap = {};

    checkouts.forEach((checkout) => {
      totalSales += checkout.totalPrice;
      totalOrders += checkout.items.length;

      checkout.items.forEach((item) => {
        if (!productSalesMap[item.productName]) {
          productSalesMap[item.productName] = {
            quantitySold: 0,
            totalSales: 0,
          };
        }
        productSalesMap[item.productName].quantitySold += item.quantity;
        productSalesMap[item.productName].totalSales += item.itemTotalPrice;
      });

      // Sales by date
      const date = checkout.createdAt.toISOString().split("T")[0]; // Extract date
      if (!dateSalesMap[date]) {
        dateSalesMap[date] = { totalSales: 0, totalOrders: 0 };
      }
      dateSalesMap[date].totalSales += checkout.totalPrice;
      dateSalesMap[date].totalOrders += checkout.items.length;

      // Sales by month
      const month = checkout.createdAt.toISOString().substring(0, 7); // Extract year-month
      if (!monthSalesMap[month]) {
        monthSalesMap[month] = { totalSales: 0, totalOrders: 0 };
      }
      monthSalesMap[month].totalSales += checkout.totalPrice;
      monthSalesMap[month].totalOrders += checkout.items.length;
    });

    // Format data for rendering
    const salesByProduct = Object.entries(productSalesMap).map(
      ([productName, data]) => ({
        productName,
        quantitySold: data.quantitySold,
        totalSales: data.totalSales,
      })
    );
    const salesByDate = Object.entries(dateSalesMap).map(([date, data]) => ({
      date,
      totalSales: data.totalSales,
      totalOrders: data.totalOrders,
    }));
    const salesByMonth = Object.entries(monthSalesMap).map(([month, data]) => ({
      month,
      totalSales: data.totalSales,
      totalOrders: data.totalOrders,
    }));

    // Render the page
    res.render("SalesReport", {
      title: "Sales Report",
      isSalesReportPage: true,
      totalSales,
      totalOrders,
      totalProductsSold: salesByProduct.length,
      salesByProduct,
      salesByDate,
      salesByMonth,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getSalesResportPage };
