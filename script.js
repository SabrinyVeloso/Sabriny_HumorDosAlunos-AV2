let nomeUsuario = '';
let registros = [];

function mostrarPagina(pagina) {
  document.querySelectorAll('.secao').forEach(secao => secao.style.display = 'none');
  document.getElementById(pagina).style.display = 'block';

  if (pagina === 'registros') exibirRegistros();
  if (pagina === 'grafico') gerarGraficoHumores();
}

function entrar() {
  const nomeInput = document.getElementById('nomeUsuario');
  if (nomeInput.value.trim() === '') {
    alert('Por favor, insira seu nome.');
    return;
  }

  nomeUsuario = nomeInput.value.trim();
  document.getElementById('saudacao').innerText = `Olá, ${nomeUsuario}!`;
  document.getElementById('paginaNome').style.display = 'none';
  document.getElementById('paginaPrincipal').style.display = 'flex';
  mostrarPagina('cadastrar');
}

function sair() {
  nomeUsuario = '';
  document.getElementById('paginaNome').style.display = 'flex';
  document.getElementById('paginaPrincipal').style.display = 'none';
}

function cadastrarHumor() {
  const data = document.getElementById('data').value;
  const humor = document.getElementById('humor').value;
  const comentario = document.getElementById('comentario').value.trim();

  if (!data) {
    alert('Por favor, selecione uma data.');
    return;
  }

  const dataSelecionada = new Date(data + "T00:00:00");
  const diaSemana = dataSelecionada.getDay(); // 0 = domingo, 6 = sábado

  if (diaSemana === 0 || diaSemana === 6) {
    alert('Registros não são permitidos aos finais de semana.');
    return;
  }

  if (registros.find(r => r.data === data)) {
    alert('Você já registrou humor nesta data.');
    return;
  }

  registros.push({ data, humor, comentario });
  alert('Humor registrado com sucesso!');
  document.getElementById('data').value = '';
  document.getElementById('comentario').value = '';
}

function exibirRegistros() {
  const container = document.getElementById('listaRegistros');
  if (registros.length === 0) {
    container.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  registros.sort((a, b) => new Date(a.data) - new Date(b.data));

  container.innerHTML = registros.map(r => 
    `
      <div class="registro">
        <p><strong>Data:</strong> ${r.data}</p>
        <p><strong>Humor:</strong> ${r.humor}</p>
        <p><strong>Comentário:</strong> ${r.comentario || 'Sem comentário.'}</p>
      </div>
    `
  ).join('');
}

function gerarGraficoHumores() {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const contagem = {
    feliz: Array(7).fill(0),
    triste: Array(7).fill(0),
    neutro: Array(7).fill(0),
  };

  registros.forEach(r => {
    const dia = new Date(r.data + "T00:00:00").getDay();
    contagem[r.humor][dia]++;
  });

  const ctx = document.getElementById('graficoHumor').getContext('2d');
  if (window.graficoInstancia) {
    window.graficoInstancia.destroy();
  }

  window.graficoInstancia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: diasSemana,
      datasets: [
        {
          label: 'Feliz',
          data: contagem.feliz,
          backgroundColor: '#FFD700'
        },
        {
          label: 'Triste',
          data: contagem.triste,
          backgroundColor: '#4B92DB'
        },
        {
          label: 'Neutro',
          data: contagem.neutro,
          backgroundColor: '#9B59B6'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Quantidade' }

          
        }
      }
    }
  });
}
