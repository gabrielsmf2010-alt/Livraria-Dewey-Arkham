// A nossa lista inicial (catalogo base)
// Adicionei uns livros novos aqui, alguns com promoção ativa pra testarmos o sistema visual!
let produtosPadrao = [
    { id: 1, titulo: "Iniciação", autor: 'Rafael "Cellbit" Lange', preco: 89.90, precoAntigo: 103.90, promocao: true, estoque: 15, capa: "capas dos livros/Capa-iniciacao.webp" },
    { id: 2, titulo: "O Enigma de Outro Mundo", autor: "John W. Campbell", preco: 55.00, estoque: 8, capa: "https://via.placeholder.com/200x300/111827/ffffff?text=O+Enigma" },
    { id: 3, titulo: "Javalis da Estrada", autor: "Autor Desconhecido", preco: 35.00, precoAntigo: 50.00, promocao: true, estoque: 20, capa: "https://via.placeholder.com/200x300/111827/ffffff?text=Javalis" },
    { id: 4, titulo: "Guia do Caçador: O Uso da Montante", autor: "Guilda de Astera", preco: 60.00, estoque: 5, capa: "https://via.placeholder.com/200x300/111827/ffffff?text=Guia+Cacador" }
    // Pode adicionar mais livros aqui se quiser no código base, ou usar o painel admin!
];

// Puxa o estoque da memória. Se não tiver nada salvo, usa os produtosPadrao.
function obterEstoque() {
    let salvo = localStorage.getItem('estoqueLoja');
    return salvo ? JSON.parse(salvo) : produtosPadrao;
}

// Salva as alterações na memória do navegador
function salvarEstoque(estoque) {
    localStorage.setItem('estoqueLoja', JSON.stringify(estoque));
}

// Inicia o carrinho lendo da memória
let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

// Atualiza a bolinha vermelha no menu
function atualizarContador() {
    let totalItens = 0;
    carrinho.forEach(item => totalItens += item.qtd);
    document.getElementById('contador-topo').textContent = totalItens;
}

// O famoso "Toast" - substitui aqueles alerts chatos
function mostrarAviso(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.className = "toast mostrar";
    
    // Some depois de 3 segundos
    setTimeout(function(){ 
        toast.className = toast.className.replace("mostrar", ""); 
    }, 3000);
}

// Sistema que esconde as salas e mostra só a que a gente clicou
function mudarAba(nomeAba) {
    document.querySelectorAll('.aba-conteudo').forEach(aba => aba.style.display = 'none');
    
    const abaAlvo = document.getElementById(`aba-${nomeAba}`);
    if (abaAlvo) abaAlvo.style.display = 'block';

    const banner = document.getElementById('bloco-banner');
    if (banner) banner.style.display = (nomeAba === 'loja') ? 'block' : 'none';

    window.scrollTo(0, 0);

    // Manda desenhar a aba certa
    if (nomeAba === 'loja') {
        document.getElementById('input-pesquisa').value = ''; // Limpa a pesquisa ao voltar
        renderizarVitrine();
    }
    if (nomeAba === 'carrinho') renderizarCarrinho();
    if (nomeAba === 'admin') renderizarPainelAdmin();
}

// Formata o número pra virar dinheiro (ex: 45.9 vira 45,90)
function formatarDinheiro(valor) {
    return valor.toFixed(2).replace('.', ',');
}

