module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT User_Id FROM Users ORDER BY User_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Users(Name, Password, Email, Company) VALUES (${Name}, ${Password} , ${Email}, ${Company}) RETURNING Name, User_Id',values, user => user.Name && user.User_Id),
        
      find: values => {
          
          return rep.many('SELECT * FROM Users WHERE Name = ${Name} OR User_Id = ${User_Id} OR Company = ${Company} OR Email = ${Email}', values, users )
         },
      
      updateName: values =>
        rep.any('UPDATE Users SET Name = ${newName} WHERE Name = ${Name} RETURNING Name', values, user => user.Name),

      deleteUser: name =>
        rep.result('DELETE FROM Users WHERE Name = $1', name )      
   };
};
