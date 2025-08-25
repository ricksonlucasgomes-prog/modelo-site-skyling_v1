import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

// Este é um novo componente que pode criar num ficheiro separado,
// por exemplo, 'src/LocationButton.jsx'

export default function LocationButton() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    // Verifica se a geolocalização é suportada pelo navegador
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLoading(true);
    setError('');

    // Pede a localização ao navegador
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false);
        console.log(`Localização obtida: Lat ${latitude}, Lon ${longitude}`);
        // Aqui, você poderia usar outra API (como a do Google Maps)
        // para converter estas coordenadas num endereço de rua.
      },
      (err) => {
        setError(`Não foi possível obter a localização: ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800 text-white rounded-lg">
      <button
        onClick={handleGetLocation}
        disabled={loading}
        className="bg-[#FFD700] text-[#0D0D0D] font-bold py-3 px-6 rounded-full flex items-center space-x-2 disabled:bg-gray-500"
      >
        <MapPin size={20} />
        <span>{loading ? 'A obter localização...' : 'Partilhar Localização Precisa'}</span>
      </button>

      {location && (
        <div className="mt-4 text-center">
          <p className="font-bold text-green-400">Localização obtida com sucesso!</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-center">
          <p className="font-bold text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
