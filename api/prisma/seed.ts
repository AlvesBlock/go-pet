import { PrismaClient, DriverStatus, DriverCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const drivers = [
    {
      name: 'Camila Duarte',
      email: 'camila.duarte@gopet.com',
      phone: '+55 11 99999-1111',
      cnhNumber: '1234567890',
      cnhExpiresAt: new Date('2027-03-15'),
      vehicleModel: 'Doblò Adventure 2022',
      vehiclePlate: 'FHP2B19',
      vehicleYear: 2022,
      categories: ['PLUS', 'SUV', 'VET'] as DriverCategory[],
      equipments: ['Caixa universal', 'Cintos pet M/G', 'Spray enzimático', 'Manta térmica'],
      trainingCompletedAt: new Date('2024-08-10'),
      cnhDocumentUrl: 'https://example.com/docs/camila-cnh.jpg',
      profilePhotoUrl: 'https://example.com/photos/camila.jpg',
      status: DriverStatus.APPROVED,
    },
    {
      name: 'Rafael Nunes',
      email: 'rafael.nunes@gopet.com',
      phone: '+55 11 98888-2222',
      cnhNumber: '9876543210',
      cnhExpiresAt: new Date('2026-11-02'),
      vehicleModel: 'Spin LTZ 2021',
      vehiclePlate: 'GVX3F12',
      vehicleYear: 2021,
      categories: ['BASIC', 'PLUS'] as DriverCategory[],
      equipments: ['Cintos pet P', 'Forro impermeável', 'Kit limpeza'],
      trainingCompletedAt: new Date('2024-06-05'),
      cnhDocumentUrl: 'https://example.com/docs/rafael-cnh.jpg',
      profilePhotoUrl: 'https://example.com/photos/rafael.jpg',
      status: DriverStatus.APPROVED,
    },
    {
      name: 'Juliana Prado',
      email: 'juliana.prado@gopet.com',
      phone: '+55 11 97777-3333',
      cnhNumber: '1122334455',
      cnhExpiresAt: new Date('2028-01-20'),
      vehicleModel: 'Renegade 2023',
      vehiclePlate: 'GZF8A88',
      vehicleYear: 2023,
      categories: ['SUV', 'VET'] as DriverCategory[],
      equipments: ['Rampas para idosos', 'Monitor temperatura', 'Manta vet'],
      trainingCompletedAt: new Date('2024-09-12'),
      cnhDocumentUrl: 'https://example.com/docs/juliana-cnh.jpg',
      profilePhotoUrl: 'https://example.com/photos/juliana.jpg',
      status: DriverStatus.APPROVED,
    },
  ];

  await prisma.driver.deleteMany();
  await prisma.driver.createMany({ data: drivers });
  await prisma.driver.updateMany({
    data: {
      applicationNotes: 'Checklist em andamento',
      applicationHistory: ['Cadastro recebido', 'Checklist validado'],
    },
  });

  console.log(`Seeded ${drivers.length} drivers`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
