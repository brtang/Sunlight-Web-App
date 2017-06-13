module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT User_Id FROM Users ORDER BY User_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Users(First_name, Last_Name, Password, Email, Company, Role) VALUES (${First_Name}, ${Last_Name}, ${Password} , ${Email}, ${Company}, ${Role}) RETURNING Email, Role, User_Id',values, user => user.Email && user.Role && user.User_Id),
        
      findByEmail: values =>         
          rep.any('SELECT * FROM Users WHERE Email = ${Email}', values, users ),
      
      findById: values =>
          rep.any('SELECT * FROM Users WHERE User_Id = ${Id}', values, users),
          
      orderByCompany: () =>
          rep.any('SELECT * FROM Users ORDER BY Company ', [], user => user.first_name && user.last_name && user.email),  
      
      updateName: values =>
        rep.any('UPDATE Users SET Name = ${newName} WHERE Name = ${Name} RETURNING Name', values, user => user.Name),
        
      update: values =>
        rep.any('UPDATE Users SET First_name = ${First_Name}, Last_Name  = ${Last_Name}, Password = ${Password}, Email = ${Email} WHERE User_Id = ${Id} RETURNING First_name, Last_Name, Password, Email, Company, User_Id', values, user => user.First_name && user.Last_Name && user.Password && user.Email && user.Company && user.User_Id),

      deleteUser: name =>
        rep.result('DELETE FROM Users WHERE Name = $1', name )      
   };
};
