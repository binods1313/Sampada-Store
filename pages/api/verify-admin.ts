import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

// In-memory rate limiter (for production, use Redis/Upstash)
const attempts = new Map<string, { count: number; resetAt: number }>()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown'
  const now = Date.now()

  // Rate limiting: 5 attempts per 15 minutes per IP
  const record = attempts.get(ip)
  if (record) {
    if (now < record.resetAt && record.count >= 5) {
      const remainingTime = Math.ceil((record.resetAt - now) / 60000)
      return res.status(429).json({
        error: `Too many attempts. Try again in ${remainingTime} minutes.`
      })
    }
    if (now >= record.resetAt) {
      attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    } else {
      record.count++
    }
  } else {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
  }

  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // Verify credentials against environment variables
  const validEmail = email === process.env.ADMIN_EMAIL
  const validPassword = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH || ''
  )

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate JWT token
  const token = jwt.sign(
    { email, role: 'admin', iat: Date.now() },
    process.env.JWT_SECRET || 'change-this-secret',
    { expiresIn: '7d' }
  )

  // Set httpOnly cookie (XSS protection)
  res.setHeader('Set-Cookie', serialize('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }))

  // Reset attempt counter on success
  attempts.delete(ip)

  return res.status(200).json({ success: true })
}
