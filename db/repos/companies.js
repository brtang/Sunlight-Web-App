module.exports = (rep, pgp) => {
   return{
      countId: () =>
          rep.any('SELECT Company_Id FROM Companies ORDER BY Company_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Companies(Name, Company_Id, Number_of_Users) VALUES (${Name}, ${Company_Id} , ${Number_of_Users}) RETURNING Name, Company_Id',values, company => company.Name && company.Company_Id),
        
      find: values => {
          
          return rep.many('SELECT * FROM Companies WHERE Name = ${Name} OR Company_Id = ${Company_Id} OR Number_of_Users = ${Number_of_Users}', values, companies )
         },
      
      updateUsers: values =>
        rep.any('UPDATE Companies SET Number_of_Users = ${numUsers} WHERE Name = ${Name} RETURNING Number_of_Users', values, company => company.Number_of_Users),

      deleteUser: name =>
        rep.result('DELETE FROM Companies WHERE Name = $1', name )      
   };
};
