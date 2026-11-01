import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import { ExperienceProvider } from './lib/experienceContext.jsx'
import './xp.css'
import './desktop-finish.css'
import './showcase-finish.css'
import './calendar.css'

// Opt into scroll-reveal only once JS is confirmed running. Without this class
// the `.reveal` elements stay fully visible, so a script failure can never
// leave the page blank.
document.documentElement.classList.add('js-reveal')
// Route scrolling is handled by ScrollManager; browser restoration can otherwise
// reopen the room halfway through its scroll-to-enter camera journey on reload.
window.history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ExperienceProvider>
          <App />
        </ExperienceProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
