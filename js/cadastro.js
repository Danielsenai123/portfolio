const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Verificar campos
    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos.");
        return;
    }

    // Verificar se as senhas são iguais
    if (senha !== confirmarSenha) {
        alert("As senhas não são iguais.");
        return;
    }

    // Verificar tamanho da senha
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {

        // Criar usuário no Supabase
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: {
                    nome: nome
                }
            }
        });

        if (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message);
            return;
        }

        if (!data.user) {
            alert("Não foi possível criar o usuário.");
            return;
        }

        alert("Cadastro realizado com sucesso!");

        window.location.href = "/login.html";

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Ocorreu um erro ao realizar o cadastro.");
    }

});