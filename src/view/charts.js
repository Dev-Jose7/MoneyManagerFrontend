
function generateChart(container, graph, label, value) {
    let side = "";
    let info = "";
    let colorLabel = [];
    container.innerHTML = "";

    // Crear el canvas y aplicarle estilo para que sea responsive
    let canvas = document.createElement("canvas");
    canvas.classList.add("chart-element");
    canvas.style.width = "100%";
    canvas.style.height = window.innerWidth < 768 ? "80vh" : "60vh"; // 50vh en dispositivos móviles
    container.overflow = "scroll"
    container.appendChild(canvas);

    // // Configuración del lado de la leyenda según el tipo de gráfico
    // side = (graph === "pie") ? "right" : "bottom";

    // Texto de la leyenda basada en el valor máximo
    info = (value[0] > 1000) ? "Valor por transacciones" : "Cantidad de transacciones";

    // Color personalizado de ingreso y gasto o asignación aleatoria si no es predefinido
    if (label.includes("Ingreso")) {
        colorLabel = ['rgba(76, 175, 80, 0.7)', 'rgba(255, 0, 0, 0.8)'];
    } else {
        colorLabel = selectColor(label.length);
    }

    // Inicialización de la instancia de Chart con opciones responsivas y padding adecuado
    const chart = new Chart(canvas, {
        type: graph,
        data: {
            labels: label,
            datasets: [{
                label: info,
                data: value,
                borderWidth: 1,
                backgroundColor: colorLabel
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite ajustar el alto dinámicamente
            aspectRatio: 2, // Desactiva el aspect ratio fijo para ajustar el alto dinámicamente
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 30,
                    }
                }
            },
            layout: {
                padding: {
                    top: 10
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) { // Si se hizo clic en un elemento
                    const elementIndex = elements[0].index; // Obtener el índice del elemento clickeado
                    const clickedLabel = chart.data.labels[elementIndex]; // Obtener la etiqueta del eje x
                    const clickedValue = chart.data.datasets[0].data[elementIndex]; // Obtener el valor de la barra clickeada
    
                    // Realiza alguna acción con la información obtenida
                    alert(`Etiqueta: ${clickedLabel}, Valor: ${clickedValue}`);
                }
            }
        }
    });
}

let objectColor = {
    blue: "rgba(53,161,235,0.7)",
    pink: "rgba(254,100,131,0.7)",
    orange: "rgba(255,159,64,0.7)",
    yellow: "rgba(255,205,86,0.7)",
    green: "rgba(76,193,192,0.7)",
    purple: "rgba(154,102,255,0.7)",
    brown: "rgba(165, 42, 42, 0.7)",
    gray: "rgba(201,203,206,0.7)",
    black: "rgba(0, 0, 0, 0.7)"
};

function selectColor(num) {
    let array = [];
    for (let color in objectColor) {
        array.push(objectColor[color]);
    }

    // Si la cantidad de colores es mayor que los colores en objectColor, agrega colores aleatorios
    return num > Object.keys(objectColor).length ? ramdomRGB(num - Object.keys(objectColor).length, array) : array;
}

function ramdomRGB(num, array) {
    for (let i = 0; i < num; i++) {
        array.push(`rgba(${ramdom(256)}, ${ramdom(256)}, ${ramdom(256)}, 1)`);
    }
    return array;
}

function ramdom(max) {
    return Math.floor(Math.random() * max).toString();
}
