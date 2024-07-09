import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error('Invalid email or password');
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error('Invalid email or password');
        }
        return user;
      },
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
    encode: async ({ token }) => {
      const jwtClaims = {
        sub: token.sub.toString(),
        name: token.name,
        email: token.email,
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      const encodedToken = jwt.sign(jwtClaims, process.env.JWT_SECRET, { algorithm: 'HS256' });
      return encodedToken;
    },
    decode: async ({ token }) => {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken;
    },
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user = token;
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);

export async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    // Generate a token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send the token in the response
    return res.status(201).json({ token });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
