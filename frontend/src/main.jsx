import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#F6F2EE',
          color: '#2B1E1A',
          border: '1px solid #E9E3DD',
        },
      }}
    />
  </StrictMode>,
)
