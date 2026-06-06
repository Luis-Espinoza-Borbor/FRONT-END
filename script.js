
console.log("el archivo js se asocio correctamente al html");

fetch('http://cine.runasp.net/api/Actores').then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));

fetch('http://cine.runasp.net/api/Actores/13').then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));

const actor = {
    nombre: "Vin Diesel",
    imagen: "url.jpg",
    fechaNacimiento: "2026-06-T14:37:07.2902",
    nacionalidad: "ecuatoriano" 
}

fetch('http://cine.runasp.net/api/Actores', {
    method : 'POST',
    headers : {
        "Content - Type": "application/json"
    },
    body: JSON.stringify(actor)
}).then(respuesta => respuesta.json()).then(informacion => console.log(informacion)).catch(error => console.log(error));