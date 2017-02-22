CREATE TABLE Company(
Name varchar(50) UNIQUE NOT NULL,
Company_Id int NOT NULL,
Number_Of_Users int,
PRIMARY KEY (Company_Id)
);

CREATE TABLE Users(
Name varchar(50) UNIQUE NOT NULL,
User_Id int NOT NULL,
Company_Id int NOT NULL REFERENCES Company(Company_Id), 
Role varchar(50),
PRIMARY KEY (User_Id)
);

CREATE TABLE Region(
Name varchar(50) UNIQUE NOT NULL,
Region_Id int NOT NULL,
Company_Id int NOT NULL REFERENCES Company(Company_Id),
Location varchar(50),
Longitude int,
Latitude int,
Number_Of_Groups int,
PRIMARY KEY (Region_Id)
);

CREATE TABLE Groups(
Name varchar(50) NOT NULL,
Group_Id int NOT NULL,
Region_Id int NOT NULL REFERENCES Region(Region_Id),
Number_Of_Poles int,
PRIMARY KEY(Group_Id)
);

CREATE TABLE Pole(
Pole_Id int NOT NULL,
Group_Id int NOT NULL REFERENCES Groups(Group_Id),
Region_Id int NOT NULL REFERENCES Region(Region_Id),
Company_Id int NOT NULL REFERENCES Company(Company_Id),
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
