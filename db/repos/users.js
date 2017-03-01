module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT User_Id FROM Users ORDER BY User_Id DESC LIMIT 1', [], a => +a.count),      
       
      count:() =>
         rep.oneOrNone('SELECT count(*) FROM Users', [], a => +a.count),
      
      insert: values =>
        rep.any('INSERT INTO Users(Name, User_Id, Company_Id, Role) VALUES (${Name}, ${User_Id} , ${Company_Id}, ${Role}) RETURNING Name, User_Id',values, user => user.Name && user.User_Id),
        
      find: name => {
          console.log("Name is:", name);
          return rep.oneOrNone('SELECT * FROM Users WHERE Name = $1', name)
         },
      
      updateName: values =>
        rep.any('UPDATE Users SET Name = ${newName} WHERE Name = ${Name} RETURNING Name', values, user => user.Name),

      deleteUser: name =>
        rep.result('DELETE FROM Users WHERE Name = $1', name )      
   };
};
