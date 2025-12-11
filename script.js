/*
    ============================================
    BLOG DIDÁTICO - JAVASCRIPT
    ============================================
    
    Este arquivo contém toda a lógica interativa do blog.
    JavaScript permite adicionar comportamento dinâmico às páginas web.
    
    Funcionalidades implementadas:
    1. Navegação suave entre seções
    2. Adicionar comentários dinamicamente
    3. Armazenar comentários no localStorage
    4. Validação de formulário
    5. Feedback visual ao usuário
*/

// ============================================
// 1. INICIALIZAÇÃO E CARREGAMENTO
// ============================================

/*
    DOMContentLoaded: Evento que dispara quando o HTML foi completamente carregado
    Garante que todos os elementos HTML estejam disponíveis antes de executar o código
    
    Sem isso, o JavaScript poderia tentar acessar elementos que ainda não existem,
    causando erros.
*/
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página carregada! Inicializando funcionalidades...');
    
    // Chama as funções de inicialização
    inicializarNavegacao();
    inicializarFormularioComentarios();
    carregarComentariosSalvos();
});

// ============================================
// 2. NAVEGAÇÃO SUAVE
// ============================================

/*
    Esta função configura a navegação para suavizar o scroll
    quando você clica em um link de navegação.
*/
function inicializarNavegacao() {
    /*
        querySelector: Seleciona elementos do HTML usando seletores CSS
        Sintaxe: document.querySelector('seletor')
        
        Exemplos:
        - '.classe' seleciona por classe
        - '#id' seleciona por id
        - 'tag' seleciona por nome da tag
        - '.container > p' seleciona parágrafos filhos diretos
    */
    
    // Seleciona todos os links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    
    /*
        forEach: Método que executa uma função para cada elemento da lista
        Sintaxe: array.forEach(function(elemento) { ... })
        
        Aqui, para cada link de navegação, adicionamos um listener de clique
    */
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            /*
                event.preventDefault(): Impede o comportamento padrão
                Sem isso, a página pularia para a seção sem suavidade
            */
            event.preventDefault();
            
            // Obtém o atributo 'href' do link (ex: "#posts")
            const targetId = this.getAttribute('href');
            
            // Seleciona o elemento alvo
            const targetElement = document.querySelector(targetId);
            
            // Verifica se o elemento existe antes de tentar rolar
            if (targetElement) {
                /*
                    scrollIntoView: Rola a página para que o elemento fique visível
                    behavior: 'smooth' faz a rolagem ser suave (não instantânea)
                */
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Atualiza o link ativo
                atualizarNavegacaoAtiva(targetId);
            }
        });
    });
}

