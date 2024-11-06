import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export class AuthController {
  constructor() {
    this.initializeGoogleStrategy();
    this.initializePassport()
  }

  // Metode untuk menginisialisasi Google OAuth Strategy
  private initializeGoogleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: 'http://localhost:8000/api/auth/google/callback',
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
                    return done(new Error("Email tidak tersedia di profil Google"), undefined);
                  }
            let user = await prisma.user.findUnique({
              where: { googleId: profile.id },
            });
            if (!user) {
              user = await prisma.user.create({
                data: {
                  googleId: profile.id,
                  email: email,
                  name: profile.displayName,
                  avatarUrl: avatarUrl
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
    })

    passport.deserializeUser(async (id: number, done: Function) => {
        const user = await prisma.user.findUnique({
            where: { id: id },
        })
        done(null, user);
    })
  }

  googleCallback(req: Request, res: Response): void {
    try {
        if (!req.user) {
            res.status(400).send({
                status: 'error',
                msg: 'Authentication failed'
            })
        }
        res.redirect("http://localhost:3000")
    } catch (error) {
        res.status(500).send({
            status: 'error',
            msg: 'Internal Server Error'
        })
    }
    
    }

    googleAuth = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("google", {
            scope: ["profile", "email"]
        })(req, res, next);
    }
}
