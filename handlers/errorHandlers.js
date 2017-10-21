exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.errorHandler = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errors = [];  
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => errors.push(err.errors[key].message));
  res.json({ success: false, errors });
};
