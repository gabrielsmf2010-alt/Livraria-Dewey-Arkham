// Lista padrão de produtos iniciais da livraria
let produtosPadrao = [
    { id: 1, titulo: "Iniciação", autor: 'Rafael "Cellbit" Lange', preco: 103.90, estoque: 15, capa: "capas dos livros/Capa-iniciacao.webp", promocao: true },
    { id: 2, titulo: "Segredo na Floresta - Parte 1", autor: 'Rafael "Cellbit" Lange', preco: 149.90, estoque: 50, capa: "capas dos livros/capa-o-segredo-na-floresta-part1.webp", promocao: true },
    { id: 3, titulo: "Segredo na Floresta - Parte 2", autor: 'Rafael "Cellbit" Lange', preco: 149.90, estoque: 53, capa: "capas dos livros/capa-o-segredo-na-floresta-part2.webp" },
    { id: 4, titulo: "Desconjuração - Parte 1", autor: 'Rafael "Cellbit" Lange', preco: 149.90, estoque: 42, capa: "capas dos livros/capa-desconjuracao-part1.webp" },
    { id: 5, titulo: "Desconjuração - Parte 2", autor: 'Rafael "Cellbit" Lange', preco: 149.90, estoque: 0, capa: "capas dos livros/capa-desconjuracao-part2.webp" },
    { id: 6, titulo: "Livro de Regras", autor: 'Rafael "Cellbit" Lange', preco: 49.90, estoque: 34, capa: "capas dos livros/capa-livro-de-regras.webp" },
    { id: 7, titulo: "Sobrevivendo ao Horror", autor: 'Rafael "Cellbit" Lange', preco: 179.90, estoque: 20, capa: "capas dos livros/capa-sobrevivendo-ao-horror.webp", promocao: true },
    { id: 8, titulo: "Vendeta Oculta", autor: 'Rafael "Cellbit" Lange', preco: 129.90, estoque: 26, capa: "capas dos livros/capa-vendeta-oculta.webp" },
    { id: 9, titulo: "Vendeta Oculta 2", autor: 'Rafael "Cellbit" Lange', preco: 129.90, estoque: 50, capa: "capas dos livros/capa-vendeta-oculta-part2.webp" },
    { id: 10, titulo: "A Cor Que Caiu do Céu", autor: "H.P. Lovecraft", preco: 99.90, estoque: 30, capa: "capas dos livros/capa-a-cor-que-caiu-do-ceu.webp", promocao: true },
    { id: 11, titulo: "Box H.P. Lovecraft", autor: "H.P. Lovecraft", preco: 330.00, estoque: 23, capa: "capas dos livros/capa-box-hp-lovecraft.webp", promocao: true },
    { id: 12, titulo: "O Chamado de Cthulhu e Outros Contos", autor: "H.P. Lovecraft", preco: 84.90, estoque: 40, capa: "capas dos livros/capa-cthulhu.webp" },
    { id: 13, titulo: "O Caso de C. Dexter Ward", autor: "H.P. Lovecraft", preco: 99.90, estoque: 73, capa: "capas dos livros/capa-o-caso-de-c.-dexter-ward.webp" },
    { id: 14, titulo: "O Espreitador", autor: "H.P. Lovecraft", preco: 119.90, estoque: 34, capa: "capas dos livros/capa-o-espreitador.webp" },
    { id: 15, titulo: "Herbert West: Reanimator", autor: "H.P. Lovecraft", preco: 99.90, estoque: 67, capa: "capas dos livros/capa-reanimator.webp" }
];

// Obtém o estoque salvo no navegador ou usa o padrão[cite: 15]
function obterEstoque() {
    let salvo = localStorage.getItem('estoqueLoja');
    return salvo ? JSON.parse(salvo) : produtosPadrao;
}

// Salva o estoque atualizado no localStorage[cite: 15]
function salvarEstoque(estoque) {
    localStorage.setItem('estoqueLoja', JSON.stringify(estoque));
}

// Carrega os itens do carrinho salvos no navegador[cite: 15]
let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

