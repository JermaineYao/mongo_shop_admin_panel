import CircularProgress from '@mui/material/CircularProgress'

export default function LoadingCover(props) {
  const open = props.open
  const isCircle = props?.isCircle ? props?.isCircle : false

  return (
    <div className={open ? (isCircle ? 'loading circle' : 'loading') : 'loading-off'}>
      <CircularProgress size={40} sx={{ color: ' rgba(218, 201, 166, 1)' }} />
    </div>
  )
}
