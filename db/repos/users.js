module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT User_Id FROM Users ORDER BY User_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Users(Name, Password, Email, Company, Role) VALUES (${Name}, ${Password} , ${Email}, ${Company}, ${Role}) RETURNING Name, Role',values, user => user.Name && user.Role),
        
      findByEmail: values =>         
          rep.any('SELECT * FROM Users WHERE Email = ${Email}', values, users ),
      
      
      updateName: values =>
        rep.any('UPDATE Users SET Name = ${newName} WHERE Name = ${Name} RETURNING Name', values, user => user.Name),

      deleteUser: name =>
        rep.result('DELETE FROM Users WHERE Name = $1', name )      
   };
};
