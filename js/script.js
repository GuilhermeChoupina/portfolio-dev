// ---- NAVEGAÇÃO SCROLL ----
const navegação = document.getElementById('navegação');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navegação.classList.add('scrolled');
    } else {
        navegação.classList.remove('scrolled');
    }
});

// ---- MENU MÓVEL ----
const alternarMenu = document.getElementById('alternarMenu');
const menuMóvel = document.getElementById('menuMóvel');
const linksMóveis = document.querySelectorAll('.link-móvel');

alternarMenu.addEventListener('click', () => {
    menuMóvel.classList.toggle('open');
});

linksMóveis.forEach(link => {
    link.addEventListener('click', () => {
        menuMóvel.classList.remove('open');
    });
});

// ---- ATIVO LINK NAV na SCROLL ----
const sections = document.querySelectorAll('section[id]');
const linksNavegação = document.querySelectorAll('.links-navegação a');

const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.links-navegação a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                linksNavegação.forEach(l => l.style.color = '');
                link.style.color = 'var(--accent1)';
            }
        }
    });
};
window.addEventListener('scroll', highlightNav);

// ---- REVEAL ON SCROLL ----
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// Trigger reveals already visible on load
window.dispatchEvent(new Event('scroll'));

// ---- BARRAS HABILIDADES ANIMAÇÃO ----
const preenchimentosHabilidades = document.querySelectorAll('.preenchimento-habilidade');

const observerHabilidades = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const larguraAlvo = el.getAttribute('data-width') + '%';
            setTimeout(() => {
                el.style.width = larguraAlvo;
            }, 200);
            observerHabilidades.unobserve(el);
        }
    });
}, { threshold: 0.3 });

preenchimentosHabilidades.forEach(fill => observerHabilidades.observe(fill));

// ---- FORMULÁRIO CONTATO (UNIFICADO E CORRIGIDO) ----
const formulárioContato = document.getElementById('formulárioContato');
const sucessoFormulário = document.getElementById('sucessoFormulário');

if (formulárioContato) {
    formulárioContato.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // 1. Executa a validação nativa do HTML (Verifica o @ do e-mail e os campos required)
        if (!formulárioContato.checkValidity()) {
            formulárioContato.reportValidity(); // Mostra o balãozinho nativo do navegador se houver erro

            // Aplica o efeito visual de erro (shake) apenas nos campos inválidos atuais
            [document.getElementById('nome'), document.getElementById('email'), document.getElementById('mensagem')].forEach(field => {
                if (!field.checkValidity()) {
                    field.style.borderColor = '#C24D2C';
                    field.style.animation = 'shake 0.4s ease';
                    setTimeout(() => {
                        field.style.animation = '';
                        field.style.borderColor = '';
                    }, 500);
                }
            });
            return; // Interrompe o envio se não for válido
        }

        // 2. Se o formulário for 100% válido, recolhe os valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        // 3. Modifica o estado do botão para indicar carregamento
        const botaoEnviar = formulárioContato.querySelector('button[type="submit"]');
        const textoBotaoOriginal = botaoEnviar.textContent;
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';

        try {
            // 4. Faz a requisição POST para o seu webhook do n8n
            await fetch('https://gfcdev.app.n8n.cloud/webhook/a3d853c1-0a54-43d8-af58-9cb3741fd56d', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, mensagem })
            });

            // 5. Se o envio der certo, limpa/esconde o formulário e ativa a mensagem de sucesso
            formulárioContato.reset();

            // Esconde os elementos visuais internos do formulário
            formulárioContato.querySelectorAll('.grupo-formulário, .botão-principal, .bloco-aceite')
                .forEach(el => el.style.display = 'none');

            // Exibe a mensagem de sucesso de forma consistente
            if (sucessoFormulário) {
                sucessoFormulário.style.display = 'flex';
                sucessoFormulário.classList.add('ativo');
            }

        } catch (erro) {
            // 6. Trata falhas na conexão ou na API do webhook
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = textoBotaoOriginal;
            alert('Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
        }
    });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- EFEITO DIGITAÇÃO no subtítulo herói ----
const subtítuloHerói = document.querySelector('.subtítulo-herói');
if (subtítuloHerói) {
    const textos = [
        'Desenvolvedor Full-Stack em formação',
        'Estudante de Ciência da Computação',
        'Criando experiências web simples e elegantes',
    ];
    let índiceTexto = 0;
    let índiceCaractere = 0;
    let estáDeletando = false;
    let timeoutDigitação;

    function digitar() {
        const atual = textos[índiceTexto];

        if (estáDeletando) {
            subtítuloHerói.textContent = atual.substring(0, índiceCaractere - 1);
            indiceCaractere--;
        } else {
            subtítuloHerói.textContent = atual.substring(0, índiceCaractere + 1);
            índiceCaractere++;
        }

        let velocidade = estáDeletando ? 50 : 80;

        if (!estáDeletando && índiceCaractere === atual.length) {
            velocidade = 2000;
            estáDeletando = true;
        } else if (estáDeletando && índiceCaractere === 0) {
            estáDeletando = false;
            índiceTexto = (índiceTexto + 1) % textos.length;
            velocidade = 400;
        }

        timeoutDigitação = setTimeout(digitar, velocidade);
    }

    setTimeout(digitar, 1200);
}

// ---- CURSOR GLOW EFFECT (desktop only) ----
if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(228,166,44,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s, top 0.15s;
    top: -200px; left: -200px;
  `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ---- SHAKE KEYFRAMES via JS (injected) ----
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(styleEl);