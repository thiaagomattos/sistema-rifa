const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const rifasController = require("./routes/rifasController");
const sequelize = require('./database/database');

const Rifa = require('./Model/Rifa');
const Compra = require('./Model/Compra');
const CompraNumero = require('./Model/CompraNumero');
const NumeroRifa = require('./Model/NumeroRifa');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", rifasController);
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
});

// Associações
Rifa.hasMany(NumeroRifa, { foreignKey: 'rifaId' });
NumeroRifa.belongsTo(Rifa, { foreignKey: 'rifaId' });

Compra.hasMany(CompraNumero, { foreignKey: 'compraId' });
CompraNumero.belongsTo(Compra, { foreignKey: 'compraId' });

NumeroRifa.hasMany(CompraNumero, { foreignKey: 'numeroId' });
CompraNumero.belongsTo(NumeroRifa, { foreignKey: 'numeroId' });

// Função para criar a rifa e os números associados
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log("Tabelas sincronizadas com sucesso!");

        // Cria a rifa
        const rifaCriada = await Rifa.create({
            titulo: "RIFA ASJ",
            descricao: `Rifa ASJ em prol do campeonato INTERASSOCIAÇÕES!`
        });
        console.log("Rifa criada com sucesso!");

        // Cria os números de rifa após a rifa existir
        const numeros = [];
        for (let i = 1; i <= 250; i++) {
            numeros.push({
                rifaId: rifaCriada.id, // usa o ID da rifa criada
                numero: i,
                disponivel: true
            });
        }

        await NumeroRifa.bulkCreate(numeros);
        console.log("250 números de rifa inseridos com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error.message);
        console.error("Stack Trace:", error.stack);
    }
}

// Inicializa o banco de dados e insere os dados iniciais
initializeDatabase();

app.listen(4000, () => {
    console.log("Servidor rodando na porta 4000");
});
