const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require("./config/database.js");
const UserRoutes = require("./routes/user_route.js");
const VoiceRoutes = require("./routes/voice_route.js");

const app = express();
const PORT = 7000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", UserRoutes);
app.use("/api", VoiceRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "Voice Agent Backend is running!" });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync database (create tables if they don't exist)
        await sequelize.sync({ force: false });
        console.log("Database & tables created!");
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`API endpoints available at http://localhost:${PORT}/api`);
        });
        
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`
    });
});

// Start the server
startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
});