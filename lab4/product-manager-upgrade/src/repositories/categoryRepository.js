const docClient = require("../config/dbConfig");
const {
  ScanCommand,
  PutCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Categories";

const getAllCategories = async () => {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const response = await docClient.send(command);
  return response.Items;
};

const saveCategory = async (category) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: category,
  });
  return await docClient.send(command);
};

const deleteCategory = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { categoryId: id },
  });
  return await docClient.send(command);
};

module.exports = { getAllCategories, saveCategory, deleteCategory };
