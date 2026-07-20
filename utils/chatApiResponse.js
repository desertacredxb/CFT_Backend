function success(data) {
  return {
    success: true,
    data,
  };
}

function failure(message) {
  return {
    success: false,
    message,
  };
}

module.exports = {
  success,
  failure,
};