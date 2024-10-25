// Model/CompraNumero.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');

class CompraNumero extends Model {}

CompraNumero.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    compraId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compras', // Nome da tabela referenciada
            key: 'id'
        }
    },
    numeroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'numero_rifas', // Nome da tabela referenciada
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'CompraNumero',
    tableName: 'compra_numeros', // Nome da tabela no banco de dados
    timestamps: false // Se não usar createdAt e updatedAt
});

module.exports = CompraNumero;
