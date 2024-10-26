const express = require('express');
const router = express.Router();
const Rifa = require('../Model/Rifa');
const Compra = require('../Model/Compra');
const NumeroRifa = require('../Model/NumeroRifa');
const CompraNumero = require('../Model/CompraNumero');

router.get("/rifa/lista",(req,res) =>{
    Rifa.findAll().then(rifas =>{
        res.render("rifa/index",{rifas: rifas})
    })
})

router.get("/rifa/novarifa", (req,res)=>{
    res.render("rifa/novarifa");
})


router.get("/rifa/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rifa = await Rifa.findByPk(id);
        const numerosDisponiveis = await NumeroRifa.findAll({
            where: { disponivel: true, rifaId: id } 
        });

        res.render("rifa/details", { rifa, numerosDisponiveis });
    } catch (error) {
        console.error("Erro ao buscar rifa:", error);
        res.status(500).send("Erro ao buscar rifa.");
    }
});


router.post("/rifa/comprar/:id", async (req, res) => {
    const { nome, cpf, telefone, numerosSelecionados } = req.body;

    let numeros;
    try {
        numeros = JSON.parse(numerosSelecionados); 
    } catch (error) {
        return res.status(400).send("Formato de números selecionados inválido.");
    }

    const quantidadeNumeros = Array.isArray(numeros) ? numeros.length : 0; 
    const valorTotal = quantidadeNumeros * 25.00; 
    const cnpj = "xxxxxxxxxx";  

    if (telefone.length < 10 || telefone.length > 18) {
        return res.status(400).send("Número de telefone inválido.");
    }
    if (cpf.length < 11 || cpf.length > 14) { 
        return res.status(400).send("Número de CPF inválido.");
    }
    if (nome.length < 2) {
        return res.status(400).send("Nome inválido.");
    }
    if (quantidadeNumeros === 0) {
        return res.status(400).send("Você deve selecionar pelo menos um número de rifa.");
    }

    try {

        const numerosValidos = await NumeroRifa.findAll({
            where: {
                numero: numeros,
                disponivel: true,
                rifaId: req.params.id
            }
        });

        if (numerosValidos.length !== numeros.length) {
            return res.status(400).send("Um ou mais números selecionados não estão disponíveis.");
        }

        await NumeroRifa.update(
            { disponivel: false }, 
            {
                where: {
                    numero: numeros,
                    rifaId: req.params.id 
                }
            }
        );

        await Compra.create({
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            numeros: numerosSelecionados,
            rifaId: req.params.id
        });

        res.render("rifa/pagamento", {
            nome,
            cpf,
            telefone,
            numeros,
            cnpj,
            valorTotal
        });
    } catch (error) {
        console.error("Erro ao processar a compra:", error);
        res.status(500).send("Erro ao processar a compra.");
    }
});

router.get("/rifa/compradores/:id", async (req, res) => {
    const rifaId = req.params.id;

    try {
        const numerosVendidos = await Compra.findAll({
            where: { 
                rifaId: rifaId,
            }
        });

        res.render("rifa/compradores",{numerosVendidos: numerosVendidos}); 
    } catch (error) {
        console.error("Erro ao buscar compradores:", error);
        res.status(500).send("Erro ao buscar compradores.");
    }
});

router.post("/rifa/salvar", (req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Rifa.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/rifa/lista");
    });;
})

router.post("/rifa/delete",(req,res) =>{
    var id = req.body.id

    Rifa.destroy({where:{id:id}
    }).then(()=>{
        res.redirect("/rifa/lista")
    })
})

module.exports = router;