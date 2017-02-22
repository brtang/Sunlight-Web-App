INSERT INTO Company(Name, Company_Id, Number_Of_Users) VALUES ('UCSC', 0, 3);

INSERT INTO Region(Name, Region_Id, Company_Id, Number_Of_Groups) VALUES('West Remote', 0, 0, 2);
INSERT INTO Region(Name, Region_Id, Company_Id, Number_Of_Groups) VALUES('East Remote', 1, 0, 2);

INSERT INTO Groups(Name, Group_Id, Region_Id, Number_Of_Poles) VALUES('Inner circle', 0, 0, 2);
INSERT INTO Groups(Name, Group_Id, Region_Id, Number_Of_Poles) VALUES('Outer circle', 1, 0, 3);

INSERT INTO Groups(Name, Group_Id, Region_Id, Number_Of_Poles) VALUES('Inner cube', 2, 1, 3);
INSERT INTO Groups(Name, Group_Id, Region_Id, Number_Of_Poles) VALUES('Outer cube', 3, 1, 2);

INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(0, 0, 0);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(1, 0, 0);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(2, 1, 0);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(3, 1, 0);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(4, 1, 0);

INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(5, 2, 1);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(6, 2, 1);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(7, 2, 1);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(8, 3, 1);
INSERT INTO Pole(Pole_Id, Group_Id, Region_Id) VALUES(9, 3, 1);

INSERT INTO Users(Name, User_Id, Company_Id, Role) VALUES ('Frank', 0, 0, 'Admin');
INSERT INTO Users(Name, User_Id, Company_Id, Role) VALUES ('Rob', 1, 0, 'User');
INSERT INTO Users(Name, User_Id, Company_Id, Role) VALUES ('Patrick', 2, 0, 'User');




