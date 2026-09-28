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

        // IMPORTANTE:
        // caminho relativo para o GitHub Pages
        window.location.href = "./login.html";

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
        // SEM SESSÃO
        // ==============================

        if (!session) {

            console.log(
                "Nenhuma sessão encontrada."
            );

            // IMPORTANTE:
            // caminho relativo para /portfolio/
            window.location.href =
                "./login.html";

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
// INICIAR VERIFICAÇÃO
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const caminho =
            window.location.pathname;

        /*
         * No GitHub Pages o site está em:
         *
         * /portfolio/
         *
         * Quando acessamos:
         *
         * https://danielsenai123.github.io/portfolio/
         *
         * o pathname termina com "/".
         *
         * Também aceitamos:
         *
         * /portfolio/index.html
         */

        const pagina =
            caminho.split("/").pop();


        if (
            pagina === "" ||
            pagina === "index.html"
        ) {

            verificarLogin();
        }

    }
);