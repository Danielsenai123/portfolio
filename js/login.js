// ==============================
// LOGIN
// ==============================

async function logar() {

    const emailInput =
        document.getElementById("email");

    const senhaInput =
        document.getElementById("senha");


    if (!emailInput || !senhaInput) {

        console.error(
            "Campos de login não encontrados."
        );

        return;
    }


    const email =
        emailInput.value.trim();

    const senha =
        senhaInput.value;


    if (!email || !senha) {

        alert(
            "Preencha o email e a senha."
        );

        return;
    }


    try {

        // ==============================
        // VERIFICAR SUPABASE
        // ==============================

        if (!window.supabaseClient) {

            console.error(
                "Supabase não foi carregado."
            );

            alert(
                "Erro de conexão com o sistema."
            );

            return;
        }


        console.log(
            "Iniciando login..."
        );


        // ==============================
        // AUTENTICAR
        // ==============================

        const {
            data,
            error
        } =
            await window.supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: senha

                });


        // ==============================
        // ERRO NO LOGIN
        // ==============================

        if (error) {

            console.error(
                "Erro de autenticação:",
                error
            );

            alert(
                "Não foi possível entrar. Verifique o email e a senha."
            );

            return;
        }


        console.log(
            "Usuário autenticado:",
            data.user
        );


        // ==============================
        // CONFIRMAR SESSÃO
        // ==============================

        const {
            data: sessionData,
            error: sessionError
        } =
            await window.supabaseClient.auth
                .getSession();


        if (sessionError) {

            console.error(
                "Erro ao recuperar sessão:",
                sessionError
            );

            alert(
                "Login realizado, mas a sessão não pôde ser recuperada."
            );

            return;
        }


        if (
            !sessionData ||
            !sessionData.session
        ) {

            console.error(
                "Login realizado, mas nenhuma sessão foi encontrada."
            );

            alert(
                "A sessão não foi criada. Tente novamente."
            );

            return;
        }


        console.log(
            "Sessão confirmada."
        );


        // ==============================
        // IR PARA O PORTFÓLIO
        // ==============================

        window.location.href =
            "./index.html";


    } catch (erro) {

        console.error(
            "Erro inesperado no login:",
            erro
        );

        alert(
            "Ocorreu um erro ao realizar o login."
        );
    }
}