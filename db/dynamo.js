const {
  DynamoDBClient,
  CreateTableCommand,
} = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const createTable = async () => {
  const params = {
    TableName: "HighlightColorProfiles",
    AttributeDefinitions: [
      { AttributeName: "userID", AttributeType: "S" },
      { AttributeName: "configID", AttributeType: "S" },
    ],
    KeySchema: [
      {
        AttributeName: "userID",
        KeyType: "HASH",
      }, // Partition key
      { AttributeName: "configID", KeyType: "RANGE" }, // Sort key
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const command = new CreateTableCommand(params);
    const response = await dynamoDB.send(command);
    console.log("Table created:", response);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const main = async () => {
  console.log("Creating dynamo table: HighlightColorProfiles");
  await createTable();
};

main();
