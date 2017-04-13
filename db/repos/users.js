module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT User_Id FROM Users ORDER BY User_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Users(First_name, Last_Name, Password, Email, Company, Role) VALUES (${First_Name}, ${Last_Name}, ${Password} , ${Email}, ${Company}, ${Role}) RETURNING Email, Role, User_Id',values, user => user.Email && user.Role && user.User_Id),
        
      findByEmail: values =>         
          rep.any('SELECT * FROM Users WHERE Email = ${Email}', values, users ),
      
      
      updateName: values =>
        rep.any('UPDATE Users SET Name = ${newName} WHERE Name = ${Name} RETURNING Name', values, user => user.Name),

      deleteUser: name =>
        rep.result('DELETE FROM Users WHERE Name = $1', name )      
   };
};
