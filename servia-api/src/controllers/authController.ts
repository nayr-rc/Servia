import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database'

export async function register(req: Request, res: Response) {
  const { name, email, password, role = 'client' } = req.body

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (exists.rowCount && exists.rowCount > 0) {
      res.status(409).json({ error: 'E-mail já cadastrado' })
      return
    }

    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hash, role]
    )

    const user = result.rows[0]
    const token = generateToken(user.id, user.role)

    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, password_hash, avatar_url FROM users WHERE email = $1',
      [email]
    )

    const user = result.rows[0]
    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha inválidos' })
      return
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'E-mail ou senha inválidos' })
      return
    }

    const { password_hash, ...userSafe } = user
    const token = generateToken(user.id, user.role)

    res.json({ user: userSafe, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

export async function me(req: Request, res: Response) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1',
      [req.user!.userId]
    )
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Usuário não encontrado' })
      return
    }
    res.json({ user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}

function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  )
}
