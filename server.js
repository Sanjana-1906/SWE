const express = require('express');
const cors = require('cors'); // Import the cors package
const pool = require('./database'); // Ensure this file is correct and using mysql2's promise API

const app = express();
const port = 3001; // Make sure this port is available

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Use express.json() for parsing JSON

app.get('/api/flashcards', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM flashcards');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred while fetching flashcards' });
  }
});

app.delete('/api/flashcards', async (req, res) => { 
  try {
    const { question } = req.body; 

    if (!question) {
      return res.status(400).json({ error: 'Question is required to delete a flashcard' });
    }

    const [result] = await pool.query('DELETE FROM flashcards WHERE question = ?', [question]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No flashcard found with the specified question' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred while deleting the flashcard' });
  }
});

app.put('/api/flashcards', async (req, res) => {
  try {
    const { oldQuestion, newQuestion, newAnswer } = req.body;

    const [result] = await pool.query(
      'UPDATE flashcards SET question = ?, answer = ? WHERE question = ?',
      [newQuestion, newAnswer, oldQuestion]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Flashcard updated successfully' });
    } else {
      res.status(404).json({ error: 'Flashcard not found' });
    }
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'An error occurred while updating the flashcard' });
  }
});

app.post('/api/flashcards', async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Both question and answer are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO flashcards (question, answer) VALUES (?, ?)',
      [question, answer]
    );

    res.json({ id: result.insertId, question, answer });
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).json({ error: 'An error occurred while adding the flashcard' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
