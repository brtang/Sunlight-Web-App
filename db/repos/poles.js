module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Pole', []),
      
      insert: values =>
        rep.any('INSERT INTO Pole(XBee_MAC_addr, Group_Id, Region_Id, Company_Id) VALUES (${XBee_MAC_addr}, ${Group_Id}, ${Region_Id}, ${Company_Id}) RETURNING XBee_MAC_addr ',values, pole => pole.XBee_MAC_addr),
        
      findByCompany: values => {
          
          return rep.any('SELECT * FROM Pole WHERE Company = ${Company} ', values, [] )
         },
      /*
      insertLog: values =>
        rep.any('INSERT INTO PoleLog(
      */
      
      //SELECT * FROM PoleLog WHERE extract(Month from time_stamp) = 5;
      
      updateBrightness: values =>
        rep.any('UPDATE Pole SET Brightness_level = ${brightness_level} WHERE XBee_MAC_addr = ${xbee_mac_addr} RETURNING Company', values, pole => pole.Company),

      deletePole: name =>
        rep.result('DELETE FROM Pole WHERE Name = $1', name ),

       getLatestTime: () =>
        rep.any('SELECT time_stamp FROM PoleLog ORDER by time_stamp DESC LIMIT 1', []),
   };
};
