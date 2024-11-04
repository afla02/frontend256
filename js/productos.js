function mostrarProductos() {
    let request = sendRequest('producto', 'GET', '');
    let table = document.getElementById('productos-table');
    table.innerHTML = "";
    request.onload = function() {
        let data = request.response;
        data.forEach(element => {
            table.innerHTML += `
            <tr>
                <td>${element.nombre}</td>
                <td>${element.descripcion}</td>
                <td>${element.precio}</td>
                <td>${element.cantidad}</td>
                <td>${element.estado}</td>
                <td>${element.fechaCreacion}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick='window.location = "/formProductos.html?id=${element._id}"'>Editar</button>
                    <button type="button" class="btn btn-danger" onclick='confirmarEliminar("${element._id}")'>Eliminar</button>
                </td>
            </tr>
        `;
        });
    }
} 

function confirmarEliminar(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProductos(id); 
            Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado.',
                'success'
            );
        }
    });
}

function deleteProductos(id) {
    let request = sendRequest('producto/' + id, 'DELETE', '');
    request.onload = function() {
        mostrarProductos(); 
    }
}


function guardarProductos() {
    let nom = document.getElementById('nombre-n').value;
    let des = document.getElementById('descripcion-d').value;
    let pre= document.getElementById('precio-p').value;
    let can = document.getElementById('cantidad-c').value;
    let est = document.getElementById('estado-e').value;

    // Verificación de campos vacíos
    if (!nom || !des || !pre || !can || !est) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Uno o más campos se encuentran vacíos. Por favor, complétalos antes de continuar.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: 'btn btn-warning'
            },
            buttonsStyling: false
        });
        return; // Detener la función si hay campos vacíos
    }

    // Si no hay campos vacíos, proceder con la solicitud
    let data = { 'nombre': nom, 'descripcion': des, 'precio': pre, 'cantidad': can, 'estado': est};
    let request = sendRequest('producto/', 'POST', data);

    request.onload = function () {
        Swal.fire({
            icon: 'success',
            title: 'Producto creado',
            text: 'El Producto ha sido creado exitosamente.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location = 'productos.html';
            }
        });
    };

    request.onerror = function () {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al guardar los datos. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        });
    };
}

function cargarDatos(id) {
    let request = sendRequest('producto/' + id, 'GET', '');
    let nom = document.getElementById('nombre-n');
    let des = document.getElementById('descripcion-d');
    let pre= document.getElementById('precio-p');
    let can = document.getElementById('cantidad-c');
    let est = document.getElementById('estado-e');

    request.onload = function () {
        if (request.status === 200) { 
            let data = request.response;
            nom.value = data.nombre;
            des.value = data.descripcion;
            pre.value = data.precio;
            can.value = data.cantidad;
            est.value = data.estado;
            console.log(data);
        } else {
            console.error("Error al cargar datos:", request.status, request.statusText);
            console.log("Error al cargar datos");
        }
    };

    request.onerror = function () {
        console.error("Error de red:", request.status, request.statusText);
        console.log("Error al cargar datos");
    };
}

function modificarProducto(id) {
    let nom = document.getElementById('nombre-n').value;
    let des = document.getElementById('descripcion-d').value;
    let pre= document.getElementById('precio-p').value;
    let can = document.getElementById('cantidad-c').value;
    let est = document.getElementById('estado-e').value;

    let data = { 'nombre': nom, 'descripcion': des, 'precio': pre, 'cantidad': can, 'estado': est};
    let request = sendRequest('producto/' + id, 'PUT', data);

    request.onload = function () {
        if (request.status === 200) { 
            Swal.fire({
                icon: 'success',
                title: 'Producto editado',
                text: 'El Producto ha sido editado correctamente.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
            }).then(() => {
                window.location = 'productos.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al editar el producto. Inténtalo de nuevo.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                buttonsStyling: false
            });
        }
    };

    request.onerror = function () {
        console.log('Error al modificar los datos');
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al modificar los datos. Por favor, inténtalo más tarde.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });
    };
}

