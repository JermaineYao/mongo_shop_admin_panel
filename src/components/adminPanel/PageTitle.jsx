export default function PageTitle(props) {
  const title = props.title

  return (
    <div className="page-title">
      <span>{title}</span>

      <hr />
    </div>
  )
}
