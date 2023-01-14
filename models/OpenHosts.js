module.exports = (sequelize, DataTypes) => {
	return sequelize.define('openhosts', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		game: {
			type: DataTypes.STRING,
		},
		active: {
		  type: DataTypes.Boolean,
		  defaultValue = false,
		}
	}, {
		timestamps: false,
	});
};