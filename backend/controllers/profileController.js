const { getHighlightProfile, updateHighlightColorProfiles } = require('../db/dynamoConfig');

const getProfile = async (req, res) => {
    const profileID = req.params.id;
    try {
        const response = await getHighlightProfile(profileID);
        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (err) {
        console.error('Error getting highlight profile:', err);
        res.status(500).json({
            success: false,
            error: 'Error getting highlight profile',
        });
    }
};

const saveProfile = async (req, res) => {
    const items = req.body.items;
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items format' });
    }

    try {
        const response = await updateHighlightColorProfiles(items);
        res.status(200).json({
            success: true,
            message: "Items inserted successfully",
            data: response,
        });
    } catch (err) {
        console.error("Error inserting items:", err);
        res.status(500).json({
            success: false,
            error: "Failed to insert items",
        });
    }
};

module.exports = { getProfile, saveProfile };