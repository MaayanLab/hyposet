import * as React from 'react'

export default function InputSet({ props: { setProps } }) {
  const [inputSetName, setInputSetName] = React.useState('')
  const [inputSet, setInputSet] = React.useState('')
  return (
    <div>
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