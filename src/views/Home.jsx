// import TextField from '@mui/material/TextField'
import { Input } from '@mui/material'

// logo component
import Logo from '@comp/Logo'

export default function Home() {
  return (
    <div className="page">
      <Logo large={true}></Logo>

      {/* <TextField></TextField> */}
      <Input></Input>
    </div>
  )
}
