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

// Variável na memória RAM que guarda o estoque durante o uso (alterações não são permanentes)
let estoqueAtual = [...produtosPadrao];

function obterEstoque() {
    return estoqueAtual;
}

function salvarEstoque(estoque) {
    estoqueAtual = estoque;
}

// Carrega os itens do carrinho salvos no navegador
let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

// Exibe notificações flutuantes (toasts) na tela
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

// Alterna entre as abas visíveis do site (loja, carrinho, login, admin)
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

// Atualiza o contador de itens no topo do site
function atualizarContador() {
    const contadores = document.querySelectorAll('.contador-carrinho');
    let totalUnidades = 0;
    carrinho.forEach(item => { totalUnidades += (item.quantidade || 1); });
    
    contadores.forEach(c => {
        c.textContent = totalUnidades;
    });
}

// Verifica se há um usuário logado para alterar o botão do topo
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

// Gerencia o clique no botão de login do topo
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

// Verifica se o usuário atual tem permissão de administrador
function verificarAcessoAdmin() {
    if (localStorage.getItem('adminAutenticado') === 'true') {
        mudarAba('admin');
    } else {
        mostrarToast("Acesso restrito. Faça login com a conta de administrador.");
        mudarAba('login');
    }
}

// Filtra os livros da vitrine com base na pesquisa
function pesquisarLivros() {
    const textoDigitado = document.getElementById('input-pesquisa').value.toLowerCase();
    renderizarVitrine(textoDigitado);
}

// Renderiza os cards de produtos na vitrine da loja
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
        
        let esgotou = produto.estoque <= 0;
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

// Adiciona um produto selecionado ao carrinho de compras
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

// Renderiza a lista de itens dentro do carrinho
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

// Remove um item específico do carrinho
window.removerItem = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContador();
};

// Finaliza a compra e abate as quantidades do estoque real
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

// Inicializa o sistema de login com credenciais padrão
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

// Renderiza a lista de produtos no painel administrativo
function renderizarPainelAdmin() {
    const containerAdmin = document.getElementById('lista-admin-produtos');
    if (!containerAdmin) return;

    let estoque = obterEstoque();
    containerAdmin.innerHTML = '';

    estoque.forEach((produto) => {
        const bloco = document.createElement('div');
        bloco.className = 'bloco-item-admin';
        bloco.setAttribute('data-id', produto.id); // Ajuda a identificar o livro ao editar
        
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
            <!-- Botão de excluir que remove o livro de verdade -->
            <button onclick="removerLivroEstoque(${produto.id})" class="btn-remover-carrinho">Remover Livro</button>
        `;
        containerAdmin.appendChild(bloco);
    });
}

// Remove o livro definitivamente da lista (apenas na memória da sessão atual)
window.removerLivroEstoque = function(idLivro) {
    if (confirm("Tem certeza de que deseja excluir este livro da loja?")) {
        let estoque = obterEstoque();
        
        // Filtra o estoque tirando o livro que tem este ID
        estoque = estoque.filter(produto => produto.id !== idLivro);
        
        salvarEstoque(estoque);
        
        mostrarToast("Livro excluído com sucesso.");
        renderizarPainelAdmin(); // Atualiza a lista do admin
        renderizarVitrine();     // Atualiza a loja imediatamente
    }
};

// Adição de livro de forma estruturada no array, refletindo na loja e admin
document.getElementById('form-novo-livro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputArquivo = document.getElementById('add-capa');
    const tituloVal = document.getElementById('add-nome').value.trim();
    const autorVal = document.getElementById('add-autor').value.trim();
    const precoVal = parseFloat(document.getElementById('add-preco').value) || 0;
    const estoqueVal = parseInt(document.getElementById('add-estoque').value) || 0;

    function adicionarLivroAoEstoque(capaSrc) {
        let estoque = obterEstoque();
        
        // Gera um novo ID baseado no maior ID existente
        const novoId = estoque.length > 0 ? Math.max(...estoque.map(p => p.id)) + 1 : 1;

        const novoLivro = {
            id: novoId,
            titulo: tituloVal,
            autor: autorVal,
            preco: precoVal,
            estoque: estoqueVal,
            capa: capaSrc || "https://via.placeholder.com/185x270/121620/a3e635?text=Sem+Capa",
            promocao: false // Padrão
        };

        // Adiciona na memória RAM
        estoque.push(novoLivro);
        salvarEstoque(estoque);
        
        // Atualiza a interface
        renderizarPainelAdmin();
        renderizarVitrine();
        
        document.getElementById('form-novo-livro').reset();
        mostrarToast("Novo livro adicionado à loja!");
    }

    if (inputArquivo.files && inputArquivo.files[0]) {
        let leitor = new FileReader();
        leitor.onload = function(eventoArquivo) {
            adicionarLivroAoEstoque(eventoArquivo.target.result);
        };
        leitor.readAsDataURL(inputArquivo.files[0]);
    } else {
        adicionarLivroAoEstoque('');
    }
});

// Salva as alterações feitas nos inputs do painel administrativo
window.salvarAlteracoesAdmin = function() {
    const blocos = document.querySelectorAll('#lista-admin-produtos > div.bloco-item-admin');
    let estoque = obterEstoque();

    blocos.forEach((bloco) => {
        const inputNome = bloco.querySelector('.adm-nome');
        const inputPreco = bloco.querySelector('.adm-preco');
        const inputEstoque = bloco.querySelector('.adm-estoque');
        const idLivro = parseInt(bloco.getAttribute('data-id'));

        if (inputNome && inputPreco && inputEstoque && !isNaN(idLivro)) {
            // Acha o livro no array real e atualiza os dados
            const produto = estoque.find(p => p.id === idLivro);
            
            if (produto) {
                produto.titulo = inputNome.value;
                produto.preco = parseFloat(inputPreco.value) || 0;
                produto.estoque = parseInt(inputEstoque.value) || 0;
            }
        }
    });

    salvarEstoque(estoque);
    mostrarToast('Alterações no catálogo salvas com sucesso.');
    
    // Atualiza a loja imediatamente para as edições aparecerem lá
    renderizarVitrine();
};

// Encerra a sessão de administrador
window.sairAdmin = function() {
    localStorage.removeItem('adminAutenticado');
    localStorage.removeItem('usuarioLogado');
    verificarSessaoTopo();
    mudarAba('loja');
};

// Executa funções iniciais assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    verificarSessaoTopo();
    renderizarVitrine();
    inicializarLogin();
});
