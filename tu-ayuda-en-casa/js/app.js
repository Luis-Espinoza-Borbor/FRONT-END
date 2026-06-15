document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. CONTROL DE SESIÓN EN NAVBAR
    // ==========================================
    const contenedorAuthNav = document.getElementById('contenedorAuthNav');
    if (contenedorAuthNav) {
        let usuarioActual = null;
        try {
            usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        } catch (e) { }

        if (usuarioActual && usuarioActual.nombre) {
            let linkPanel = 'index.html';
            if (usuarioActual.rol === 'Admin') linkPanel = 'admin-dashboard.html';
            if (usuarioActual.rol === 'Cliente') linkPanel = 'historial-servicios.html';
            if (usuarioActual.rol === 'Trabajador') linkPanel = 'panel-trabajador.html';

            let htmlAvatar = '';
            if (usuarioActual.foto) {
                htmlAvatar = `<img src="${usuarioActual.foto}" class="avatar-img" alt="Perfil">`;
            } else {
                let nombreParaInicial = usuarioActual.nombre || "U";
                let inicial = nombreParaInicial.charAt(0).toUpperCase();
                htmlAvatar = `<div class="avatar-inicial">${inicial}</div>`;
            }

            contenedorAuthNav.innerHTML = `
                <a href="perfil.html" class="d-flex align-items-center gap-2 text-decoration-none">
                    ${htmlAvatar}
                    <span class="text-primary fw-bold d-none d-lg-inline">👋 ${usuarioActual.nombre.split(' ')[0]}</span>
                </a>
                <a href="${linkPanel}" class="btn btn-primary btn-sm fw-bold shadow-sm ms-2">Mi Panel</a>
                <button id="btnCerrarSesion" class="btn btn-outline-danger btn-sm fw-bold ms-2">Salir</button>
            `;

            document.getElementById('btnCerrarSesion').addEventListener('click', () => {
                Swal.fire({
                    title: '¿Cerrar sesión?',
                    text: "Tendrás que volver a ingresar tus datos para entrar.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#0d6efd',
                    cancelButtonColor: '#dc3545',
                    confirmButtonText: 'Sí, salir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('usuarioActual');
                        window.location.href = 'index.html';
                    }
                });
            });
        } else {
            contenedorAuthNav.innerHTML = `
                <a href="login.html" class="btn btn-outline-primary fw-bold">Iniciar Sesión</a>
            `;
        }
    }

    // ==========================================
    // INICIALIZACIÓN DE PROFESIONES Y SELECTS
    // ==========================================
    let profesionesGuardadas = JSON.parse(localStorage.getItem('profesiones'));
    if (!profesionesGuardadas) {
        profesionesGuardadas = ['Limpieza', 'Gasfitería', 'Pintura', 'Niñera', 'Electricidad'];
        localStorage.setItem('profesiones', JSON.stringify(profesionesGuardadas));
    }

    const selectsDinamicos = document.querySelectorAll('.select-dinamico');
    if (selectsDinamicos.length > 0) {
        let profesionesActuales = JSON.parse(localStorage.getItem('profesiones')) || [];
        selectsDinamicos.forEach(select => {
            let textoBase = select.options.length > 0 ? select.options[0].textContent : 'Seleccione...';
            select.innerHTML = '';

            let optBase = document.createElement('option');
            optBase.value = '';
            optBase.textContent = textoBase;
            select.appendChild(optBase);

            profesionesActuales.forEach(profesion => {
                let opt = document.createElement('option');
                opt.value = profesion;
                opt.textContent = profesion;
                select.appendChild(opt);
            });
        });
    }

    // ==========================================
    // 1. MODO OSCURO
    // ==========================================
    const btnModoOscuro = document.getElementById('btnModoOscuro');
    const htmlElement = document.documentElement;
    if (btnModoOscuro) {
        if (localStorage.getItem('tema') === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            btnModoOscuro.textContent = '☀️ Claro';
            btnModoOscuro.classList.replace('btn-dark', 'btn-light');
        }
        btnModoOscuro.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-bs-theme') === 'light') {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('tema', 'dark');
                btnModoOscuro.textContent = '☀️ Claro';
                btnModoOscuro.classList.replace('btn-dark', 'btn-light');
            } else {
                htmlElement.setAttribute('data-bs-theme', 'light');
                localStorage.setItem('tema', 'light');
                btnModoOscuro.textContent = '🌙 Oscuro';
                btnModoOscuro.classList.replace('btn-light', 'btn-dark');
            }
        });
    }

    // ==========================================
    // 2. BUSCADOR HERO
    // ==========================================
    const formBuscador = document.getElementById('formBuscadorInicio');
    if (formBuscador) {
        formBuscador.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = "servicios.html";
        });
    }

    // ==========================================
    // 3. REGISTRO TRABAJADOR
    // ==========================================
    const formRegistroTrabajador = document.getElementById('formRegistroTrabajador');
    if (formRegistroTrabajador) {
        formRegistroTrabajador.addEventListener('submit', function (e) {
            e.preventDefault();
            const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            if (hoy.getMonth() - fechaNacimiento.getMonth() < 0 || (hoy.getMonth() - fechaNacimiento.getMonth() === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;

            const errorEdad = document.getElementById('errorEdad');
            if (edad < 18) {
                errorEdad.classList.remove('d-none');
                return;
            } else {
                errorEdad.classList.add('d-none');
            }

            const correoLimpio = document.getElementById('correoTrabajador').value.trim().toLowerCase();
            let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

            if (trabajadores.some(t => t.correo === correoLimpio)) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Este correo ya está registrado por otro profesional.' });
                return;
            }

            const nuevoTrabajador = {
                id: Date.now(),
                nombre: document.getElementById('nombreTrabajador').value,
                correo: correoLimpio,
                password: document.getElementById('passTrabajador').value,
                cedula: document.getElementById('cedulaTrabajador').value,
                categoria: document.getElementById('categoriaEspecialidad').value,
                tarifa: parseFloat(document.getElementById('tarifaHora').value),
                experiencia: document.getElementById('experiencia').value,
                estado: 'Pendiente'
            };

            trabajadores.push(nuevoTrabajador);
            localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu perfil está pendiente de aprobación por un administrador.',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                formRegistroTrabajador.reset();
                window.location.href = "index.html";
            });
        });
    }

    // ==========================================
    // 4. TABLA ADMIN USUARIOS
    // ==========================================
    const tablaTrabajadoresBody = document.getElementById('tablaTrabajadoresBody');
    const mensajeVacio = document.getElementById('mensajeVacio');
    if (tablaTrabajadoresBody) {
        const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
        tablaTrabajadoresBody.innerHTML = '';
        if (trabajadores.length === 0) {
            if (mensajeVacio) mensajeVacio.classList.remove('d-none');
        } else {
            if (mensajeVacio) mensajeVacio.classList.add('d-none');
            trabajadores.forEach(t => {
                let badgeColor = t.estado === 'Aprobado' ? 'bg-success' : 'bg-warning text-dark';
                tablaTrabajadoresBody.innerHTML += `
                <tr>
                    <td class="fw-bold">${t.nombre}</td>
                    <td>${t.cedula}</td>
                    <td>${t.categoria}</td>
                    <td>$${t.tarifa.toFixed(2)}</td>
                    <td><span class="badge ${badgeColor}">${t.estado}</span></td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-success me-1" onclick="aprobarTrabajador(${t.id})">✓</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarTrabajador(${t.id})">X</button>
                    </td>
                </tr>
            `;
            });
        }
    }

    // ==========================================
    // 5. CATÁLOGO SERVICIOS
    // ==========================================
    const contenedorServicios = document.getElementById('contenedorServicios');
    const inputFiltroNombre = document.getElementById('filtroNombre');
    const selectFiltroCategoria = document.getElementById('filtroCategoria');

    if (contenedorServicios) {
        const renderizarServicios = () => {
            let aprobados = (JSON.parse(localStorage.getItem('trabajadores')) || []).filter(t => t.estado === 'Aprobado');
            const resenas = JSON.parse(localStorage.getItem('resenas')) || [];

            const texto = inputFiltroNombre ? inputFiltroNombre.value.toLowerCase() : '';
            if (texto) aprobados = aprobados.filter(t => t.nombre.toLowerCase().includes(texto));
            const cat = selectFiltroCategoria ? selectFiltroCategoria.value : '';
            if (cat) aprobados = aprobados.filter(t => t.categoria === cat);

            contenedorServicios.innerHTML = '';
            if (aprobados.length === 0) {
                contenedorServicios.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">No se encontraron profesionales con estos filtros.</h4></div>';
                return;
            }

            aprobados.forEach(t => {
                let icono = '';
                if (t.categoria === 'Limpieza') icono = '<i class="bi bi-house-check text-primary"></i>';
                else if (t.categoria === 'Niñera') icono = '<i class="bi bi-person-hearts text-primary"></i>';
                else if (t.categoria === 'Pintura') icono = '<i class="bi bi-brush text-primary"></i>';
                else if (t.categoria === 'Electricidad') icono = '<i class="bi bi-lightning-charge text-primary"></i>';
                else icono = '<i class="bi bi-tools text-primary"></i>';

                let misResenas = resenas.filter(r => r.idTrabajador == t.id);
                let htmlEstrellas = '<span class="badge bg-light text-dark border mb-2"><small>Nuevo profesional</small></span>';

                if (misResenas.length > 0) {
                    let suma = misResenas.reduce((acc, val) => acc + parseInt(val.calificacion), 0);
                    let promedio = (suma / misResenas.length).toFixed(1);
                    htmlEstrellas = `<div class="mb-2"><span class="text-warning fs-5">★</span> <span class="fw-bold">${promedio}</span> <span class="text-muted small">(${misResenas.length} reseñas)</span></div>`;
                }

                contenedorServicios.innerHTML += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm tarjeta-servicio border-0">
                            <div class="card-body text-center p-4">
                                <div class="mb-3"><span class="display-4">${icono}</span></div>
                                <h5 class="card-title fw-bold mb-1">${t.nombre}</h5>
                                ${htmlEstrellas}
                                <span class="badge bg-primary mb-3">${t.categoria}</span>
                                <p class="card-text small text-muted text-start mb-4" style="height: 60px; overflow: hidden;">${t.experiencia}</p>
                                <div class="d-flex justify-content-between align-items-center border-top pt-3">
                                    <span class="fw-bold fs-5 text-success">$${t.tarifa.toFixed(2)}/hr</span>
                                    <a href="agendamiento.html" class="btn btn-outline-primary btn-sm fw-bold px-3">Contratar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        };
        renderizarServicios();
        if (inputFiltroNombre) inputFiltroNombre.addEventListener('input', renderizarServicios);
        if (selectFiltroCategoria) selectFiltroCategoria.addEventListener('change', renderizarServicios);
    }

    // ==========================================
    // 6. AGENDAMIENTO
    // ==========================================
    const formAgendamiento = document.getElementById('formAgendamiento');
    if (formAgendamiento) {
        const selectProfesional = document.getElementById('selectProfesional');
        const inputHoras = document.getElementById('inputHoras');
        const totalPagarText = document.getElementById('totalPagarText');

        const aprobados = (JSON.parse(localStorage.getItem('trabajadores')) || []).filter(t => t.estado === 'Aprobado');
        aprobados.forEach(t => {
            selectProfesional.innerHTML += `<option value="${t.id}" data-tarifa="${t.tarifa}">${t.nombre} - ${t.categoria} ($${t.tarifa.toFixed(2)}/hr)</option>`;
        });

        const calcularTotal = () => {
            if (selectProfesional.value) {
                const tarifa = parseFloat(selectProfesional.options[selectProfesional.selectedIndex].getAttribute('data-tarifa'));
                const horas = parseFloat(inputHoras.value) || 0;
                totalPagarText.textContent = `$${(tarifa * horas).toFixed(2)}`;
            }
        };
        selectProfesional.addEventListener('change', calcularTotal);
        inputHoras.addEventListener('input', calcularTotal);

        formAgendamiento.addEventListener('submit', (e) => {
            e.preventDefault();
            const opt = selectProfesional.options[selectProfesional.selectedIndex];
            const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            reservas.push({
                idReserva: Date.now(),
                idTrabajador: opt.value,
                nombreTrabajador: opt.textContent,
                fecha: document.getElementById('fechaServicio').value,
                hora: document.getElementById('horaServicio').value,
                horasContratadas: inputHoras.value,
                totalPagado: parseFloat(opt.getAttribute('data-tarifa')) * parseFloat(inputHoras.value),
                estado: 'Pendiente de Pago'
            });
            localStorage.setItem('reservas', JSON.stringify(reservas));
            window.location.href = "checkout.html";
        });
    }

    // ==========================================
    // 7. CHECKOUT
    // ==========================================
    const formCheckout = document.getElementById('formCheckout');
    if (formCheckout) {
        const resumenPagoContenedor = document.getElementById('resumenPagoContenedor');
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        let ultimaReserva = reservas[reservas.length - 1];

        if (ultimaReserva && ultimaReserva.estado === 'Pendiente de Pago') {
            resumenPagoContenedor.innerHTML = `
                <ul class="list-group list-group-flush bg-transparent mb-3">
                    <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Servicio con:</span><strong>${ultimaReserva.nombreTrabajador}</strong></li>
                    <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Fecha agendada:</span><strong>${ultimaReserva.fecha}</strong></li>
                    <li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>Horas:</span><strong>${ultimaReserva.horasContratadas} hrs</strong></li>
                </ul>
                <div class="d-flex justify-content-between text-success pt-3 border-top"><h5 class="fw-bold">Total a Pagar</h5><h5 class="fw-bold">$${ultimaReserva.totalPagado.toFixed(2)}</h5></div>
            `;
        } else {
            resumenPagoContenedor.innerHTML = `<p class="text-danger">No hay reservas pendientes de pago.</p>`;
        }

        formCheckout.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('numTarjeta').value.length !== 16) {
                Swal.fire({ icon: 'warning', title: 'Oops...', text: 'La tarjeta debe tener 16 dígitos.' });
                return;
            }
            if (ultimaReserva) {
                ultimaReserva.estado = 'Pagado';
                localStorage.setItem('reservas', JSON.stringify(reservas));
                window.location.href = "confirmacion.html";
            }
        });
    }

    // ==========================================
    // 8. TEMPORIZADOR CONFIRMACIÓN
    // ==========================================
    const temporizadorLlegada = document.getElementById('temporizadorLlegada');
    if (temporizadorLlegada) {
        const reservas = (JSON.parse(localStorage.getItem('reservas')) || []).filter(r => r.estado === 'Pagado');
        const ultima = reservas[reservas.length - 1];
        if (ultima) {
            document.getElementById('nombreConfirmado').textContent = ultima.nombreTrabajador;
            const fechaObjetivo = new Date(`${ultima.fecha}T${ultima.hora}`).getTime();

            const intervalo = setInterval(() => {
                const distancia = fechaObjetivo - new Date().getTime();
                if (distancia < 0) {
                    clearInterval(intervalo);
                    temporizadorLlegada.textContent = "¡Servicio en curso!";
                    temporizadorLlegada.classList.replace('text-dark', 'text-success');
                    return;
                }
                const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
                const h = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distancia % (1000 * 60)) / 1000);
                temporizadorLlegada.textContent = d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
            }, 1000);
        }
    }

