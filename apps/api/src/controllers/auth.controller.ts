import { generateReferralCode } from '@/helpers/referral';
import prisma from '@/prisma';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

export class AuthController {
  async googleAuthCallback(req: Request, res: Response) {
    try {
      const { code } = req.body;

      console.log("Authorization code received by server:", code); // debugging


      if (!code) throw new Error('Authorization code is missing');
      const tokenResponse = await fetch('https://oauth.googleapis.com/token', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
      });
      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Failed to fetch access token');
    }

      if (tokenData.access_token) {

        
        const userResponse = await fetch(
          'https://www.googleapis.com/oauth/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          },
        );
        const userData = await userResponse.json();

        let user = await prisma.user.findUnique({
          where: { googleId: userData.id },
        });

        if (!user) {
          const referralCode = generateReferralCode(userData.name);
          user = await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              avatarUrl: userData.picture,
              googleId: userData.id,
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
              referralCode: referralCode,
              isVerified: true
            },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
            },
          });
        }

        const payload = { id: user.id, role: user.role };
        const token = sign(payload, process.env.SECRET_JWT!, {
          expiresIn: '2w',
        });

        res.status(201).send({
          status: 'ok',
          msg: 'Login berhasil',
          token,
          user,
        });
      } throw new Error('Gagal mengambil token akses dari Google')
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err || 'An error occured',
      });
    }
  }
}
