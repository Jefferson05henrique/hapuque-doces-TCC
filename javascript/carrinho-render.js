// javascript/carrinho-render.js

function renderizarCarrinho() {
    // 1. Pega os dados salvos pelo cardapio.html
    const carrinho = getCarrinho(); 
    
    // 2. Referencia os elementos HTML
    const listaEl = document.getElementById('lista-carrinho');
    const totalEl = document.getElementById('valor-total-carrinho');
    const contadorEl = document.getElementById('contador-itens');
    const vazioEl = document.getElementById('carrinho-vazio');

    let totalGeral = 0;
    let totalItens = 0;

    listaEl.innerHTML = ''; // Limpa a lista antes de reconstruir

    if (carrinho.length === 0) {
        vazioEl.style.display = 'block';
    } else {
        vazioEl.style.display = 'none';
        
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            totalGeral += subtotal;
            totalItens += item.quantidade;

            // 3. Cria o HTML para CADA item do carrinho
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
                        <button class="btn-menos" data-id="${item.id}" type="button">-</button>
                        <span class="quantidade-valor">${item.quantidade}</span>
                        <button class="btn-mais" data-id="${item.id}" type="button">+</button>
                    </div>
                    <button class="btn-remover" data-id="${item.id}" type="button">
                        Remover
                    </button>
                </div>
            `;
            listaEl.appendChild(itemDiv);
        });
    }

    // 4. Atualiza os totais
    totalEl.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    contadorEl.textContent = totalItens;
}

// Função para mudar a quantidade (usa as funções de lógica do carrinho.js)
function mudarQuantidade(id, delta) {
    let carrinho = getCarrinho();
    const item = carrinho.find(i => i.id === id);

    if (item) {
        item.quantidade += delta;

        if (item.quantidade < 1) {
            removerItem(id);
        } else {
            saveCarrinho(carrinho);
            renderizarCarrinho();
            setupCarrinhoEventListeners(); // Re-adiciona listeners após renderizar
        }
    }
}

// Setup dos event listeners - executado APÓS o DOM estar pronto
function setupCarrinhoEventListeners() {
    const listaEl = document.getElementById('lista-carrinho');
    
    if (!listaEl) return;

    // Delegação de eventos para +/- e remover
    listaEl.removeEventListener('click', handleCarrinhoClick); // Remove listener antigo se existir
    listaEl.addEventListener('click', handleCarrinhoClick);
}

// Handler de cliques - função separada para facilitar remover/readicionar
function handleCarrinhoClick(e) {
    const botao = e.target;
    
    if (!botao.classList) return;
    
    const id = botao.getAttribute('data-id');
    
    if (!id) return;

    if (botao.classList.contains('btn-mais')) {
        e.preventDefault();
        mudarQuantidade(id, 1);
    } else if (botao.classList.contains('btn-menos')) {
        e.preventDefault();
        mudarQuantidade(id, -1);
    } else if (botao.classList.contains('btn-remover')) {
        e.preventDefault();
        removerItem(id);
    }
}

// CHAMA A FUNÇÃO DE RENDERIZAÇÃO AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
    setupCarrinhoEventListeners();
});


function limparCarrinho() {
    if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
        localStorage.removeItem('carrinhoHapuque');
        renderizarCarrinho();
        setupCarrinhoEventListeners();
    }
}

function finalizarCompra() {
    // Lê o carrinho e valida
    const carrinho = getCarrinho();

    if (!carrinho || carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        return;
    }

    // Lê os dados do cliente do formulário (se presentes)
    const nomeCliente = (document.getElementById('cliente-nome') && document.getElementById('cliente-nome').value.trim()) || '';
    const telefoneCliente = (document.getElementById('cliente-telefone') && document.getElementById('cliente-telefone').value.trim()) || '';
    const enderecoCliente = (document.getElementById('cliente-endereco') && document.getElementById('cliente-endereco').value.trim()) || '';

    // Recomendamos pelo menos o nome e telefone (telefone opcional dependendo do fluxo)
    if (!nomeCliente) {
        if (!confirm('Você não informou seu nome. Deseja continuar mesmo assim?')) return;
    }

    // Monta linhas de itens e calcula total
    let totalGeral = 0;
    const linhas = carrinho.map(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        return `${item.quantidade} x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    });

    const dataPedido = new Date();
    const pedidoId = `PED-${dataPedido.getFullYear()}${(dataPedido.getMonth()+1).toString().padStart(2,'0')}${dataPedido.getDate().toString().padStart(2,'0')}-${dataPedido.getHours().toString().padStart(2,'0')}${dataPedido.getMinutes().toString().padStart(2,'0')}${dataPedido.getSeconds().toString().padStart(2,'0')}`;

    // Monta mensagem em texto simples e codifica no final
    let mensagemTexto = `Olá, gostaria de fazer um pedido (${pedidoId})\n\n`;
    linhas.forEach(l => { mensagemTexto += `${l}\n`; });
    mensagemTexto += `\nTotal: R$ ${totalGeral.toFixed(2).replace('.', ',')}\n\n`;
    if (nomeCliente) mensagemTexto += `Nome: ${nomeCliente}\n`;
    if (telefoneCliente) mensagemTexto += `Telefone: ${telefoneCliente}\n`;
    if (enderecoCliente) mensagemTexto += `Endereço: ${enderecoCliente}\n`;

    // Obtém número do botão (data-whatsapp) ou usa fallback
    const btn = document.getElementById('btn-finalizar');
    const telefone = (btn && btn.getAttribute('data-whatsapp')) ? btn.getAttribute('data-whatsapp') : '5511940261055';

    // Confirmação antes de abrir WhatsApp e limpar o carrinho
    const confirmar = confirm('Abrir WhatsApp para finalizar o pedido? Ao confirmar, o carrinho será limpo localmente.');
    if (!confirmar) return;

    // Cria URL com encodeURIComponent
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagemTexto)}`;
    window.open(url, '_blank');

    // Limpa carrinho local e re-renderiza
    localStorage.removeItem('carrinhoHapuque');
    renderizarCarrinho();
    setupCarrinhoEventListeners();
}

window.renderizarCarrinho = renderizarCarrinho;
window.setupCarrinhoEventListeners = setupCarrinhoEventListeners;