import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";
import { connectToDatabase } from "@/lib/mongodb";
import { Agent } from "@/models/Agent";

type AgentRow = {
  _id: unknown;
  email: string;
  password_hash: string;
  name?: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        await connectToDatabase();
        const agent = await Agent.findOne({ email })
          .select("+password_hash")
          .lean<AgentRow | null>();

        if (!agent) return null;

        const ok = await bcrypt.compare(password, agent.password_hash);
        if (!ok) return null;

        return {
          id: String(agent._id),
          email: agent.email,
          name: agent.name ?? null,
        };
      },
    }),
  ],
});