// Exibe notificações flutuantes (toasts) na tela[cite: 15]
function mostrarToast(mensagem) {
    const container = document.getElementById('container-toast');
    const div = document.createElement('div');
    div.className = 'toast-msg';
    div.innerText = mensagem;
    container.appendChild(div);
    
    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
    }, 2000);
}

// Alterna entre as abas visíveis do site (loja, carrinho, login, admin)[cite: 15]
function mudarAba(nomeAba) {
    document.querySelectorAll('.aba-conteudo').forEach(aba => {
        aba.style.display = 'none';
    });

    const abaAlvo = document.getElementById(`aba-${nomeAba}`);
    if (abaAlvo) {
        abaAlvo.style.display = 'block';
    }

    const banner = document.getElementById('bloco-banner');
    if (banner) {
        banner.style.display = (nomeAba === 'loja') ? 'flex' : 'none';
    }

    window.scrollTo(0, 0);

    if (nomeAba === 'loja') {
        document.getElementById('input-pesquisa').value = '';
        renderizarVitrine();
    }
    if (nomeAba === 'carrinho') renderizarCarrinho();
    if (nomeAba === 'admin') renderizarPainelAdmin();
}

// Atualiza o contador de itens no topo do site[cite: 15]
function atualizarContador() {
    const contadores = document.querySelectorAll('.contador-carrinho');
    let totalUnidades = 0;
    carrinho.forEach(item => { totalUnidades += (item.quantidade || 1); });
    
    contadores.forEach(c => {
        c.textContent = totalUnidades;
    });
}

// Verifica se há um usuário logado para alterar o botão do topo[cite: 15]
function verificarSessaoTopo() {
    const linkLogin = document.getElementById('link-login-topo');
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (linkLogin) {
        if (usuarioLogado) {
            linkLogin.textContent = usuarioLogado;
            linkLogin.onclick = (e) => {
                e.preventDefault();
                if (confirm("Deseja encerrar a sessão?")) {
                    localStorage.removeItem('usuarioLogado');
                    localStorage.removeItem('adminAutenticado');
                    window.location.reload();
                }
            };
        } else {
            linkLogin.textContent = "Login - Cadastro";
            linkLogin.onclick = (e) => { 
                e.preventDefault(); 
                mudarAba('login'); 
            };
        }
    }
}

// Gerencia o clique no botão de login do topo[cite: 15]
function gerenciarCliqueLogin() {
    if (localStorage.getItem('usuarioLogado')) {
        if (confirm("Deseja encerrar a sessão?")) {
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('adminAutenticado');
            window.location.reload();
        }
    } else {
        mudarAba('login');
    }
}

// Verifica se o usuário atual tem permissão de administrador[cite: 15]
function verificarAcessoAdmin() {
    if (localStorage.getItem('adminAutenticado') === 'true') {
        mudarAba('admin');
    } else {
        mostrarToast("Acesso restrito. Faça login com a conta de administrador.");
        mudarAba('login');
    }
}

// Filtra os livros da vitrine com base na pesquisa[cite: 15]
function pesquisarLivros() {
    const textoDigitado = document.getElementById('input-pesquisa').value.toLowerCase();
    renderizarVitrine(textoDigitado);
}

