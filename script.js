// Array principal de produtos com mais itens setados com "promocao: true" para teste
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

// Gerenciamento de LocalStorage
function obterEstoque() {
    let salvo = localStorage.getItem('estoqueLoja');
    return salvo ? JSON.parse(salvo) : produtosPadrao;
}

function salvarEstoque(estoque) {
    localStorage.setItem('estoqueLoja', JSON.stringify(estoque));
}

let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

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
        banner.style.display = (nomeAba === 'loja') ? 'block' : 'none';
    }

    window.scrollTo(0, 0);

    if (nomeAba === 'loja') {
        document.getElementById('input-pesquisa').value = '';
        renderizarVitrine();
    }
    if (nomeAba === 'carrinho') renderizarCarrinho();
    if (nomeAba === 'admin') renderizarPainelAdmin();
}

function atualizarContador() {
    const contadores = document.querySelectorAll('.contador-carrinho');
    let totalUnidades = 0;
    carrinho.forEach(item => { totalUnidades += (item.quantidade || 1); });
    
    contadores.forEach(c => {
        c.textContent = totalUnidades;
    });
}

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

function verificarAcessoAdmin() {
    if (localStorage.getItem('adminAutenticado') === 'true') {
        mudarAba('admin');
    } else {
        mostrarToast("Acesso restrito. Faça login com a conta de administrador.");
        mudarAba('login');
    }
}

function pesquisarLivros() {
    const textoDigitado = document.getElementById('input-pesquisa').value.toLowerCase();
    renderizarVitrine(textoDigitado);
}

function renderizarVitrine(filtroTexto = '') {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return;

    let estoque = obterEstoque();
    vitrine.innerHTML = '';
    
    let livrosFiltrados = estoque.filter(produto => {
        return produto.titulo.toLowerCase().includes(filtroTexto) || produto.autor.toLowerCase().includes(filtroTexto);
    });

    if (livrosFiltrados.length === 0) {
        vitrine.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Nenhum livro foi encontrado na pesquisa.</p>';
        return;
    }

    livrosFiltrados.forEach(produto => {
        let precoReal = produto.promocao ? produto.preco * 0.8 : produto.preco;
        let valorParcelado = (precoReal / 3).toFixed(2).replace('.', ',');
        
        let esgotou = produto.estoque === 0;
        let textoBotao = esgotou ? "Esgotado" : "Comprar";
        let statusDisabled = esgotou ? "disabled style='background-color: #374151; cursor: not-allowed; opacity: 0.7;'" : `onclick="adicionarAoCarrinho(${produto.id})"`;
        
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
            <button class="btn-comprar" ${statusDisabled}>${textoBotao}</button>
        `;
        vitrine.appendChild(cartao);
    });
}

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
        div.style.cssText = "display: flex; align-items: center; background: var(--fundo-cartao); padding: 15px; margin-bottom: 10px; border-radius: 6px; border: 1px solid rgba(124,58,237,0.2);";
        div.innerHTML = `
            <img src="${item.capa}" alt="${item.titulo}" style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;">
            <div style="flex-grow: 1; margin-left: 15px;">
                <h4 style="margin: 0; color: var(--verde-claro); font-family: 'Cinzel', serif;">${item.titulo}</h4>
                <span style="color: var(--texto-secundario);">R$ ${item.preco.toFixed(2).replace('.', ',')} (Quantidade: ${qtdDaVez})</span>
            </div>
            <button onclick="removerItem(${index})" style="border: 1px solid var(--vermelho-botao); color: var(--vermelho-botao); background:none; padding: 5px 10px; cursor:pointer; border-radius: 4px;">Remover</button>
        `;
        container.appendChild(div);
    });

    if (elementoTotal) {
        elementoTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    if (containerBtnFinalizar) {
        containerBtnFinalizar.innerHTML = `<button onclick="finalizarCompra()" class="btn-comprar" style="width: 100%; margin-top: 0; padding: 12px; font-size: 1rem; cursor: pointer;">Finalizar Compra</button>`;
    }
}

window.removerItem = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarContador();
};

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

function renderizarPainelAdmin() {
    const containerAdmin = document.getElementById('lista-admin-produtos');
    if (!containerAdmin) return;

    let estoque = obterEstoque();
    containerAdmin.innerHTML = '';

    estoque.forEach((produto) => {
        const bloco = document.createElement('div');
        bloco.style.cssText = "background: var(--fundo-cartao); padding: 15px; margin-bottom: 15px; border-radius: 6px; border: 1px solid rgba(124,58,237,0.3); display: flex; flex-direction: column; gap: 10px;";
        bloco.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--texto-secundario);">Autor: <strong>${produto.autor}</strong></div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 2; min-width: 200px;">
                    <label style="font-size: 0.8rem; display: block; color: var(--verde-claro);">Nome do Produto:</label>
                    <input type="text" class="adm-nome" value="${produto.titulo}" style="width: 100%; padding: 8px; background: #020617; border: 1px solid #334155; color: white; border-radius: 4px;">
                </div>
                <div style="flex: 1; min-width: 100px;">
                    <label style="font-size: 0.8rem; display: block; color: var(--verde-claro);">Preço (R$):</label>
                    <input type="number" step="0.01" class="adm-preco" value="${produto.preco.toFixed(2)}" style="width: 100%; padding: 8px; background: #020617; border: 1px solid #334155; color: white; border-radius: 4px;">
                </div>
                <div style="flex: 1; min-width: 100px;">
                    <label style="font-size: 0.8rem; display: block; color: var(--verde-claro);">Estoque:</label>
                    <input type="number" class="adm-estoque" value="${produto.estoque}" style="width: 100%; padding: 8px; background: #020617; border: 1px solid #334155; color: white; border-radius: 4px;">
                </div>
            </div>
        `;
        containerAdmin.appendChild(bloco);
    });
}

