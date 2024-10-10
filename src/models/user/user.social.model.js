module.exports = (sequelize, DataTypes) => {
    const Social = sequelize.define('Social', {
        github: DataTypes.STRING,
        linkedin: DataTypes.STRING,
        leetcode: DataTypes.STRING,
        hackerrank: DataTypes.STRING,
        gfg: DataTypes.STRING,
        codechef: DataTypes.STRING,
        codeforces: DataTypes.STRING,
    }, {
        tableName: 'social',
        freezeTableName: true,
    });

    // Associate with Address
    Social.associate = (models) => {
        Social.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Social;
};
