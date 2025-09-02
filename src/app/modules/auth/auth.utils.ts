/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';

// code generate
export function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

type jwtpaylode = {
  id: string;
  role: string;
};

export const createToken = (
  payloadData: jwtpaylode,
  secret: Secret,
  expiresIn: string,
) => {
  const token = jwt.sign(payloadData, secret, {
    expiresIn,
  });
  return token;
};

export const generateUniqueReferralCode = async (): Promise<string> => {
  let newCode: string;
  let existingCode: User | null;

  do {
    newCode = generateUniqueCode();
    existingCode = await prisma.user.findUnique({
      where: { myReferralCode: newCode },
    });
  } while (existingCode);

  return newCode;
};

// export const createToken = (payloadData: jwtpaylode, secret: Secret,
//   expiresIn: string, ) => {
//   const token = jwt.sign(payloadData, secret, {
//     expiresIn: '365d',
//   });
//   return token;
// };

//  55 - 195

export const updateReferrerWalletAndCount = async (
  transactionClient: any,
  user: any, // newly created user
  userReffer: any, // new user's top referrer
): Promise<void> => {
  // 1. get 3 level users
  // 2, send bonus to native wallet
  // 3. save history for user

  // userReffer from reffer code is give user

  // 1. find all avobe the user using myReferralCode in my reffercode
  const rcmAndSignUpBonus = await transactionClient.rcmSetting.findFirst();

  const referringUsers: any[] = [];
  let currentReferralCodeS = userReffer.myReferralCode;

  // Loop to find all referring users
  while (currentReferralCodeS) {
    const referringUser = await transactionClient.user.findFirst({
      where: { myReferralCode: currentReferralCodeS },
      select: {
        id: true,
        email: true,
        myReferralCode: true,
        referralCode: true,
        referralCount: true,
      },
    });

    if (referringUser) {
      const updateCount = await transactionClient.user.update({
        where: { id: referringUser.id },
        data: { referralCount: referringUser.referralCount + 1 },
      });
      console.log(updateCount, 'updateCount');

      if (
        updateCount.referralCount >= rcmAndSignUpBonus.teamSize &&
        !updateCount.isRcm
      ) {
        console.log(updateCount, 'rem user 1');

        const countDirectReffer = await transactionClient.user.count({
          where: {
            referralCode: updateCount.myReferralCode,
          },
        });
        console.log(countDirectReffer, 'countDirectReffer');

        if (countDirectReffer >= rcmAndSignUpBonus.targetedRefer) {
          // console.log('find rcm');
          // update to rcm
          await transactionClient.user.update({
            where: {
              id: updateCount.id,
            },
            data: {
              isRcm: true,
            },
          });

          // sitrtibute rcm bonus
          await transactionClient.wallet.update({
            where: { userId: updateCount.id },
            data: {
              icoWallet: { increment: rcmAndSignUpBonus.targetedReferBonus },
            },
          });

          // save history
          await transactionClient.transactionHistory.create({
            data: {
              amount: rcmAndSignUpBonus.targetedReferBonus,
              bonusFrom: 'RCM reword',
              charge: 0,
              userId: updateCount.id,
            },
          });
        }
      }

      referringUsers.push(referringUser);
      currentReferralCodeS = referringUser.referralCode;
    } else {
      break;
    }
  }

  // 1. get 3 level users
  // Loop to find up to three levels of referred users

  const referredUsers: any[] = [];
  let currentReferralCode = userReffer.myReferralCode;
  for (let level = 0; level < 3; level++) {
    const referredUser = await transactionClient.user.findUnique({
      where: { myReferralCode: currentReferralCode },
      select: {
        id: true,
        email: true,
        myReferralCode: true,
        referralCode: true,
      },
    });

    if (referredUser) {
      referredUsers.push(referredUser);
      currentReferralCode = referredUser.referralCode;
    } else {
      break;
    }
  }

  const bonusLevels = [
    rcmAndSignUpBonus?.levelOne || 0,
    rcmAndSignUpBonus?.levelTwo || 0,
    rcmAndSignUpBonus?.levelThree || 0,
  ];

  const bonusPromises = referredUsers.map((referredUser, index) => {
    const bonusAmount = bonusLevels[index];
    const userId = referredUser.id;

    return Promise.all([
      transactionClient.wallet.update({
        where: { userId: userId },
        data: { nativeWallet: { increment: bonusAmount } },
      }),
      transactionClient.transactionHistory.create({
        data: {
          amount: bonusAmount,
          bonusFrom: user.email,
          charge: 0,
          userId: userId,
        },
      }),
    ]);
  });

  await Promise.all(bonusPromises);
};