/*
    Esta função marca o link de navegação atual como ativo
    Mostra visualmente qual seção o usuário está vendo
*/
function atualizarNavegacaoAtiva(targetId) {
    // Seleciona todos os links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove a classe 'active' de todos os links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    /*
        Adiciona a classe 'active' apenas ao link correspondente
        querySelector com atributo: [atributo="valor"]
    */
    const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ============================================
// 3. FORMULÁRIO DE COMENTÁRIOS
// ============================================

/*
    Esta função configura o formulário de comentários
    Adiciona validação e manipula o envio
*/
function inicializarFormularioComentarios() {
    // Seleciona o formulário
    const form = document.getElementById('comment-form');
    
    /*
        addEventListener: Adiciona um "ouvidor" para um evento
        Quando o evento ocorre, a função é executada
        
        Eventos comuns:
        - 'submit': Quando um formulário é enviado
        - 'click': Quando algo é clicado
        - 'change': Quando um input muda
        - 'input': Enquanto o usuário digita
    */
    form.addEventListener('submit', function(event) {
        /*
            event.preventDefault(): Impede o envio padrão do formulário
            Sem isso, a página recarregaria
        */
        event.preventDefault();
        
        // Chama a função para processar o comentário
        processarComentario();
    });
}

/*
    Esta função processa o comentário quando o formulário é enviado
*/
function processarComentario() {
    // Seleciona os campos do formulário
    const nameInput = document.getElementById('comment-name');
    const emailInput = document.getElementById('comment-email');
    const textInput = document.getElementById('comment-text');
    
    // Obtém os valores dos campos
    const nome = nameInput.value.trim();
    const email = emailInput.value.trim();
    const texto = textInput.value.trim();
    
    /*
        Validação básica: Verifica se os campos não estão vazios
        Se algum estiver vazio, exibe um alerta e retorna
    */
    if (!nome || !email || !texto) {
        alert('❌ Por favor, preencha todos os campos!');
        return;
    }
    
    /*
        Validação de email simples
        Verifica se o email contém @ e .
        (Uma validação real seria mais complexa)
    */
    if (!email.includes('@') || !email.includes('.')) {
        alert('❌ Por favor, insira um email válido!');
        return;
    }
    
    // Cria um objeto com os dados do comentário
    const comentario = {
        nome: nome,
        email: email,
        texto: texto,
        data: new Date().toLocaleString('pt-BR') // Data e hora atual formatada
    };
    
    // Adiciona o comentário à página
    adicionarComentarioAoPagina(comentario);
    
    // Salva o comentário no localStorage
    salvarComentario(comentario);
    
    // Limpa o formulário
    document.getElementById('comment-form').reset();
    
    // Exibe mensagem de sucesso
    console.log('✅ Comentário adicionado com sucesso!');
}

/*
    Esta função adiciona um comentário visualmente à página
*/
function adicionarComentarioAoPagina(comentario) {
    // Seleciona o container onde os comentários serão exibidos
    const commentsList = document.getElementById('comments-list');
    
    /*
        Cria um novo elemento div para o comentário
        innerHTML: Define o conteúdo HTML do elemento
    */
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    /*
        Template literal (backticks): Permite inserir variáveis em strings
        Sintaxe: `texto ${variavel} mais texto`
        Muito mais legível que concatenação com +
    */
    commentElement.innerHTML = `
        <div class="comment-author">👤 ${comentario.nome}</div>
        <div class="comment-email">📧 ${comentario.email}</div>
        <div class="comment-text">${comentario.texto}</div>
        <div class="comment-date">⏰ ${comentario.data}</div>
    `;
    
    /*
        insertBefore: Insere um elemento antes de outro
        Aqui, adicionamos o novo comentário no início da lista
        Assim, os comentários mais recentes aparecem primeiro
    */
    commentsList.insertBefore(commentElement, commentsList.firstChild);
}

// ============================================
// 4. ARMAZENAMENTO LOCAL (localStorage)
// ============================================

/*
    localStorage: Permite armazenar dados no navegador
    Os dados persistem mesmo após fechar a página
    
    Métodos:
    - setItem(chave, valor): Salva um item
    - getItem(chave): Recupera um item
    - removeItem(chave): Remove um item
    - clear(): Remove todos os itens
    
    Limitação: Apenas armazena strings
    Para objetos, usamos JSON.stringify() e JSON.parse()
*/

/*
    Esta função salva um comentário no localStorage
*/
function salvarComentario(comentario) {
    /*
        Recupera a lista de comentários já salvos
        getItem retorna null se não existir, então usamos || '[]'
    */
    let comentarios = localStorage.getItem('comentarios');
    
    /*
        JSON.parse: Converte uma string JSON em um objeto JavaScript
        Se comentarios for null, cria um array vazio
    */
    comentarios = comentarios ? JSON.parse(comentarios) : [];
    
    // Adiciona o novo comentário ao array
    comentarios.push(comentario);
    
    /*
        JSON.stringify: Converte um objeto JavaScript em string JSON
        Necessário porque localStorage só armazena strings
    */
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    
    console.log('💾 Comentário salvo no localStorage!');
}

/*
    Esta função carrega os comentários salvos do localStorage
    Executada quando a página carrega
*/
function carregarComentariosSalvos() {
    // Recupera os comentários do localStorage
    let comentarios = localStorage.getItem('comentarios');
    
    // Se não houver comentários salvos, retorna
    if (!comentarios) {
        console.log('ℹ️ Nenhum comentário salvo ainda.');
        return;
    }
    
    // Converte a string JSON em array de objetos
    comentarios = JSON.parse(comentarios);
    
    // Adiciona cada comentário à página
    comentarios.forEach(comentario => {
        adicionarComentarioAoPagina(comentario);
    });
    
    console.log(`✅ ${comentarios.length} comentário(s) carregado(s) do localStorage!`);
}

// ============================================
// 5. FUNÇÕES AUXILIARES
// ============================================

/*
    Esta função exibe mensagens no console para debugging
    Ajuda a entender o que está acontecendo no código
    
    Abra o console do navegador com F12 ou Ctrl+Shift+I
    e veja as mensagens de log
*/
function logDebug(mensagem) {
    console.log(`[DEBUG] ${new Date().toLocaleTimeString()} - ${mensagem}`);
}

// ============================================
// 6. DICAS E BOAS PRÁTICAS
// ============================================

/*
    DICAS IMPORTANTES:
    
    1. SEMPRE use console.log() para debugar
       - F12 abre o console do navegador
       - Veja as mensagens e erros lá
    
    2. Use querySelector para selecionar elementos
       - Mais moderno que getElementById, getElementsByClassName, etc.
       - Suporta qualquer seletor CSS
    
    3. Sempre valide dados do usuário
       - Nunca confie no que o usuário digita
       - Verifique se está vazio, tem formato correto, etc.
    
    4. Use localStorage para dados simples
       - Perfeito para comentários, preferências, etc.
       - Não use para dados sensíveis (senhas, tokens)
    
    5. Use template literals (backticks) para strings
       - Muito mais legível que concatenação com +
       - Permite quebras de linha e variáveis
    
    6. Sempre use preventDefault() em formulários
       - Evita o recarregamento da página
       - Você controla o que acontece
    
    7. Use addEventListener em vez de onclick
       - Mais flexível e moderno
       - Permite múltiplos listeners no mesmo elemento
    
    8. Sempre teste em diferentes navegadores
       - Chrome, Firefox, Safari, Edge
       - Alguns recursos podem não funcionar em todos
    
    9. Use nomes descritivos para variáveis e funções
       - 'nome' é melhor que 'n'
       - 'processarComentario()' é melhor que 'pc()'
    
    10. Comente seu código!
        - Explique o "por quê", não o "o quê"
        - Código bom é código que outros entendem
*/

// ============================================
// 7. ESTRUTURA DE DADOS - COMENTÁRIO
// ============================================

/*
    Um comentário é um objeto com a seguinte estrutura:
    
    {
        nome: "João Silva",
        email: "joao@email.com",
        texto: "Ótimo artigo!",
        data: "15/12/2024 14:30:45"
    }
    
    Quando salvamos no localStorage, convertemos para JSON:
    
    [
        {
            "nome": "João Silva",
            "email": "joao@email.com",
            "texto": "Ótimo artigo!",
            "data": "15/12/2024 14:30:45"
        }
    ]
    
    JSON (JavaScript Object Notation) é um formato padrão
    para trocar dados entre sistemas.
*/

// ============================================
// 8. FLUXO DE EXECUÇÃO
// ============================================

/*
    Quando a página carrega:
    
    1. HTML é carregado e interpretado
    2. CSS é carregado e aplicado
    3. JavaScript é carregado
    4. DOMContentLoaded dispara
    5. inicializarNavegacao() é chamada
       - Adiciona listeners de clique aos links
    6. inicializarFormularioComentarios() é chamada
       - Adiciona listener de submit ao formulário
    7. carregarComentariosSalvos() é chamada
       - Recupera comentários do localStorage
       - Exibe comentários na página
    
    Quando o usuário clica em um link de navegação:
    1. Evento 'click' é disparado
    2. preventDefault() impede o comportamento padrão
    3. A página rola suavemente para a seção
    4. O link é marcado como ativo
    
    Quando o usuário envia um comentário:
    1. Evento 'submit' é disparado
    2. preventDefault() impede o recarregamento
    3. Os campos são validados
    4. Um objeto comentário é criado
    5. O comentário é exibido na página
    6. O comentário é salvo no localStorage
    7. O formulário é limpo
*/

console.log('✅ Script JavaScript carregado com sucesso!');
