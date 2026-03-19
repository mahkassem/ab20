import { createApp } from "./app";
import { initializeDatabase } from "./db/sqlite";

const port = Number(process.env.PORT ?? 3000);

initializeDatabase();
const app = createApp();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
