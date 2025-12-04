/**
 * Abre o modal do produto com as informações do item clicado
 */
function abrirModal(elementoDoce) {
    const nome = elementoDoce.querySelector('h3').textContent;
    const precoTexto = elementoDoce.querySelector('.card-price').textContent.replace('R$ ', '').replace(',', '.');
    const preco = parseFloat(precoTexto);
    const imagemSrc = elementoDoce.querySelector('img').src;

    // Gera ID único baseado no nome
    const id = nome.replace(/\s+/g, '-').toLowerCase();

    // Preenche o modal com dados do produto
    document.getElementById('modal-nome').textContent = nome;
    document.getElementById('modal-preco').textContent = precoTexto;
    document.getElementById('modal-imagem').src = imagemSrc;
    document.getElementById('quantidade').value = 1;

    // Armazena dados no botão de adicionar
    const btnAdicionar = document.getElementById('btn-adicionar');
    btnAdicionar.setAttribute('data-produto-id', id);
    btnAdicionar.setAttribute('data-produto-nome', nome);
    btnAdicionar.setAttribute('data-produto-preco', preco);
    btnAdicionar.setAttribute('data-produto-imagem', imagemSrc);

    // Atualiza subtotal e exibe modal
    atualizarSubtotal();
    document.getElementById('modal-produto').style.display = 'block';
}

/**
 * Fecha o modal do produto
 */
function fecharModal() {
    document.getElementById('modal-produto').style.display = 'none';
}

/**
 * Atualiza o subtotal exibido no modal
 */
function atualizarSubtotal() {
    const btnAdicionar = document.getElementById('btn-adicionar');
    const preco = parseFloat(btnAdicionar.getAttribute('data-produto-preco'));
    const quantidade = parseInt(document.getElementById('quantidade').value);

    if (isNaN(preco) || isNaN(quantidade) || quantidade < 1) {
        document.getElementById('modal-subtotal').textContent = 'R$ 0,00';
        return;
    }

    const subtotal = preco * quantidade;
    document.getElementById('modal-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

/**
 * Aumenta a quantidade no modal
 */
function aumentarQuantidade() {
    const quantidadeInput = document.getElementById('quantidade');
    let valor = parseInt(quantidadeInput.value) || 1;
    valor += 1;
    quantidadeInput.value = valor;
    atualizarSubtotal();
}

/**
 * Diminui a quantidade no modal
 */
function diminuirQuantidade() {
    const quantidadeInput = document.getElementById('quantidade');
    let valor = parseInt(quantidadeInput.value) || 1;
    if (valor > 1) {
        valor -= 1;
        quantidadeInput.value = valor;
        atualizarSubtotal();
    }
}

// Configura listeners dos produtos quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona listener para cada produto do cardápio
    document.querySelectorAll('.doce-item').forEach(item => {
        item.addEventListener('click', function() {
            abrirModal(this);
        });
    });

    // Fecha modal ao clicar fora dele
    const modal = document.getElementById('modal-produto');
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }
});



/**
 * Lê o carrinho do localStorage
 */
function getCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinhoHapuque');
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

/**
 * Salva o carrinho no localStorage e dispara evento de atualização
 */
function saveCarrinho(carrinho) {
    localStorage.setItem('carrinhoHapuque', JSON.stringify(carrinho));
    try {
        document.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: { carrinho } }));
    } catch (e) {
        // Falha silenciosa em ambientes sem document
    }
}

/**
 * Remove um item do carrinho
 */
function removerItem(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => String(item.id) !== String(id));
    saveCarrinho(carrinho);
}

/**
 * Adiciona o produto do modal ao carrinho
 */
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
    const existente = carrinho.find(item => String(item.id) === String(id));

    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade });
    }

    saveCarrinho(carrinho);
    fecharModal();

    alert(`${quantidade} x ${nome} adicionado(s) ao carrinho.`);

    // Atualiza renderização se estiver na página do carrinho
    if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
    }
}
