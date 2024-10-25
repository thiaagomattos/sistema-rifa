// Model/NumeroRifa.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');

class NumeroRifa extends Model {}

NumeroRifa.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rifaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rifas', // Nome da tabela referenciada
            key: 'id'
        }
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Por padrão, os números estão disponíveis
    }
}, {
    sequelize,
    modelName: 'NumeroRifa',
    tableName: 'numero_rifas', // Nome da tabela no banco de dados
    timestamps: false // Se não usar createdAt e updatedAt
});


module.exports = NumeroRifa;
