// ======================================
// RENDERIZAÇÃO DO CARRINHO
// ======================================

/**
 * Atualiza o badge do contador de itens no header (se existir)
 */
function atualizarBadgeCarrinho() {
    const carrinho = getCarrinho();
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    
    // Tenta atualizar o badge em cardapio.html
    const badge = document.querySelector('.carrinho-badge');
    if (badge) {
        badge.textContent = totalItens;
        badge.style.display = totalItens > 0 ? 'flex' : 'none';
    }
    
    // Tenta atualizar contador na página do carrinho
    const contadorEl = document.getElementById('contador-itens');
    if (contadorEl) {
        contadorEl.textContent = totalItens;
    }
}

/**
 * Renderiza os itens do carrinho na página
 */
function renderizarCarrinho() {
    const carrinho = getCarrinho(); 
    const listaEl = document.getElementById('lista-carrinho');
    const vazioEl = document.getElementById('carrinho-vazio');

    let totalGeral = 0;
    let totalItens = 0;

    // Se não estiver em página do carrinho, apenas atualiza badge
    if (!listaEl) {
        atualizarBadgeCarrinho();
        return;
    }

    const totalEl = document.getElementById('valor-total-carrinho');
    const contadorEl = document.getElementById('contador-itens');

    listaEl.innerHTML = '';

    if (carrinho.length === 0) {
        if (vazioEl) vazioEl.style.display = 'block';
    } else {
        if (vazioEl) vazioEl.style.display = 'none';
        
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            totalGeral += subtotal;
            totalItens += item.quantidade;

            // Cria o HTML para cada item do carrinho
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrinho-item');
            itemDiv.setAttribute('data-produto-id', item.id);
            itemDiv.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
                <div class="item-detalhes">
                    <h3>${item.nome}</h3>
                    <p>Valor Unitário: R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <p>Subtotal: <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong></p>
                </div>
                <div class="item-acoes">
                    <div class="quantidade-input">
                        <button class="btn-menos" data-id="${item.id}" type="button">−</button>
                        <span class="quantidade-valor">${item.quantidade}</span>
                        <button class="btn-mais" data-id="${item.id}" type="button">+</button>
                    </div>
                    <button class="btn-remover" data-id="${item.id}" type="button">
                        🗑️ Remover
                    </button>
                </div>
            `;
            listaEl.appendChild(itemDiv);
        });
    }

    // Atualiza os totais
    if (totalEl) totalEl.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    if (contadorEl) contadorEl.textContent = totalItens;

    // Atualiza badge também
    atualizarBadgeCarrinho();
}

/**
 * Muda a quantidade de um item no carrinho
 */
function mudarQuantidade(id, delta) {
    let carrinho = getCarrinho();
    const item = carrinho.find(i => String(i.id) === String(id));

    if (item) {
        item.quantidade += delta;

        if (item.quantidade < 1) {
            removerItem(id);
        } else {
            saveCarrinho(carrinho);
        }
        
        renderizarCarrinho();
        setupCarrinhoEventListeners();
    }
}

/**
 * Configura os event listeners do carrinho
 */
function setupCarrinhoEventListeners() {
    const listaEl = document.getElementById('lista-carrinho');
    if (!listaEl) return; // Se não está em página do carrinho, não faz nada

    // Remove listener anterior para evitar duplicatas
    listaEl.removeEventListener('click', handleCarrinhoClick);
    
    // Adiciona novo listener
    listaEl.addEventListener('click', handleCarrinhoClick);
}

/**
 * Handler de cliques dos botões do carrinho
 */
function handleCarrinhoClick(e) {
    const botao = e.target.closest('button[data-id]'); 
    
    if (!botao) return; 

    const id = botao.getAttribute('data-id');
    if (!id) return;
    
    e.preventDefault(); 
    
    if (botao.classList.contains('btn-mais')) {
        mudarQuantidade(id, 1);
    } else if (botao.classList.contains('btn-menos')) {
        mudarQuantidade(id, -1);
    } else if (botao.classList.contains('btn-remover')) {
        removerItem(id); 
        renderizarCarrinho();
        setupCarrinhoEventListeners();
    }
}

/**
 * Limpa o carrinho após confirmação
 */
function limparCarrinho() {
    if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
        localStorage.removeItem('carrinhoHapuque');
        renderizarCarrinho();
        if (document.getElementById('lista-carrinho')) {
            setupCarrinhoEventListeners();
        }
    }
}

/**
 * Finaliza a compra e envia para WhatsApp
 */
function finalizarCompra() {
    const carrinho = getCarrinho();

    if (!carrinho || carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        return;
    }

    // Lê dados do cliente
    const nomeCliente = (document.getElementById('cliente-nome')?.value.trim()) || '';
    const telefoneCliente = (document.getElementById('cliente-telefone')?.value.trim()) || '';
    const enderecoCliente = (document.getElementById('cliente-endereco')?.value.trim()) || '';

    if (!nomeCliente) {
        if (!confirm('Você não informou seu nome. Deseja continuar mesmo assim?')) return;
    }

    // Monta linhas de itens
    let totalGeral = 0;
    const linhas = carrinho.map(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        return `${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    });

    // Cria ID do pedido
    const dataPedido = new Date();
    const pedidoId = `PED-${dataPedido.getFullYear()}${String(dataPedido.getMonth()+1).padStart(2,'0')}${String(dataPedido.getDate()).padStart(2,'0')}-${String(dataPedido.getHours()).padStart(2,'0')}${String(dataPedido.getMinutes()).padStart(2,'0')}${String(dataPedido.getSeconds()).padStart(2,'0')}`;

    // Monta mensagem
    let mensagemTexto = `Olá, gostaria de fazer um pedido (${pedidoId})\n\n`;
    linhas.forEach(l => { mensagemTexto += `${l}\n`; });
    mensagemTexto += `\nTotal: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n\n`;
    if (nomeCliente) mensagemTexto += `Nome: ${nomeCliente}\n`;
    if (telefoneCliente) mensagemTexto += `Telefone: ${telefoneCliente}\n`;
    if (enderecoCliente) mensagemTexto += `Endereço: ${enderecoCliente}\n`;

    // Obtém número de WhatsApp
    const btn = document.getElementById('btn-finalizar');
    const telefone = (btn?.getAttribute('data-whatsapp')) || '5511940261055';

    // Confirmação
    const confirmar = confirm('Abrir WhatsApp para finalizar o pedido?');
    if (!confirmar) return;

    // Abre WhatsApp
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagemTexto)}`;
    window.open(url, '_blank');

    // Limpa carrinho
    localStorage.removeItem('carrinhoHapuque');
    renderizarCarrinho();
    if (document.getElementById('lista-carrinho')) {
        setupCarrinhoEventListeners();
    }
}

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
    setupCarrinhoEventListeners();
});

// Atualiza carrinho quando evento é disparado (de qualquer página)
document.addEventListener('carrinhoAtualizado', () => {
    renderizarCarrinho();
    setupCarrinhoEventListeners();
});

// Sincroniza carrinho em tempo real quando localStorage muda (em outra aba)
window.addEventListener('storage', (e) => {
    if (e.key === 'carrinhoHapuque') {
        renderizarCarrinho();
        setupCarrinhoEventListeners();
    }
});

