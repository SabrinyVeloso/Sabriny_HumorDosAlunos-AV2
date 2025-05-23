let registros = [];
let nomeUsuario = '';

function getDiaSemanaLocal(dateString) {
  const partes = dateString.split('-'); // "YYYY-MM-DD"
  const ano = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1; // mês começa em 0
  const dia = parseInt(partes[2], 10);
  const dataObj = new Date(ano, mes, dia);
  return dataObj.getDay();
}

function entrar() {
  const nomeInput = document.getElementById('nomeUsuario').value.trim();
  if (!nomeInput) {
    alert("Por favor, digite seu nome.");
    return;
  }

  nomeUsuario = nomeInput;
  document.getElementById('saudacao').textContent = `Olá, ${nomeUsuario}!`;
  document.getElementById('paginaNome').classList.remove('active');
  document.getElementById('paginaNome').classList.add('hidden');
  document.getElementById('paginaPrincipal').classList.add('active');
}

function mostrarPagina(paginaId) {
  document.querySelectorAll('.paginaInterna').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  const pagina = document.getElementById(paginaId);
  pagina.classList.add('active');
  pagina.classList.remove('hidden');

  if (paginaId === 'exibir') exibirRegistros();
  if (paginaId === 'grafico') gerarGraficoHumores();
}

function cadastrarHumor() {
  const data = document.getElementById('dataInput').value;
  if (!data) {
    alert("Selecione uma data.");
    return;
  }
  
  const diaSemana = getDiaSemanaLocal(data);
  
  if (diaSemana === 0 || diaSemana === 6) {
    alert("Não é permitido registrar humor aos sábados e domingos.");
    return;
  }

  const humor = document.getElementById('humorInput').value;
  const comentario = document.getElementById('comentarioInput').value;

  registros.push({ data, humor, comentario });
  alert("Humor salvo!");

  document.getElementById('dataInput').value = '';
  document.getElementById('comentarioInput').value = '';
}

function exibirRegistros() {
  const container = document.getElementById('listaRegistros');
  container.innerHTML = registros.map(r =>
    `<p><strong>${r.data}</strong> - ${r.humor}<br>${r.comentario}</p><hr>`
  ).join('');
}

function atualizarComentario() {
  const data = document.getElementById('dataAtualizar').value;
  const novoComentario = document.getElementById('novoComentario').value;
  const registro = registros.find(r => r.data === data);
  if (registro) {
    registro.comentario = novoComentario;
    alert("Comentário atualizado!");
  } else {
    alert("Registro não encontrado.");
  }
}

function verificarHumor() {
  const data = document.getElementById('dataVerificar').value;
  const reg = registros.find(r => r.data === data);
  const resultado = document.getElementById('resultadoVerificacao');
  if (reg) {
    resultado.textContent = reg.humor === 'feliz' ? "😊 Humor positivo!" : "😐 Humor não positivo.";
    resultado.className = reg.humor === 'feliz' ? "positivo" : "negativo";
  } else {
    resultado.textContent = "Registro não encontrado.";
    resultado.className = "";
  }
}

function sair() {
  if (confirm("Deseja sair?")) {
    nomeUsuario = '';
    document.getElementById('paginaPrincipal').classList.remove('active');
    document.getElementById('paginaPrincipal').classList.add('hidden');
    document.getElementById('paginaNome').classList.add('active');
    document.getElementById('paginaNome').classList.remove('hidden');
    document.getElementById('nomeUsuario').value = '';
  }
}

function gerarGraficoHumores() {
  const ctx = document.getElementById('graficoHumores').getContext('2d');
  const diasUteis = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const dadosPorDia = { 'Seg': [], 'Ter': [], 'Qua': [], 'Qui': [], 'Sex': [] };
  const valores = { feliz: 3, neutro: 2, triste: 1 };

  registros.forEach(r => {
    const diaSemana = getDiaSemanaLocal(r.data);
    const diaNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][diaSemana];
    if (diasUteis.includes(diaNome)) {
      dadosPorDia[diaNome].push(valores[r.humor]);
    }
  });

  const medias = diasUteis.map(dia => {
    const dados = dadosPorDia[dia];
    return dados.length ? (dados.reduce((a, b) => a + b, 0) / dados.length) : 0;
  });

  if (window.graficoInstance) window.graficoInstance.destroy();

  window.graficoInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: diasUteis,
      datasets: [{
        label: 'Média do Humor',
        data: medias,
        backgroundColor: [
          'yellow',   // feliz
          'purple',   // neutro
          'blue'      // triste
        ],
        backgroundColor: medias.map(media => {
          if (media >= 2.5) return 'yellow';     // feliz
          else if (media >= 1.5) return 'purple'; // neutro
          else return 'blue';                     // triste
        })
      }]
    },
    options: {
      scales: {
        y: {
          min: 0,
          max: 3,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}
