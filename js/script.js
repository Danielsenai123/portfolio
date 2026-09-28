// ==========================================
// 1. FUNÇÃO DE LOGIN (Chamada pelo formulário do login.html)
// ==========================================
async function logar(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) {
        console.error("Campos de e-mail ou senha não encontrados.");
        return;
    }

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

    // Login bem-sucedido: Redireciona para o index
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
// 3. LOGOUT (BOTÃO SAIR DO INDEX)
// ==========================================
async function logout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    // Limpa dados de sessão guardados localmente
    localStorage.clear();
    sessionStorage.clear();
    
    window.location.href = "login.html";
}


// ==========================================
// 4. VERIFICAÇÃO DE ACESSO AO INDEX
// ==========================================
async function verificarAcesso() {
    const caminho = window.location.pathname;

    // Se estiver na página de login ou cadastro, não interrompe
    if (caminho.includes("login.html") || caminho.includes("cadastro.html")) {
        return;
    }

    if (!window.supabaseClient) return;

    // Obtém a sessão ativa
    const { data } = await window.supabaseClient.auth.getSession();

    // Se NÃO houver usuário logado, redireciona para a página de login
    if (!data || !data.session) {
        window.location.href = "login.html";
        return;
    }

    // Se estiver logado, exibe o e-mail no cabeçalho
    const nomeUsuario = document.getElementById("usuario-logado");
    if (nomeUsuario && data.session.user) {
        nomeUsuario.textContent = `Olá, ${data.session.user.email}!`;
    }
}

// Executa a verificação assim que a página carregar
document.addEventListener("DOMContentLoaded", verificarAcesso);