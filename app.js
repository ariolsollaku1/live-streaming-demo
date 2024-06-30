const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Initialize OpenAI instance with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function get_data(messages) {
  try {
    const symbols = ['META', 'AAPL', 'MSFT', 'GOOGL', 'SHOP', 'DELL', 'ASML', 'VGT', 'TSM', 'AVGO'];
    const queryParams = symbols
      .filter(symbol => messages.some(msg => msg.includes(symbol)))
      .map(symbol => `symbols=${symbol}`)
      .join('&');
    const flaskUrl = `http://34.90.167.67:5005/get_data?${queryParams}`;
    
    const flaskResponse = await axios.get(flaskUrl);

    return flaskResponse.data;
  } catch (error) {
    console.error('Error calling Flask API:', error);
    throw error;
  }
}


// Handle POST requests to /openai
app.options('/openai', cors());
app.post('/openai', async (req, res) => {
  try {
    const messages = [
      { role: "user", content: req.messages},
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "get_data",
          description: "Get data from server"
          }
        }      
    ];

    // Call the Flask API (simulated by get_data function)
    const apiResponse = get_data(req.messages);

    // Extend messages with API response
    messages.push({
      role: "assistant",
      content: `Here is the requested data: ${JSON.stringify(apiResponse)}`,
    });

    // Send messages to OpenAI for completions
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Replace with your desired OpenAI model
      messages: messages,
      tools: tools,
      tool_choice: "auto", // Default tool choice
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.use('/', express.static(__dirname));
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
