// ==============================
// FUNÇÃO DE LOGIN (CHAMADA PELO FORMULÁRIO)
// ==============================

async function logar(event) {
    if (event) {
        event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário
    }

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) {
        console.error("Campos de email ou senha não encontrados.");
        return;
    }

    const email = emailInput.value;
    const senha = senhaInput.value;

    try {
        if (!window.supabaseClient) {
            console.error("Supabase não carregado.");
            alert("Erro na conexão com o servidor. Tente novamente em instantes.");
            return;
        }

        // Tenta autenticar o usuário com o Supabase
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (error) {
            console.error("Erro no login:", error.message);
            alert("Email ou senha incorretos.");
            return;
        }

        console.log("Login realizado com sucesso!", data);

        // REDIRECIONA PARA A PÁGINA INICIAL (INDEX) NO GITHUB PAGES
        window.location.href = "https://danielsenai123.github.io/portfolio/index.html";

    } catch (erro) {
        console.error("Erro inesperado ao realizar login:", erro);
        alert("Erro ao tentar conectar. Tente novamente.");
    }
}


// ==============================
// MOSTRAR / OCULTAR SENHA
// ==============================

function alternarSenha() {

    const campoSenha =
        document.getElementById("senha");

    const icone =
        document.getElementById("icone-olho");

    if (!campoSenha) {
        return;
    }

    if (campoSenha.type === "password") {

        campoSenha.type = "text";

        if (icone) {
            icone.style.opacity = "0.5";
        }

    } else {

        campoSenha.type = "password";

        if (icone) {
            icone.style.opacity = "1";
        }
    }
}


// ==============================
// LOGOUT
// ==============================

async function logout() {

    try {

        if (!window.supabaseClient) {
            console.error("Supabase não carregado.");
            return;
        }

        const { error } =
            await window.supabaseClient.auth.signOut();

        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            alert("Erro ao sair da conta.");

            return;
        }

        // REDIRECIONA PARA O LOGIN APÓS SAIR
        window.location.href = "https://danielsenai123.github.io/portfolio/login.html";

    } catch (erro) {

        console.error(
            "Erro no logout:",
            erro
        );

        alert("Erro ao sair da conta.");
    }
}


// ==============================
// VERIFICAR LOGIN
// ==============================

async function verificarLogin() {

    try {

        if (!window.supabaseClient) {

            console.error(
                "Supabase não carregado."
            );

            return;
        }


        // ==============================
        // RECUPERAR SESSÃO
        // ==============================

        const {
            data,
            error
        } = await window.supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao recuperar sessão:",
                error
            );

            return;
        }


        const session = data.session;


        // ==============================
        // SEM SESSÃO -> REDIRECIONA PARA LOGIN
        // ==============================

        if (!session) {

            console.log(
                "Nenhuma sessão encontrada."
            );

            window.location.href =
                "https://danielsenai123.github.io/portfolio/login.html";

            return;
        }


        // ==============================
        // USUÁRIO LOGADO
        // ==============================

        const user =
            session.user;


        console.log(
            "Usuário logado:",
            user
        );


        // ==============================
        // MOSTRAR EMAIL
        // ==============================

        const nomeUsuario =
            document.getElementById(
                "usuario-logado"
            );


        if (nomeUsuario) {

            nomeUsuario.textContent =
                `Olá, ${user.email}!`;
        }


        // ==============================
        // BUSCAR PERFIL
        // ==============================

        try {

            const {
                data: perfil,
                error: perfilError
            } = await window.supabaseClient
                .from("perfis")
                .select(
                    "nome, email, tipo_usuario"
                )
                .eq("id", user.id)
                .maybeSingle();


            if (perfilError) {

                console.warn(
                    "Não foi possível carregar o perfil:",
                    perfilError
                );

                return;
            }


            if (
                perfil &&
                perfil.nome &&
                nomeUsuario
            ) {

                nomeUsuario.textContent =
                    `Olá, ${perfil.nome}!`;
            }

        } catch (erroPerfil) {

            console.warn(
                "Erro ao carregar perfil:",
                erroPerfil
            );

        }

    } catch (erro) {

        console.error(
            "Erro na verificação de login:",
            erro
        );

    }
}


// ==============================
// INICIAR VERIFICAÇÃO NA PÁGINA INICIAL
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const caminho =
            window.location.pathname;

        const pagina =
            caminho.split("/").pop();

        // Executa a verificação apenas no index.html (não no login.html)
        if (
            pagina === "" ||
            pagina === "index.html"
        ) {
            verificarLogin();
        }

    }
);git add .