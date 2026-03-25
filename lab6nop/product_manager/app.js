const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const { client } = require("./config/aws-config");
const {
  CreateTableCommand,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Hàm đợi (ms)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tự động tạo bảng với cơ chế Retry
const initDB = async () => {
  let attempts = 0;
  while (attempts < 5) {
    try {
      const { TableNames } = await client.send(new ListTablesCommand({}));
      if (!TableNames.includes("Products")) {
        await client.send(
          new CreateTableCommand({
            TableName: "Products",
            AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
            KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          }),
        );
        console.log("Bảng Products đã được tạo.");
      }
      return; // Thành công thì thoát vòng lặp
    } catch (err) {
      attempts++;
      console.log(`Đang đợi DynamoDB... (Lần thử ${attempts}/5)`);
      await sleep(2000);
    }
  }
};
initDB();

app.use("/", productRoutes);

app.listen(3000, () => console.log("App chạy tại http://localhost:3000"));
