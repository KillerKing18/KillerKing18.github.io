import { html, render, Component } from 'https://unpkg.com/htm/preact/standalone.module.js'

const titulo = document.getElementById("tituloTemporal")
titulo.remove()

if (localStorage.getItem('tareas') === null) {
    localStorage.setItem('tareas', '0')
}

function onClickEditarTarea(boton) {
    const nombreTarea = boton.innerHTML
    boton.outerHTML = '<input class="inputTarea" placeholder="' + nombreTarea + '" type="text" id="' + boton.id + '">'

    let inputTarea = document.getElementById(boton.id)

    const divBotonesTarea = document.getElementById('divBotonesTarea' + boton.id.substring(5, boton.id.length))
    
    let botonEliminar = document.createElement("button")
    let textoBotonEliminar = document.createTextNode("Eliminar")
    botonEliminar.appendChild(textoBotonEliminar)
    botonEliminar.onclick = function() {
        onClickEliminarTarea(inputTarea)
    }
    divBotonesTarea.appendChild(botonEliminar)

    let botonCancelar = document.createElement("button")
    let textoBotonCancelar = document.createTextNode("Cancelar")
    botonCancelar.appendChild(textoBotonCancelar)
    botonCancelar.onclick = function() {
        onClickCancelarEditarTarea(inputTarea)
    }
    divBotonesTarea.appendChild(botonCancelar)

    let botonGuardar = document.createElement("button")
    let textoBotonGuardar = document.createTextNode("Guardar")
    botonGuardar.appendChild(textoBotonGuardar)
    botonGuardar.id = 'guardarTarea' + boton.id.substring(5, boton.id.length)
    botonGuardar.onclick = function() {
        onClickGuardarTareaEditada(inputTarea)
    }
    divBotonesTarea.appendChild(botonGuardar)
}

function onClickGuardarTareaEditada(inputTarea) {
    const nuevoNombre = inputTarea.value
    if (nuevoNombre !== '') {
        inputTarea.outerHTML = '<button class="botonTarea" id="' + inputTarea.id + '">' + nuevoNombre + '</button>'
        let boton = document.getElementById(inputTarea.id)
        boton.onclick = function() {
            onClickEditarTarea(boton)
        }

        localStorage.setItem(inputTarea.id.substring(5, inputTarea.id.length), nuevoNombre)

        const divBotonesTarea = document.getElementById('divBotonesTarea' + inputTarea.id.substring(5, boton.id.length))
        divBotonesTarea.innerHTML = ""
    }
    else {
        alert("El nombre de la tarea no puede quedar vacío.");
    }
}

function onClickEliminarTarea(inputTarea) {
    const numeroOriginal = parseInt(inputTarea.id.substring(5, inputTarea.id.length))
    let numeroTarea = parseInt(inputTarea.id.substring(5, inputTarea.id.length))
    let totalTareas = parseInt(localStorage.getItem('tareas'))

    const divBotonesTarea = document.getElementById('divBotonesTarea' + inputTarea.id.substring(5, inputTarea.id.length))
    inputTarea.remove()
    divBotonesTarea.remove()

    for(numeroTarea; numeroTarea < totalTareas; numeroTarea++) {
        localStorage.setItem(numeroTarea, localStorage.getItem((numeroTarea + 1).toString()))
        if (numeroTarea !== numeroOriginal) {
            let botonOInput = document.getElementById("tarea" + numeroTarea)
            let div = document.getElementById("divBotonesTarea" + numeroTarea)
            let nuevoNumero = numeroTarea - 1
            botonOInput.id = "tarea" + nuevoNumero
            div.id = "divBotonesTarea" + nuevoNumero
        }
    }

    // restar 1 a las tareas
    totalTareas = totalTareas - 1
    localStorage.setItem('tareas', totalTareas)
}

