function errorMiddleware(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Sunucu hatası"
      : err.message || "Beklenmeyen hata";

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ error: message });
}

module.exports = { errorMiddleware };
