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
        alert("Erro ao conectar com o Supabase. Aguarde alguns segundos e tente novamente.");
        return;
    }

    // Autentica o utilizador no Supabase
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
        return;
    }

    // Redireciona imediatamente para o index.html após autenticação bem-sucedida
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
// 4. VERIFICAÇÃO AUTOMÁTICA DE SESSÃO E COMUNICAÇÃO
// ==========================================
function inicializarAutenticacao() {
    const caminho = window.location.pathname;
    const ePaginaLogin = caminho.includes("login.html") || caminho.includes("cadastro.html");

    if (!window.supabaseClient) {
        // Se a biblioteca ainda não carregou, tenta novamente em 100ms
        setTimeout(inicializarAutenticacao, 100);
        return;
    }

    // Escuta em tempo real o estado de autenticação do Supabase
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (!ePaginaLogin) {
            // Se NÃO estiver logado e tentar aceder ao index.html, redireciona para login.html
            if (!session) {
                window.location.href = "login.html";
            } else {
                // Exibe o e-mail do utilizador no campo especificado
                const nomeUsuario = document.getElementById("usuario-logado");
                if (nomeUsuario && session.user) {
                    nomeUsuario.textContent = `Olá, ${session.user.email}!`;
                }
            }
        } else {
            // Se JÁ estiver logado e tentar aceder ao login.html, redireciona para index.html
            if (session && event === "SIGNED_IN") {
                window.location.href = "index.html";
            }
        }
    });
}

// Executa a inicialização imediatamente
inicializarAutenticacao();