CREATE TYPE roles AS ENUM('Member', 'Client', 'Owner', 'Admin');
CREATE TYPE colors as ENUM('yellow', 'cyan', 'green', 'red');
CREATE TYPE alert_types as ENUM('success', 'info', 'danger', 'warning');

CREATE TABLE Company(
Name varchar(50) UNIQUE NOT NULL,
Company_Id SERIAL,
Number_Of_Users int,
longitude numeric,
latitude numeric,
location varchar(50) NOT NULL,
num_poles int DEFAULT '0',
PRIMARY KEY (Company_Id)
);

CREATE TABLE Users(
First_Name varchar(50) NOT NULL,
Last_Name varchar(50) NOT NULL,
Password text NOT NULL,
Email varchar(50) NOT NULL,
Role roles,
User_Id SERIAL,
--Company_Id SERIAL NOT NULL REFERENCES Company(Company_Id), 
Company varchar(50) NOT NULL,
Company_Id int NOT NULL REFERENCES Company(Company_Id),
PRIMARY KEY (User_Id)
);

CREATE TABLE Region(
Name varchar(50) UNIQUE NOT NULL,
Region_Id SERIAL,
Company_Id int NOT NULL REFERENCES Company(Company_Id),
Location varchar(50),
Longitude int,
Latitude int,
Number_Of_Groups int,
PRIMARY KEY (Region_Id)
);

CREATE TABLE Groups(
Name varchar(50) NOT NULL,
Group_Id int,
Region_Id int NOT NULL REFERENCES Region(Region_Id),
Number_Of_Poles int,
PRIMARY KEY(Group_Id)
);

CREATE TABLE Pole(
Pole_Id SERIAL,
XBee_MAC_addr varchar(50) NOT NULL,
Group_name varchar(50),
Region_Id int REFERENCES Region(Region_Id),
Company varchar(50) NOT NULL REFERENCES Company(Name),
Batt_Volt int,
Batt_Current int,
Panel_Volt int,
Panel_Current int,
Temperature int,
Power_source varchar(50),
Brightness_level int,
MAN_LED_Override varchar(50),
LED varchar(50),
Arch_light varchar(50),
longitude numeric,
latitude numeric,
PRIMARY KEY(Pole_Id)
);

CREATE TABLE PoleLog(
Pole_Id SERIAL NOT NULL,
XBee_MAC_addr varchar(50) NOT NULL,
Company varchar(50) NOT NULL REFERENCES Company(Name),
Time_stamp timestamp NOT NULL,
Date_stamp date NOT NULL,
Batt_Volt int,
Batt_Current int,
Panel_Volt int,
Panel_Current int,
Temperature int,
Power_source varchar(50),
Brightness_level int,
MAN_LED_Override varchar(50),
LED varchar(50),
Arch_light varchar(50),
PRIMARY KEY(Pole_Id)
);

CREATE TABLE Notifications(
Notification_Id SERIAL NOT NULL,
Time_stamp timestamp NOT NULL,
Company varchar(50) NOT NULL REFERENCES Company(Name),
Color colors NOT NULL,
Alert_type alert_types NOT NULL,
Unread boolean NOT NULL,
Text varchar(50) NOT NULL
);


