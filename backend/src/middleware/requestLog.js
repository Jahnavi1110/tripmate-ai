const recentLogs = [];
const MAX_LOGS = 100;

export function requestLogger(req, res, next) {
  const started = Date.now();
  res.on("finish", () => {
    recentLogs.unshift({
      time: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - started
    });
    if (recentLogs.length > MAX_LOGS) recentLogs.pop();
  });
  next();
}

export function getRecentLogs() {
  return recentLogs;
}
