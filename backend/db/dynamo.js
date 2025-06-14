const {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMO_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // sessionToken: process.env.AWS_SESSION_TOKEN,
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

const updateHighlightColorProfiles = async (newItems, userID) => {
  // Get the existing items in the table for the given highlightColorProfile
  console.log("userid updatehighlight: ", userID);
  const existingItems = await getHighlightProfile(userID);
  console.log("existing map: ", existingItems);

  // Convert the existing items into a map for easier comparison
  const existingItemsMap = new Map(
    existingItems.map((item) => [item.configID.S, item]),
  );

  // Compare and remove items that no longer exist in the new list
  for (const existingItem of existingItems) {
    const itemInNewList = newItems.find(
      (item) => item.configID.S === existingItem.configID.S,
    );
    if (!itemInNewList) {
      // Item is not in the new list, so delete it
      // console.log('item not in new list: ', existingItem);
      await deleteItem(existingItem.userID.S, existingItem.configID.S);
    }
  }

  // Add or update items in the table
  for (const newItem of newItems) {
    const existingItem = existingItemsMap.get(newItem.configID.S);

    if (!existingItem) {
      // Item does not exist in the table, so add it
      // console.log('Adding new item: ', newItem);
      await insertItems([newItem]);
    } else {
      // Item exists, but we re-insert it to ensure it matches the new list
      // console.log('Re-uploading item: ', newItem);
      await deleteItem(newItem.userID.S, newItem.configID.S); // Delete the existing item
      await insertItems([newItem]); // Insert the new item
    }
  }

  console.log("Table updated successfully.");
};

const defaultProfile = (userID) => [
  {
    userID: { S: userID },
    highlightColorProfile: { S: "default" },
    configColor: { S: "#91f3d4" },
    configID: { S: "default-1" },
    background: { S: "" },
    color: { S: "#000000" },
    font: { S: "serif" },
    bold: { BOOL: false },
    italic: { BOOL: true },
    underline: { BOOL: false },
    strike: { BOOL: false },
    header: { N: 1 },
    list: { S: "" },
    indent: { N: 0 },
    align: { S: "left" },
    size: { S: "huge" },
  },
  {
    userID: { S: userID },
    highlightColorProfile: { S: "default" },
    configColor: { S: "#f8ff8f" },
    configID: { S: "default-2" },
    background: { S: "" },
    color: { S: "#000000" },
    font: { S: "serif" },
    bold: { BOOL: false },
    italic: { BOOL: false },
    underline: { BOOL: true },
    strike: { BOOL: false },
    header: { N: 2 },
    list: { S: "check" },
    indent: { N: 1 },
    align: { S: "left" },
    size: { S: "large" },
  },
  {
    userID: { S: userID },
    highlightColorProfile: { S: "default" },
    configColor: { S: "#f3ad91" },
    configID: { S: "default-3" },
    background: { S: "" },
    color: { S: "#000000" },
    font: { S: "serif" },
    bold: { BOOL: true },
    italic: { BOOL: false },
    underline: { BOOL: false },
    strike: { BOOL: false },
    header: { N: 3 },
    list: { S: "" },
    indent: { N: 2 },
    align: { S: "left" },
    size: { S: "small" },
  },
];

const insertItems = async (items) => {
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
          indent: { N: item.indent.N.toString() },
          align: { S: item.align.S },
          size: { S: item.size.S },
        },
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

const getHighlightProfile = async (userID) => {
  const params = {
    TableName: "HighlightColorProfiles",
    FilterExpression: "userID = :userID",
    ExpressionAttributeValues: {
      ":userID": { S: userID },
    },
  };

  try {
    // Create and send the ScanCommand
    const command = new ScanCommand(params);
    const response = await dynamoDB.send(command);

    // Output the retrieved items
    console.log("Items in table:", response.Items);
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

  console.log(
    `Deleted all items with highlightColorProfile: ${highlightColorProfile}`,
  );
};

const main = async () => {
  await createTable();
  // await insertItems();
  // await deleteItemsByHighlightColorProfile('default');
  // const response = await getHighlightProfile("71762101b373411a");
  // console.log(response);
};

// main();

module.exports = {
  getHighlightProfile,
  insertItems,
  updateHighlightColorProfiles,
  defaultProfile,
};
