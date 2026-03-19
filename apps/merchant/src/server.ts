import { createApp } from "./app";
import { initializeDatabase } from "./db/sqlite";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT ?? 3001);

initializeDatabase();
const app = createApp();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
