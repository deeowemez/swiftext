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

const insertItems = async (items) => {
  const colorItems = [
      {
        userID: { S: "user123" },
        highlightColorProfile: { S: "default" },
        configColor: { S: "#FF5733" },
        configID: { S: "default-1" },
        background: { S: "" },
        color: { S: "#000000" },
        font: { S: "monospace" },
        bold: { BOOL: false },
        italic: { BOOL: true },
        underline: { BOOL: false },
        strike: { BOOL: false },
        header: { N: 1 },
        list: { S: "" },
        script: { S: "" },
        indent: { N: 0 },
        align: { S: "left" },
        size: { S: "huge" },
      },
      {
        userID: { S: "user123" },
        highlightColorProfile: { S: "default" },
        configColor: { S: "#FF57DE" },
        configID: { S: "default-2" },
        background: { S: "" },
        color: { S: "#000000" },
        font: { S: "monospace" },
        bold: { BOOL: false },
        italic: { BOOL: false },
        underline: { BOOL: true },
        strike: { BOOL: false },
        header: { N: 2 },
        list: { S: "check" },
        script: { S: "" },
        indent: { N: 1 },
        align: { S: "left" },
        size: { S: "large" },
      },
      {
        userID: { S: "user123" },
        highlightColorProfile: { S: "default" },
        configColor: { S: "#FFC300" },
        configID: { S: "default-3" },
        background: { S: "" },
        color: { S: "#000000" },
        font: { S: "monospace" },
        bold: { BOOL: true },
        italic: { BOOL: false },
        underline: { BOOL: false },
        strike: { BOOL: false },
        header: { N: 3 },
        list: { S: "" },
        script: { S: "" },
        indent: { N: 2 },
        align: { S: "right" },
        size: { S: "small" },
      },
    ];
    

  // console.log('items in insertItems func: ', items);
  const results = [];
  try {
    for (const item of items) {
      const command = new PutItemCommand({
        TableName: "HighlightColorProfiles",
        Item: {
          userID: { S: item.userID.S },
          highlightColorProfile: { S: item.highlightColorProfile.S },
          configColor: { S: item.configColor.S },
          configID: { S: item.configID.S },
          color: { S: item.color.S },
          background: { S: item.background.S },
          font: { S: item.font.S },
          bold: { BOOL: item.bold.BOOL },
          italic: { BOOL: item.italic.BOOL },
          underline: { BOOL: item.underline.BOOL },
          strike: { BOOL: item.strike.BOOL },
          header: { N: item.header.N.toString() },
          list: { S: item.list.S },
          script: { S: item.script.S },
          indent: { N: item.indent.N.toString() },
          align: { S: item.align.S },
          size: { S: item.size.S },
        }
      });
      // console.log(command)
      await dynamoDB.send(command);
      // console.log("Successfully inserted item:", item);
    }
  } catch (error) {
    console.error("Error inserting item:", error);
  }
  return results;
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
    const configID = item.configID.S;
    await deleteItem(userID, configID); // Delete each item by its primary key
  }

  console.log(`Deleted all items with highlightColorProfile: ${highlightColorProfile}`);
};

const main = async () => {
  // await createTable();
  await insertItems();
  // await deleteItemsByHighlightColorProfile('default');
  const response = await getHighlightProfile("default");
  console.log(response);
};

// main();

module.exports = { getHighlightProfile, insertItems };
