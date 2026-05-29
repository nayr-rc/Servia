import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database'
import authRoutes from './routes/auth'
import providerRoutes from './routes/providers'
import categoryRoutes from './routes/categories'
import { notFound, errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares globais
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'servia-api', timestamp: new Date().toISOString() })
})

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/categories', categoryRoutes)

// Erros
app.use(notFound)
app.use(errorHandler)

// Start
async function bootstrap() {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🚀 Servia API rodando em http://localhost:${PORT}`)
    console.log(`📋 Health: http://localhost:${PORT}/health`)
  })
}

bootstrap().catch(console.error)

export default app
