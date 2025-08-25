// api/getIp.js

export default function handler(request, response) {
  // A Vercel fornece o IP do visitante no cabeçalho 'x-forwarded-for'
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  
  // Esta linha regista o IP nos logs do servidor da Vercel
  console.log('Visitante com IP:', ip); 

  // Esta linha envia o IP de volta para o navegador (para o console do F12)
  response.status(200).json({ ip });
}
