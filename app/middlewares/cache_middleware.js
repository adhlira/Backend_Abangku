import redis from "redis";

const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl;
  client.get(cacheKey, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

export default cacheMiddleware