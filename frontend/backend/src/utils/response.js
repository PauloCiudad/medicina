export const successResponse = (
  res,
  data = null,
  message = "Operación correcta",
  status = 200
) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(status).json({
    ok: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Error",
  status = 500
) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(status).json({
    ok: false,
    message,
  });
};