// ==========================================
    // 9. HISTORIAL CLIENTE
    // ==========================================
    const tablaHistorialBody = document.getElementById('tablaHistorialBody');
    if (tablaHistorialBody) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const msj = document.getElementById('mensajeSinReservas');
        if (reservas.length === 0) {
            if(msj) msj.classList.remove('d-none');
        } else {
            if(msj) msj.classList.add('d-none');
            reservas.slice().reverse().forEach(r => {
                let badge = '';
                if (r.estado === 'Pagado') badge = 'bg-success';
                else if (r.estado === 'Cancelado') badge = 'bg-danger';
                else badge = 'bg-warning text-dark';

                let btn = '';
                if (r.estado === 'Pagado') {
                    btn = `<button class="btn btn-sm btn-outline-primary mb-1 w-100" onclick="abrirFactura(${r.idReserva})">📄 Factura</button>
                           <button class="btn btn-sm btn-warning mb-1 w-100" onclick="irACalificar(${r.idReserva})">⭐ Calificar</button>
                           <button class="btn btn-sm btn-danger w-100 fw-bold" onclick="cancelarReserva(${r.idReserva})">❌ Cancelar</button>`;
                } else if (r.estado === 'Cancelado') {
                    btn = `<span class="text-danger small fw-bold">Servicio Cancelado</span>`;
                } else {
                    btn = `<span class="text-muted small">Pendiente</span>`;
                }
                
                tablaHistorialBody.innerHTML += `<tr><td><strong>${r.fecha}</strong> <br><small class="text-muted">${r.hora}</small></td><td>${r.nombreTrabajador}</td><td>${r.horasContratadas} hrs</td><td class="fw-bold">$${parseFloat(r.totalPagado).toFixed(2)}</td><td><span class="badge ${badge}">${r.estado}</span></td><td class="text-center">${btn}</td></tr>`;
            });
        }
    }

    // ==========================================
    // 10. DASHBOARD ADMINISTRADOR + BUZÓN DINÁMICO
    // ==========================================
    const dashVentas = document.getElementById('dashVentas');
    if (dashVentas) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

        document.getElementById('dashTrabajadores').textContent = trabajadores.filter(t => t.estado === 'Aprobado').length;

        const pagadas = reservas.filter(r => r.estado === 'Pagado');
        document.getElementById('dashServicios').textContent = pagadas.length;

        const totalVentas = pagadas.reduce((sum, r) => sum + parseFloat(r.totalPagado), 0);
        dashVentas.textContent = `$${totalVentas.toFixed(2)}`;

        const tablaDash = document.getElementById('tablaDashServicios');
        if (tablaDash) {
            const ultimasReservas = reservas.slice().reverse().slice(0, 5);
            if (ultimasReservas.length === 0) {
                tablaDash.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No hay transacciones registradas.</td></tr>';
            } else {
                ultimasReservas.forEach(r => {
                    let badge = r.estado === 'Pagado' ? 'bg-success' : 'bg-warning text-dark';
                    tablaDash.innerHTML += `<tr><td>${r.fecha}</td><td>${r.nombreTrabajador}</td><td class="fw-bold text-success">$${parseFloat(r.totalPagado).toFixed(2)}</td><td><span class="badge ${badge}">${r.estado}</span></td></tr>`;
                });
            }
        }

        const tablaSugerenciasBody = document.getElementById('tablaSugerenciasBody');
        const msjSinSugerencias = document.getElementById('mensajeSinSugerencias');

        if (tablaSugerenciasBody) {
            let sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];
            tablaSugerenciasBody.innerHTML = '';

            if (sugerencias.length === 0) {
                if (msjSinSugerencias) msjSinSugerencias.classList.remove('d-none');
            } else {
                if (msjSinSugerencias) msjSinSugerencias.classList.add('d-none');

                sugerencias.slice().reverse().forEach(sug => {
                    tablaSugerenciasBody.innerHTML += `
                        <tr>
                            <td><span class="badge bg-light text-dark border">${sug.fecha}</span></td>
                            <td class="fw-bold">${sug.nombre}</td>
                            <td><a href="mailto:${sug.correo}" class="text-decoration-none">${sug.correo}</a></td>
                            <td style="max-width: 300px; white-space: normal;">${sug.mensaje}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarSugerencia(${sug.id})">🗑️</button>
                            </td>
                        </tr>
                    `;
                });
            }
        }
    }

    // ==========================================
    // 11. BUZÓN DE SUGERENCIAS
    // ==========================================
    const formSugerencias = document.getElementById('formSugerencias');
    if (formSugerencias) {
        formSugerencias.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevaSugerencia = {
                id: Date.now(),
                nombre: document.getElementById('sugNombre').value,
                correo: document.getElementById('sugCorreo').value.trim().toLowerCase(),
                mensaje: document.getElementById('sugMensaje').value,
                fecha: new Date().toLocaleDateString()
            };
            const sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];
            sugerencias.push(nuevaSugerencia);
            localStorage.setItem('sugerencias', JSON.stringify(sugerencias));

            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Hemos recibido tu sugerencia correctamente.',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                formSugerencias.reset();
            });
        });
    }

    // ==========================================
    // 12. REGISTRO CLIENTES
    // ==========================================
    const formRegistroCliente = document.getElementById('formRegistroCliente');
    if (formRegistroCliente) {
        formRegistroCliente.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('regPassword').value;
            const confirmPass = document.getElementById('regPasswordConfirm').value;
            const errorPass = document.getElementById('errorPassword');

            if (pass !== confirmPass) {
                errorPass.classList.remove('d-none');
                return;
            } else {
                errorPass.classList.add('d-none');
            }

            const nuevoCliente = {
                id: Date.now(),
                nombre: document.getElementById('regNombre').value,
                cedula: document.getElementById('regCedula') ? document.getElementById('regCedula').value : '',
                correo: document.getElementById('regCorreo').value.trim().toLowerCase(),
                password: pass,
                rol: 'Cliente'
            };

            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            if (clientes.some(c => c.correo === nuevoCliente.correo)) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Este correo ya está registrado. Por favor, inicia sesión.' });
                return;
            }

            clientes.push(nuevoCliente);
            localStorage.setItem('clientes', JSON.stringify(clientes));

            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: 'Ahora puedes iniciar sesión con tus credenciales.',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                window.location.href = "login.html";
            });
        });
    }

    // ==========================================
    // 13. LOGIN MULTIPERFIL
    // ==========================================
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const correo = document.getElementById('loginCorreo').value.trim().toLowerCase();
            const pass = document.getElementById('loginPassword').value;

            if (correo === 'admin@admin.com' && pass === '123456') {
                localStorage.setItem('usuarioActual', JSON.stringify({ nombre: 'Administrador', rol: 'Admin' }));
                window.location.href = "admin-dashboard.html";
                return;
            }

            const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            const cliente = clientes.find(c => c.correo === correo && c.password === pass);
            if (cliente) {
                localStorage.setItem('usuarioActual', JSON.stringify({ nombre: cliente.nombre, correo: cliente.correo, rol: 'Cliente', foto: cliente.foto }));
                window.location.href = "servicios.html";
                return;
            }

            const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
            const trabajador = trabajadores.find(t => t.correo === correo && t.password === pass);
            if (trabajador) {
                if (trabajador.estado !== 'Aprobado') {
                    Swal.fire({ icon: 'warning', title: 'Acceso Denegado', text: 'Tu cuenta está en estado: ' + trabajador.estado + '. Un administrador debe aprobar tu perfil.' });
                    return;
                }
                localStorage.setItem('usuarioActual', JSON.stringify({ id: trabajador.id, nombre: trabajador.nombre, correo: trabajador.correo, rol: 'Trabajador', foto: trabajador.foto }));
                window.location.href = "panel-trabajador.html";
                return;
            }

            Swal.fire({ icon: 'error', title: 'Error de acceso', text: 'Correo o contraseña incorrectos.' });
        });
    }

    // ==========================================
    // 14. PANEL TRABAJADOR
    // ==========================================
    const tablaMisTrabajos = document.getElementById('tablaMisTrabajos');
    if (tablaMisTrabajos) {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual && usuarioActual.rol === 'Trabajador') {
            const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            const misCitas = reservas.filter(r => r.idTrabajador == usuarioActual.id && r.estado === 'Pagado');
            tablaMisTrabajos.innerHTML = '';
            if (misCitas.length === 0) {
                tablaMisTrabajos.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No tienes citas programadas en este momento.</td></tr>';
            } else {
                misCitas.slice().reverse().forEach(cita => {
                    tablaMisTrabajos.innerHTML += `<tr><td><strong>${cita.fecha}</strong> <br><small class="text-muted">${cita.hora}</small></td><td>Consumidor Final</td><td>${cita.horasContratadas} hrs</td><td class="fw-bold text-success">$${parseFloat(cita.totalPagado).toFixed(2)}</td></tr>`;
                });
            }
        }
    }

    // ==========================================
    // 15. SISTEMA DE CALIFICACIONES
    // ==========================================
    const formCalificacion = document.getElementById('formCalificacion');
    if (formCalificacion) {
        const reservaId = localStorage.getItem('reservaACalificar');
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const reservaActual = reservas.find(r => r.idReserva == reservaId);

        if (reservaActual) {
            document.getElementById('califNombreTrabajador').textContent = `Profesional: ${reservaActual.nombreTrabajador}`;
            document.getElementById('califFechaServicio').textContent = `Servicio del: ${reservaActual.fecha}`;
        }

        const estrellas = document.querySelectorAll('.estrella');
        const inputValor = document.getElementById('valorCalificacion');
        const errorEstrellas = document.getElementById('errorEstrellas');
        let calificacionSeleccionada = 0;

        estrellas.forEach(estrella => {
            estrella.addEventListener('mouseover', function () {
                let valor = this.getAttribute('data-valor');
                estrellas.forEach(e => { if (e.getAttribute('data-valor') <= valor) e.classList.add('hover'); else e.classList.remove('hover'); });
            });
            estrella.addEventListener('mouseout', function () { estrellas.forEach(e => e.classList.remove('hover')); });
            estrella.addEventListener('click', function () {
                calificacionSeleccionada = this.getAttribute('data-valor');
                inputValor.value = calificacionSeleccionada;
                errorEstrellas.classList.add('d-none');
                estrellas.forEach(e => { if (e.getAttribute('data-valor') <= calificacionSeleccionada) e.classList.add('activa'); else e.classList.remove('activa'); });
            });
        });

        formCalificacion.addEventListener('submit', (e) => {
            e.preventDefault();
            if (calificacionSeleccionada == 0) {
                errorEstrellas.classList.remove('d-none');
                return;
            }
            const resenas = JSON.parse(localStorage.getItem('resenas')) || [];
            resenas.push({
                idReserva: reservaActual.idReserva,
                idTrabajador: reservaActual.idTrabajador,
                nombreTrabajador: reservaActual.nombreTrabajador,
                calificacion: calificacionSeleccionada,
                comentario: document.getElementById('comentarioResena').value,
                fecha: new Date().toLocaleDateString()
            });
            localStorage.setItem('resenas', JSON.stringify(resenas));

            Swal.fire({
                icon: 'success',
                title: '¡Gracias por tu opinión!',
                text: 'Tu calificación ha sido enviada exitosamente.',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                window.location.href = "historial-servicios.html";
            });
        });
    }

    // ==========================================
    // 16. LOGICA CONFIGURACIÓN PERFIL
    // ==========================================
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    if (formEditarPerfil) {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuarioActual) {
            window.location.href = "login.html";
        } else {
            let tablaDestino = usuarioActual.rol === 'Cliente' ? 'clientes' : 'trabajadores';
            let usuariosRegistrados = JSON.parse(localStorage.getItem(tablaDestino)) || [];
            let usuarioReal = usuariosRegistrados.find(u => u.correo === usuarioActual.correo);

            if (usuarioReal) {
                document.getElementById('editNombre').value = usuarioReal.nombre;
                document.getElementById('editCedula').value = usuarioReal.cedula || '';
                document.getElementById('editPassword').value = usuarioReal.password;
            }

            const vistaPreviaContenedor = document.getElementById('vistaPreviaContenedor');
            let fotoTemporalBase64 = usuarioReal ? usuarioReal.foto : null;

            const actualizarVistaPrevia = () => {
                if (fotoTemporalBase64) {
                    vistaPreviaContenedor.innerHTML = `<img src="${fotoTemporalBase64}" class="avatar-img-grande shadow-sm" alt="Preview">`;
                } else {
                    let nombreActual = document.getElementById('editNombre').value || "U";
                    let inicial = nombreActual.charAt(0).toUpperCase();
                    vistaPreviaContenedor.innerHTML = `<div class="avatar-inicial avatar-grande shadow-sm">${inicial}</div>`;
                }
            };
            actualizarVistaPrevia();

            document.getElementById('editNombre').addEventListener('input', () => { if (!fotoTemporalBase64) actualizarVistaPrevia(); });

            const inputFotoPerfil = document.getElementById('inputFotoPerfil');
            inputFotoPerfil.addEventListener('change', function () {
                const archivo = this.files[0];
                if (archivo) {
                    const lector = new FileReader();
                    lector.onload = function (e) {
                        fotoTemporalBase64 = e.target.result;
                        actualizarVistaPrevia();
                    };
                    lector.readAsDataURL(archivo);
                }
            });

            formEditarPerfil.addEventListener('submit', (e) => {
                e.preventDefault();
                let nuevoNombre = document.getElementById('editNombre').value;
                let nuevaCedula = document.getElementById('editCedula').value;
                let nuevaPass = document.getElementById('editPassword').value;

                let index = usuariosRegistrados.findIndex(u => u.correo === usuarioActual.correo);
                if (index !== -1) {
                    usuariosRegistrados[index].nombre = nuevoNombre;
                    usuariosRegistrados[index].cedula = nuevaCedula;
                    usuariosRegistrados[index].password = nuevaPass;
                    usuariosRegistrados[index].foto = fotoTemporalBase64;
                    localStorage.setItem(tablaDestino, JSON.stringify(usuariosRegistrados));
                }

                usuarioActual.nombre = nuevoNombre;
                usuarioActual.foto = fotoTemporalBase64;
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

                Swal.fire({
                    icon: 'success',
                    title: '¡Actualizado!',
                    text: 'Perfil actualizado con éxito.',
                    confirmButtonColor: '#0d6efd'
                }).then(() => {
                    window.location.href = "index.html";
                });
            });
        }
    }

    // ==========================================
    // 17. GESTIÓN DE PROFESIONES (PANEL ADMIN)
    // ==========================================
    const formAgregarProfesion = document.getElementById('formAgregarProfesion');
    const listaProfesionesAdmin = document.getElementById('listaProfesionesAdmin');

    if (listaProfesionesAdmin) {
        const renderizarProfesiones = () => {
            let profesiones = JSON.parse(localStorage.getItem('profesiones')) || [];
            listaProfesionesAdmin.innerHTML = '';

            profesiones.forEach((profesion, index) => {
                listaProfesionesAdmin.innerHTML += `
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                        ${profesion}
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProfesion(${index})">Eliminar</button>
                    </li>
                `;
            });
        };

        renderizarProfesiones();

        if (formAgregarProfesion) {
            formAgregarProfesion.addEventListener('submit', (e) => {
                e.preventDefault();
                let inputVal = document.getElementById('nuevaProfesionInput').value.trim();
                let profesionLimpia = inputVal.charAt(0).toUpperCase() + inputVal.slice(1).toLowerCase();

                let profesiones = JSON.parse(localStorage.getItem('profesiones')) || [];

                if (profesiones.includes(profesionLimpia)) {
                    Swal.fire({ icon: 'warning', title: 'Categoría Duplicada', text: 'Esta profesión ya está registrada.' });
                    return;
                }

                profesiones.push(profesionLimpia);
                localStorage.setItem('profesiones', JSON.stringify(profesiones));
                document.getElementById('nuevaProfesionInput').value = '';
                renderizarProfesiones();
            });
        }
    }

});

