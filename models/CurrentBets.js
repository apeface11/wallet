module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currentbets', {
		host: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		user_id: {
		  type: DataTypes.STRING,
		},
		amount: {
		  type: DataTypes.INTEGER,
		  defaultValue: 0,
		  allowNull: false,
		},
		type: {
		  type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});
};