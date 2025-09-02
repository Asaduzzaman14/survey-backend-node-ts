// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const defaultSettings = [
//   {
//     key: 'charge',
//     value: '2',
//     description: 'Transaction charge percentage',
//   },
//   {
//     key: 'minDeposit',
//     value: '100',
//     description: 'Minimum deposit amount',
//   },
//   {
//     key: 'minWithdraw',
//     value: '5000',
//     description: 'Maximum withdraw limit',
//   },
//   {
//     key: 'minConvart',
//     value: '5000',
//     description: 'Maximum withdraw limit',
//   },
// ];

// async function main() {
//   for (const setting of defaultSettings) {
//     const exists = await prisma.siteSettings.findUnique({
//       where: { key: setting.key },
//     });

//     if (!exists) {
//       await prisma.siteSettings.create({ data: setting });
//       console.log(`✅ Created: ${setting.key}`);
//     } else {
//       console.log(`⚠️ Already exists: ${setting.key}`);
//     }
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect();
//   });
