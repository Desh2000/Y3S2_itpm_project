const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    const intent = req.body.queryResult.intent.displayName;
    res.json({ fulfillmentText: `Received intent: ${intent}` });
});

app.listen(3000, () => console.log('Mock server on port 3000'));