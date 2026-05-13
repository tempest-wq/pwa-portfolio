const form = document.getElementById('form-comentario');
const inputId = document.getElementById('comentario-id');
const inputNome = document.getElementById('nome');
const inputMensagem = document.getElementById('mensagem');
const listaComentarios = document.getElementById('lista-comentarios');
const btnSubmit = document.getElementById('btn-submit');

const STORAGE_KEY = 'portfolio_comentarios';

function getComentarios() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function renderizarComentarios() {
    listaComentarios.innerHTML = '';
    const comentarios = getComentarios();

    if (comentarios.length === 0) {
        listaComentarios.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro!</p>';
        return;
    }

    comentarios.forEach(comentario => {
        const div = document.createElement('div');
        div.className = 'comentario-card animar-entrada';
        div.innerHTML = `
            <strong>${comentario.nome}</strong> 
            <small>(${comentario.data})</small>
            <p>${comentario.mensagem}</p>
            <div class="acoes">
                <button class="btn btn-editar" onclick="prepararEdicao(${comentario.id})">Editar</button>
                <button class="btn btn-deletar" onclick="deletarComentario(${comentario.id})">Excluir</button>
            </div>
        `;
        listaComentarios.appendChild(div);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const idAtual = inputId.value;
    const novoNome = inputNome.value.trim();
    const novaMensagem = inputMensagem.value.trim();
    
    if (!novoNome || !novaMensagem) return;

    let comentarios = getComentarios();

    if (idAtual) {
        const index = comentarios.findIndex(c => c.id == idAtual);
        if (index !== -1) {
            comentarios[index].nome = novoNome;
            comentarios[index].mensagem = novaMensagem;
        }
        btnSubmit.textContent = 'Enviar Comentário';
    } else {
        const novoComentario = {
            id: Date.now(),
            nome: novoNome,
            mensagem: novaMensagem,
            data: new Date().toLocaleDateString('pt-BR')
        };
        comentarios.push(novoComentario);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));
    form.reset();
    inputId.value = '';
    renderizarComentarios();
});

window.prepararEdicao = function(id) {
    const comentarios = getComentarios();
    const comentario = comentarios.find(c => c.id == id);
    if (comentario) {
        inputId.value = comentario.id;
        inputNome.value = comentario.nome;
        inputMensagem.value = comentario.mensagem;
        btnSubmit.textContent = 'Atualizar Comentário';
        window.scrollTo({ top: document.getElementById('comentarios').offsetTop - 50, behavior: 'smooth' });
    }
}

window.deletarComentario = function(id) {
    if(confirm('Tem certeza que deseja excluir este comentário?')) {
        let comentarios = getComentarios();
        comentarios = comentarios.filter(c => c.id != id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));
        renderizarComentarios();
    }
}

renderizarComentarios();