import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { generateReferralCode } from '@/helpers/referral';
import { sign, verify } from 'jsonwebtoken';

export class AuthController {
  constructor() {
    this.initializeGoogleStrategy();
    this.initializePassport();
  }

  // Metode untuk menginisialisasi Google OAuth Strategy
  private initializeGoogleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `${process.env.BASE_URL_API}auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : null;
            const avatarUrl =
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null;

            if (!email) {
              return done(
                new Error('Email tidak tersedia di profil Google'),
                undefined,
              );
            }
            let user = await prisma.user.findUnique({
              where: { email: email },
            });
            if (user) {
              if (!user.googleId) {
                user = await prisma.user.update({
                  where: { email: email },
                  data: { googleId: profile.id, avatarUrl: avatarUrl },
                });
              }
            } else {
              const referralCode = generateReferralCode(profile.displayName);
              user = await prisma.user.create({
                data: {
                  googleId: profile.id,
                  email: email,
                  name: profile.displayName,
                  avatarUrl: avatarUrl,
                  isVerified: true,
                  referralCode: referralCode,
                  checkout: { create: {} },
                  cart: { create: {} },
                },
                
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );
  }

  private initializePassport() {
    passport.serializeUser((user: any, done: Function) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done: Function) => {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      done(null, user);
    });
  }

  googleCallback(req: Request, res: Response): void {
    try {
      if (!req.user) {
        res.status(400).send({
          status: 'error',
          msg: 'Authentication failed',
        });
      }

      const payload = { id: req.user?.id, role: req.user?.role };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '2w' });
      res.redirect(`http://localhost:3000/passwordless?token=${token}`);
    } catch (error) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal Server Error',
      });
    }
  }

  googleAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  };

  async getUserAuth(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ msg: 'No token provided' });

      const decoded = verify(token, process.env.SECRET_JWT!) as { id: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          address: true,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json({ user });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
}
