import { Router } from 'express'
import { body } from 'express-validator'
import {
  listProviders, getProvider, createProvider,
  updateProvider, getMyProvider
} from '../controllers/providerController'
import { getReviews, createReview } from '../controllers/reviewController'
import { logContact } from '../controllers/categoryController'
import { authenticate } from '../middlewares/auth'
import { handleValidation } from '../middlewares/errorHandler'

const router = Router()

// Listagem e busca (pública)
router.get('/', listProviders)

// Meu perfil (autenticado)
router.get('/me', authenticate, getMyProvider)

// Perfil público por ID
router.get('/:id', getProvider)

// Criar perfil de prestador
router.post('/',
  authenticate,
  body('display_name').trim().notEmpty().withMessage('Nome de exibição obrigatório'),
  body('city').trim().notEmpty().withMessage('Cidade obrigatória'),
  body('state').trim().isLength({ min: 2, max: 2 }).withMessage('Estado inválido (use UF)'),
  body('whatsapp').optional().matches(/^\d{10,11}$/).withMessage('WhatsApp inválido'),
  body('category_ids').optional().isArray(),
  handleValidation,
  createProvider
)

// Editar perfil
router.patch('/:id',
  authenticate,
  body('display_name').optional().trim().notEmpty(),
  body('state').optional().isLength({ min: 2, max: 2 }),
  handleValidation,
  updateProvider
)

// Avaliações do prestador (pública)
router.get('/:id/reviews', getReviews)

// Criar avaliação (autenticado)
router.post('/:id/reviews',
  authenticate,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Nota entre 1 e 5'),
  body('comment').optional().trim(),
  handleValidation,
  createReview
)

// Registrar contato
router.post('/:id/contact',
  body('channel').optional().isIn(['whatsapp', 'chat', 'form']),
  handleValidation,
  logContact
)

export default router