// Renderiza os cards de produtos na vitrine da loja[cite: 15]
function renderizarVitrine(filtroTexto = '') {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return;

    let estoque = obterEstoque();
    vitrine.innerHTML = '';
    
    let livrosFiltrados = estoque.filter(produto => {
        return produto.titulo.toLowerCase().includes(filtroTexto) || produto.autor.toLowerCase().includes(filtroTexto);
    });

    if (livrosFiltrados.length === 0) {
        vitrine.innerHTML = '<p class="mensagem-busca-vazia">Nenhum livro foi encontrado na pesquisa.</p>';
        return;
    }

    livrosFiltrados.forEach(produto => {
        let precoReal = produto.promocao ? produto.preco * 0.8 : produto.preco;
        let valorParcelado = (precoReal / 3).toFixed(2).replace('.', ',');
        
        let esgotou = produto.estoque === 0;
        let textoBotao = esgotou ? "Esgotado" : "Comprar";
        let statusDisabled = esgotou ? "disabled class='btn-comprar btn-esgotado'" : `onclick="adicionarAoCarrinho(${produto.id})" class="btn-comprar"`;
        
        let badgeClasse = produto.promocao ? "promocao" : "";
        
        const cartao = document.createElement('div');
        cartao.className = `cartao-livro ${badgeClasse}`;
        if(produto.promocao) { cartao.setAttribute('data-badge', 'PROMOÇÃO'); }
        
        let blocoPrecoHTML = '';
        if (produto.promocao) {
            blocoPrecoHTML = `
                <div class="bloco-preco">
                    <span class="preco-antigo">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <p class="info-preco">R$ ${precoReal.toFixed(2).replace('.', ',')}</p>
                    <p class="parcelas">ou em até 3x de R$ ${valorParcelado}</p>
                </div>
            `;
        } else {
            blocoPrecoHTML = `
                <div class="bloco-preco">
                    <p class="info-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    <p class="parcelas">ou em até 3x de R$ ${valorParcelado}</p>
                </div>
            `;
        }
        
        cartao.innerHTML = `
            <img src="${produto.capa}" alt="${produto.titulo}" class="capa-livro">
            <h3 class="titulo-livro">${produto.titulo}</h3>
            <div class="info-secundaria"><p class="autor">(${produto.autor})</p></div>
            ${blocoPrecoHTML}
            <span class="info-stock">Em estoque: <span class="qtd-estoque">${produto.estoque}</span> cópias</span>
            <button ${statusDisabled}>${textoBotao}</button>
        `;
        vitrine.appendChild(cartao);
    });
}

// Adiciona um produto selecionado ao carrinho de compras[cite: 15]
window.adicionarAoCarrinho = function(idProduto) {
    let estoque = obterEstoque();
    let produto = estoque.find(p => p.id === idProduto);

    if (!produto || produto.estoque <= 0) {
        mostrarToast("Este item esgotou no estoque.");
        return;
    }

    let precoFinal = produto.promocao ? produto.preco * 0.8 : produto.preco;
    let itemQueJaTem = carrinho.find(item => item.id === idProduto);

    if (itemQueJaTem) {
        if (itemQueJaTem.quantidade < produto.estoque) {
            itemQueJaTem.quantidade++;
            mostrarToast(`Mais uma unidade de "${produto.titulo}" adicionada.`);
        } else {
            mostrarToast("Já selecionou todo o estoque disponível deste item.");
            return;
        }
    } else {
        carrinho.push({ id: produto.id, titulo: produto.titulo, preco: precoFinal, capa: produto.capa, quantidade: 1 });
        mostrarToast(`"${produto.titulo}" foi adicionado ao carrinho.`);
    }

    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    atualizarContador();
};

// Renderiza a lista de itens dentro do carrinho[cite: 15]
function renderizarCarrinho() {
    const container = document.getElementById('lista-carrinho');
    const elementoTotal = document.getElementById('total-carrinho');
    const containerBtnFinalizar = document.getElementById('container-btn-finalizar');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p class="subtitulo-secao">O seu carrinho está vazio.</p>';
        if (elementoTotal) elementoTotal.innerText = 'R$ 0,00';
        if (containerBtnFinalizar) containerBtnFinalizar.innerHTML = '';
        return;
    }

    carrinho.forEach((item, index) => {
        let qtdDaVez = item.quantidade || 1;
        let precoSoma = item.preco * qtdDaVez; 
        total += precoSoma;

        const div = document.createElement('div');
        div.className = 'item-carrinho-bloco-dinamico';
        div.innerHTML = `
            <img src="${item.capa}" alt="${item.titulo}" class="imagem-item-carrinho">
            <div class="detalhes-item-carrinho">
                <h4 class="titulo-item-carrinho">${item.titulo}</h4>
                <span class="subtexto-item-carrinho">R$ ${item.preco.toFixed(2).replace('.', ',')} (Quantidade: ${qtdDaVez})</span>
            </div>
            <button onclick="removerItem(${index})" class="btn-remover-carrinho">Remover</button>
        `;
        container.appendChild(div);
    });

    if (elementoTotal) {
        elementoTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    if (containerBtnFinalizar) {
        containerBtnFinalizar.innerHTML = `<button onclick="finalizarCompra()" class="btn-comprar btn-finalizar-grande">Finalizar Compra</button>`;
    }
}

