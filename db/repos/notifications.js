module.exports = (rep, pgp) => {
   return{

      insert: values =>
        rep.any('INSERT INTO Notifications(time_stamp, company, color, alert_type, unread, text) VALUES (${Time_stamp}, ${Company}, ${Color}, ${Alert_type}, ${Unread}, ${Text}) RETURNING Text ',values, notifications => notifications.Text),
      
     findByCompany: values => 
        rep.any("SELECT * FROM Notifications WHERE Company = ${Company}", values, [] ),
         
      findByCompanyAndUnread: values => 
        rep.any("SELECT * FROM Notifications WHERE Company = ${Company} && Unread = 't' ", values, [] ),
      
      updateNotificationById: values =>
        rep.any("UPDATE Notifications SET unread = 'f' WHERE Notification_Id = ${Id} RETURNING unread", values, notifications => notifications.unread),

      deleteNotification: name =>
        rep.result('DELETE FROM Company WHERE Name = $1', name )      
   };
};
