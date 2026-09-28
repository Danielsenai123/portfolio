// ==========================================
// 1. FUNÇÃO DE LOGIN (Chamada no login.html)
// ==========================================
async function logar(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!window.supabaseClient) {
        alert("Erro ao conectar com o Supabase.");
        return;
    }

    // Autentica no Supabase
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    // LOGIN SUCESSO -> Vai para a página do index no repositório
    window.location.href = "index.html";
}


// ==========================================
// 2. MOSTRAR / OCULTAR SENHA
// ==========================================
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


// ==========================================
// 3. LOGOUT (BOTÃO SAIR)
// ==========================================
async function logout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = "login.html";
}


// ==========================================
// 4. PONTE / VERIFICAÇÃO DE ACESSO
// ==========================================
async function verificarAcesso() {
    const caminho = window.location.pathname;

    // Se já estiver no login ou no cadastro, ignora
    if (caminho.includes("login.html") || caminho.includes("cadastro.html")) {
        return;
    }

    if (!window.supabaseClient) return;

    const { data } = await window.supabaseClient.auth.getSession();

    // Se NÃO estiver logado, envia para a página de login
    if (!data || !data.session) {
        window.location.href = "login.html";
        return;
    }

    // Se estiver logado, exibe o e-mail
    const nomeUsuario = document.getElementById("usuario-logado");
    if (nomeUsuario && data.session.user) {
        nomeUsuario.textContent = `Olá, ${data.session.user.email}!`;
    }
}

document.addEventListener("DOMContentLoaded", verificarAcesso);