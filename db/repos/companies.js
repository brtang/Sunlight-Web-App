module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Company', [], company),
      
      countId: () =>
          rep.any('SELECT Company_Id FROM Company ORDER BY Company_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Company(Name, Number_Of_Users) VALUES (${Name}, ${Number_Of_Users}) RETURNING Name ',values, company => company.Name),
        
      find: values => {
          
          return rep.any('SELECT * FROM Company WHERE Name = ${Name} ', values, company => company.Name )
         },
      
      updateUsers: values =>
        rep.any('UPDATE Company SET Number_of_Users = ${numUsers} WHERE Name = ${Name} RETURNING Number_of_Users', values, company => company.Number_of_Users),

      deleteUser: name =>
        rep.result('DELETE FROM Company WHERE Name = $1', name )      
   };
};
