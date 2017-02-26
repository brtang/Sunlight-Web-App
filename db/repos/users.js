module.exports = (rep, pgp) => {
   return{
      find: name =>
         rep.oneOrNone('SELECT * FROM Users WHERE Name = $1', name)
   };
};
