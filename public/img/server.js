const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const conexao = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/teste', async (req, res) => {
    try {
        const [resultado] = await conexao.query(
            'SELECT * FROM usuarios'
        );

        res.json(resultado);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao consultar o banco de dados.'
        });
    }
});

app.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const [resultado] = await conexao.query(
            `INSERT INTO usuarios (nome, email, senha)
             VALUES (?, ?, ?)`,
            [nome, email, senhaHash]
        );

        res.json({
            mensagem: 'Usuário cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensagem: 'Este email já está cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.'
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha email e senha.'
            });
        }

        const [usuarios] = await conexao.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: 'Email ou senha incorretos.'
            });
        }

        const usuario = usuarios[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: 'Email ou senha incorretos.'
            });
        }

        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao realizar login.'
        });
    }
});

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});