import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { prisma } from "./db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.users.findUnique({ where: { user_id: id } });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.id) return done(null, false);

        let user = await prisma.users.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = await prisma.users.create({
            data: {
              google_id: profile.id,
              username: profile.emails[0].value.split("@")[0],
              fullname: profile.displayName ? profile.displayName : "",
              email: profile.emails[0].value,
              profile_pic: profile.photos[0].value,
              password: hashedPassword,
              is_verified: true,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
