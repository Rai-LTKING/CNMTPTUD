const docClient = require("../config/dbConfig");
const {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const LOG_TABLE = "ProductLogs";

const logAction = async (productId, action, userId) => {
  const logItem = {
    logId: Date.now().toString(),
    productId,
    action,
    userId: userId || "system",
    time: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: LOG_TABLE, Item: logItem }));
};

const getAllProducts = async (filter = {}) => {
  // Scan cơ bản, thực tế cần xử lý FilterExpression động
  let params = {
    TableName: TABLE_NAME,
    FilterExpression: "isDeleted <> :deleted", // Soft delete: Chỉ lấy sp chưa xóa
    ExpressionAttributeValues: { ":deleted": true },
  };

  // Logic tìm kiếm & lọc nâng cao (Yêu cầu 6)
  if (filter.search) {
    params.FilterExpression += " AND contains(#n, :name)";
    params.ExpressionAttributeNames = { "#n": "name" };
    params.ExpressionAttributeValues[":name"] = filter.search;
  }

  if (filter.categoryId) {
    params.FilterExpression += " AND categoryId = :cat";
    params.ExpressionAttributeValues[":cat"] = filter.categoryId;
  }

  // Khoảng giá (ví dụ demo)
  if (filter.minPrice) {
    params.FilterExpression += " AND price >= :min";
    params.ExpressionAttributeValues[":min"] = Number(filter.minPrice);
  }

  const command = new ScanCommand(params);
  const response = await docClient.send(command);
  return response.Items;
};

const saveProduct = async (product, userId, isUpdate = false) => {
  // Luôn đảm bảo isDeleted là false khi tạo mới/update
  product.isDeleted = false;

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: product,
  });
  await docClient.send(command);

  // Audit Log
  await logAction(product.id, isUpdate ? "UPDATE" : "CREATE", userId);
};

const getProductById = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id: id },
  });
  const response = await docClient.send(command);
  return response.Item;
};

// Soft Delete (Yêu cầu 3)
const softDeleteProduct = async (id, userId) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id: id },
    UpdateExpression: "set isDeleted = :true",
    ExpressionAttributeValues: { ":true": true },
  });
  await docClient.send(command);
  await logAction(id, "DELETE", userId);
};

module.exports = {
  getAllProducts,
  saveProduct,
  getProductById,
  softDeleteProduct,
};
