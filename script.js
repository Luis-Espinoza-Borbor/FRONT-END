
console.log("el archivo js se asocio correctamente al html");

fetch('http://cine.runasp.net/api/Actores').then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));

fetch('http://cine.runasp.net/api/Actores/13').then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));

const actor = {
    nombre: "alfredo ordoñez",
    imagen: "foto.jpg",
    fechaNacimiento: "1996-08-26T00:00:00",
    nacionalidad: "ecuador"
  }

fetch('http://cine.runasp.net/api/Actores', {
    method : 'POST',
    headers : {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(actor)
}).then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));