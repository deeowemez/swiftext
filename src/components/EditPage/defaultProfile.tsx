import axios from "axios";

const defaultProfile = (userID: string) => [
    {
        userID: { S: userID },
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
        userID: { S: userID },
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
        userID: { S: userID },
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


const insertDefaultProfile = async (userID: string) => {
    const response = await axios.post(`http://localhost:5000/api/profile/save?userID=${user.userID}`, { items: defaultProfile });
}


