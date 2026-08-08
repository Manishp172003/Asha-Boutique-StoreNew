import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, state } = useLocation()

  useEffect(() => {
    // Don't scroll to top if navigating to Home with a section scroll intent
    if (pathname === '/' && state?.scrollTo) {
      return
    }
    // Scroll to top on pathname change
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, state])

  return null
}

export default ScrollToTop
