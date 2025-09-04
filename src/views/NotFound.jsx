import { useNavigate } from 'react-router-dom'

// logo component
import Logo from '../components/Logo'

export default function NotFound() {
  const nav = useNavigate()

  return (
    <div id="not-found" className="page">
      <Logo large={true}></Logo>

      <div className="not-found-wrap">
        <span className="not-found-404">404 Not Found</span>

        <div className="btn" onClick={() => nav(-1)}>
          <span>回上一頁</span>
        </div>
      </div>
    </div>
  )
}
