var QueryFile = require('pg-promise').QueryFile;
var path = require('path');

module.exports = {
  users: {
  }
};

//Helper for linking to external query files;
function sql(file) {
  var fullPath = path.join(__dirname, file); //Generate full path
  var options = {
    minify: true,
    params: {
    }
  };
  var qf = new QueryFile(fullPath, options);
  
  if(qf.error){
    console.error(qf.error);
  }

  return qf;


};
