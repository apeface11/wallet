module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		rs3: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		O7: {
		  type: DataTypes.INTEGER,
		  defaultValue: 0,
		  allowNull: false,
		}
	}, {
		timestamps: false,
	});
};