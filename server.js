import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port} 🚀`);
});
