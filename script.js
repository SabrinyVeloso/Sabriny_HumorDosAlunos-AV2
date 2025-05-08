const humorForm = document.getElementById('humorForm');
const comentarioInput = document.getElementById('comentario');
const radioButtons = document.getElementsByName('humor');
const registroLista = document.getElementById('registroLista');
const humorChart = document.getElementById('humorChart');
const dataInput = document.getElementById('dataRegistro');
const disciplinaInput = document.getElementById('disciplina');

let registrosHumor = [
    { humor: "feliz", comentario: "Foi um ótimo dia!", data: "05/05/2025", disciplina: "Matemática" },
    { humor: "triste", comentario: "Me senti cansado.", data: "06/05/2025", disciplina: "" },
];

let chartInstance;

function exibirRegistros() {
    registroLista.innerHTML = '';
    registrosHumor.forEach(registro => {
        const div = document.createElement('div');
        div.classList.add('registroItem');
        div.innerHTML = `
            <strong>${registro.data}</strong> | Humor: ${registro.humor}
            ${registro.disciplina ? `<p>Disciplina: ${registro.disciplina}</p>` : ""}
            <p>Comentário: ${registro.comentario || '(Sem comentário)'}</p>
        `;
        registroLista.appendChild(div);
    });
}

function atualizarGrafico() {
    const ctx = humorChart.getContext('2d');

    const dadosHumor = { feliz: 0, triste: 0, neutro: 0 };
    registrosHumor.forEach(registro => {
        dadosHumor[registro.humor]++;
    });

    const chartData = {
        labels: ['Feliz', 'Triste', 'Neutro'],
        datasets: [{
            label: 'Humores',
            data: [dadosHumor.feliz, dadosHumor.triste, dadosHumor.neutro],
            backgroundColor: ['#8e44ad', '#5dade2', '#58d68d'],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#333',
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions
    });
}

humorForm.addEventListener('submit', function (event) {
    event.preventDefault();

    let humorSelecionado = null;
    radioButtons.forEach(radio => {
        if (radio.checked) {
            humorSelecionado = radio.value;
        }
    });

    if (!humorSelecionado) {
        alert("Por favor, selecione um humor!");
        return;
    }

    const comentario = comentarioInput.value;
    const data = dataInput.value ? new Date(dataInput.value).toLocaleDateString() : new Date().toLocaleDateString();
    const disciplina = disciplinaInput.value;

    const novoRegistro = {
        comentario: comentario,
        humor: humorSelecionado,
        data: data,
        disciplina: disciplina
    };

    registrosHumor.push(novoRegistro);
    exibirRegistros();
    atualizarGrafico();

    comentarioInput.value = '';
    disciplinaInput.value = '';
    dataInput.value = '';
    radioButtons.forEach(radio => radio.checked = false);
});

exibirRegistros();
atualizarGrafico();
