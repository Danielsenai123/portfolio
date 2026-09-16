async function logar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.mensagem);

            console.log("Usuário conectado:", dados.usuario);

            window.location.href = "/index.html";

        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
}


function alternarSenha() {
    const campoSenha = document.getElementById("senha");
    const icone = document.getElementById("icone-olho");

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        icone.style.opacity = "0.5";
    } else {
        campoSenha.type = "password";
        icone.style.opacity = "1";
    }
}

async function logout() {
    try {
        const resposta = await fetch('/logout', {
            method: 'POST'
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            window.location.href = '/login.html';
        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        console.error(erro);
        alert('Erro ao sair da conta.');
    }
}

async function verificarLogin() {
    try {
        const resposta = await fetch('/verificar-login');

        if (!resposta.ok) {
            window.location.href = '/login.html';
            return;
        }

        const dados = await resposta.json();

        console.log('Usuário logado:', dados.usuario);

        const nomeUsuario = document.getElementById("usuario-logado");

        if (nomeUsuario) {
            nomeUsuario.textContent = `Olá, ${dados.usuario.nome}!`;
        }

    } catch (erro) {
        console.error('Erro ao verificar login:', erro);
        window.location.href = '/login.html';
    }
}