import * as React from 'react'
import inlineSort from '../utils/inlineSort'
import styles from './DataSearchResults.module.css'

export default function DataSearchResults({ tab: library, props: { enrichrList, setProps } }) {
  const [searchResults, setSearchResults] = React.useState([])
  React.useEffect(async () => {
    if (!library || !enrichrList) return
    const req = await fetch(`https://maayanlab.cloud/Enrichr/enrich?backgroundType=${library}&userListId=${enrichrList.userListId}`)
    const res = await req.json()
    const [results] = Object.values(res)
    setSearchResults(
      results.map(([
        rank,
        term,
        pvalue,
        zscore,
        combinedscore,
        overlapping_genes,
        adjusted_pvalue,
      ]) => ({
        rank,
        term,
        pvalue,
        zscore,
        combinedscore,
        overlapping_genes,
        adjusted_pvalue,
      }))
    )
  }, [library, enrichrList])
  return (
    <div className={styles.DataSearchResults}>
      <ul>
        {inlineSort(searchResults.map(({ term, adjusted_pvalue }) => (
          <li key={term}>
            <button
              className="btn btn-success"
              onClick={async _ => {
                const req = await fetch(`https://maayanlab.cloud/Enrichr/geneSetLibrary?mode=json&libraryName=${encodeURIComponent(library)}&term=${encodeURIComponent(term)}`)
                const res = await req.json()
                const [name] = Object.keys(res)
                const [set] = Object.values(res)
                setProps(props => ({
                  ...props,
                  sets: [
                    ...props.sets,
                    set,
                  ],
                  set_annotations: [
                    ...props.set_annotations,
                    `${library}: ${name}`,
                  ],
                }))
              }}
            >+</button>
            &nbsp;
            {library}: {term} ({adjusted_pvalue})
          </li>
        )), (a, b) => a.combinedscore - b.combinedscore)}
      </ul>
    </div>
  )
}