document.getElementById('form-novo-livro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let estoque = obterEstoque();
    let maiorId = 0;
    estoque.forEach(p => { if (p.id > maiorId) maiorId = p.id; });
    
    const inputArquivo = document.getElementById('add-capa');
    
    if (inputArquivo.files && inputArquivo.files[0]) {
        let leitor = new FileReader();
        leitor.onload = function(eventoArquivo) {
            
            let novoLivro = {
                id: maiorId + 1,
                titulo: document.getElementById('add-nome').value.trim(),
                autor: document.getElementById('add-autor').value.trim(),
                preco: parseFloat(document.getElementById('add-preco').value) || 0,
                estoque: parseInt(document.getElementById('add-estoque').value) || 0,
                capa: eventoArquivo.target.result
            };
            
            estoque.push(novoLivro);
            salvarEstoque(estoque);
            mostrarToast("Novo registro adicionado ao catálogo com sucesso.");
            
            document.getElementById('form-novo-livro').reset();
            renderizarPainelAdmin();
        };
        leitor.readAsDataURL(inputArquivo.files[0]);
    }
});

window.salvarAlteracoesAdmin = function() {
    const blocos = document.querySelectorAll('#lista-admin-produtos > div');
    let estoque = obterEstoque();

    blocos.forEach((bloco, index) => {
        const novoNome = bloco.querySelector('.adm-nome').value;
        const novoPreco = parseFloat(bloco.querySelector('.adm-preco').value) || 0;
        const novoEstoque = parseInt(bloco.querySelector('.adm-estoque').value) || 0;

        if (estoque[index]) {
            estoque[index].titulo = novoNome;
            estoque[index].preco = novoPreco;
            estoque[index].estoque = novoEstoque;
        }
    });

    salvarEstoque(estoque);
    mostrarToast('Alterações no catálogo salvas com sucesso.');
    renderizarVitrine();
};

window.sairAdmin = function() {
    localStorage.removeItem('adminAutenticado');
    localStorage.removeItem('usuarioLogado');
    verificarSessaoTopo();
    mudarAba('loja');
};

document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    verificarSessaoTopo();
    renderizarVitrine();
    inicializarLogin();
});