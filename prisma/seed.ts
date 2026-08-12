import { PrismaClient, Role, EventType, TicketStatus, ExternalSource } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Limpeza de dados pré-existentes para garantir idempotência
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 2. Criação dos Usuários Obrigatórios
  console.log('👤 Seeding users...');
  
  const organizer = await prisma.user.create({
    data: {
      name: 'Carlos Organizador',
      email: 'organizador@verzel.com',
      passwordHash: defaultPassword,
      role: Role.ORGANIZADOR,
    },
  });

  const client1 = await prisma.user.create({
    data: {
      name: 'Ana Cliente',
      email: 'cliente1@verzel.com',
      passwordHash: defaultPassword,
      role: Role.CLIENTE,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: 'Bruno Silva',
      email: 'cliente2@verzel.com',
      passwordHash: defaultPassword,
      role: Role.CLIENTE,
    },
  });

  const portaria = await prisma.user.create({
    data: {
      name: 'Marcos Portaria',
      email: 'portaria@verzel.com',
      passwordHash: defaultPassword,
      role: Role.PORTARIA,
    },
  });

  console.log(`✅ Users created:
    - Organizador: ${organizer.email}
    - Cliente 1: ${client1.email}
    - Cliente 2: ${client2.email}
    - Portaria: ${portaria.email}
    (Senha padrão para todos: Password123!)`);

  // 3. Criação dos Eventos Obrigatórios (com assento e pista)
  console.log('🎭 Seeding events...');

  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 7);
  futureDate1.setHours(20, 0, 0, 0);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 14);
  futureDate2.setHours(21, 30, 0, 0);

  // Evento 1: Cinema / Mapa de Assentos
  const eventCinema = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      externalApiId: '157336', // TMDb Movie ID (Interstellar)
      externalSource: ExternalSource.TMDB,
      title: 'Interstellar - Sessão Especial IMAX',
      description: 'Uma jornada épica pelo espaço sideral em busca de um novo lar para a humanidade. Exibição especial em resolução 4K com som imersivo.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      location: 'Cineplex IMAX - Sala 1 (Av. Paulista, 1000)',
      date: futureDate1,
      type: EventType.SEATED,
      capacity: 60,
      price: 45.0,
    },
  });

  // Evento 2: Show / Pista (General Admission)
  const eventShow = await prisma.event.create({
    data: {
      organizerId: organizer.id,
      externalApiId: 'K8vZ9171C_f', // Ticketmaster Event ID
      externalSource: ExternalSource.TICKETMASTER,
      title: 'Coldplay - Music of the Spheres Tour',
      description: 'Show completo da turnê mundial do Coldplay com efeitos visuais deslumbrantes, pulseiras de LED e os maiores sucessos da banda.',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      location: 'Estádio Morumbi - São Paulo/SP',
      date: futureDate2,
      type: EventType.GENERAL,
      capacity: 2500,
      price: 280.0,
    },
  });

  console.log(`✅ Events created:
    - "${eventCinema.title}" (Assentos, Preço: R$ ${eventCinema.price})
    - "${eventShow.title}" (Pista, Preço: R$ ${eventShow.price})`);

  // 4. Ingressos de Exemplo para Teste Imediato dos Fluxos
  console.log('🎟️ Seeding sample tickets...');

  // Helper para gerar assinatura de QR code
  const generateSignature = (ticketId: string, eventId: string) => {
    const secret = process.env.QR_SIGNING_SECRET || 'verzel_qr_hmac_secret_signing_key_2026';
    return crypto.createHmac('sha256', secret).update(`${ticketId}:${eventId}`).digest('hex');
  };

  // Ticket 1: Pago e Válido para Ana Cliente (Assento C5) - Pronto para Portaria ler
  const ticket1Id = crypto.randomUUID();
  const ticket1 = await prisma.ticket.create({
    data: {
      id: ticket1Id,
      eventId: eventCinema.id,
      clientId: client1.id,
      seatNumber: 'C5',
      qrCodeSignature: generateSignature(ticket1Id, eventCinema.id),
      shareToken: crypto.randomUUID(),
      status: TicketStatus.PAID,
    },
  });

  // Ticket 2: Já validado pela Portaria (Assento C6) - Para testar "Ingresso já utilizado"
  const ticket2Id = crypto.randomUUID();
  const ticket2 = await prisma.ticket.create({
    data: {
      id: ticket2Id,
      eventId: eventCinema.id,
      clientId: client2.id,
      seatNumber: 'C6',
      qrCodeSignature: generateSignature(ticket2Id, eventCinema.id),
      shareToken: crypto.randomUUID(),
      status: TicketStatus.VALIDATED,
      validatedAt: new Date(),
      validatedById: portaria.id,
    },
  });

  console.log(`✅ Tickets created:
    - Ticket Válido (Ana): ${ticket1.id} (Assento ${ticket1.seatNumber}) - Share Token: ${ticket1.shareToken}
    - Ticket Já Validado (Bruno): ${ticket2.id} (Assento ${ticket2.seatNumber}) - Status: ${ticket2.status}`);

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
