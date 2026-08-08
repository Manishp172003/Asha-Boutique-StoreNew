import { RouterProvider } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import router from './routes'
import './App.css'

function App() {
  return (
    <GoogleOAuthProvider clientId="116347018906-6se17i8o2484b8t599jgs0q60qn8ljf5.apps.googleusercontent.com">
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </GoogleOAuthProvider>
  )
}

export default App
