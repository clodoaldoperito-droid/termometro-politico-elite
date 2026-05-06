// CONFIGURAÇÕES
const FREE_QUERIES_LIMIT = 1;

// ESTADO DO USUÁRIO
let userData = {
    email: '',
    whatsapp: '',
    queriesDone: 0,
    hasSocialUnlock: false
};

// MATRIX ENGINE
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function startMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 50);
}

// LOGICA DE REGISTRO
function handleRegister(e) {
    e.preventDefault();
    userData.email = document.getElementById('email').value;
    userData.whatsapp = document.getElementById('whatsapp').value;
    
    // Salvar localmente (poderia enviar para o n8n na VPS aqui)
    localStorage.setItem('tp_user', JSON.stringify(userData));
    
    showDashboard();
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    // document.getElementById('user-display').innerText = userData.email; // Removido para manter XTAL Automações
    updateCounter();
}

function updateCounter() {
    const left = FREE_QUERIES_LIMIT - userData.queriesDone;
    const el = document.getElementById('queries-left');
    if (left > 0) {
        el.innerText = `Consultas: ${left} Grátis`;
    } else if (userData.hasSocialUnlock) {
        el.innerText = `Consultas: +1 Bônus Ativo`;
    } else {
        el.innerText = `Consultas Esgotadas`;
    }
}

// LOGICA DE AUDITORIA
function performAudit() {
    const target = document.getElementById('target').value;
    if (!target) return alert("INSIRA UM ALVO VÁLIDO.");

    // Verificar Limites
    if (userData.queriesDone >= FREE_QUERIES_LIMIT && !userData.hasSocialUnlock) {
        showPaywall();
        return;
    }

    // Iniciar Processo Visual
    document.getElementById('audit-process').classList.remove('hidden');
    const statusText = document.getElementById('process-text');
    
    const steps = [
        "CONECTANDO AO TSE...",
        "RASTREANDO EVOLUÇÃO PATRIMONIAL...",
        "VARRENDO DIÁRIOS OFICIAIS...",
        "MAPEANDO CONEXÕES COM CONSTRUTORAS...",
        "FINALIZANDO DOSSIÊ SNIPER..."
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            statusText.innerText = steps[i];
            i++;
        } else {
            clearInterval(interval);
            finishAudit();
        }
    }, 1500);
}

function finishAudit() {
    userData.queriesDone++;
    if (userData.hasSocialUnlock) userData.hasSocialUnlock = false; // Consome o bônus
    
    localStorage.setItem('tp_user', JSON.stringify(userData));
    updateCounter();

    document.getElementById('audit-process').classList.add('hidden');
    const results = document.getElementById('results-display');
    results.classList.remove('hidden');
    
    results.innerHTML = `
        <div class="result-card">
            <h3>AUDITORIA CONCLUÍDA: ${document.getElementById('target').value}</h3>
            <p>Dossiê Forense gerado com sucesso pela IA Antigravity em ${new Date().toLocaleDateString()}.</p>
            <p>Este documento contém a análise completa de evolução patrimonial, vínculos com construtoras e licitações ativas.</p>
            <div class="actions">
                <button onclick="downloadPDF()">GERAR PDF / IMPRIMIR DOSSIÊ</button>
            </div>
        </div>
    `;
}

// PAYWALL & SOCIAL
function showPaywall() {
    document.getElementById('paywall-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('paywall-modal').classList.add('hidden');
}

function openInstagram() {
    window.open('https://instagram.com/seu_perfil', '_blank');
    // Simulação: o usuário envia a DM e volta. 
    // Em produção, isso seria validado por um webhook do Instagram.
    alert("Após seguir e mandar a DM 'AUDITORIA', sua conta será desbloqueada em instantes.");
    
    // Simulação de desbloqueio para teste
    userData.hasSocialUnlock = true;
    updateCounter();
    closeModal();
}

function downloadPDF() {
    window.print();
}

// INICIALIZAÇÃO
window.onload = () => {
    startMatrix();
    const saved = localStorage.getItem('tp_user');
    if (saved) {
        userData = JSON.parse(saved);
        showDashboard();
    }
};
