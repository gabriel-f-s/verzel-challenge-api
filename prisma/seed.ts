import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const defaultPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  // 1. Criando Organizador
  const organizador = await prisma.user.create({
    data: {
      name: 'Verzel Organizador',
      email: 'organizador@verzel.com',
      passwordHash,
      role: 'ORGANIZADOR',
    },
  });
  console.log(`Organizador criado: ${organizador.email}`);

  // 2. Criando Clientes
  const cliente1 = await prisma.user.create({
    data: {
      name: 'John Wick da Silva',
      email: 'cliente1@verzel.com',
      passwordHash,
      role: 'CLIENTE',
    },
  });
  const cliente2 = await prisma.user.create({
    data: {
      name: 'Harry Potter Costa',
      email: 'cliente2@verzel.com',
      passwordHash,
      role: 'CLIENTE',
    },
  });
  console.log(`Clientes criados: ${cliente1.email}, ${cliente2.email}`);

  // 3. Criando Portaria
  const portaria = await prisma.user.create({
    data: {
      name: 'Zeca Portaria',
      email: 'portaria@verzel.com.br',
      passwordHash,
      role: 'PORTARIA',
    },
  });
  console.log(`Portaria criada: ${portaria.email}`);

  // 4. Criando Evento Publicado (Com Ingressos Disponíveis)
  const dataEvento = new Date();
  dataEvento.setDate(dataEvento.getDate() + 30); // Evento para daqui a 30 dias

  const evento = await prisma.event.create({
    data: {
      organizerId: organizador.id,
      externalApiId: '157336',
      externalSource: 'TMDB',
      title: 'Interestelar',
      description:
        'As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado de Brand, Jenkins e Doyle, ele seguirá em busca de um novo lar.',
      imageUrl:
        'https://image.tmdb.org/t/p/w500/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg',
      location: 'Cine Verzel - Sala 1',
      date: dataEvento,
      type: 'SEATED',
      capacity: 48,
      price: 65,
    },
  });
  console.log(`Evento semeado: ${evento.title} (${evento.type})`);

  console.log('Seeding concluído com sucesso!');
  console.log(`
--- DADOS DE LOGIN ---
Senhas para todos os usuários: ${defaultPassword}

Organizador: organizador@verzel.com.br
Cliente 1: joao@cliente.com
Cliente 2: maria@cliente.com
Portaria: portaria@verzel.com.br
----------------------
  `);
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
