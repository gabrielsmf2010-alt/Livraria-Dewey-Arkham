// 1. ESTADO DA APLICAÇÃO (MEMÓRIA RAM)
// ==========================================

// Lista base de livros (dados originais que restauram ao dar F5)
let livros = [
    {
        id: 1,
        titulo: "Iniciação",
        autor: "Cellbit",
        preco: 29.90,
        precoAntigo: 39.90,
        capa: "https://via.placeholder.com/185x270/121620/a3e635?text=Inicia%C3%A7%C3%A3o",
        estoque: 8,
        promocao: true,
        badge: "Destaque"
    },
    {
        id: 2,
        titulo: "O Segredo na Floresta Part 1",
        autor: "Cellbit",
        preco: 34.90,
        precoAntigo: null,
        capa: "https://via.placeholder.com/185x270/121620/a3e635?text=Segredo+na+Floresta",
        estoque: 5,
        promocao: false,
        badge: ""
    },
    {
        id: 3,
        titulo: "Desconjuração",
        autor: "Cellbit",
        preco: 42.00,
        precoAntigo: 49.90,
        capa: "https://via.placeholder.com/185x270/121620/a3e635?text=Desconjuracao",
        estoque: 3,
        promocao: true,
        badge: "Promoção"
    },
    {
        id: 4,
        titulo: "Calamidade",
        autor: "Cellbit",
        preco: 45.00,
        precoAntigo: null,
        capa: "https://via.placeholder.com/185x270/121620/a3e635?text=Calamidade",
        estoque: 0,
        promocao: false,
        badge: ""
    }
];

let carrinho = [];

// ==========================================
// 2. INICIALIZAÇÃO DA PÁGINA
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderizarVitrine();
    renderizarPainelAdmin();
    atualizarCarrinhoUI();
    configurarEventos();
});

// ==========================================
// 3. RENDERIZAÇÃO DA VITRINE (LOJA)
// ==========================================

function renderizarVitrine(termoBusca = '') {
    const grelha = document.querySelector('.grelha-livros');
    if (!grelha) return;

    grelha.innerHTML = '';

    // Filtro por palavra-chave de busca
    const livrosFiltrados = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        livro.autor.toLowerCase().includes(termoBusca.toLowerCase())
    );

    if (livrosFiltrados.length === 0) {
        grelha.innerHTML = `
            <div class="mensagem-busca-vazia">
                <p>Nenhum livro encontrado para "${termoBusca}".</p>
            </div>
        `;
        return;
    }

    livrosFiltrados.forEach(livro => {
        const cartao = document.createElement('div');
        cartao.className = `cartao-livro ${livro.promocao ? 'promocao' : ''}`;
        if (livro.promocao && livro.badge) {
            cartao.setAttribute('data-badge', livro.badge);
        }

        const esgotado = livro.estoque <= 0;

        cartao.innerHTML = `
            <img src="${livro.capa}" alt="${livro.titulo}" class="capa-livro">
            <h3 class="titulo-livro">${livro.titulo}</h3>
            <div class="info-secundaria">
                <p class="autor">${livro.autor}</p>
            </div>
            <div class="bloco-preco">
                ${livro.precoAntigo ? `<span class="preco-antigo">R$ ${livro.precoAntigo.toFixed(2)}</span>` : ''}
                <p class="info-preco">R$ ${livro.preco.toFixed(2)}</p>
            </div>
            <p class="parcelas">3x de R$ ${(livro.preco / 3).toFixed(2)} sem juros</p>
            
            <span class="info-stock">${esgotado ? 'Esgotado' : `Estoque: ${livro.estoque}`}</span>
            
            <button 
                class="btn-comprar ${esgotado ? 'btn-esgotado' : ''}" 
                onclick="adicionarAoCarrinho(${livro.id})"
                ${esgotado ? 'disabled' : ''}>
                ${esgotado ? 'Indisponível' : 'Adicionar ao Carrinho'}
            </button>
        `;

        grelha.appendChild(cartao);
    });
}

// ==========================================
// 4. FUNCIONALIDADES DO CARRINHO
// ==========================================

function adicionarAoCarrinho(idLivro) {
    const livro = livros.find(l => l.id === idLivro);
    if (!livro || livro.estoque <= 0) return;

    const itemNoCarrinho = carrinho.find(item => item.id === idLivro);

    if (itemNoCarrinho) {
        if (itemNoCarrinho.quantidade < livro.estoque) {
            itemNoCarrinho.quantidade++;
            exibirToast(`"${livro.titulo}" atualizado no carrinho!`);
        } else {
            exibirToast(`Limite de estoque atingido para este livro.`);
            return;
        }
    } else {
        carrinho.push({ ...livro, quantidade: 1 });
        exibirToast(`"${livro.titulo}" adicionado ao carrinho!`);
    }

    atualizarCarrinhoUI();
}

function removerDoCarrinho(idLivro) {
    carrinho = carrinho.filter(item => item.id !== idLivro);
    atualizarCarrinhoUI();
    exibirToast("Item removido do carrinho.");
}

