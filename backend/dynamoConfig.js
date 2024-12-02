const { DynamoDBClient, CreateTableCommand, PutItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

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
    TableName: "HighlightColorProfiles",
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

const insertItems = async () => {
  const colorItems = [
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#FF5733",
      configID: "1-#FF5733",
      backgroundColor: "",
      color: "#000000",
      font: "monospace",
      bold: false,
      italic: true,
      underline: false,
      strike: false,
      header: 1,
      list: '',
      script: '',
      indent: 0,
      align: 'left',
      size: 'huge',
    },
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#FF57DE",
      configID: "1-#FF57DE",
      color: "#000000",
      backgroundColor: "",
      font: "monospace",
      bold: false,
      italic: false,
      underline: true,
      strike: false,
      header: 2,
      list: 'check',
      script: '',
      indent: 1,
      align: 'left',
      size: 'large',
    },
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#FFC300",
      configID: "1-#FFC300",
      color: "#000000",
      backgroundColor: "",
      font: "monospace",
      bold: true,
      italic: false,
      underline: false,
      strike: false,
      header: 3,
      list: '',
      script: 'super',
      indent: 2,
      align: 'right',
      size: 'small',
    },
  ];


  try {
    for (const item of colorItems) {
      const command = new PutItemCommand({
        TableName: "HighlightColorProfiles",
        Item: {
          userID: { S: item.userID },
          highlightColorProfile: { S: item.highlightColorProfile },
          configColor: { S: item.configColor },
          configID: { S: item.configID },
          color: { S: item.color },
          backgroundColor: { S: item.backgroundColor },
          font: { S: item.font },
          bold: { BOOL: item.bold },
          italic: { BOOL: item.italic },
          underline: { BOOL: item.underline },
          strike: { BOOL: item.strike },
          header: { N: item.header.toString() },
          list: { S: item.list },
          script: { S: item.script },
          indent: { N: item.indent.toString() },
          align: { S: item.align },
          size: { S: item.size },
        }
      });
      console.log(command)
      await dynamoDB.send(command);
      
      console.log("Successfully inserted item:", item);
    }
  } catch (error) {
    console.error("Error inserting item:", error);
  }

};

const getHighlightProfile = async (profile) => {
  const params = {
    TableName: "HighlightColorProfiles",
    FilterExpression: "highlightColorProfile  = :profile",  // Filter for items where userID is 'user123'
    ExpressionAttributeValues: {
      ":profile": { S: profile }  // Replace with the userID you want to filter by
    }
  };

  try {
    // Create and send the ScanCommand
    const command = new ScanCommand(params);
    const response = await dynamoDB.send(command);

    // Output the retrieved items
    // console.log("Items in table:", response.Items);
    return response.Items;
  } catch (error) {
    console.error("Error listing items:", error);
  }
};

// Function to delete a specific item
const deleteItem = async (userID, configID) => {
  const params = {
    TableName: "HighlightColorProfiles",
    Key: {
      userID: { S: userID },
      configID: { S: configID },
    },
  };

  try {
    const command = new DeleteItemCommand(params);
    await dynamoDB.send(command);
    console.log(`Deleted item with userID: ${userID}, configID: ${configID}`);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const deleteItemsByHighlightColorProfile = async (highlightColorProfile) => {
  const items = await getHighlightProfile(highlightColorProfile);

  for (const item of items) {
    const userID = item.userID.S;
    const configID = item.configID.N;
    await deleteItem(userID, configID); // Delete each item by its primary key
  }

  console.log(`Deleted all items with highlightColorProfile: ${highlightColorProfile}`);
};

const main = async () => {
  // await createTable();
  // await insertItems();
  // await deleteItemsByHighlightColorProfile('1');
  const response = await getHighlightProfile("1");
  console.log(response);
};

// main();

module.exports = {getHighlightProfile};
