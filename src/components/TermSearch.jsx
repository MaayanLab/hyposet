import * as React from 'react'

import styles from './TermSearch.module.css'

export default function TermSearch({ props: { setProps } }) {
  const [termSearch, setTermSearch] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  return (
    <div className={styles.TermSearch}>
      <div className={styles.TermSearchBox}>
        <label for="term-search">Term Search</label>
        <input
          id="term-search"
          type="text"
          className="form-control"
          value={termSearch}
          onChange={evt => setTermSearch(evt.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          onClick={async _ => {
            const req = await fetch(`https://maayanlab.cloud/Enrichr/termmap?json=true&setup=true&meta=${encodeURIComponent(termSearch)}`)
            const res = await req.json()
            console.log(res)
            const { terms, categories } = res
            console.log({ terms, categories })
            const results = []
            const category_lookup = {}
            for (const category of categories) {
              for (const library of category.libraries) {
                category_lookup[library.name] = category.name
              }
            }
            console.log({ category_lookup })
            for (const library in terms) {
              const category = category_lookup[library]
              for (const term of terms[library]) {
                results.push({
                  term,
                  library,
                  category,
                })
              }
            }
            setSearchResults(results)
          }}
        >Search</button>
      </div>
      <div className={styles.TermSearchResults}>
        <ul>
          {searchResults.map(({ term, library, category }) => (
            <li key={`${library}-${term}`}>
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
              {library}: {term}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}