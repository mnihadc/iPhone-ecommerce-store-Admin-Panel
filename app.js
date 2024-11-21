const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");

const homeRouter = require("./routes/home.route");
const usermangementRouter = require("./routes/usermangement.route");
const productRouter = require("./routes/product.route");
const orderRouter = require("./routes/order.route");
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    layoutsDir: path.join(__dirname, "views", "layouts"),
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT_NO;
app.use("/", homeRouter);
app.use("/user", usermangementRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
