// scripts.js
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    alert('Login error: ' + error.message);
  } else {
    alert('Login successful!');
    window.location.href = 'pet-management.html'; // Redirect to pet management page after successful login
  }
}

async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert('Sign-up error: ' + error.message);
  } else {
    alert('Check your email for confirmation!');
    window.location.href = 'login.html'; // Redirect to login page after successful sign up
  }
}

async function getPets() {
  const user = supabase.auth.user();
  if (user) {
    const { data, error } = await supabase.from('pets').select('*').eq('owner_id', user.id);
    if (error) {
      alert('Error fetching pets: ' + error.message);
    } else {
      displayPets(data);
    }
  }
}

function displayPets(pets) {
  const petList = document.getElementById('pet-list');
  petList.innerHTML = '';
  pets.forEach(pet => {
    petList.innerHTML += `<div><strong>${pet.name}</strong> - ${pet.species}</div>`;
  });
}
