// URL base de la API local
const API_URL = 'http://localhost:3000';

// Variables
let nombre = '';
let email = '';
let numero = '';
let mensaje = '';

// Funciones esenciales
function validarCampos() {
  let campos = [nombre, email, numero, mensaje];
  let nombresCampos = ["nombre", "email", "numero", "mensaje"];

  for (let i = 0; i < campos.length; i++) {
    if (campos[i] === "") {
      alert("Por favor, ingrese su " + nombresCampos[i] + ".");
      return false;
    }
  }

  return true;
}

function validarEmail() {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, ingrese un email válido.");
    return false;
  }

  return true;
}

function limpiarCampos() {
  nombre = '';
  email = '';
  numero = '';
  mensaje = '';

  document.getElementById('nombre').value = '';
  document.getElementById('email').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('mensaje').value = '';
}

// Cargar usuarios desde la API si existen y mostrarlos en el DOM
function cargarUsuarios() {
  fetch(`${API_URL}/usuarios`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      return response.json();
    })
    .then((usuarios) => {
      mostrarUsuarios(usuarios);
    })
    .catch((error) => {
      console.error(error);
    });
}

function mostrarUsuarios(usuarios) {
  let listaUsuarios = document.getElementById('lista-usuarios');
  listaUsuarios.innerHTML = '';

  usuarios.forEach(function(usuario) {
    let itemUsuario = document.createElement('li');
    itemUsuario.textContent = `Nombre: ${usuario.nombre}, Email: ${usuario.email}, Número: ${usuario.numero}`;
    listaUsuarios.appendChild(itemUsuario);
  });
}

cargarUsuarios();

// Método de búsqueda en el array
function buscarUsuario(email) {
  return fetch(`${API_URL}/usuarios?email=${email}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al buscar usuario');
      }
      return response.json();
    })
    .then((usuarios) => {
      return usuarios.length > 0 ? usuarios[0] : null;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

// Mostrar u ocultar lista de usuarios filtrados
document.getElementById('filtro-nombre').addEventListener('input', function() {
  let filtroNombre = this.value.trim();
  if (filtroNombre === '') {
    document.getElementById('lista-filtrada').style.display = 'none';
  } else {
    fetch(`${API_URL}/usuarios?nombre_like=${filtroNombre}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al filtrar usuarios');
        }
        return response.json();
      })
      .then((usuariosFiltrados) => {
        mostrarUsuariosFiltrados(usuariosFiltrados);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

function mostrarUsuariosFiltrados(usuariosFiltrados) {
  let listaFiltrada = document.getElementById('lista-filtrada');
  listaFiltrada.innerHTML = '';

  usuariosFiltrados.forEach(function(usuario) {
    let itemUsuario = document.createElement('li');
    itemUsuario.textContent = `Nombre: ${usuario.nombre}, Email: ${usuario.email}, Número: ${usuario.numero}`;
    listaFiltrada.appendChild(itemUsuario);
  });

  listaFiltrada.style.display = 'block';
}

// Enviar formulario
document.getElementById('contacto').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener valores de los campos
  nombre = document.getElementById('nombre').value;
  email = document.getElementById('email').value;
  numero = document.getElementById('numero').value;
  mensaje = document.getElementById('mensaje').value;

  if (!validarCampos() || !validarEmail()) {
    return;
  }

  console.log("Formulario válido, puede ser enviado.");

  document.getElementById('status').innerHTML = "Enviado correctamente 📨";

  // Agregar usuario a la API
  const nuevoUsuario = {
    nombre: nombre,
    email: email,
    numero: numero
  };

  fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoUsuario),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al agregar usuario');
      }
      return response.json();
    })
    .then(() => {
      // Recargar la lista de usuarios después de agregar uno nuevo
      cargarUsuarios();

      // Limpiar campos después de enviar el formulario
      limpiarCampos();

      // Mostrar notificación de envío exitoso con SweetAlert
      swal("Enviado correctamente", "Tu mensaje ha sido enviado correctamente.", "success");
    })
    .catch((error) => {
      console.error(error);
    });
});
