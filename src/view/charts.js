document.addEventListener("DOMContentLoaded", function(){
    const chartType = document.getElementById("chartType");

    new Chart(chartType, {
        type: 'doughnut',
        data: {
          labels: ['Ingresos', 'Gastos'],
          datasets: [{
            label: 'Total de transacciones',
            data: [7, 6],
            borderWidth: 1,
            backgroundColor: ['rgb(76, 175, 80)', 'rgb(244, 67, 54)']
          }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {  
                    position: "bottom",// Coloca la leyenda en la parte superior
                    labels: {
                        padding: 30,  // Padding general entre las etiquetas
                    }
                }
            },
            layout: {
                padding: {
                    top: 10
                }
            }
        }
      });

});