import * as React from 'react'
import classes from '../utils/classes'
import styles from './Tabs.module.css'

export default function Tabs({ tabs, props }) {
  const [tab, setTab] = React.useState(Object.keys(tabs)[0])
  const Tab = tabs[tab]
  return (
    <div className={styles.Tabs}>
      <ul className="nav nav-tabs">
        {Object.keys(tabs).map(t =>
          <li key={t} className="nav-item">
            <a
              className={classes({ 'nav-link': true, 'active': tab == t })}
              onClick={_ => setTab(t)}
              href="#"
            >{t}</a>
          </li>
        )}
      </ul>
      <div>
        <React.Suspense fallback={null}>
          <Tab tab={tab} props={props} />
        </React.Suspense>
      </div>
    </div>
  )
}
