module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Pole', []),
      
      insert: values =>
        rep.any('INSERT INTO Pole(Name, Number_Of_Users) VALUES (${Name}, ${Number_Of_Users}) RETURNING Name ',values, pole => pole.Name),
        
      find: values => {
          
          return rep.any('SELECT * FROM Pole WHERE Name = ${Name} ', values, pole => pole.Name )
         },
      
      updateUsers: values =>
        rep.any('UPDATE Pole SET Number_of_Users = ${numUsers} WHERE Name = ${Name} RETURNING Number_of_Users', values, pole => company.Number_of_Users),

      deleteUser: name =>
        rep.result('DELETE FROM Pole WHERE Name = $1', name )      
   };
};
