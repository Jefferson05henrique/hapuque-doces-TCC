// Função para abrir o modal com os dados do produto clicado
function abrirModal(elementoDoce) {
    const nome = elementoDoce.querySelector('h3').textContent;
    const precoTexto = elementoDoce.querySelector('.card-price').textContent.replace('R$ ', '').replace(',', '.');
    const preco = parseFloat(precoTexto);
    const imagemSrc = elementoDoce.querySelector('img').src;
    
    // Obter um ID único para o produto (pode ser o nome, mas melhor se for um ID real)
    // Usaremos o nome como ID por enquanto, mas o ideal é ter um ID no HTML
    const id = nome.replace(/\s/g, '-').toLowerCase(); 

    // 1. Preenche o Modal
    document.getElementById('modal-nome').textContent = nome;
    document.getElementById('modal-preco').textContent = precoTexto;
    document.getElementById('modal-imagem').src = imagemSrc;
    document.getElementById('quantidade').value = 1;

    // 2. Associa o ID e o Preço ao botão de adicionar para uso posterior
    const btnAdicionar = document.getElementById('btn-adicionar');
    btnAdicionar.setAttribute('data-produto-id', id);
    btnAdicionar.setAttribute('data-produto-nome', nome);
    btnAdicionar.setAttribute('data-produto-preco', preco);
    btnAdicionar.setAttribute('data-produto-imagem', imagemSrc);

    // 3. Atualiza o subtotal inicial e exibe o modal
    atualizarSubtotal();
    document.getElementById('modal-produto').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-produto').style.display = 'none';
}

function atualizarSubtotal() {
    const preco = parseFloat(document.getElementById('btn-adicionar').getAttribute('data-produto-preco'));
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (isNaN(preco) || isNaN(quantidade) || quantidade < 1) {
        document.getElementById('modal-subtotal').textContent = 'R$ 0,00';
        return;
    }
    
    const subtotal = preco * quantidade;
    document.getElementById('modal-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Vincula a função abrirModal a cada item do cardápio
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.doce-item').forEach(item => {
        item.addEventListener('click', function() {
            // Passa o elemento clicado para a função abrirModal
            abrirModal(this); 
        });
    });
});



// 1. LÊ O LOCALSTORAGE
function getCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinhoHapuque');
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

// 2. SALVA NO LOCALSTORAGE (usada por outras funções de manipulação)
function saveCarrinho(carrinho) {
    localStorage.setItem('carrinhoHapuque', JSON.stringify(carrinho));
    // Dispara um evento customizado para notificar outros módulos que o carrinho foi atualizado
    // Isso torna a UI reativa: qualquer listener pode reagir a mudanças sem depender de chamadas diretas
    try {
        document.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: { carrinho } }));
    } catch (e) {
        // Em ambientes onde `document` não existe (testes fora do browser) falha silenciosamente
        // Mantemos o salvamento no localStorage como a fonte da verdade.
    }
}

// NO ARQUIVO: javascript/carrinho.js

// 3. REMOVE UM ITEM (ou diminui a quantidade)
function removerItem(id) {
    let carrinho = getCarrinho();
    // Normaliza tipos para evitar problemas entre string/number
    carrinho = carrinho.filter(item => String(item.id) !== String(id));
    saveCarrinho(carrinho);
}

// Função para adicionar o produto (configurado no modal) ao carrinho
function adicionarProdutoAoCarrinho() {
    const btn = document.getElementById('btn-adicionar');
    if (!btn) return;

    const id = btn.getAttribute('data-produto-id');
    const nome = btn.getAttribute('data-produto-nome');
    const preco = parseFloat(btn.getAttribute('data-produto-preco'));
    const imagem = btn.getAttribute('data-produto-imagem');
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;

    if (!id || !nome || isNaN(preco)) {
        alert('Dados do produto inválidos. Tente novamente.');
        return;
    }

    let carrinho = getCarrinho();
    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade });
    }

    saveCarrinho(carrinho);

    // Fecha o modal e atualiza a página do carrinho caso esteja aberta
    fecharModal();
    if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
    }


    alert(`${quantidade} x ${nome} adicionado(s) ao carrinho.`);
}