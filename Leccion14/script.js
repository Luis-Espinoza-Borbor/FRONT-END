console.log(multiplicar(5,5));
function multiplicar(a,b){
    return a * b;
}

const multiplicacion = function(a,b){
    return a * b;
}

console.log(multiplicacion(5,5));

const dividir = (a,b) => {
    return a / b;
}
console.log(dividir(10,2));


const productos =[
    { id: 1 , nombre: 'Laptop'},
    { id: 2 , nombre: 'Impresora'},
    { id: 3 , nombre: 'Mouse'},
    { id: 4 , nombre: 'Teclado'},
]

console.log(productos);
const valorAbuscar = 'Mouse';
const buscarProducto = productos.find(x => x.nombre == valorAbuscar);
console.log(buscarProducto);

const peliculas =[
    { id: 1 , nombre: 'Avengers'},
    { id: 2 , nombre: 'Ant man'},
    { id: 3 , nombre: 'Spider man'},
    { id: 4 , nombre: 'Superman'},
]

console.log(peliculas);
const valorpelicula = 'Superman';
/*
const buscarPelicula = peliculas.find(x => x.nombre == valorpelicula);
console.log(buscarPelicula);
if(buscarPelicula == undefined || buscarPelicula == null){
    console.log("No se encontro la pelicula");
}else{
    console.log(buscarPelicula);
}
*/

setTimeout(() => {
    const buscarPelicula = peliculas.find(x => x.nombre == valorpelicula);
    console.log(buscarPelicula);
        if(buscarPelicula == undefined || buscarPelicula == null){
            console.log("No se encontro la pelicula");
        }else{
            console.log(buscarPelicula);
        }
}, 5000);

let promesaPizza = new Promise((resolve, reject) => {
    let todoBien = false;
    if(todoBien){
        resolve("Todo bien con la pizza");
    }else{
        resolve("Algo salio mal en la preparacion de la pizza");
    }
})

promesaPizza.then(respuesta => console.log(respuesta)).catch(error => console.log(error));

// http://cine.runasp.net/api/Actores

// fetch('http://cine.runasp.net/api/Actores').then(response => response.json()).then(respuesta =>
//console.log(respuesta)).catch(error => console.log(error));


//fetch('http://cine.runasp.net/api/Generos').then(response => response.json()).then(respuesta => 
//console.log(respuesta)).catch(error => console.log(error));


let titulo = document.getElementById("titulo");
console.log(titulo.innerHTML);

let parrafo = document.getElementById("parrafo");

fetch('http://cine.runasp.net/api/Actores').then(response => response.json()).then(respuesta => {
    parrafo.innerHTML = JSON.stringify(respuesta);
}).catch(error => console.log(error));
