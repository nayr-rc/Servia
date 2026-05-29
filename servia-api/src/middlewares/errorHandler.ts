import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function handleValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }
  next()
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada` })
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Erro interno:', err)
  res.status(500).json({ error: 'Erro interno do servidor' })
}
