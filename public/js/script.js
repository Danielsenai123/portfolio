// ==============================
// FUNÇÃO DE LOGIN (CHAMADA PELO FORMULÁRIO DO LOGIN.HTML)
// ==============================

async function logar(event) {
    if (event) {
        event.preventDefault(); // Evita recarregar a página
    }

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) {
        console.error("Campos de email ou senha não encontrados.");
        return;
    }

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    try {
        if (!window.supabaseClient) {
            alert("Erro: Supabase não foi carregado corretamente.");
            return;
        }

        // Tenta fazer o login no Supabase
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

        // REDIRECIONA PARA O INDEX APÓS O LOGIN
        window.location.href = "./index.html";

    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Ocorreu um erro ao tentar conectar.");
    }
}


// ==============================
// MOSTRAR / OCULTAR SENHA
// ==============================

function alternarSenha() {
    const campoSenha = document.getElementById("senha");
    const icone = document.getElementById("icone-olho");

    if (!campoSenha) return;

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        if (icone) icone.style.opacity = "0.5";
    } else {
        campoSenha.type = "password";
        if (icone) icone.style.opacity = "1";
    }
}


// ==============================
// LOGOUT (BOTAO SAIR)
// ==============================

async function logout() {
    try {
        if (!window.supabaseClient) return;

        await window.supabaseClient.auth.signOut();

        // REDIRECIONA PARA A TELA DE LOGIN AO SAIR
        window.location.href = "./login.html";

    } catch (erro) {
        console.error("Erro no logout:", erro);
        alert("Erro ao sair da conta.");
    }
}


// ==============================
// VERIFICAR SE O USUÁRIO ESTÁ LOGADO
// ==============================

async function verificarLogin() {
    try {
        if (!window.supabaseClient) {
            console.error("Supabase não carregado.");
            return;
        }

        const { data, error } = await window.supabaseClient.auth.getSession();

        if (error) {
            console.error("Erro ao recuperar sessão:", error);
            window.location.href = "./login.html";
            return;
        }

        const session = data.session;

        // SE NÃO TIVER SESSÃO (NÃO ESTIVER LOGADO), VAI PARA O LOGIN IMMEDIATAMENTE
        if (!session) {
            console.log("Usuário não autenticado. Redirecionando para login.html...");
            window.location.href = "./login.html";
            return;
        }

        // SE TIVER SESSÃO, MOSTRA O USUÁRIO LOGADO
        const user = session.user;
        const nomeUsuario = document.getElementById("usuario-logado");

        if (nomeUsuario) {
            nomeUsuario.textContent = `Olá, ${user.email}!`;
        }

        // Buscar dados do perfil (opcional)
        try {
            const { data: perfil } = await window.supabaseClient
                .from("perfis")
                .select("nome")
                .eq("id", user.id)
                .maybeSingle();

            if (perfil && perfil.nome && nomeUsuario) {
                nomeUsuario.textContent = `Olá, ${perfil.nome}!`;
            }
        } catch (e) {
            console.warn("Perfil não encontrado:", e);
        }

    } catch (erro) {
        console.error("Erro na verificação de login:", erro);
        window.location.href = "./login.html";
    }
}


// ==============================
// INICIALIZAÇÃO CONTROLADA
// ==============================

document.addEventListener("DOMContentLoaded", function () {
    const pathname = window.location.pathname;

    // Se estiver na página de login, não precisa verificar a sessão para evitar loop de redirecionamento
    const ePaginaLogin = pathname.includes("login.html") || pathname.includes("cadastro.html");

    if (!ePaginaLogin) {
        // Em qualquer outra página (index.html, /portfolio/, etc), EXIGE que o usuário esteja logado!
        verificarLogin();
    }
});