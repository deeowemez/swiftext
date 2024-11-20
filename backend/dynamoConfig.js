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
      type: "Heading 1",
      indent: "20px",
      style: "bold",
      size: "16px",
    },
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#FF57DE",
      configID: "1-#FF57DE",
      type: "Heading 2",
      indent: "20px",
      style: "bold",
      size: "14px",
    },
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#FFC300",
      configID: "1-#FFC300",
      type: "Subheading",
      indent: "10px",
      style: "italic",
      size: "12px",
    },
    {
      userID: "user123",
      highlightColorProfile: "1",
      configColor: "#DAF7A6",
      configID: "1-#DAF7A6",
      type: "Body",
      indent: "5px",
      style: "normal",
      size: "11px",
    },
    {
      userID: "user456",
      highlightColorProfile: "1",
      configColor: "#C70039",
      configID: "1-#C70039",
      type: "Heading 1",
      indent: "25px",
      style: "bold",
      size: "18px",
    },
    {
      userID: "user456",
      highlightColorProfile: "1",
      configColor: "#900C3F",
      configID: "1-#900C3F",
      type: "Heading 2",
      indent: "25px",
      style: "bold",
      size: "16px",
    },
    {
      userID: "user456",
      highlightColorProfile: "1",
      configColor: "#581845",
      configID: "1-#581845",
      type: "Subheading",
      indent: "15px",
      style: "italic",
      size: "13px",
    },
    {
      userID: "user456",
      highlightColorProfile: "1",
      configColor: "#1C1C1C",
      configID: "1-#1C1C1C",
      type: "Body",
      indent: "10px",
      style: "normal",
      size: "12px",
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
          type: { S: item.type },
          indent: { S: item.indent },
          style: { S: item.style },
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
    // console.log("Items in highlightConfig table:", response.Items);
    return response.Items;
  } catch (error) {
    console.error("Error listing items:", error);
  }
};


const main = async () => {
  // await createTable();
  // await insertItems();
  // const response = await getHighlightProfile("1");
  // console.log(response);
};

main();

module.exports = {getHighlightProfile};
