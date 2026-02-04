const docClient = require("../config/dbConfig");
const {
  GetCommand,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Users";

const findUserByUsername = async (username) => {
  // Scan là giải pháp đơn giản cho Lab, thực tế nên dùng Query với GSI trên username
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "username = :u",
    ExpressionAttributeValues: { ":u": username },
  });
  const response = await docClient.send(command);
  return response.Items[0];
};

const createUser = async (user) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
  });
  return await docClient.send(command);
};

module.exports = { findUserByUsername, createUser };
