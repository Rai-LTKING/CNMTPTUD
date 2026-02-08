const docClient = require("../config/db");
const {
  PutCommand,
  ScanCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Products";

const Product = {
  getAll: async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return response.Items;
  },
  // Lấy 1 sản phẩm để sửa
  getById: async (id) => {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    const response = await docClient.send(command);
    return response.Item;
  },
  // Dùng PutCommand cho cả thêm mới và cập nhật (vì cùng id sẽ ghi đè)
  save: async (product) => {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    });
    return await docClient.send(command);
  },
  delete: async (id) => {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    return await docClient.send(command);
  },
};

module.exports = Product;
