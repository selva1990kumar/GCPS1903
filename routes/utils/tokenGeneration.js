module.exports = {
  getToken: function() {
    return new Promise((resolve, reject) => {
      let token =
        Math.round(new Date().getTime() / 1000) +
        Math.floor(Math.random() * 10000000 + 2).toString();
      resolve(token);
    });
  }
};
