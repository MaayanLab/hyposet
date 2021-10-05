import 'bootstrap/dist/css/bootstrap.min.css'

import * as React from "react"
import * as ReactDOM from "react-dom"

const App = React.lazy(() => import('./App'))

ReactDOM.render(
  <React.Suspense fallback={null}><App /></React.Suspense>,
  document.getElementById('root'),
)
