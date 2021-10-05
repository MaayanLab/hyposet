import * as React from 'react'
import styles from './ManageSets.module.css'

export default function ManageSets({ props: { props, setProps } }) {
  const [inputSetName, setInputSetName] = React.useState('')
  const [inputSet, setInputSet] = React.useState('')
  return (
    <div className={styles.ManageSets}>
      <div className={styles.Sets}>
        <ul>
          {props.sets.map((_, i) => (
            <li key={`${i}`}>
              <button
                className="btn btn-danger"
                onClick={_ => {
                  setProps(props => ({
                    ...props,
                    sets: [
                      ...props.sets.slice(0, i),
                      ...props.sets.slice(i+1),
                    ],
                    set_annotations: [
                      ...props.set_annotations.slice(0, i),
                      ...props.set_annotations.slice(i+1),
                    ],
                  }))
                }}
              >X</button>
              &nbsp;
              {props.set_annotations[i]}
              &nbsp;
              (<a
                onClick={_ => {
                  navigator.clipboard.writeText(props.sets[i].join('\n'))
                }}
                href="#"
              >{props.sets[i].length} items</a>)
            </li>
          ))}
        </ul>
      </div>
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
      <div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={_ => {
            setProps(props => ({
              ...props,
              sets: [...props.sets, inputSet.split('\n').filter(t => t)],
              set_annotations: [...props.set_annotations, inputSetName],
            }))
            setInputSet('')
            setInputSetName('')
          }}
        >
          Add set
        </button>
      </div>
    </div>
  )
}