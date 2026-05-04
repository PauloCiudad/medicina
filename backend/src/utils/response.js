export const successResponse = (res, data = null, message = "Operación correcta", status = 200) => {
  return res.status(status).json({
    ok: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", status = 500) => {
  return res.status(status).json({
    ok: false,
    message,
  });
};