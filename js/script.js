// Navegação segura no GitHub Pages
function navegarPara(pagina) {
    const caminho = window.location.pathname;
    if (caminho.endsWith("/") || caminho.endsWith("index.html")) {
        window.location.href = "./" + pagina;
    } else {
        window.location.href = pagina;
    }
}

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
        alert("Aguarde o carregamento do Supabase e tente novamente.");
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    navegarPara("index.html");
}

// ==========================================
// 2. FUNÇÃO DE CADASTRO
// ==========================================
async function cadastrarUsuario(event) {
    if (event) event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value;
    const confirmarSenha = document.getElementById("confirmarSenha")?.value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    if (!window.supabaseClient) {
        alert("Aguarde a conexão com o Supabase e tente novamente.");
        return;
    }

    const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: senha
    });

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
        return;
    }

    alert("Cadastro realizado com sucesso! Faça login para continuar.");
    navegarPara("login.html");
}

// ==========================================
// 3. MOSTRAR / OCULTAR SENHA
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
// 4. LOGOUT (BOTÃO SAIR DO INDEX)
// ==========================================
async function logout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    localStorage.clear();
    sessionStorage.clear();
    navegarPara("login.html");
}

// ==========================================
// 5. VERIFICAÇÃO DE ACESSO AO INDEX
// ==========================================
async function verificarAcesso() {
    const caminho = window.location.pathname;

    // Se estiver no login ou cadastro, ignora a proteção do index
    if (caminho.includes("login.html") || caminho.includes("cadastro.html")) {
        return;
    }

    if (!window.supabaseClient) {
        setTimeout(verificarAcesso, 100);
        return;
    }

    const { data } = await window.supabaseClient.auth.getSession();

    // Se NÃO estiver logado e tentar aceder ao index, envia para o login
    if (!data || !data.session) {
        navegarPara("login.html");
        return;
    }

    // Se estiver logado, mostra o email no topo
    const nomeUsuario = document.getElementById("usuario-logado");
    if (nomeUsuario && data.session.user) {
        nomeUsuario.textContent = `Olá, ${data.session.user.email}!`;
    }
}

document.addEventListener("DOMContentLoaded", verificarAcesso);