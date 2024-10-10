module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
        zipcode: DataTypes.STRING,
        street: DataTypes.STRING,
    }, {
        tableName: 'address',
        freezeTableName: true,
    });

    // Associate with User
    Address.associate = (models) => {
        Address.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Address;
};
