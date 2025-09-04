import CircularProgress from '@mui/material/CircularProgress'

export default function LoadingCover(props) {
  const open = props.open

  return (
    <div className={open ? 'loading' : 'loading-off'}>
      <CircularProgress size={40} sx={{ color: ' rgba(218, 201, 166, 1)' }} />
    </div>
  )
}
