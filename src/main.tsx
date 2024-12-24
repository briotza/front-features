import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import AppRoutes from './routes/routes'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
