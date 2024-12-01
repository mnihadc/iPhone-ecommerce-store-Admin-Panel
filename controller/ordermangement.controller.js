const Checkout = require("../model/Checkout");
const Coupon = require("../model/Coupons");
const Product = require("../model/Product");

const getOrders = async (req, res, next) => {
  try {
    const orders = await Checkout.find()
      .populate("userId", "username email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    const ordersData = await Promise.all(
      orders.map(async (order) => {
        const products = order.items.map((item) => ({
          productId: item.productId?._id || "Unknown",
          productName: item.productName,
          quantity: item.quantity,
          price: `₹${
            (item.productId?.price * item.quantity).toLocaleString() || "N/A"
          }`,
        }));

        const deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const isHighlighted = new Date() <= deliveryDate;

        return {
          orderId: order._id,
          username: order.userId?.username || "Unknown",
          email: order.userId?.email || "Unknown",
          offerCode: order.offerCode || "N/A",
          deliveryMethod: order.delivery,
          totalPrice: `₹${order.totalPrice.toLocaleString()}`,
          discount: `₹${order.discount.toLocaleString()}`,
          paymentStatus: order.paymentStatus ? "Paid" : "Pending",
          createdAt: order.createdAt.toLocaleDateString(),
          deliveryDate: deliveryDate.toLocaleDateString(),
          products,
          highlight: isHighlighted,
        };
      })
    );

    res.render("OrderMangements", {
      title: "Order Management",
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

const CreateCoupons = async (req, res, next) => {
  try {
    const { code, validUntil } = req.body;
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    const coupon = new Coupon({
      code,
      validUntil: new Date(validUntil),
    });

    await coupon.save();

    res.status(201).json({ message: "Coupon created successfully." });
  } catch (error) {
    next(error);
  }
};

const DeleteCoupons = async (req, res, next) => {
  try {
    const { code } = req.params;

    const deletedCoupon = await Coupon.findOneAndDelete({ code });

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon code not found." });
    }

    res.status(200).json({ message: "Coupon deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getSalesResportPage,
  CreateCoupons,
  DeleteCoupons,
};
