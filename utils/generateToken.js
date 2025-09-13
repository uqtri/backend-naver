const generateToken = () =>
  Math.floor(10000 + Math.random() * 900000).toString();

export default generateToken;
