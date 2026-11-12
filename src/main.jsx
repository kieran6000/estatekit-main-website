import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { setRenderTime } from './lib/renderClock'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// A prerendered page names the route it was built for. Hydrate only when
// that is the page actually being viewed; anything else (the empty shell, a
// host that served the wrong file) renders fresh, and React swaps the old
// markup out in one commit rather than blanking the page first.
const here = window.location.pathname.replace(/\/+$/, '') || '/'
const built = root.dataset.route

if (built && built === here && root.hasChildNodes()) {
  setRenderTime(Number(root.dataset.builtAt))
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
