let registros = [];

const humorChartCtx = document.getElementById('humorChart').getContext('2d');
const semanalChartCtx = document.getElementById('humorSemanalChart').getContext('2d');

let humorChart = new Chart(humorChartCtx, {
  type: 'doughnut',
  data: {
    labels: ['Feliz', 'Triste', 'Neutro'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#a29bfe', '#fd79a8', '#81ecec']
    }]
  },
  options: {
    responsive: false
  }
});

let semanalChart = new Chart(semanalChartCtx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Média semanal (1=Triste, 2=Neutro, 3=Feliz)',
      data: [],
      backgroundColor: '#8e44ad'
    }]
  },
  options: {
    scales: { y: { min: 1, max: 3, ticks: { stepSize: 1 } } }
  }
});

function registrarHumor() {
  const humor = document.querySelector('input[name="humor"]:checked');
  const data = document.getElementById('dataRegistro').value;
  const disciplina = document.getElementById('disciplina').value;
  const comentario = document.getElementById('comentario').value;

  if (!humor || !data) {
    alert('Preencha o humor e a data.');
    return;
  }

  const registro = {
    humor: humor.value,
    data,
    disciplina,
    comentario
  };

  registros.push(registro);
  atualizarRegistros();
  atualizarGraficos();
}

function atualizarRegistros() {
  const lista = document.getElementById('registroLista');
  lista.innerHTML = '';
  registros.forEach(r => {
    lista.innerHTML += `<p><strong>${r.data}</strong> - ${r.humor} ${r.disciplina ? `- ${r.disciplina}` : ''} ${r.comentario ? `<br>${r.comentario}` : ''}</p>`;
  });
}

function atualizarGraficos() {
  const contagem = { Feliz: 0, Triste: 0, Neutro: 0 };
  registros.forEach(r => contagem[r.humor]++);

  humorChart.data.datasets[0].data = [contagem.Feliz, contagem.Triste, contagem.Neutro];
  humorChart.update();

  // Gráfico semanal (média)
  const semana = {};
  registros.forEach(r => {
    const semanaData = r.data.slice(0, 7); // yyyy-mm
    if (!semana[semanaData]) semana[semanaData] = [];
    semana[semanaData].push(r.humor);
  });

  const labels = [];
  const medias = [];
  for (const [sem, humores] of Object.entries(semana)) {
    labels.push(sem);
    const valores = humores.map(h => h === 'Feliz' ? 3 : h === 'Neutro' ? 2 : 1);
    const media = (valores.reduce((a, b) => a + b, 0)) / valores.length;
    medias.push(media.toFixed(2));
  }

  semanalChart.data.labels = labels;
  semanalChart.data.datasets[0].data = medias;
  semanalChart.update();
}
