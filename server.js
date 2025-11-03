import express, { json, urlencoded } from 'express';
import env from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


env.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Example API route
app.get('/api/hobbies', (req, res) => {
    const hobbiesPath = path.join(__dirname, 'hobbies.json');
    const hobbiesData = readFileSync(hobbiesPath, 'utf8');
    const hobbies = JSON.parse(hobbiesData);
    res.json(hobbies);
});

app.post('/api/add-hobby', (req, res) => {
    const hobbiesPath = path.join(__dirname, 'hobbies.json');
    const hobbiesData = readFileSync(hobbiesPath, 'utf8');
    const hobbies = JSON.parse(hobbiesData);
    
    const {hobby} = req.body;

    const existingKeys = Object.keys(hobbies);
    const numbers = existingKeys.map(key => parseInt(key.replace('h', '')));
    const maxNumber = Math.max(...numbers);
    const nextKey = `h${maxNumber + 1}`;
    hobbies[nextKey] = hobby;

    writeFileSync(hobbiesPath, JSON.stringify(hobbies, null, 2), 'utf8');
    res.status(201).json({
        message: 'Hobby added successfully', 
        key: nextKey,
        hobby: hobby
    })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});