function mostrarClientes() {
    let request = sendRequest('cliente', 'GET', '');
    let table = document.getElementById('clientes-table');
    table.innerHTML = "";
    request.onload = function () {
        let data = request.response;
        data.forEach(element => {
            table.innerHTML += `
            <tr>
                <td>${element.nombres}</td>
                <td>${element.apellidos}</td>
                <td>${element.documento}</td>
                <td>${element.correo}</td>
                <td>${element.telefono}</td>
                <td>${element.direccion}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick='window.location = "/formClientes.html?id=${element._id}"'>Editar</button>
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
            deleteClientes(id);
            Swal.fire(
                'Eliminado!',
                'El cliente ha sido eliminado.',
                'success'
            );
        }
    });
}

function deleteClientes(id) {
    let request = sendRequest('cliente/' + id, 'DELETE', '');
    request.onload = function () {
        mostrarClientes();
    }
}

function guardarClientes() {
    let nom = document.getElementById('nombres-n').value;
    let ape = document.getElementById('apellidos-a').value;
    let doc = document.getElementById('documento-d').value;
    let cor = document.getElementById('correo-c').value;
    let tel = document.getElementById('telefono-t').value;
    let dir = document.getElementById('direccion-d').value;

    // Verificación de campos vacíos
    if (!nom || !ape || !doc || !cor || !tel || !dir) {
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
        return; 
    }

    let data = { 'nombres': nom, 'apellidos': ape, 'documento': doc, 'correo': cor, 'telefono': tel, 'direccion': dir };
    let request = sendRequest('cliente/', 'POST', data);

    request.onload = function () {
        Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente ha sido creado exitosamente.',
            confirmButtonText: 'Aceptar',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location = 'clientes.html';
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
    let request = sendRequest('cliente/' + id, 'GET', '');
    let nom = document.getElementById('nombres-n');
    let ape = document.getElementById('apellidos-a');
    let doc = document.getElementById('documento-d');
    let cor = document.getElementById('correo-c');
    let tel = document.getElementById('telefono-t');
    let dir = document.getElementById('direccion-d');

    request.onload = function () {
        if (request.status === 200) { // Verifica que la solicitud fue exitosa
            let data = request.response;
            nom.value = data.nombres;
            ape.value = data.apellidos;
            doc.value = data.documento;
            cor.value = data.correo;
            tel.value = data.telefono;
            dir.value = data.direccion;
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

function modificarCliente(id) {
    let nom = document.getElementById('nombres-n').value;
    let ape = document.getElementById('apellidos-a').value;
    let doc = document.getElementById('documento-d').value;
    let cor = document.getElementById('correo-c').value;
    let tel = document.getElementById('telefono-t').value;
    let dir = document.getElementById('direccion-d').value;

    let data = { 'nombres': nom, 'apellidos': ape, 'documento': doc, 'correo': cor, 'telefono': tel, 'direccion': dir };
    let request = sendRequest('cliente/' + id, 'PUT', data);

    request.onload = function () {
        if (request.status === 200) { // Verifica que la modificación fue exitosa
            Swal.fire({
                icon: 'success',
                title: 'Cliente editado',
                text: 'El cliente ha sido editado correctamente.',
                confirmButtonText: 'Aceptar',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
            }).then(() => {
                window.location = 'clientes.html'; // Redirige después de que se cierre el SweetAlert
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al editar el cliente. Inténtalo de nuevo.',
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
