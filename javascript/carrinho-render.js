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
    // Implementar a lógica de finalizar compra (Ex: Gerar link WhatsApp)
    alert("Funcionalidade de Finalizar Compra será implementada aqui!");
    // Exemplo: window.location.href = 'checkout.html';
}