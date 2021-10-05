import * as React from 'react'
import styles from './DataSearch.module.css'

const Tabs = React.lazy(() => import('./Tabs'))
const DataSearchResults = React.lazy(() => import('./DataSearchResults'))

export default function DataSearch({ props: { setProps } }) {
  const [inputSet, setInputSet] = React.useState('')
  const [inputSetName, setInputSetName] = React.useState('')
  const [enrichrList, setEnrichrList] = React.useState(null)
  return (
    <div className={styles.DataSearch}>
      <div>
        <label for="input-set-name">Input Set Name</label>
        <input
          id="input-set-name"
          type="text"
          className="form-control"
          value={inputSetName}
          onChange={evt => setInputSetName(evt.target.value)}
        />
      </div>
      <div>
        <label for="input-set">Input Set</label>
        <textarea
          id="input-set"
          className="form-control"
          value={inputSet}
          onChange={evt => setInputSet(evt.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={async _ => {
          const formData = new FormData()
          formData.append('description', `HypoSet: ${inputSetName}`)
          formData.append('list', inputSet)
          const addListReq = await fetch(`https://maayanlab.cloud/Enrichr/addList`, {
            method: 'POST',
            body: formData,
          })
          const addListRes = await addListReq.json()
          const { userListId, shortId } = addListRes
          setEnrichrList({ userListId, shortId })
        }}
      >Search</button>
      <Tabs
        tabs={{
          'GO_Biological_Process_2021': DataSearchResults,
        }}
        props={{enrichrList, setProps}}
      />
    </div>
  )
}