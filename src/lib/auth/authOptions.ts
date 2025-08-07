import { NextAuthOptions, User } from 'next-auth'

import { compare } from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '../prisma'

export const authOptions: NextAuthOptions = {
  providers: [

CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Senha', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null
    }

    const user = await client.user.findUnique({
      where: {
        email: credentials.email,
      },
    })

    if (!user) {
      return null
    }

    const passwordIsCorrect = await compare(
      credentials.password,
      user.password,
    )

    if (passwordIsCorrect) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || '',
        // Adicione outros campos que você queira na sessão
      }
    }

    return null
  },
}),
  ],
  callbacks: {
    async session({ session, token }) {
      const userPrisma = await client.user.findUnique({
        where: {
          id: token.sub,
        },
      })

      if (userPrisma) {
        const userSession: User = {
          ...session.user,
          id: userPrisma.id,
          name: userPrisma.name,
          email: userPrisma?.email || '',
          profilePicture: userPrisma.profilePicture || '',
        }
        session.user = userSession
        return session
      }

      const userSession: User = {
        ...session.user,
        id: token.sub!,
      }
      session.user = userSession
      return session
    },
  },
}