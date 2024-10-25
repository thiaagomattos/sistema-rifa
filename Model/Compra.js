// Model/Compra.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');

class Compra extends Model {}

Compra.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numeros:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rifaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rifas', // Nome da tabela referenciada
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Compra',
    tableName: 'compras', // Nome da tabela no banco de dados
    timestamps: false // Se não usar createdAt e updatedAt
});

module.exports = Compra;
