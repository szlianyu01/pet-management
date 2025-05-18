// 初始化 Supabase 客户端
const supabaseUrl = 'https://zkhgypnrzyzqdpnkgido.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraGd5cG5yenl6cWRwbmtnaWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTc2ODksImV4cCI6MjA2MzEzMzY4OX0.dhA4gagsbf-U194sil3JsgobqWYUb85_rpd7mD8Ai9I';
const supabase = supabase.createClient(supabaseUrl,supabaseKey);


// 用户登录
async function login() {
  console.log("login button clicked");  // 添加日志
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { user, error } = await supabase.auth.signIn({ email, password });

  if (error) {
    alert('Login error: ' + error.message);
  } else {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('pets').style.display = 'block';
    getPets();
  }
}

// 用户注册
async function signUp() {
  console.log("Sign-up button clicked");  // 添加日志
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert('Sign-up error: ' + error.message);
  } else {
    alert('Check your email for confirmation!');
  }
}

// 获取宠物信息
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

// 显示宠物信息
function displayPets(pets) {
  const petList = document.getElementById('petList');
  petList.innerHTML = '';
  pets.forEach(pet => {
    petList.innerHTML += `<div><strong>${pet.name}</strong> - ${pet.species}</div>`;
  });
}

// 添加宠物
function addPet() {
  document.getElementById('addPetForm').style.display = 'block';
}

// 上传宠物图片
async function uploadPetImage(file) {
  const { data, error } = await supabase.storage.from('pet-images').upload(file.name, file);
  if (error) {
    alert('Error uploading image: ' + error.message);
    return null;
  }
  const { publicURL } = supabase.storage.from('pet-images').getPublicUrl(file.name);
  return publicURL;
}

// 提交宠物数据
async function submitPet() {
  const petName = document.getElementById('petName').value;
  const petSpecies = document.getElementById('petSpecies').value;
  const petBreed = document.getElementById('petBreed').value;
  const petBirthday = document.getElementById('petBirthday').value;
  const petDescription = document.getElementById('petDescription').value;
  const petImage = document.getElementById('petImage').files[0];

  const { user } = supabase.auth;

  if (user) {
    let imageUrl = '';
    if (petImage) {
      imageUrl = await uploadPetImage(petImage);
    }

    const { error } = await supabase.from('pets').insert([
      {
        owner_id: user.id,
        name: petName,
        species: petSpecies,
        breed: petBreed,
        birthday: petBirthday,
        description: petDescription,
        photo_url: imageUrl,
      },
    ]);

    if (error) {
      alert('Error adding pet: ' + error.message);
    } else {
      alert('Pet added successfully!');
      getPets(); // Reload pets
      document.getElementById('addPetForm').style.display = 'none';
    }
  }
}
