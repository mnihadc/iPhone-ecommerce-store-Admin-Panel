const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");

const homeRouter = require("./routes/home.route"); 

const app = express();

dotenv.config();

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
    layoutsDir: path.join(__dirname, "views", "layouts"),
  })
);

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const port = process.env.PORT_NO;
app.use("/", homeRouter);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
