const { Model, DataTypes, Sequelize } = require('sequelize');
const connection = require('../database/database');

class Rifa extends Model {}

Rifa = connection.define('rifas',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
});
module.exports = Rifa;
