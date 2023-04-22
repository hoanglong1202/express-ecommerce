const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.mongodb");
const PORT = port || 5000;
app.listen(PORT, () => {
  console.log("Web Server eCommerce is listening on PORT 3055");
});

process.on("SIGHINT", () => {
  console.log("Web Server eCommerce is exit");
});
