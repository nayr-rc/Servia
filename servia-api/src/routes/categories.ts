import { Router } from 'express'
import { getCategories, getDashboard } from '../controllers/categoryController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.get('/', getCategories)
router.get('/dashboard', authenticate, getDashboard)

export default router
