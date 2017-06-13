module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Company', []),
      
      countId: () =>
          rep.any('SELECT Company_Id FROM Company ORDER BY Company_Id DESC LIMIT 1', [], a => +a.count),      
       
      insert: values =>
        rep.any('INSERT INTO Company(Name, Longitude, Latitude, Location) VALUES (${Name}, ${Longitude}, ${Latitude},${Location} ) RETURNING Name ',values, company => company.Name),
        
      findByName: values => {          
        return rep.any('SELECT * FROM Company WHERE Name = ${Name} ', values, [] )
      },
      
      update: values =>
        rep.any('UPDATE Company SET Name = ${Updated_name}, Location  = ${Location}, Longitude = ${Longitude}, Latitude = ${Latitude} WHERE Name = ${Name} RETURNING Name, Location, Longitude, Latitude', values, company => company.name && company.location && company.longitude && company.latitude ),

      deleteUser: name =>
        rep.result('DELETE FROM Company WHERE Name = $1', name )      
   };
};
