const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
        alert("As senhas não são iguais.");
        return;
    }

    try {

        const resposta = await fetch("/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {

            alert(dados.mensagem);

            // Voltar para o login
            window.location.href = "/login.html";

        } else {

            alert(dados.mensagem);

        }

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao conectar com o servidor.");

    }

});