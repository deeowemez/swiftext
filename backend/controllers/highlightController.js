const pool = require('../db/psql'); // Importing database pool

const getHighlights = async (req, res) => {
    const filePath = req.query.filePath;
    try {
        const result = await pool.query(
            'SELECT highlights FROM highlights WHERE filepath = $1',
            [filePath]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No highlights found for this file and user.');
        }

        res.status(200).json({
            success: true,
            highlights: result.rows[0].highlights,
        });
    } catch (err) {
        console.error('Error fetching highlights:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch highlights' });
    }
};

const saveHighlights = async (req, res) => {
    const filePath = req.query.filePath;
    const { highlights } = req.body;

    if (!highlights) {
        return res.status(400).json({ error: 'Highlights data is required' });
    }

    try {
        const checkResult = await pool.query(
            'SELECT * FROM highlights WHERE filepath = $1',
            [filePath]
        );

        if (checkResult.rows.length > 0) {
            await pool.query(
                'UPDATE highlights SET highlights = $1 WHERE filepath = $2',
                [JSON.stringify(highlights), filePath]
            );
        } else {
            await pool.query(
                'INSERT INTO highlights (filepath, highlights) VALUES ($1, $2)',
                [filePath, JSON.stringify(highlights)]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Highlights saved successfully.',
        });
    } catch (err) {
        console.error('Error saving highlights:', err);
        res.status(500).json({ success: false, error: 'Failed to save highlights' });
    }
};

module.exports = { getHighlights, saveHighlights };