// Remove um item específico do carrinho[cite: 15]
window.removerItem = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContador();
};

// Finaliza a compra e abate as quantidades do estoque real[cite: 15]
window.finalizarCompra = function() {
    document.getElementById('tela-carregamento').style.display = 'flex';
    
    setTimeout(() => {
        let estoque = obterEstoque();

        carrinho.forEach(itemCarrinho => {
            let produtoEstoque = estoque.find(p => p.id === itemCarrinho.id);
            if (produtoEstoque && produtoEstoque.estoque > 0) {
                produtoEstoque.estoque -= (itemCarrinho.quantidade || 1);
            }
        });

        salvarEstoque(estoque);
        localStorage.removeItem('carrinhoLoja');
        carrinho = [];
        atualizarContador();
        
        document.getElementById('tela-carregamento').style.display = 'none';
        mostrarToast("Compra realizada com sucesso! O catálogo foi atualizado.");
        mudarAba('loja');
    }, 2500);
};

// Inicializa o sistema de login com credenciais padrão[cite: 15]
function inicializarLogin() {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputUsuario = document.getElementById('email-login').value.trim();
        const inputSenha = document.getElementById('senha-login').value;

        if (inputUsuario === 'Moises' && inputSenha === 'adm1234') {
            localStorage.setItem('usuarioLogado', 'Moises');
            localStorage.setItem('adminAutenticado', 'true');
            mostrarToast('Sessão de Administrador iniciada.');
            verificarSessaoTopo();
            mudarAba('admin');
            return;
        }

        if (inputUsuario !== "") {
            localStorage.setItem('usuarioLogado', inputUsuario);
            localStorage.removeItem('adminAutenticado');
            mostrarToast(`Sessão iniciada como ${inputUsuario}.`);
            verificarSessaoTopo();
            mudarAba('loja');
        }
    });
}

// Renderiza a lista de produtos no painel administrativo[cite: 15]
function renderizarPainelAdmin() {
    const containerAdmin = document.getElementById('lista-admin-produtos');
    if (!containerAdmin) return;

    let estoque = obterEstoque();
    containerAdmin.innerHTML = '';

    estoque.forEach((produto) => {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-item-admin';
        bloco.innerHTML = `
            <div class="autor-admin">Autor: <strong>${produto.autor}</strong></div>
            <div class="linha-inputs-admin">
                <div class="grupo-input-admin-flex-2">
                    <label class="label-admin-input">Nome do Produto:</label>
                    <input type="text" class="adm-nome input-admin-custom" value="${produto.titulo}">
                </div>
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Preço (R$):</label>
                    <input type="number" step="0.01" class="adm-preco input-admin-custom" value="${produto.preco.toFixed(2)}">
                </div>
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Estoque:</label>
                    <input type="number" class="adm-estoque input-admin-custom" value="${produto.estoque}">
                </div>
            </div>
            <!-- Botão de excluir visual (usa .remove() via DOM para sumir da tela sem afetar o estoque real) -->
            <button onclick="removerLivroEstoqueVisual(this)" class="btn-remover-carrinho">Remover Livro</button>
        `;
        containerAdmin.appendChild(bloco);
    });
}

