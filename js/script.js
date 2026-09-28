// ==========================================
// 1. FUNÇÃO DE LOGIN
// ==========================================
async function logar(event) {
    if (event) event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha.");
        return;
    }

    if (!window.supabaseClient) {
        alert("Erro ao conectar ao servidor Supabase.");
        return;
    }

    // Autentica o usuário
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    // Redireciona para o index após login correto
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
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
}


// ==========================================
// 4. VERIFICAÇÃO DE ACESSO
// ==========================================
async function verificarAcesso() {
    const caminho = window.location.pathname;

    // Se estiver no login ou cadastro, ignora a checagem
    if (caminho.includes("login.html") || caminho.includes("cadastro.html")) {
        return;
    }

    if (!window.supabaseClient) return;

    const { data } = await window.supabaseClient.auth.getSession();

    // Se NÃO estiver logado e tentar abrir o index, manda para o login
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