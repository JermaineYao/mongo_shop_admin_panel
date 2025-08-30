import { useState } from 'react'

import InputLabelDynamic from '../ui/InputLabelDynamic'

import { isValidEmail } from '../../utils/utils'

export default function ForgotPwd(props) {
  const { toSignIn } = props

  return (
    <div id="forgot-pwd" className="page-transition">
      <InputLabelDynamic name="Email" onBlur={isValidEmail}></InputLabelDynamic>

      <div className="action-container">
        <div className="btn">
          <span>發送信件</span>
        </div>
        <span className="send-email">將發送設密碼設定連結至信箱</span>

        <span className="home-toggle" onClick={toSignIn}>
          回登入畫面
        </span>
      </div>
    </div>
  )
}
