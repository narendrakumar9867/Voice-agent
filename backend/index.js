const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require("./config/database.js");
const UserRoutes = require("./routes/user_route.js");
const voiceAgent = require("./services/voice_agent.js");
const VoiceRoutes = require("./routes/voice_route.js");

const app = express();
const PORT = 7000;

app.use(bodyParser.json());
app.use("/api", UserRoutes);
app.use("/api", VoiceRoutes);

sequelize.sync({ force: false }).then(() => console.log("Database & tables created!")).catch(console.error);

app.listen(PORT, async () => {
    console.log(`Server is starting on ${PORT}`);
    await voiceAgent();
});
