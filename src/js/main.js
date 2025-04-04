const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const app = document.querySelector('#app');
const mapDiv = document.createElement('div');

mapDiv.textContent = 'Hola Mundo'
app.appendChild(mapDiv);

async function buscarLugar(placeName) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
  
      const data = await response.json();
      console.log('Resultado de Google Places API:', data);
    } catch (error) {
      console.error('Hubo un error al hacer la solicitud:', error);
    }
  }
  
  // Ejemplo de uso:
  buscarLugar('Torre Eiffel');