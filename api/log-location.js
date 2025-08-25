// api/log-location.js

export default function handler(request, response) {
  // Apenas permite que este endpoint seja acedido com o método POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas o método POST é permitido' });
  }

  try {
    // Pega nas coordenadas e no IP do visitante
    const { latitude, longitude } = request.body;
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    // Monta o objeto de dados completo
    const locationData = {
      ip,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    };

    // A LINHA MAIS IMPORTANTE: Regista os dados nos Logs da Vercel
    console.log('Localização Precisa Recebida:', locationData);

    // Envia uma resposta de sucesso de volta para o site
    response.status(200).json({ success: true, data: locationData });
  } catch (error) {
    console.error('Erro ao registar a localização:', error);
    response.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