// ==========================================
// FUNCIONES GLOBALES 
// ==========================================

function aprobarTrabajador(id) {
    let t = JSON.parse(localStorage.getItem('trabajadores')) || [];
    let i = t.findIndex(x => x.id == id);
    if (i !== -1) {
        t[i].estado = 'Aprobado';
        localStorage.setItem('trabajadores', JSON.stringify(t));

        Swal.fire({
            icon: 'success',
            title: '¡Aprobado!',
            text: 'El trabajador ahora es visible en el catálogo.',
            confirmButtonColor: '#198754'
        }).then(() => {
            location.reload();
        });
    }
}

function eliminarTrabajador(id) {
    Swal.fire({
        title: '¿Rechazar solicitud?',
        text: "Este trabajador será eliminado del sistema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let t = JSON.parse(localStorage.getItem('trabajadores')) || [];
            t = t.filter(x => x.id != id);
            localStorage.setItem('trabajadores', JSON.stringify(t));
            location.reload();
        }
    });
}

function eliminarProfesion(index) {
    Swal.fire({
        title: '¿Borrar categoría?',
        text: "Podría afectar a los trabajadores que ya la tienen asignada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let profesiones = JSON.parse(localStorage.getItem('profesiones')) || [];
            profesiones.splice(index, 1);
            localStorage.setItem('profesiones', JSON.stringify(profesiones));
            location.reload();
        }
    });
}

