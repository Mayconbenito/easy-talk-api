export default (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(err)
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR"
  })
}
