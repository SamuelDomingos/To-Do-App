const Error = ({ error }: { error: any }) => {
  return (
    <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
      {error}
    </div>
  )
}

export default Error