function eliminarSugerencia(id) {
    Swal.fire({
        title: '¿Borrar mensaje?',
        text: "Esta acción quitará el reporte de la bandeja del administrador.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];
            sugerencias = sugerencias.filter(s => s.id != id);
            localStorage.setItem('sugerencias', JSON.stringify(sugerencias));
            location.reload();
        }
    });
}

function abrirFactura(idReserva) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const r = reservas.find(x => x.idReserva == idReserva);
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (r) {
        const total = parseFloat(r.totalPagado);
        const subtotal = total / 1.15;

        let nombreCliente = "Consumidor Final";
        let cedulaCliente = "9999999999";

        if (usuarioActual && usuarioActual.rol === 'Cliente') {
            const clienteReal = clientes.find(c => c.correo === usuarioActual.correo);
            if (clienteReal) {
                nombreCliente = clienteReal.nombre;
                cedulaCliente = clienteReal.cedula || "N/A";
            }
        }

        const setContenido = (id, valor) => {
            const el = document.getElementById(id);
            if (el) el.textContent = valor;
        };

        setContenido('facNumero', `001-001-${String(r.idReserva).slice(-9)}`);
        setContenido('facAutorizacion', `${new Date(r.fecha).getTime()}${r.idReserva}1234567890`);
        setContenido('facEmision', r.fecha);
        setContenido('facClienteNombre', nombreCliente);
        setContenido('facClienteCI', cedulaCliente);
        setContenido('facHoras', r.horasContratadas);
        setContenido('facProfesional', `Servicio con: ${r.nombreTrabajador}`);
        setContenido('facPUnitario', `$${(subtotal / r.horasContratadas).toFixed(2)}`);
        setContenido('facPTotalLinea', `$${subtotal.toFixed(2)}`);
        setContenido('facSubtotal', `$${subtotal.toFixed(2)}`);
        setContenido('facIva', `$${(total - subtotal).toFixed(2)}`);
        setContenido('facTotal', `$${total.toFixed(2)}`);

        const modalElement = document.getElementById('modalFactura');
        if (modalElement) {
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        } else {
            Swal.fire({ icon: 'error', title: 'Error interno', text: 'No se encontró el diseño de la factura.' });
        }
    }
}

