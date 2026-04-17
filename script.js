// Base de datos de complejidad
const complejidades = {
    'simple': {
        min: 50,
        max: 80,
        palabras: ['contacto', 'blog', 'portfolio simple', 'landing page', 'presentación']
    },
    'intermedia': {
        min: 80,
        max: 140,
        palabras: ['tienda', 'e-commerce pequeño', 'servicio', 'reservas', 'citas', 'formularios']
    },
    'compleja': {
        min: 140,
        max: 200,
        palabras: ['base de datos', 'sistema', 'plataforma', 'app web', 'integraciones', 'complejo']
    }
};

const tipoCambio = 450; // 1 USD = 450 ARS (ajustar según el cambio actual)

function sendMessage(mensaje = null) {
    const input = document.getElementById('userInput');
    const mensaje_usuario = mensaje || input.value.trim();

    if (!mensaje_usuario) return;

    // Mostrar mensaje del usuario
    agregarMensajeAlChat(mensaje_usuario, 'user');
    input.value = '';

    // Procesar con IA después de un pequeño delay
    setTimeout(() => {
        procesarConIA(mensaje_usuario);
    }, 500);
}

function agregarMensajeAlChat(texto, tipo) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;

    const p = document.createElement('p');
    p.textContent = texto;
    messageDiv.appendChild(p);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function procesarConIA(texto) {
    // Análisis de complejidad
    const textoLower = texto.toLowerCase();
    let complejidad = 'intermedia';
    let confianza = 0;

    // Analizar palabras clave
    for (let nivel in complejidades) {
        const puntuacion = complejidades[nivel].palabras.filter(palabra =>
            textoLower.includes(palabra)
        ).length;

        if (puntuacion > 0 && puntuacion > confianza) {
            complejidad = nivel;
            confianza = puntuacion;
        }
    }

    // Si no hay coincidencias claras, evaluar por longitud y complejidad del texto
    if (confianza === 0) {
        if (textoLower.length < 50) {
            complejidad = 'simple';
        } else if (textoLower.length < 150) {
            complejidad = 'intermedia';
        } else {
            complejidad = 'compleja';
        }
    }

    // Generar precio
    const rango = complejidades[complejidad];
    const precioDolar = Math.floor(rango.min + Math.random() * (rango.max - rango.min));
    const precioARS = Math.floor(precioDolar * tipoCambio);

    // Mensaje de la IA
    let respuestaIA = `Perfecto, entiendo que necesitas: "${texto}"\n\n`;
    respuestaIA += `He analizado tu proyecto y lo considero de complejidad "${complejidad.toUpperCase()}".\n\n`;
    respuestaIA += `💰 Mi cotización: $${precioDolar} USD o $${precioARS.toLocaleString('es-AR')} ARS`;

    setTimeout(() => {
        agregarMensajeAlChat(respuestaIA, 'bot');
        mostrarCotizacion(precioDolar, precioARS, texto);
    }, 800);
}

function mostrarCotizacion(precioDolar, precioARS, descripcion) {
    const cotizacionDiv = document.getElementById('cotizacion');
    document.getElementById('precioDolar').textContent = `$${precioDolar}`;
    document.getElementById('precioARS').textContent = `$${precioARS.toLocaleString('es-AR')}`;
    document.getElementById('descripcionProyecto').textContent = `Tu proyecto: ${descripcion}`;

    cotizacionDiv.classList.remove('hidden');
}

function scrollToChat() {
    document.getElementById('eleccion').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('userInput').focus();
}

function mostrarContacto() {
    const numero = '5492617227289';
    const mensaje = `Hola, me interesa tu servicio de diseño web. Vi una cotización de $${document.getElementById('precioDolar').textContent}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Mensaje inicial al cargar
window.addEventListener('load', () => {
    setTimeout(() => {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <p>¡Hola! 👋 Soy tu asistente de IA. Cuéntame sobre tu proyecto:</p>
                <ul class="suggestions">
                    <li onclick="sendMessage('Quiero una página de e-commerce para vender ropa')">E-commerce</li>
                    <li onclick="sendMessage('Necesito una página de servicios profesionales')">Servicios</li>
                    <li onclick="sendMessage('Quiero un portafolio para mostrar mi trabajo')">Portafolio</li>
                    <li onclick="sendMessage('Necesito un sitio web complejo con base de datos')">Complejo</li>
                </ul>
            </div>
        `;
    }, 300);
});
