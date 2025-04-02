const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const Job = sequelize.define("jobs", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    requirements: { type: DataTypes.TEXT, allowNull: false },
},
{
    timestamps: true
});

const Candidate = sequelize.define("candidates", {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    current_ctc: { type: DataTypes.DECIMAL(10, 2) },    
    expected_ctc: { type: DataTypes.DECIMAL(10, 2) },
    notice_period: { type: DataTypes.INTEGER },
    experience: { type: DataTypes.INTEGER },
},
{
    timestamps: true
});

const Appointment = sequelize.define("appointments", {
    job_id: { type: DataTypes.INTEGER, allowNull: false },
    candidate_id: { type: DataTypes.INTEGER, allowNull: false },
    date_time: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
},
{
    timestamps: true
});

const Conversation = sequelize.define("conversations", {
    candidate_id: { type: DataTypes.INTEGER, allowNull: false },
    transcript: { type: DataTypes.TEXT },
    entities_extracted: { type: DataTypes.JSON },
},
{
    timestamps: true
});


module.exports = {
    Job,
    Candidate,
    Appointment,
    Conversation
};
