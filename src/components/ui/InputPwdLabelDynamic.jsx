import { useEffect, useState } from 'react'
// icon
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function InputLabelDynamic(props) {
  const { name, alertMsg = null, value, onChange, onFocus, onBlur, ...rest } = props

  const isControlled = 'value' in props
  const [innerValue, setInnerValue] = useState('')
  const displayValue = isControlled ? (value ?? '') : innerValue

  const handleChange = (e) => {
    const v = e.target.value
    if (!isControlled) setInnerValue(v)
    onChange?.(v)
  }

  const handleFocus = (e) => {
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    onBlur?.(e)
  }

  // icon
  const [isShowPwd, showPwd] = useState(false)

  const togglePwd = (e) => {
    const input = e.target.closest('label')?.querySelector('input')
    if (!input) return
    input.type = input.type === 'password' ? 'text' : 'password'
    showPwd((prev) => !prev)
  }

  return (
    <label className={`input-label-container ${displayValue ? 'has-value' : ''}`}>
      <input
        type={isShowPwd ? 'text' : 'password'}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />

      <div className="icon_wrap" onClick={togglePwd}>
        {isShowPwd ? (
          <RemoveRedEyeIcon
            sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '22px' }}
          ></RemoveRedEyeIcon>
        ) : (
          <VisibilityOffIcon
            sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '22px' }}
          ></VisibilityOffIcon>
        )}
      </div>

      <span className="label-name">{name}</span>
      {alertMsg && <span className="alert">{alertMsg}</span>}
    </label>
  )
}
