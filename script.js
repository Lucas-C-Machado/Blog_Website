/*
    ============================================
    BLOG DIDÁTICO - JAVASCRIPT
    ============================================
    
    Este arquivo contém toda a lógica interativa do blog.
    JavaScript permite adicionar comportamento dinâmico às páginas web.
    
    Funcionalidades implementadas:
    1. Navegação suave entre seções
    2. Adicionar, Editar e Excluir comentários dinamicamente
    3. Armazenar comentários no localStorage
    4. Validação de formulário
    5. Feedback visual ao usuário
*/

// ============================================
// 1. INICIALIZAÇÃO E CARREGAMENTO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página carregada! Inicializando funcionalidades...');
    
    inicializarNavegacao();
    inicializarFormularioComentarios();
    carregarComentariosSalvos();
});

// ============================================
// 2. NAVEGAÇÃO SUAVE
// ============================================

function inicializarNavegacao() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                atualizarNavegacaoAtiva(targetId);
            }
        });
    });
}

function atualizarNavegacaoAtiva(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ============================================
// 3. FORMULÁRIO DE COMENTÁRIOS
// ============================================

function inicializarFormularioComentarios() {
    const forms = document.querySelectorAll('.comment-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const postId = this.getAttribute('data-post-id');
            processarComentario(postId, this);
        });
    });
}

function processarComentario(postId, formElement) {
    const nameInput = formElement.querySelector(`#comment-name-${postId}`);
    const textInput = formElement.querySelector(`#comment-text-${postId}`);
    
    const nome = nameInput.value.trim();
    const texto = textInput.value.trim();
    
    if (!nome || !texto) {
        alert('❌ Por favor, preencha todos os campos!');
        return;
    }
    
    // Gera um ID único baseado no timestamp
    const id = Date.now().toString(); 
    
    const comentario = {
        id: id, // ID ÚNICO
        postId: postId,
        nome: nome,
        texto: texto,
        data: new Date().toLocaleString('pt-BR')
    };
    
    adicionarComentarioAoPagina(comentario);
    salvarComentario(comentario);
    
    formElement.reset();
    
    console.log(`✅ Comentário adicionado com sucesso na postagem ${postId}!`);
}

