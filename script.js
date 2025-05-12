// Função para selecionar o humor
function selectMood(mood) {
  document.getElementById('mood').value = mood;

  const buttons = document.querySelectorAll('.mood-button');
  buttons.forEach(button => {
    button.style.opacity = '1';  // Reset opacity
  });

  // Alterar a opacidade do botão selecionado
  document.querySelector(`.mood-button.${mood}`).style.opacity = '0.6';
}

// Função para fazer login do usuário
function loginUser() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    document.getElementById('message').textContent = 'Preencha todos os campos.';
    return;
  }

  // Verificar se o usuário existe
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    localStorage.setItem('loggedInUser', username);
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('moodFormContainer').style.display = 'block';
    document.getElementById('message').textContent = '';
    document.getElementById('moodForm').reset();
    loadMoodData();
  } else {
    document.getElementById('message').textContent = 'Usuário ou senha incorretos!';
  }
}

// Função para fazer logout
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  showLoginForm();
}

// Função para registrar o humor
document.getElementById('moodForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const mood = document.getElementById('mood').value;
  const comment = document.getElementById('comment').value;

  const moodData = JSON.parse(localStorage.getItem('moods')) || [];
  moodData.push({ username: localStorage.getItem('loggedInUser'), date, mood, comment });
  localStorage.setItem('moods', JSON.stringify(moodData));

  alert('Humor registrado com sucesso!');
  loadMoodData();
});

// Função para carregar os dados de humor
function loadMoodData() {
  const moodData = JSON.parse(localStorage.getItem('moods')) || [];
  const userMoodData = moodData.filter(mood => mood.username === localStorage.getItem('loggedInUser'));

  if (userMoodData.length > 0) {
    const dates = userMoodData.map(item => item.date);
    const moods = userMoodData.map(item => item.mood);

    const moodCounts = { feliz: 0, triste: 0, neutro: 0 };
    moods.forEach(mood => moodCounts[mood]++);

    const chartData = {
      labels: ['Feliz', 'Triste', 'Neutro'],
      datasets: [{
        data: [moodCounts.feliz, moodCounts.triste, moodCounts.neutro],
        backgroundColor: ['#FFEB3B', '#2196F3', '#9C27B0'],
      }],
    };

    const ctx = document.getElementById('moodChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: chartData,
    });
  }
}

// Se o usuário já estiver logado, exibe a página de humor
if (localStorage.getItem('loggedInUser')) {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('moodFormContainer').style.display = 'block';
  loadMoodData();
}
