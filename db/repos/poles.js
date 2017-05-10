module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Pole', []),
      
      insert: values =>
        rep.any('INSERT INTO Pole(XBee_MAC_addr, Group_Id, Region_Id, Company_Id) VALUES (${XBee_MAC_addr}, ${Group_Id}, ${Region_Id}, ${Company_Id}) RETURNING XBee_MAC_addr ',values, pole => pole.XBee_MAC_addr),
        
      findByCompany: values => {
          
          return rep.any('SELECT * FROM Pole WHERE Company = ${Company} ', values, [] )
         },
      
      updatePole: values =>
        rep.any('UPDATE Pole SET Number_of_Users = ${numUsers} WHERE Name = ${Name} RETURNING Number_of_Users', values, pole => company.Number_of_Users),

      deletePole: name =>
        rep.result('DELETE FROM Pole WHERE Name = $1', name )      
   };
};
