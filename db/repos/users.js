module.exports = (rep, pgp) => {
   return{
      add: values =>
        rep.one('INSERT INTO Users(Name, User_Id, Company_Id, Role) VALUES ($1, $2, $3, $4)';,values, user => user.Name),
        
      find: name =>
         rep.oneOrNone('SELECT * FROM Users WHERE Name = $1', name)
   };
};
