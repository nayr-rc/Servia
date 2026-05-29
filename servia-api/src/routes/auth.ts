import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/authController'
import { authenticate } from '../middlewares/auth'
import { handleValidation } from '../middlewares/errorHandler'

const router = Router()

router.post('/register',
  body('name').trim().notEmpty().withMessage('Nome obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role').optional().isIn(['client', 'provider']),
  handleValidation,
  register
)

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidation,
  login
)

router.get('/me', authenticate, me)

export default router
