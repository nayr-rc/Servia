import { Request, Response } from 'express'
import { pool } from '../config/database'

export async function listProviders(req: Request, res: Response) {
  const { city, state, category, search, plan, page = '1', limit = '12' } = req.query

  const offset = (Number(page) - 1) * Number(limit)
  const params: unknown[] = []
  const conditions: string[] = ['p.active = TRUE']

  if (city) {
    params.push(`%${city}%`)
    conditions.push(`p.city ILIKE $${params.length}`)
  }
  if (state) {
    params.push(state)
    conditions.push(`p.state = $${params.length}`)
  }
  if (plan) {
    params.push(plan)
    conditions.push(`p.plan = $${params.length}`)
  }
  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(p.display_name ILIKE $${params.length} OR p.bio ILIKE $${params.length})`)
  }
  if (category) {
    params.push(category)
    conditions.push(`EXISTS (
      SELECT 1 FROM provider_categories pc
      JOIN categories c ON c.id = pc.category_id
      WHERE pc.provider_id = p.id AND c.slug = $${params.length}
    )`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM providers p ${where}`,
      params
    )
    const total = Number(countResult.rows[0].count)

    params.push(Number(limit), offset)
    const result = await pool.query(
      `SELECT
        p.id, p.display_name, p.bio, p.city, p.state,
        p.photo_url, p.plan, p.avg_rating, p.review_count,
        p.verified, p.whatsapp,
        COALESCE(
          json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon))
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) AS categories
       FROM providers p
       LEFT JOIN provider_categories pc ON pc.provider_id = p.id
       LEFT JOIN categories c ON c.id = pc.category_id
       ${where}
       GROUP BY p.id
       ORDER BY
         CASE p.plan WHEN 'pro' THEN 1 WHEN 'destaque' THEN 2 ELSE 3 END,
         p.avg_rating DESC, p.review_count DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    res.json({
      data: result.rows,
      meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar prestadores' })
  }
}

export async function getProvider(req: Request, res: Response) {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT
        p.*,
        u.name AS user_name, u.email AS user_email,
        COALESCE(
          json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon))
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) AS categories
       FROM providers p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN provider_categories pc ON pc.provider_id = p.id
       LEFT JOIN categories c ON c.id = pc.category_id
       WHERE p.id = $1 AND p.active = TRUE
       GROUP BY p.id, u.name, u.email`,
      [id]
    )
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Prestador não encontrado' })
      return
    }
    res.json({ data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar prestador' })
  }
}

export async function createProvider(req: Request, res: Response) {
  const { display_name, bio, city, state, whatsapp, photo_url, category_ids } = req.body
  const userId = req.user!.userId

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const existing = await client.query('SELECT id FROM providers WHERE user_id = $1', [userId])
    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({ error: 'Você já possui um perfil de prestador' })
      return
    }

    const result = await client.query(
      `INSERT INTO providers (user_id, display_name, bio, city, state, whatsapp, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, display_name, bio, city, state, whatsapp, photo_url]
    )
    const provider = result.rows[0]

    if (category_ids?.length) {
      const placeholders = category_ids.map((_: string, i: number) => `($1, $${i + 2})`).join(', ')
      await client.query(
        `INSERT INTO provider_categories (provider_id, category_id) VALUES ${placeholders} ON CONFLICT DO NOTHING`,
        [provider.id, ...category_ids]
      )
    }

    await client.query("UPDATE users SET role = 'provider' WHERE id = $1", [userId])
    await client.query('COMMIT')

    res.status(201).json({ data: provider })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar perfil' })
  } finally {
    client.release()
  }
}

export async function updateProvider(req: Request, res: Response) {
  const { id } = req.params
  const { display_name, bio, city, state, whatsapp, photo_url, category_ids } = req.body
  const userId = req.user!.userId

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const check = await client.query('SELECT id FROM providers WHERE id = $1 AND user_id = $2', [id, userId])
    if (!check.rowCount || check.rowCount === 0) {
      res.status(403).json({ error: 'Sem permissão para editar este perfil' })
      return
    }

    const result = await client.query(
      `UPDATE providers SET
        display_name = COALESCE($1, display_name),
        bio = COALESCE($2, bio),
        city = COALESCE($3, city),
        state = COALESCE($4, state),
        whatsapp = COALESCE($5, whatsapp),
        photo_url = COALESCE($6, photo_url),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [display_name, bio, city, state, whatsapp, photo_url, id]
    )

    if (category_ids) {
      await client.query('DELETE FROM provider_categories WHERE provider_id = $1', [id])
      if (category_ids.length > 0) {
        const placeholders = category_ids.map((_: string, i: number) => `($1, $${i + 2})`).join(', ')
        await client.query(
          `INSERT INTO provider_categories (provider_id, category_id) VALUES ${placeholders} ON CONFLICT DO NOTHING`,
          [id, ...category_ids]
        )
      }
    }

    await client.query('COMMIT')
    res.json({ data: result.rows[0] })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  } finally {
    client.release()
  }
}

export async function getMyProvider(req: Request, res: Response) {
  const userId = req.user!.userId
  try {
    const result = await pool.query(
      `SELECT p.*,
        COALESCE(
          json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
          FILTER (WHERE c.id IS NOT NULL), '[]'
        ) AS categories
       FROM providers p
       LEFT JOIN provider_categories pc ON pc.provider_id = p.id
       LEFT JOIN categories c ON c.id = pc.category_id
       WHERE p.user_id = $1
       GROUP BY p.id`,
      [userId]
    )
    if (!result.rows[0]) {
      res.status(404).json({ error: 'Perfil não encontrado' })
      return
    }
    res.json({ data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar seu perfil' })
  }
}
