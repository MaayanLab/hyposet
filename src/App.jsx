import * as React from "react"
import styles from './App.module.css'

const ReactSupervenn = React.lazy(() => import('react-supervenn/src/components/ReactSupervenn'))
const Tabs = React.lazy(() => import('./components/Tabs'))
const TermSearch = React.lazy(() => import('./components/TermSearch'))
const DataSearch = React.lazy(() => import('./components/DataSearch'))
const ManageSets = React.lazy(() => import('./components/ManageSets'))

export default function App() {
  const [inputProps, setInputProps] = React.useState({sets: [], set_annotations: []})
  const [outputProps, setOutputProps] = React.useState(null)
  React.useEffect(async () => {
    if (inputProps.sets.length == 0) {
      setOutputProps(null)
    } else {
      const req = await fetch('/api/supervenn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(inputProps),
      })
      const res = await req.json()
      setOutputProps(res)
    }
  }, [inputProps])
  return (
    <React.Suspense fallback={null}>
      <div className={styles.App}>
        <div>
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