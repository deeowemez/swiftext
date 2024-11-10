const { DynamoDBClient, CreateTableCommand, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDB = new DynamoDBClient({
  region: "us-west-2",
  endpoint: "http://localhost:8000",  // DynamoDB Local endpoint
  credentials: {
    accessKeyId: "fakeMyKeyId",     // Fake key for local testing
    secretAccessKey: "fakeSecretAccessKey" // Fake secret for local testing
  }
});

const createTable = async () => {
  const params = {
    TableName: "highlightConfig",
    AttributeDefinitions: [
      { AttributeName: "userID", AttributeType: "S" },
      { AttributeName: "configID", AttributeType: "S" }
    ],
    KeySchema: [
      { AttributeName: "userID", KeyType: "HASH" }, // Partition key
      { AttributeName: "configID", KeyType: "RANGE" } // Sort key
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const command = new CreateTableCommand(params);
    const response = await dynamoDB.send(command);
    console.log("Table created:", response);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const insertItems = async (userID, configID, profile, configColor, type, indent, style, size) => {
  const colorItem = {
    userID: { S: userID },
    configID: { S: configID },
    profile: { S: profile },
    configColor: { S: configColor },
    type: { S: type },
    indent: { S: indent },
    style: { S: style },
    size: { S: size },
  }

  try {
    const command = new PutItemCommand({
      TableName: "highlightConfig",
      Item: colorItem
    });
    await dynamoDB.send(command);
    console.log("Successfully inserted item:", colorItem);
  } catch (error) {
    console.error("Error inserting item:", error);
  }

};

const listItemsByProfile = async (profile) => {
  const params = {
    TableName: "highlightConfig",
    FilterExpression: "profile = :profile",  // Filter for items where userID is 'user123'
    ExpressionAttributeValues: {
      ":profile": { S: profile }  // Replace with the userID you want to filter by
    }
  };

  try {
    // Create and send the ScanCommand
    const command = new ScanCommand(params);
    const response = await dynamoDB.send(command);

    // Output the retrieved items
    console.log("Items in highlightConfig table:", response.Items);
    return response.Items;
  } catch (error) {
    console.error("Error listing items:", error);
  }
};


const main = async () => {
  // await createTable();
  // await insertItems('#123', 'p1_001', 'fugly_pants', '#ffffff', 'Heading 1', '.5', 'Regular', '12px');
  // await insertItems('#321', 'p1_002', 'fugly_pants', '#aaaaaa', 'Heading 1', '.5', 'Regular', '13px');
  // await insertItems('#321', 'p2_001', 'swiss_miss', '#aaaaaa', 'Heading 1', '.5', 'Regular', '13px');
  await listItemsByProfile('fugly_pants');
  // await listItemsByProfile();
};

// Run the main function to execute the complete process
main();