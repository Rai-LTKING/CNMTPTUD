const { docClient } = require("../config/aws-config");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Products";

const ProductModel = {
  getAll: async () => {
    const data = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );
    return data.Items;
  },
  getById: async (id) => {
    const data = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } }),
    );
    return data.Item;
  },
  save: async (product) => {
    return await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: product }),
    );
  },
  delete: async (id) => {
    return await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }),
    );
  },
  searchByName: async (name) => {
    const data = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "contains(#n, :name)", // Tìm kiếm chuỗi con (không phân biệt hoa thường tùy cấu hình, mặc định DynamoDB là có phân biệt)
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: { ":name": name },
      }),
    );
    return data.Items;
  },
};

module.exports = ProductModel;