function atualizarCarrinhoUI() {
    // Atualiza o badge do topo
    const contador = document.querySelector('.contador-carrinho');
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    if (contador) contador.textContent = totalItens;

    // Atualiza a lista na página/seção do carrinho
    const containerCarrinho = document.querySelector('#lista-itens-carrinho');
    const valorTotalEl = document.querySelector('.texto-total-valor');

    if (containerCarrinho) {
        containerCarrinho.innerHTML = '';
        
        if (carrinho.length === 0) {
            containerCarrinho.innerHTML = '<p class="subtexto-item-carrinho">Seu carrinho está vazio.</p>';
        } else {
            carrinho.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-carrinho-bloco-dinamico';
                itemDiv.innerHTML = `
                    <img src="${item.capa}" class="imagem-item-carrinho" alt="${item.titulo}">
                    <div class="detalhes-item-carrinho">
                        <h4 class="titulo-item-carrinho">${item.titulo}</h4>
                        <p class="subtexto-item-carrinho">Qtd: ${item.quantidade} x R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <button class="btn-remover-carrinho" onclick="removerDoCarrinho(${item.id})">Remover</button>
                `;
                containerCarrinho.appendChild(itemDiv);
            });
        }
    }

    if (valorTotalEl) {
        const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        valorTotalEl.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// ==========================================
// 5. PAINEL DE ADMINISTRAÇÃO (ALTERAÇÕES TEMPORÁRIAS)
// ==========================================

function renderizarPainelAdmin() {
    const listaAdmin = document.querySelector('#lista-gerenciamento-admin');
    if (!listaAdmin) return;

    listaAdmin.innerHTML = '';

    livros.forEach(livro => {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-item-admin';
        bloco.innerHTML = `
            <strong>${livro.titulo}</strong>
            <span class="autor-admin">Autor: ${livro.autor}</span>
            <div class="linha-inputs-admin">
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Preço (R$)</label>
                    <input type="number" step="0.01" class="input-admin-custom" value="${livro.preco}" onchange="editarLivroTemporario(${livro.id}, 'preco', this.value)">
                </div>
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Estoque</label>
                    <input type="number" class="input-admin-custom" value="${livro.estoque}" onchange="editarLivroTemporario(${livro.id}, 'estoque', this.value)">
                </div>
                <div class="grupo-input-admin-flex-2">
                    <label class="label-admin-input">Título</label>
                    <input type="text" class="input-admin-custom" value="${livro.titulo}" onchange="editarLivroTemporario(${livro.id}, 'titulo', this.value)">
                </div>
            </div>
            <button class="btn-sair-admin btn-margem-superior" onclick="removerLivroTemporario(${livro.id})">Excluir Livro</button>
        `;
        listaAdmin.appendChild(bloco);
    });
}

function adicionarLivroTemporario(event) {
    event.preventDefault(); // Impede o envio do formulário e recarregamento da página

    const tituloInput = document.querySelector('#input-titulo-novo');
    const autorInput = document.querySelector('#input-autor-novo');
    const precoInput = document.querySelector('#input-preco-novo');
    const capaInput = document.querySelector('#input-capa-novo');
    const estoqueInput = document.querySelector('#input-estoque-novo');

    const novoLivro = {
        id: Date.now(),
        titulo: tituloInput ? tituloInput.value : 'Livro sem título',
        autor: autorInput ? autorInput.value : 'Autor Desconhecido',
        preco: precoInput ? parseFloat(precoInput.value) || 0 : 0,
        precoAntigo: null,
        capa: (capaInput && capaInput.value) ? capaInput.value : 'https://via.placeholder.com/185x270/121620/a3e635?text=Novo+Livro',
        estoque: estoqueInput ? parseInt(estoqueInput.value) || 1 : 1,
        promocao: false,
        badge: ''
    };

    // Atualiza apenas o array na memória RAM
    livros.push(novoLivro);

    // Sincroniza a vitrine e a lista do admin imediatamente
    renderizarVitrine();
    renderizarPainelAdmin();

    if (event.target && event.target.reset) event.target.reset();
    exibirToast("Livro adicionado temporariamente à loja!");
}

function editarLivroTemporario(id, campo, valor) {
    const livro = livros.find(l => l.id === id);
    if (!livro) return;

    if (campo === 'preco') livro.preco = parseFloat(valor) || 0;
    if (campo === 'estoque') livro.estoque = parseInt(valor) || 0;
    if (campo === 'titulo') livro.titulo = valor;

    // Atualiza imediatamente a visualização da loja sem salvar em storage
    renderizarVitrine();
    exibirToast("Alteração refletida na vitrine!");
}

function removerLivroTemporario(id) {
    livros = livros.filter(l => l.id !== id);
    renderizarVitrine();
    renderizarPainelAdmin();
    exibirToast("Livro removido temporariamente!");
}

// ==========================================
// 6. SISTEMA DE NAVEGAÇÃO E UTILITÁRIOS
// ==========================================

function configurarEventos() {
    // Campo de busca em tempo real
    const inputPesquisa = document.querySelector('#input-pesquisa');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            renderizarVitrine(e.target.value);
        });
    }

    // Form de adicionar livro no Admin
    const formNovoLivro = document.querySelector('#form-adicionar-livro');
    if (formNovoLivro) {
        formNovoLivro.addEventListener('submit', adicionarLivroTemporario);
    }
}

function exibirToast(mensagem) {
    const container = document.querySelector('#container-toast');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = mensagem;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
