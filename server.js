const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const conexao = require('./database');

const app = express();

app.use(cors());
app.use(express.json());


// ==============================
// SESSÃO
// ==============================

app.use(session({
    secret: 'chave-secreta-do-sistema',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));


// ==============================
// LOGIN
// ==============================

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// ==============================
// ROTA PRINCIPAL PROTEGIDA
// ==============================

app.get('/', (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/index.html');
});

// ==============================
// PORTFÓLIO PROTEGIDO
// ==============================

app.get('/index.html', (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/index.html');
});

// ==============================
// OUTRAS PÁGINAS PROTEGIDAS
// ==============================

app.get('/project.html', (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/project.html');
});


app.get('/contact.html', (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/contact.html');
});


app.get('/areas.html', (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/areas.html');
});

// ==============================
// PÁGINAS DOS EIXOS PROTEGIDAS
// ==============================

app.get(/^\/(linguagens|humanas|natureza|matematica|senai)-galeria.*\.html$/, (req, res) => {

    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.sendFile(__dirname + '/public/' + req.path);
});

// ==============================
// ARQUIVOS DO SITE
// ==============================

app.use(express.static('public', {
    index: false
}));



// ==============================
// CADASTRO
// ==============================

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


// ==============================
// LOGIN DO USUÁRIO
// ==============================

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


        // ==============================
        // CRIAR SESSÃO
        // ==============================

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        };


        // ==============================
        // SALVAR SESSÃO ANTES DE RESPONDER
        // ==============================

        req.session.save((erro) => {

            if (erro) {

                console.error('Erro ao salvar sessão:', erro);

                return res.status(500).json({
                    mensagem: 'Erro ao salvar a sessão.'
                });
            }


            // ==============================
            // RESPOSTA DO LOGIN
            // ==============================

            res.json({
                mensagem: 'Login realizado com sucesso!',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo_usuario: usuario.tipo_usuario
                }
            });

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao realizar login.'
        });
    }
});


// ==============================
// VERIFICAR LOGIN
// ==============================

app.get('/verificar-login', (req, res) => {

    if (!req.session.usuario) {

        return res.status(401).json({
            logado: false
        });

    }

    res.json({
        logado: true,
        usuario: req.session.usuario
    });

});


// ==============================
// LOGOUT
// ==============================

app.post('/logout', (req, res) => {

    req.session.destroy((erro) => {

        if (erro) {

            console.error(erro);

            return res.status(500).json({
                mensagem: 'Erro ao sair da conta.'
            });

        }

        res.json({
            mensagem: 'Logout realizado com sucesso!'
        });

    });

});


// ==============================
// SERVIDOR
// ==============================

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});