const express = require('express');
const path = require('path');
const { setupAuth } = require('./server/auth');
const session = require('express-session');
const { storage } = require('./server/storage');
const { registerRoutes } = require('./server/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup session and auth
const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'devsecret123',
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
};

app.use(express.json());
app.use(session(sessionSettings));
setupAuth(app);

// API routes
registerRoutes(app);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'client/public')));

// Simple viewer for the demo
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cabo Travel - Simple Viewer</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f9fb;
          color: #333;
        }
        header {
          background-color: #2563eb;
          color: white;
          text-align: center;
          padding: 1rem;
        }
        main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .video-container {
          max-width: 800px;
          margin: 2rem auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        video {
          width: 100%;
          display: block;
        }
        h1, h2 {
          margin-top: 0;
        }
        .guide-form {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 2rem auto;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Cabo San Lucas Travel Guide</h1>
      </header>
      <main>
        <h2>Experience Paradise in Cabo San Lucas</h2>
        <p>Discover the best villas, resorts, adventures, and dining options with our comprehensive travel guide.</p>
        
        <div class="video-container">
          <video controls poster="/video-poster.svg">
            <source src="/cabo-travel.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div class="guide-form">
          <h2>Get Your Free Travel Guide</h2>
          <form id="guideForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" name="phone">
            </div>
            <div class="form-group">
              <label for="interests">Travel Interests</label>
              <textarea id="interests" name="interests" rows="3"></textarea>
            </div>
            <button type="submit">Download Guide</button>
          </form>
        </div>
      </main>
      
      <script>
        document.getElementById('guideForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            interests: document.getElementById('interests').value,
          };
          
          try {
            const response = await fetch('/api/guide-submissions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            
            if (response.ok) {
              alert('Thank you! Your guide will be emailed to you shortly.');
              document.getElementById('guideForm').reset();
            } else {
              alert('There was an error submitting your request. Please try again.');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again.');
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});