// ----------------------------------------------------
// A LOJA (VITRINE)
// ----------------------------------------------------
// A função agora recebe um "filtro", para a barra de pesquisa funcionar!
function renderizarVitrine(filtro = '') {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return;

    let estoque = obterEstoque();
    vitrine.innerHTML = '';

    // Lógica da pesquisa: só mantém o livro se o nome ou autor bater com o que foi digitado
    const livrosFiltrados = estoque.filter(produto => {
        const titulo = produto.titulo.toLowerCase();
        const autor = produto.autor.toLowerCase();
        return titulo.includes(filtro) || autor.includes(filtro);
    });

    if (livrosFiltrados.length === 0) {
        vitrine.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Nenhuma obra encontrada na investigação.</p>`;
        return;
    }

    // Desenha cada livrinho
    livrosFiltrados.forEach(produto => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao-livro';

        // Calcula a parcela e a questão da promoção
        const parcela = formatarDinheiro(produto.preco / 3);
        let tagPromoHTML = '';
        let precoAntigoHTML = '';

        if (produto.promocao && produto.precoAntigo) {
            tagPromoHTML = `<div class="tag-promo">PROMOÇÃO</div>`;
            precoAntigoHTML = `<div class="preco-riscado">De R$ ${formatarDinheiro(produto.precoAntigo)}</div>`;
        }

        // Lógica do botão Esgotado
        const taEsgotado = produto.estoque <= 0;
        const classeBotao = taEsgotado ? 'btn-comprar btn-esgotado' : 'btn-comprar';
        const textoBotao = taEsgotado ? 'Obra Esgotada' : 'Adicionar ao Carrinho';
        const acaoBotao = taEsgotado ? '' : `onclick="adicionarAoCarrinho(${produto.id})"`;

        // Se o usuário não colocou imagem no painel admin, usa um fallback (imagem padrão vazia)
        const imagemSegura = produto.capa || 'https://via.placeholder.com/200x300/111827/ffffff?text=Sem+Capa';

        cartao.innerHTML = `
            ${tagPromoHTML}
            <img src="${imagemSegura}" alt="${produto.titulo}" class="capa-livro">
            <div>
                <h3 class="titulo-livro">${produto.titulo}</h3>
                <p class="autor">${produto.autor}</p>
                <div class="bloco-preco">
                    ${precoAntigoHTML}
                    <p class="info-preco">R$ ${formatarDinheiro(produto.preco)}</p>
                    <p class="info-parcelas">ou 3x de R$ ${parcela}</p>
                </div>
                <p class="info-stock">Disponível: <strong>${produto.estoque}</strong> cópias</p>
            </div>
            <button class="${classeBotao}" ${acaoBotao} ${taEsgotado ? 'disabled' : ''}>${textoBotao}</button>
        `;
        vitrine.appendChild(cartao);
    });
}

// O ouvinte de eventos da Barra de Pesquisa
document.getElementById('input-pesquisa')?.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    renderizarVitrine(termo);
});

// ----------------------------------------------------
// CARRINHO DE COMPRAS
// ----------------------------------------------------
window.adicionarAoCarrinho = function(idProduto) {
    let estoque = obterEstoque();
    let produto = estoque.find(p => p.id === idProduto);

    if (!produto || produto.estoque <= 0) {
        mostrarAviso("Poxa, este item esgotou no estoque.");
        return;
    }

    // Procura se o livro já tá no carrinho. Se tiver, só aumenta a quantidade pra não duplicar linha!
    let itemExistente = carrinho.find(item => item.id === idProduto);
    
    if (itemExistente) {
        // Verifica se a pessoa não tá tentando botar mais no carrinho do que a loja tem fisicamente
        if (itemExistente.qtd < produto.estoque) {
            itemExistente.qtd += 1;
        } else {
            mostrarAviso("Você já pegou todo o nosso estoque deste livro!");
            return;
        }
    } else {
        // É a primeira vez do livro no carrinho, então entra com quantidade 1
        carrinho.push({ id: produto.id, titulo: produto.titulo, preco: produto.preco, capa: produto.capa, qtd: 1 });
    }

    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    atualizarContador();
    mostrarAviso(`"${produto.titulo}" foi adicionado à sacola!`);
};

function renderizarCarrinho() {
    const container = document.getElementById('lista-carrinho');
    const elementoTotal = document.getElementById('total-carrinho');
    const containerBtnFinalizar = document.getElementById('container-btn-finalizar');

    container.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Sua bolsa de investigação está vazia.</p>';
        elementoTotal.innerText = 'R$ 0,00';
        containerBtnFinalizar.innerHTML = '';
        return;
    }

    carrinho.forEach((item, index) => {
        // Multiplica o preço pela quantidade que a pessoa pediu
        const subtotal = item.preco * item.qtd;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${item.capa || 'https://via.placeholder.com/50x70/111827/ffffff?text=Capa'}" style="width: 50px; border-radius: 4px;">
                <div>
                    <strong>${item.titulo}</strong>
                    <div style="font-size: 0.9rem; color: #10b981;">R$ ${formatarDinheiro(item.preco)} (x${item.qtd})</div>
                </div>
            </div>
            <button onclick="removerItem(${index})" class="btn-remover">Excluir</button>
        `;
        container.appendChild(div);
    });

    elementoTotal.innerText = `R$ ${formatarDinheiro(total)}`;
    containerBtnFinalizar.innerHTML = `<button onclick="finalizarCompra()" class="btn-comprar" style="margin-top:20px;">Finalizar e Pagar</button>`;
}

window.removerItem = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContador();
};

window.finalizarCompra = function() {
    let estoque = obterEstoque();

    // Abatendo fisicamente do estoque
    carrinho.forEach(itemCarrinho => {
        let produtoEstoque = estoque.find(p => p.id === itemCarrinho.id);
        if (produtoEstoque) {
            produtoEstoque.estoque -= itemCarrinho.qtd;
        }
    });

    salvarEstoque(estoque);
    localStorage.removeItem('carrinhoLoja');
    carrinho = [];
    atualizarContador();
    
    mostrarAviso("Pagamento aprovado! O estoque foi atualizado.");
    setTimeout(() => mudarAba('loja'), 1500); // Dá um tempinho antes de mandar pra vitrine
};

// ----------------------------------------------------
// LOGIN & AUTENTICAÇÃO
// ----------------------------------------------------
function verificarSessaoTopo() {
    const linkLogin = document.getElementById('link-login-topo');
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        linkLogin.textContent = usuarioLogado;
    } else {
        linkLogin.textContent = "Login - Cadastro";
    }
}