// MODIFICAÇÃO SOLICITADA: Exclusão estritamente visual utilizando o DOM (.remove)
window.removerLivroEstoqueVisual = function(botaoElemento) {
    if (confirm("Tem certeza de que deseja remover este item da visualização?")) {
        const blocoItem = botaoElemento.closest('.bloco-item-admin');
        if (blocoItem) {
            blocoItem.remove(); // Remove apenas do DOM visualmente
            mostrarToast("Livro removido da visualização com sucesso.");
        }
    }
};

// MODIFICAÇÃO SOLICITADA: Adição estritamente visual utilizando o DOM (document.createElement e appendChild)
document.getElementById('form-novo-livro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const containerAdmin = document.getElementById('lista-admin-produtos');
    const inputArquivo = document.getElementById('add-capa');
    
    const tituloVal = document.getElementById('add-nome').value.trim();
    const autorVal = document.getElementById('add-autor').value.trim();
    const precoVal = parseFloat(document.getElementById('add-preco').value) || 0;
    const estoqueVal = parseInt(document.getElementById('add-estoque').value) || 0;

    // Função interna auxiliar para criar o bloco visual do novo item no painel
    function criarBlocoVisual(capaSrc) {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-item-admin';
        bloco.innerHTML = `
            <div class="autor-admin">Autor: <strong>${autorVal}</strong></div>
            <div class="linha-inputs-admin">
                <div class="grupo-input-admin-flex-2">
                    <label class="label-admin-input">Nome do Produto:</label>
                    <input type="text" class="adm-nome input-admin-custom" value="${tituloVal}">
                </div>
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Preço (R$):</label>
                    <input type="number" step="0.01" class="adm-preco input-admin-custom" value="${precoVal.toFixed(2)}">
                </div>
                <div class="grupo-input-admin-flex-1">
                    <label class="label-admin-input">Estoque:</label>
                    <input type="number" class="adm-estoque input-admin-custom" value="${estoqueVal}">
                </div>
            </div>
            <button onclick="removerLivroEstoqueVisual(this)" class="btn-remover-carrinho">Remover Livro</button>
        `;
        
        // Adiciona o elemento criado dinamicamente usando appendChild no DOM
        if (containerAdmin) {
            containerAdmin.appendChild(bloco);
        }
        
        document.getElementById('form-novo-livro').reset();
        mostrarToast("Novo registro adicionado à visualização com sucesso (Apenas Visual).");
    }

    if (inputArquivo.files && inputArquivo.files[0]) {
        let leitor = new FileReader();
        leitor.onload = function(eventoArquivo) {
            criarBlocoVisual(eventoArquivo.target.result);
        };
        leitor.readAsDataURL(inputArquivo.files[0]);
    } else {
        criarBlocoVisual('');
    }
});

// Salva as alterações feitas nos inputs do painel administrativo (mantido funcional para os demais elementos)[cite: 15]
window.salvarAlteracoesAdmin = function() {
    const blocos = document.querySelectorAll('#lista-admin-produtos > div');
    let estoque = obterEstoque();

    blocos.forEach((bloco, index) => {
        const inputNome = bloco.querySelector('.adm-nome');
        const inputPreco = bloco.querySelector('.adm-preco');
        const inputEstoque = bloco.querySelector('.adm-estoque');

        if (inputNome && inputPreco && inputEstoque) {
            const novoNome = inputNome.value;
            const novoPreco = parseFloat(inputPreco.value) || 0;
            const novoEstoque = parseInt(inputEstoque.value) || 0;

            if (estoque[index]) {
                estoque[index].titulo = novoNome;
                estoque[index].preco = novoPreco;
                estoque[index].estoque = novoEstoque;
            }
        }
    });

    salvarEstoque(estoque);
    mostrarToast('Alterações no catálogo salvas com sucesso.');
    renderizarVitrine();
};

// Encerra a sessão de administrador[cite: 15]
window.sairAdmin = function() {
    localStorage.removeItem('adminAutenticado');
    localStorage.removeItem('usuarioLogado');
    verificarSessaoTopo();
    mudarAba('loja');
};

// Executa funções iniciais assim que a página é carregada[cite: 15]
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    verificarSessaoTopo();
    renderizarVitrine();
    inicializarLogin();
});
