// ==========================================
// 1. FUNÇÃO DE LOGIN (Chamada pelo login.html)
// ==========================================
async function logar(event) {
    if (event) event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;

    if (!email || !senha) {
        alert("Preencha o e-mail e a senha.");
        return;
    }

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

    // Login bem-sucedido: Redireciona para o index
    window.location.href = "./index.html";
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
// 3. LOGOUT (BOTÃO SAIR DO INDEX)
// ==========================================
async function logout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    window.location.href = "./login.html";
}


// ==========================================
// 4. VERIFICAÇÃO DE ACESSO AO INDEX
// ==========================================
async function verificarAcesso() {
    const paginaAtual = window.location.pathname;

    // Se estiver na página de login ou cadastro, não faz a verificação
    if (paginaAtual.includes("login.html") || paginaAtual.includes("cadastro.html")) {
        return;
    }

    if (!window.supabaseClient) return;

    // Checa se existe uma sessão ativa
    const { data } = await window.supabaseClient.auth.getSession();

    // Se NÃO estiver logado, manda para o login
    if (!data || !data.session) {
        window.location.href = "./login.html";
        return;
    }

    // Se estiver logado, exibe o e-mail (se o elemento existir)
    const nomeUsuario = document.getElementById("usuario-logado");
    if (nomeUsuario && data.session.user) {
        nomeUsuario.textContent = `Olá, ${data.session.user.email}!`;
    }
}

// Executa a verificação assim que a página carregar
document.addEventListener("DOMContentLoaded", verificarAcesso);