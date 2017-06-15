module.exports = (rep, pgp) => {
   return{
      findAll: () =>
         rep.any('SELECT * FROM Pole', []),
      
      insert: values =>
        rep.any('INSERT INTO Pole(XBee_MAC_addr, Company, Longitude, Latitude) VALUES (${XBee_MAC_addr}, ${Company}, ${Longitude}, ${Latitude}) RETURNING XBee_MAC_addr ',values, pole => pole.XBee_MAC_addr),
        
      orderByCompany: () =>
          rep.any('SELECT * FROM Pole ORDER BY Company ', []),    
        
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
        
      updateMultiple: values =>
        rep.any('UPDATE Pole SET Brightness_level = ${brightness_level}, Batt_volt = ${batt_volt}, Batt_current = ${batt_current}, Panel_volt = ${Panel_volt}, Panel_current = ${Panel_current} WHERE XBee_MAC_addr = ${xbee_mac_addr} RETURNING Company', values, pole => pole.Company),
  
        
      deletePole: name =>
        rep.result('DELETE FROM Pole WHERE Name = $1', name ),

       getLatestTime: () =>
        rep.any('SELECT time_stamp FROM PoleLog ORDER by time_stamp DESC LIMIT 1', []),
   };
};
