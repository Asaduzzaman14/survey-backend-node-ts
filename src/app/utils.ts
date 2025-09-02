import prisma from '../shared/prisma';

export const findAdminByEmail = async (email: string) => {
  const user = await prisma.admins.findFirst({
    where: { email: email },
  });
  return user;
};

// const test = async () => {

//   await prisma.payments.updateMany({
//     where: { status: "APPRIVED" as any },
//     data: { status: "APPROVED" },
//   });
//   console.log("succces");

// }
// test()
