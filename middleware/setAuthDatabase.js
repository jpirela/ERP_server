// middleware/setAuthDatabase.js
const setAuthDatabase = (req, res, next) => { 
  req.dbName = process.env.DB_NAME;;
  next();
};

export default setAuthDatabase;
