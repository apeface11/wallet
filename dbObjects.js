const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const CurrentBets = require('./models/CurrentBets.js')(sequelize, Sequelize.DataTypes);
const OpenHosts = require('./models/OpenHosts.js');


module.exports = { Users, CurrentBets, OpenHosts };