/*
    Esta função adiciona um comentário visualmente à página
    AGORA INCLUI BOTÕES DE EDIÇÃO E EXCLUSÃO
*/
function adicionarComentarioAoPagina(comentario) {
    const commentsList = document.getElementById(`comments-list-${comentario.postId}`);
    
    if (!commentsList) {
        console.error(`Container de comentários não encontrado para a postagem ${comentario.postId}`);
        return;
    }
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.setAttribute('data-comment-id', comentario.id); // Adiciona o ID para manipulação
    
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">👤 ${comentario.nome}</div>
            <div class="comment-actions">
                <button class="btn-edit" data-comment-id="${comentario.id}">Editar</button>
                <button class="btn-delete" data-comment-id="${comentario.id}">Excluir</button>
            </div>
        </div>
        <div class="comment-body">
            <div class="comment-text-display">${comentario.texto}</div>
            <div class="comment-date">${comentario.data}</div>
        </div>
   `;
    
    // Adiciona os event listeners para os novos botões
    commentElement.querySelector('.btn-edit').addEventListener('click', iniciarEdicaoComentario);
    commentElement.querySelector('.btn-delete').addEventListener('click', excluirComentario);

    commentsList.insertBefore(commentElement, commentsList.firstChild);
}

// ============================================
// 4. FUNCIONALIDADES DE EDIÇÃO E EXCLUSÃO
// ============================================

function iniciarEdicaoComentario(event) {
    const commentId = event.target.getAttribute('data-comment-id');
    const commentElement = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
    
    if (!commentElement) return;

    const currentTextElement = commentElement.querySelector('.comment-text-display');
    const currentText = currentTextElement.textContent;
    const commentBody = commentElement.querySelector('.comment-body');
    const actionsDiv = commentElement.querySelector('.comment-actions');

    // 1. Cria o textarea de edição
    const editArea = document.createElement('textarea');
    editArea.className = 'comment-edit-area';
    editArea.value = currentText;
    editArea.rows = 4;

    // 2. Substitui o texto de exibição pelo textarea
    currentTextElement.style.display = 'none';
    commentBody.insertBefore(editArea, currentTextElement);

    // 3. Altera os botões de ação
    actionsDiv.innerHTML = `
        <button class="btn-save" data-comment-id="${commentId}">Salvar</button>
        <button class="btn-cancel" data-comment-id="${commentId}">Cancelar</button>
    `;

    // 4. Adiciona os novos event listeners
    actionsDiv.querySelector('.btn-save').addEventListener('click', salvarEdicaoComentario);
    actionsDiv.querySelector('.btn-cancel').addEventListener('click', cancelarEdicaoComentario);
}

function salvarEdicaoComentario(event) {
    const commentId = event.target.getAttribute('data-comment-id');
    const commentElement = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
    
    if (!commentElement) return;

    const editArea = commentElement.querySelector('.comment-edit-area');
    const novoTexto = editArea.value.trim();

    if (!novoTexto) {
        alert('O comentário não pode estar vazio!');
        return;
    }

    // 1. Atualiza o LocalStorage
    let comentarios = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const comentarioIndex = comentarios.findIndex(c => c.id === commentId);

    if (comentarioIndex !== -1) {
        comentarios[comentarioIndex].texto = novoTexto;
        comentarios[comentarioIndex].data = new Date().toLocaleString('pt-BR') + ' (Editado)';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));
    }

    // 2. Atualiza o DOM
    const currentTextElement = commentElement.querySelector('.comment-text-display');
    const actionsDiv = commentElement.querySelector('.comment-actions');
    const dateElement = commentElement.querySelector('.comment-date');

    currentTextElement.textContent = novoTexto;
    dateElement.textContent = comentarios[comentarioIndex].data; // Atualiza a data
    
    // 3. Restaura o estado de exibição
    editArea.remove();
    currentTextElement.style.display = 'block';
    
    actionsDiv.innerHTML = `
        <button class="btn-edit" data-comment-id="${commentId}">Editar</button>
        <button class="btn-delete" data-comment-id="${commentId}">Excluir</button>
    `;
    actionsDiv.querySelector('.btn-edit').addEventListener('click', iniciarEdicaoComentario);
    actionsDiv.querySelector('.btn-delete').addEventListener('click', excluirComentario);

    console.log(`✅ Comentário ${commentId} editado com sucesso!`);
}

function cancelarEdicaoComentario(event) {
    const commentId = event.target.getAttribute('data-comment-id');
    const commentElement = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
    
    if (!commentElement) return;

    const editArea = commentElement.querySelector('.comment-edit-area');
    const currentTextElement = commentElement.querySelector('.comment-text-display');
    const actionsDiv = commentElement.querySelector('.comment-actions');

    // 1. Remove o textarea e restaura o texto de exibição
    editArea.remove();
    currentTextElement.style.display = 'block';

    // 2. Restaura os botões originais
    actionsDiv.innerHTML = `
        <button class="btn-edit" data-comment-id="${commentId}">Editar</button>
        <button class="btn-delete" data-comment-id="${commentId}">Excluir</button>
    `;
    actionsDiv.querySelector('.btn-edit').addEventListener('click', iniciarEdicaoComentario);
    actionsDiv.querySelector('.btn-delete').addEventListener('click', excluirComentario);
}

function excluirComentario(event) {
    const commentId = event.target.getAttribute('data-comment-id');
    
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
        return;
    }

    // 1. Remove do LocalStorage
    let comentarios = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    comentarios = comentarios.filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));

    // 2. Remove do DOM
    const commentElement = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
    if (commentElement) {
        commentElement.remove();
    }

    console.log(`🗑️ Comentário ${commentId} excluído com sucesso!`);
}

// ============================================
// 5. ARMAZENAMENTO LOCAL (localStorage)
// ============================================

const STORAGE_KEY = 'blogComentarios';

function salvarComentario(novoComentario) {
    let comentarios = localStorage.getItem(STORAGE_KEY);
    comentarios = comentarios ? JSON.parse(comentarios) : [];
    
    // Adiciona o novo comentário ao array
    comentarios.push(novoComentario);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));
    
    console.log(`💾 Comentário para postagem ${novoComentario.postId} salvo no localStorage!`);
}

function carregarComentariosSalvos() {
    let comentarios = localStorage.getItem(STORAGE_KEY);
    
    if (!comentarios) {
        console.log('ℹ️ Nenhum comentário salvo ainda.');
        return;
    }
    
    comentarios = JSON.parse(comentarios);
    
    // Inverte a ordem para que os mais recentes apareçam primeiro
    comentarios.reverse(); 
    
    comentarios.forEach(comentario => {
        if (comentario.postId) {
            adicionarComentarioAoPagina(comentario);
        }
    });
    
    console.log(`✅ ${comentarios.length} comentário(s) carregado(s) do localStorage!`);
}

// ============================================
// 6. FUNÇÕES AUXILIARES
// ============================================

function logDebug(mensagem) {
    console.log(`[DEBUG] ${new Date().toLocaleTimeString()} - ${mensagem}`);
}
