const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gestao_condominio'
});

connection.connect(err => {
    if (err) {
        console.error("Erro na conexão:", err);
        return;
    }
    console.log("Conectado ao MySQL");
});

// Página inicial
app.get('/', (req, res) => {
    res.send(`
        <h1>Gestão de Condomínios</h1>
        <ul>
            <li><a href="/blocos">Blocos</a></li>
            <li><a href="/apartamentos">Apartamentos</a></li>
            <li><a href="/moradores">Moradores</a></li>
            <li><a href="/pagamentos">Pagamentos</a></li>
            <li><a href="/tipos-manutencao">Tipos de Manutenção</a></li>
            <li><a href="/manutencoes">Manutenções</a></li>
        </ul>
    `);
});

// Blocos
app.get('/blocos', (req, res) => {
    res.send(`
        <h2>Cadastrar Bloco</h2>
        <form action="/blocos/cadastrar" method="POST">
            <input type="text" name="nome" placeholder="Nome do bloco" required>
            <button type="submit">Cadastrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/blocos/cadastrar', (req, res) => {
    const nome = req.body.nome;
    connection.query('INSERT INTO blocos (nome) VALUES (?)', [nome], err => {
        if (err) return res.status(500).send('Erro ao cadastrar bloco');
        res.redirect('/blocos');
    });
});

// Apartamentos
app.get('/apartamentos', (req, res) => {
    res.send(`
        <h2>Cadastrar Apartamento</h2>
        <form action="/apartamentos/cadastrar" method="POST">
            <input type="text" name="numero" placeholder="Número" required>
            <input type="number" name="bloco_id" placeholder="ID do Bloco" required>
            <button type="submit">Cadastrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/apartamentos/cadastrar', (req, res) => {
    const { numero, bloco_id } = req.body;
    connection.query('INSERT INTO apartamentos (numero, bloco_id) VALUES (?, ?)', [numero, bloco_id], err => {
        if (err) return res.status(500).send('Erro ao cadastrar apartamento');
        res.redirect('/apartamentos');
    });
});

// Moradores
app.get('/moradores', (req, res) => {
    res.send(`
        <h2>Cadastrar Morador</h2>
        <form action="/moradores/cadastrar" method="POST">
            <input type="text" name="nome" placeholder="Nome" required>
            <input type="text" name="cpf" placeholder="CPF" required>
            <input type="text" name="telefone" placeholder="Telefone">
            <input type="number" name="apartamento_id" placeholder="ID do Apartamento" required>
            <button type="submit">Cadastrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/moradores/cadastrar', (req, res) => {
    const { nome, cpf, telefone, apartamento_id } = req.body;
    connection.query(
        'INSERT INTO moradores (nome, cpf, telefone, apartamento_id) VALUES (?, ?, ?, ?)',
        [nome, cpf, telefone, apartamento_id],
        err => {
            if (err) return res.status(500).send('Erro ao cadastrar morador');
            res.redirect('/moradores');
        }
    );
});

// Pagamentos
app.get('/pagamentos', (req, res) => {
    res.send(`
        <h2>Registrar Pagamento</h2>
        <form action="/pagamentos/registrar" method="POST">
            <input type="number" name="morador_id" placeholder="ID do Morador" required>
            <input type="text" name="mes_referencia" placeholder="Mês/Ano (ex: 08/2025)" required>
            <input type="number" step="0.01" name="valor" placeholder="Valor" required>
            <input type="date" name="data_pagamento" required>
            <button type="submit">Registrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/pagamentos/registrar', (req, res) => {
    const { morador_id, mes_referencia, valor, data_pagamento } = req.body;
    connection.query(
        'INSERT INTO pagamentos (morador_id, mes_referencia, valor, data_pagamento) VALUES (?, ?, ?, ?)',
        [morador_id, mes_referencia, valor, data_pagamento],
        err => {
            if (err) return res.status(500).send('Erro ao registrar pagamento');
            res.redirect('/pagamentos');
        }
    );
});

// Tipos de Manutenção
app.get('/tipos-manutencao', (req, res) => {
    res.send(`
        <h2>Cadastrar Tipo de Manutenção</h2>
        <form action="/tipos-manutencao/cadastrar" method="POST">
            <input type="text" name="tipo" placeholder="Tipo de manutenção" required>
            <button type="submit">Cadastrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/tipos-manutencao/cadastrar', (req, res) => {
    const tipo = req.body.tipo;
    connection.query('INSERT INTO tipos_manutencao (tipo) VALUES (?)', [tipo], err => {
        if (err) return res.status(500).send('Erro ao cadastrar tipo de manutenção');
        res.redirect('/tipos-manutencao');
    });
});
//oi
// Manutenções
app.get('/manutencoes', (req, res) => {
    res.send(`
        <h2>Registrar Manutenção</h2>
        <form action="/manutencoes/registrar" method="POST">
            <input type="number" name="tipo_id" placeholder="ID do Tipo" required>
            <input type="date" name="data" required>
            <input type="text" name="local" placeholder="Local" required>
            <button type="submit">Registrar</button>
        </form>
        <a href="/">Voltar</a>
    `);
});

app.post('/manutencoes/registrar', (req, res) => {
    const { tipo_id, data, local } = req.body;
    connection.query(
        'INSERT INTO manutencoes (tipo_id, data, local) VALUES (?, ?, ?)',
        [tipo_id, data, local],
        err => {
            if (err) return res.status(500).send('Erro ao registrar manutenção');
            res.redirect('/manutencoes');
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});



