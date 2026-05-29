import { Request, Response } from 'express'
import { pool } from '../config/database'

export async function getReviews(req: Request, res: Response) {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.provider_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    )
    res.json({ data: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar avaliações' })
  }
}

export async function createReview(req: Request, res: Response) {
  const { id } = req.params
  const { rating, comment } = req.body
  const userId = req.user!.userId

  try {
    const providerCheck = await pool.query('SELECT id, user_id FROM providers WHERE id = $1', [id])
    if (!providerCheck.rows[0]) {
      res.status(404).json({ error: 'Prestador não encontrado' })
      return
    }
    if (providerCheck.rows[0].user_id === userId) {
      res.status(400).json({ error: 'Você não pode avaliar seu próprio perfil' })
      return
    }

    const result = await pool.query(
      `INSERT INTO reviews (provider_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, userId, rating, comment]
    )
    res.status(201).json({ data: result.rows[0] })
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Você já avaliou este prestador' })
      return
    }
    res.status(500).json({ error: 'Erro ao criar avaliação' })
  }
}
