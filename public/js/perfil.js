async function carregarPerfil() {

    try {

        const resposta = await fetch('/verificar-login');

        if (!resposta.ok) {
            window.location.href = '/login.html';
            return;
        }

        const dados = await resposta.json();

        const usuario = dados.usuario;

        document.getElementById("usuario-logado").textContent =
            `Olá, ${usuario.nome}!`;

        document.getElementById("nome-usuario").textContent =
            usuario.nome;

        document.getElementById("email-usuario").textContent =
            usuario.email;

        document.getElementById("tipo-usuario").textContent =
            usuario.tipo_usuario;

    } catch (erro) {

        console.error("Erro ao carregar perfil:", erro);

        window.location.href = '/login.html';
    }
}


function logout() {

    fetch('/logout', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = '/login.html';
    })
    .catch(erro => {
        console.error("Erro ao sair:", erro);
    });

}


function editarPerfil() {

    alert("A função de editar perfil será adicionada em breve.");

}


function alterarSenha() {

    alert("A função de alterar senha será adicionada em breve.");

}


carregarPerfil();