window.gerenciarCliqueLogin = function() {
    if (localStorage.getItem('usuarioLogado')) {
        if (confirm("Deseja encerrar sua sessão?")) {
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('adminAutenticado');
            window.location.reload();
        }
    } else {
        mudarAba('login');
    }
};

window.verificarAcessoAdmin = function() {
    if (localStorage.getItem('adminAutenticado') === 'true') {
        mudarAba('admin');
    } else {
        mostrarAviso("Área restrita. Faça login como administrador.");
        mudarAba('login');
    }
};

document.getElementById('form-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('email-login').value.trim();
    const pass = document.getElementById('senha-login').value;

    // A senha secreta do Moises
    if (user === 'Moises' && pass === 'adm1234') {
        localStorage.setItem('usuarioLogado', 'Moises (Admin)');
        localStorage.setItem('adminAutenticado', 'true');
        verificarSessaoTopo();
        mudarAba('admin');
        mostrarAviso("Bem-vindo de volta ao sistema, chefe.");
    } else if (user) {
        localStorage.setItem('usuarioLogado', user);
        localStorage.removeItem('adminAutenticado');
        verificarSessaoTopo();
        mudarAba('loja');
        mostrarAviso(`Boas investigações, ${user}!`);
    }
});

// ----------------------------------------------------
// PAINEL DO ADMINISTRADOR
// ----------------------------------------------------
function renderizarPainelAdmin() {
    const container = document.getElementById('lista-admin-produtos');
    if (!container) return;

    let estoque = obterEstoque();
    container.innerHTML = '';

    // Lista os livros de trás pra frente (os mais novos em cima)
    estoque.slice().reverse().forEach((produto, indexReverso) => {
        // Gambiarra do bem pra achar o indice real no array original
        const indexReal = estoque.length - 1 - indexReverso; 
        
        const bloco = document.createElement('div');
        bloco.className = 'linha-admin';
        bloco.innerHTML = `
            <div style="margin-bottom: 10px;">ID: ${produto.id} | <strong style="color:var(--verde-claro)">${produto.titulo}</strong></div>
            <div class="form-grupo">
                <label>Título:</label>
                <input type="text" class="adm-nome" value="${produto.titulo}">
            </div>
            <div class="form-grupo">
                <label>Preço de Venda (R$):</label>
                <!-- O input number obriga a digitar número válido. formatamos na hora de salvar -->
                <input type="number" step="0.01" class="adm-preco" value="${produto.preco}">
            </div>
            <div class="form-grupo">
                <label>Unidades Físicas (Estoque):</label>
                <input type="number" class="adm-estoque" value="${produto.estoque}">
            </div>
        `;
        container.appendChild(bloco);
    });
}

// Escuta o envio do formulário de CADASTRO DE NOVO LIVRO
document.getElementById('form-novo-livro')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let estoque = obterEstoque();
    
    // Calcula um ID novo (pega o maior ID existente e soma 1)
    let novoId = 1;
    if (estoque.length > 0) {
        novoId = Math.max(...estoque.map(p => p.id)) + 1;
    }

    const t = document.getElementById('novo-titulo').value;
    const a = document.getElementById('novo-autor').value;
    const p = parseFloat(document.getElementById('novo-preco').value);
    const est = parseInt(document.getElementById('novo-estoque').value);
    const cap = document.getElementById('nova-capa').value;

    const novoLivro = {
        id: novoId,
        titulo: t,
        autor: a,
        preco: p,
        estoque: est,
        capa: cap,
        promocao: false // Padrão entra sem promoção
    };

    estoque.push(novoLivro);
    salvarEstoque(estoque);
    
    // Limpa os campos após cadastrar
    document.getElementById('form-novo-livro').reset();
    
    mostrarAviso("Novo livro catalogado com sucesso!");
    renderizarPainelAdmin(); // Recarrega a tela de admin para o livro aparecer na lista embaixo
});

window.salvarAlteracoesAdmin = function() {
    // Como a lista foi renderizada de trás pra frente, precisamos pegar os dados com cuidado
    const blocos = document.querySelectorAll('.linha-admin');
    let estoque = obterEstoque();

    blocos.forEach((bloco, indexReverso) => {
        const indexReal = estoque.length - 1 - indexReverso;
        
        const novoNome = bloco.querySelector('.adm-nome').value;
        const novoPreco = parseFloat(bloco.querySelector('.adm-preco').value) || 0;
        const novoEstoque = parseInt(bloco.querySelector('.adm-estoque').value) || 0;

        if (estoque[indexReal]) {
            estoque[indexReal].titulo = novoNome;
            estoque[indexReal].preco = novoPreco;
            estoque[indexReal].estoque = novoEstoque;
        }
    });

    salvarEstoque(estoque);
    mostrarAviso("O acervo geral foi atualizado!");
};

window.sairAdmin = function() {
    localStorage.removeItem('adminAutenticado');
    localStorage.removeItem('usuarioLogado');
    verificarSessaoTopo();
    mudarAba('loja');
};

// ----------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------
// Quando a página termina de carregar o HTML, roda isso aqui:
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    verificarSessaoTopo();
    renderizarVitrine();
});