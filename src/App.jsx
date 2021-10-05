import * as React from "react"
import styles from './App.module.css'

const ReactSupervenn = React.lazy(() => import('react-supervenn/src/components/ReactSupervenn'))
const Tabs = React.lazy(() => import('./components/Tabs'))
const TermSearch = React.lazy(() => import('./components/TermSearch'))
const DataSearch = React.lazy(() => import('./components/DataSearch'))
const ManageSets = React.lazy(() => import('./components/ManageSets'))

export default function App() {
  const [inputProps, setInputProps] = React.useState({ sets: [], set_annotations: [], widths_minmax_ratio: 0.1, rotate_col_annotations: true })
  const [loading, setLoading] = React.useState(false)
  const [outputProps, setOutputProps] = React.useState(null)
  React.useEffect(() => {
    setOutputProps(null)
    if (inputProps.sets.length > 0) {
      setLoading(true)
      const abortController = new AbortController()
      fetch('/api/supervenn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(inputProps),
        signal: abortController.signal,
      })
        .then(req => req.json())
        .then(res => {
          setOutputProps(res)
          setLoading(false)
        })
        .catch(err => {
          console.warn(err)
        })
      return () => {
        abortController.abort()
      }
    }
  }, [inputProps])
  return (
    <React.Suspense fallback={null}>
      <div className={styles.App}>
        <div className={styles.AppFigure}>
          {loading ? <span>Loading...</span> : null}
          {outputProps !== null ? (
            <ReactSupervenn {...outputProps} />
          ) : null}
        </div>
        <Tabs
          tabs={{
            'Manage Sets': ManageSets,
            'Term Search': TermSearch,
            'Data Search': DataSearch,
          }}
          props={{props: inputProps, setProps: setInputProps}}
        />
      </div>
    </React.Suspense>
  )
}