function irACalificar(idReserva) {
    localStorage.setItem('reservaACalificar', idReserva);
    window.location.href = "calificar.html";
}

function cancelarReserva(idReserva) {
    Swal.fire({
        title: '¿Cancelar el servicio?',
        text: "Esta acción no se puede deshacer. Se emitirá el reembolso correspondiente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cancelar servicio',
        cancelButtonText: 'Volver'
    }).then((result) => {
        if (result.isConfirmed) {
            let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            let index = reservas.findIndex(r => r.idReserva == idReserva);
            
            if (index !== -1) {
                reservas[index].estado = 'Cancelado';
                localStorage.setItem('reservas', JSON.stringify(reservas));
                
                Swal.fire(
                    '¡Cancelado!',
                    'El servicio ha sido cancelado exitosamente.',
                    'success'
                ).then(() => {
                    location.reload();
                });
            }
        }
    });
}

// ==========================================
// PARCHE DE SEGURIDAD GLOBAL
// ==========================================

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnCerrarSesion') {
        e.preventDefault();

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Tendrás que volver a ingresar tus datos para entrar.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0F265C',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('usuarioActual');
                    window.location.href = 'index.html'; 
                }
            });
        } else {
            if(confirm("¿Estás seguro de cerrar sesión?")) {
                localStorage.removeItem('usuarioActual');
                window.location.href = 'index.html'; 
            }
        }
    }
});

document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'formSugerencias') {
        e.preventDefault();

        const nombre = document.getElementById('sugNombre') ? document.getElementById('sugNombre').value : 'Usuario';
        const correo = document.getElementById('sugCorreo') ? document.getElementById('sugCorreo').value.trim() : 'sin@correo.com';
        const mensaje = document.getElementById('sugMensaje') ? document.getElementById('sugMensaje').value : 'Sin mensaje';
        
        const nuevaSugerencia = {
            id: Date.now(),
            nombre: nombre,
            correo: correo,
            mensaje: mensaje,
            fecha: new Date().toLocaleDateString()
        };
        
        const sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];
        sugerencias.push(nuevaSugerencia);
        localStorage.setItem('sugerencias', JSON.stringify(sugerencias));

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Hemos recibido tu sugerencia correctamente.',
                confirmButtonColor: '#0F265C'
            }).then(() => {
                e.target.reset();
            });
        } else {
            alert("¡Mensaje enviado exitosamente!");
            e.target.reset();
        }
    }
});