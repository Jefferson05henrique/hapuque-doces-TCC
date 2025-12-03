/**
 * Valida o formulário de contato
 */
function validarFormularioContato(event) {
  event.preventDefault();
  console.log('Função validarFormularioContato chamada');

  const form = document.getElementById('formularioContato');
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  const primeiroNome = inputs[0];
  const ultimoNome = inputs[1];
  const emailInput = inputs[2];
  const telefoneInput = inputs[3];
  
  let formularioValido = true;

  // Valida campos obrigatórios: Nome, Sobrenome, Email, Telefone
  const camposObrigatorios = [primeiroNome, ultimoNome, emailInput, telefoneInput];
  camposObrigatorios.forEach(input => {
    if (!input || !input.value.trim()) {
      formularioValido = false;
      if (input) {
        input.style.borderColor = '#ff6b6b';
        input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
      }
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  });

  if (!formularioValido) {
    console.log('Formulário inválido - campos vazios');
    mostrarNotificacao('❌ Por favor, preencha todos os campos obrigatórios! (Nome, Sobrenome, E-mail, Telefone)', 'erro');
    return;
  }

  // Valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    console.log('E-mail inválido:', emailInput.value);
    mostrarNotificacao('❌ Por favor, insira um e-mail válido!', 'erro');
    emailInput.style.borderColor = '#ff6b6b';
    emailInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
    return;
  }

  // Se passou todas as validações
  console.log('Formulário válido - mostrando sucesso');
  mostrarNotificacao('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'sucesso');
  
  // Limpa o formulário após 1.5 segundos
  setTimeout(() => {
    form.reset();
    // Remove estilos de erro
    form.querySelectorAll('input, textarea').forEach(input => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    });
  }, 1500);
}

/**
 * Valida o formulário de trabalhe conosco
 */
function validarFormularioTrabalhe(event) {
  event.preventDefault();
  console.log('Função validarFormularioTrabalhe chamada');

  const form = document.getElementById('formularioTrabalhe');
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  const primeiroNome = inputs[0];
  const ultimoNome = inputs[1];
  const emailInput = inputs[2];
  const telefoneInput = inputs[3];
  
  let formularioValido = true;

  // Valida campos obrigatórios: Nome, Sobrenome, Email, Telefone
  const camposObrigatorios = [primeiroNome, ultimoNome, emailInput, telefoneInput];
  camposObrigatorios.forEach(input => {
    if (!input || !input.value.trim()) {
      formularioValido = false;
      if (input) {
        input.style.borderColor = '#ff6b6b';
        input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
      }
    } else {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }
  });

  if (!formularioValido) {
    console.log('Formulário inválido - campos vazios');
    mostrarNotificacao('❌ Por favor, preencha todos os campos obrigatórios! (Nome, Sobrenome, E-mail, Telefone)', 'erro');
    return;
  }

  // Valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    console.log('E-mail inválido:', emailInput.value);
    mostrarNotificacao('❌ Por favor, insira um e-mail válido!', 'erro');
    emailInput.style.borderColor = '#ff6b6b';
    emailInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
    return;
  }

  // Se passou todas as validações
  console.log('Formulário válido - mostrando sucesso');
  mostrarNotificacao('✅ Currículo enviado com sucesso! Entraremos em contato em breve.', 'sucesso');
  
  // Limpa o formulário após 1.5 segundos
  setTimeout(() => {
    form.reset();
    // Remove estilos de erro
    form.querySelectorAll('input, textarea').forEach(input => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    });
  }, 1500);
}

/**
 * Mostra notificação na tela
 */
function mostrarNotificacao(mensagem, tipo) {
  console.log('Mostrando notificação:', mensagem, tipo);
  
  // Remove notificação anterior se existir
  const notificacaoAnterior = document.querySelector('.notificacao');
  if (notificacaoAnterior) {
    notificacaoAnterior.remove();
  }

  // Cria elemento de notificação
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.innerHTML = `
    <div class="notificacao-conteudo">
      <span class="notificacao-mensagem">${mensagem}</span>
      <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Adiciona à página
  document.body.appendChild(notificacao);
  console.log('Notificação criada e adicionada ao DOM');

  // Remove automaticamente após 5 segundos (sucesso) ou 4 segundos (erro)
  const duracao = tipo === 'sucesso' ? 5000 : 4000;
  setTimeout(() => {
    if (notificacao.parentElement) {
      notificacao.remove();
      console.log('Notificação removida após timeout');
    }
  }, duracao);
}

// Validação em tempo real e inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Formulário de Contato
  const formularioContato = document.getElementById('formularioContato');
  if (formularioContato) {
    formularioContato.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
      });
    });
  }

  // Formulário de Trabalhe
  const formularioTrabalhe = document.getElementById('formularioTrabalhe');
  if (formularioTrabalhe) {
    formularioTrabalhe.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
      });
    });
  }
});
