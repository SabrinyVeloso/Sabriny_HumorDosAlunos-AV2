const registros = [];

// Função para mostrar uma página e esconder as outras
function mostrarPagina(id) {
  const paginas = document.querySelectorAll('.pagina');
  paginas.forEach(p => p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');

  if(id === 'exibir') {
    atualizarListaRegistros();
  }
  if(id === 'login') {
    // Reset campos se desejar
    document.getElementById('formCadastro').reset();
  }
}

// Mostrar/esconder campo nota do dia
document.getElementById('detalhadoCheckbox').addEventListener('change', (e) => {
  const notaContainer = document.getElementById('notaContainer');
  notaContainer.classList.toggle('hidden', !e.target.checked);
});

// Cadastrar humor
document.getElementById('formCadastro').addEventListener('submit', (e) => {
  e.preventDefault();

  const data = document.getElementById('dataInput').value;
  const humor = document.getElementById('humorInput').value;
  const comentario = document.getElementById('comentarioInput').value.trim();
  const detalhado = document.getElementById('detalhadoCheckbox').checked;
  const nota = detalhado ? parseFloat(document.getElementById('notaInput').value) : null;

  if (!data || !humor) {
    alert('Preencha data e humor!');
    return;
  }

  if (detalhado && (isNaN(nota) || nota < 0 || nota > 10)) {
    alert('Informe uma nota válida entre 0 e 10.');
    return;
  }

  registros.push({data, humor, comentario, nota});
  alert('Registro cadastrado com sucesso!');
  e.target.reset();
  mostrarPagina('exibir');
});

// Atualizar lista de registros na página "Exibir Registros"
function atualizarListaRegistros() {
  const lista = document.getElementById('listaRegistros');
  lista.innerHTML = '';

  if(registros.length === 0) {
    lista.innerHTML = '<p>Nenhum registro cadastrado.</p>';
    return;
  }

  registros.forEach((reg, i) => {
    const div = document.createElement('div');
    div.className = 'registro';

    div.innerHTML = `
      <header>Registro #${i+1} - ${reg.data}</header>
      <p><strong>Humor:</strong> ${reg.humor}</p>
      <p><strong>Comentário:</strong> ${reg.comentario || '(sem comentário)'}</p>
      ${reg.nota !== null && reg.nota !== undefined ? `<p><strong>Nota do dia:</strong> ${reg.nota.toFixed(1)}</p>` : ''}
    `;
    lista.appendChild(div);
  });
}

// Atualizar comentário
document.getElementById('btnAtualizarComentario').addEventListener('click', () => {
  const idx = parseInt(document.getElementById('indexAtualizar').value) - 1;
  const novoComentario = document.getElementById('comentarioAtualizado').value.trim();

  if (isNaN(idx) || idx < 0 || idx >= registros.length) {
    alert('Número de registro inválido!');
    return;
  }
  registros[idx].comentario = novoComentario;
  alert(`Comentário do registro #${idx+1} atualizado!`);
  document.getElementById('indexAtualizar').value = '';
  document.getElementById('comentarioAtualizado').value = '';
  mostrarPagina('exibir');
});

// Verificar se humor é positivo
document.getElementById('btnVerificarHumor').addEventListener('click', () => {
  const idx = parseInt(document.getElementById('indexVerificar').value) - 1;
  const resultado = document.getElementById('resultadoVerificar');

  if (isNaN(idx) || idx < 0 || idx >= registros.length) {
    resultado.textContent = 'Número de registro inválido!';
    resultado.style.color = 'red';
    return;
  }

  const humor = registros[idx].humor.toLowerCase();
  if (humor === 'feliz') {
    resultado.textContent = 'O humor do registro é POSITIVO 😊';
    resultado.style.color = 'green';
  } else {
    resultado.textContent = 'O humor do registro NÃO é positivo.';
    resultado.style.color = 'orange';
  }
});

// Inicializa mostrando a página cadastrar
mostrarPagina('cadastrar');
