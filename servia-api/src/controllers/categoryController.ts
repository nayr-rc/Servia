import { Request, Response } from 'express'
import { pool } from '../config/database'

export async function getCategories(_req: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name')
    res.json({ data: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categorias' })
  }
}

export async function logContact(req: Request, res: Response) {
  const { id } = req.params
  const { channel = 'whatsapp' } = req.body
  const userId = req.user?.userId ?? null

  try {
    await pool.query(
      'INSERT INTO contacts (provider_id, user_id, channel) VALUES ($1, $2, $3)',
      [id, userId, channel]
    )
    res.status(201).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar contato' })
  }
}

export async function getDashboard(req: Request, res: Response) {
  const userId = req.user!.userId
  try {
    const provider = await pool.query(
      'SELECT id FROM providers WHERE user_id = $1',
      [userId]
    )
    if (!provider.rows[0]) {
      res.status(404).json({ error: 'Perfil não encontrado' })
      return
    }
    const pid = provider.rows[0].id

    const [views, contacts, reviewsAvg] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM contacts WHERE provider_id = $1', [pid]),
      pool.query(
        "SELECT COUNT(*) FROM contacts WHERE provider_id = $1 AND created_at > NOW() - INTERVAL '30 days'",
        [pid]
      ),
      pool.query('SELECT avg_rating, review_count FROM providers WHERE id = $1', [pid]),
    ])

    res.json({
      data: {
        total_contacts: Number(views.rows[0].count),
        contacts_last_30_days: Number(contacts.rows[0].count),
        avg_rating: reviewsAvg.rows[0]?.avg_rating ?? 0,
        review_count: reviewsAvg.rows[0]?.review_count ?? 0,
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do painel' })
  }
}
