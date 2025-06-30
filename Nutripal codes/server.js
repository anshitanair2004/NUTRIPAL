const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

app.use(cors()); // Enable CORS for client-side requests

app.get('/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;
  if (!ingredients) {
    return res.status(400).send('Ingredients are required.');
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const url = `https://api.openai.com/v1/completions`;

  try {
    const response = await axios.post(url, {
      model: 'text-davinci-003', // Adjust model based on your needs
      prompt: `Generate creative recipes using the following ingredients: ${ingredients}`,
      max_tokens: 256, // Adjust the number of tokens (words) for longer recipes
      temperature: 0.7, // Adjust temperature for creativity (0 = deterministic, 1 = more creative)
      top_p: 1, // Adjust for favoring higher probability completions
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
    });

    const recipes = response.data.choices[0].text.trim();
    res.json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching recipes.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
