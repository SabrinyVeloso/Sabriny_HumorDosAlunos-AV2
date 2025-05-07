const humorForm = document.getElementById('humorForm');
const comentarioInput = document.getElementById('comentario');
const radioButtons = document.getElementsByName('humor');
const registroLista = document.getElementById('registroLista');
const humorChart = document.getElementById('humorChart');

let registrosHumor = [
    { humor: "feliz", comentario: "Foi um ótimo dia!", data: "05/05/2025" },
    { humor: "triste", comentario: "Estou me sentindo um pouco para baixo.", data: "06/05/2025" },
    { humor: "neutro", comentario: "Nada demais hoje.", data: "07/05/2025" }
];

function exibirRegistros() {
    registroLista.innerHTML = '';
    registrosHumor.forEach(registro => {
        const div = document.createElement('div');
        div.classList.add('registroItem');
        div.innerHTML = `
            <strong>${registro.data}</strong>
            <p>Humor: ${registro.humor}</p>
            <p>Comentário: ${registro.comentario}</p>
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

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Feliz', 'Triste', 'Neutro'],
            datasets: [{
                label: 'Contagem de Humores',
                data: [dadosHumor.feliz, dadosHumor.triste, dadosHumor.neutro],
                backgroundColor: ['#FF5733', '#2196F3', '#4CAF50'],
                borderColor: ['#D63F28', '#1E88E5', '#388E3C'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

humorForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const comentario = comentarioInput.value;
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

    const novoRegistro = {
        comentario: comentario,
        humor: humorSelecionado,
        data: new Date().toLocaleDateString()
    };

    registrosHumor.push(novoRegistro);

    const registroDiv = document.createElement('div');
    registroDiv.classList.add('registroItem');
    registroDiv.innerHTML = `
        <strong>${novoRegistro.data}</strong>
        <p>Humor: ${novoRegistro.humor}</p>
        <p>Comentário: ${novoRegistro.comentario}</p>
    `;
    registroLista.prepend(registroDiv);

    atualizarGrafico();

    comentarioInput.value = '';
    radioButtons.forEach(radio => radio.checked = false);
});

exibirRegistros();
atualizarGrafico();
