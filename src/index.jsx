import 'bootstrap/dist/css/bootstrap.min.css'

import * as React from "react"
import { createRoot } from "react-dom/client"

const App = React.lazy(() => import('./App'))

createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={null}><App /></React.Suspense>,
)
