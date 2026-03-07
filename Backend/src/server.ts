import app from "./app";
import { testMySQLConnection } from "./config/mysql";
// import connectMongoDB from "./config/mongoDB";
// import connectionMySQL from "./config/mysql";

const PORT = 3000;

async function startServer() {

  //await connectMongoDB();
  await testMySQLConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

startServer();
