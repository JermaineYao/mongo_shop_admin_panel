import { useState } from 'react'

export default function InputLabelDynamic(props) {
  const {
    type = 'text',
    name,
    alertMsg = null,
    value,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props

  const isControlled = value ? true : false
  const [innerValue, setInnerValue] = useState('')
  const displayValue = isControlled ? value : innerValue

  const handleChange = (e) => {
    const v = e.target.value.trim()
    if (!isControlled) setInnerValue(v)
    onChange?.(v)
  }

  const handleFocus = (e) => {
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    onBlur?.(e)
  }

  return (
    <label className={`input-label-container ${displayValue ? 'has-value' : ''}`}>
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      <span className="label-name">{name}</span>
      {alertMsg && <span className="alert">{alertMsg}</span>}
    </label>
  )
}