function onClickCancelarEditarTarea(inputTarea) {
    inputTarea.outerHTML = '<button class="botonTarea" id="' + inputTarea.id + '">' + inputTarea.placeholder + '</button>'
    
    let boton = document.getElementById(inputTarea.id)
    boton.onclick = function() {
        onClickEditarTarea(boton)
    }

    const divBotonesTarea = document.getElementById('divBotonesTarea' + inputTarea.id.substring(5, boton.id.length))
    divBotonesTarea.innerHTML = ""
}

function onClickGuardarNuevaTarea() {
    const nombreTarea = document.getElementById('nombreTarea')
    if (nombreTarea.value !== '') {
        const divInferior = document.getElementById("inferior")
        let nuevoBoton = document.createElement("button")
        let textoBoton = document.createTextNode(nombreTarea.value)
        nuevoBoton.appendChild(textoBoton)
        nuevoBoton.id = 'tarea' + localStorage.getItem('tareas')
        nuevoBoton.className = "botonTarea"
        nuevoBoton.onclick = function() {
            onClickEditarTarea(nuevoBoton)
        }
        let nuevoDiv = document.createElement("div")
        nuevoDiv.id = 'divBotonesTarea' + localStorage.getItem('tareas')
        nuevoDiv.className = "divBotonesTarea"
        divInferior.appendChild(nuevoBoton)
        divInferior.appendChild(nuevoDiv)

        let numeroTareas = parseInt(localStorage.getItem('tareas'))
        localStorage.setItem(numeroTareas.toString(), nombreTarea.value)
        numeroTareas = numeroTareas + 1
        localStorage.setItem('tareas', numeroTareas)
        
        const divAnadirTarea = document.getElementById("divAnadirTarea")
        divAnadirTarea.remove()
    }
    else {
        alert("Debes rellenar el nombre de la tarea");
    }
}

function onClickCancelarNuevaTarea() {
    const divAnadirTarea = document.getElementById("divAnadirTarea")
    divAnadirTarea.remove()
}

class BotonAnadir extends Component {
    render() {
        return html`<button id="anadir" onclick=${this.handleClick.bind(this)}>Añadir tarea</button>
        <div id="espacioOnClickAnadir"></div>`
    }

    handleClick(e) {
        e.stopPropagation()
        
        // Añadir div con el input y los dos botones
        const espacioOnClickAnadir = document.getElementById('espacioOnClickAnadir')
        espacioOnClickAnadir.innerHTML = '<div id="divAnadirTarea"><input placeholder="Tarea..." type="text" id="nombreTarea" name="nombreTarea"><br><button id="guardarNuevaTarea" >Guardar</button><button id="cancelarNuevaTarea" >Cancelar</button></div>'
        
        // onclick de guardar
        const botonGuardar = document.getElementById("guardarNuevaTarea")
        botonGuardar.onclick = onClickGuardarNuevaTarea
        
        // onclick de cancelar
        const botonCancelar = document.getElementById("cancelarNuevaTarea")
        botonCancelar.onclick = onClickCancelarNuevaTarea
    }
}

const divSuperior = document.getElementById("superior")

render(html`<${BotonAnadir} />`, divSuperior)

const divInferior = document.getElementById("inferior")

const numeroTareas = localStorage.getItem('tareas')

for (let i = 0; i < numeroTareas; i++) {
    let nombre = localStorage.getItem(i.toString())

    let nuevoBoton = document.createElement("button")
    let textoBoton = document.createTextNode(nombre)
    nuevoBoton.appendChild(textoBoton)
    nuevoBoton.id = 'tarea' + i.toString()
    nuevoBoton.className = "botonTarea"
    nuevoBoton.onclick = function() {
        onClickEditarTarea(nuevoBoton)
    }
    let nuevoDiv = document.createElement("div")
    nuevoDiv.id = 'divBotonesTarea' + i.toString()
    nuevoDiv.className = "divBotonesTarea"
    divInferior.appendChild(nuevoBoton)
    divInferior.appendChild(nuevoDiv)
}