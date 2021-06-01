/*
Use Master
GO
Drop Database Jokes_DB
GO
*/

CREATE DATABASE Jokes_DB  
ON (NAME = 'Jokes_DB', 
    FILENAME = 'D:\Jokes_DB_Data.MDF' , 
    SIZE = 10, 
    FILEGROWTH = 10%) 
LOG ON (NAME = 'Jokes_DB_Log', 
        FILENAME = 'D:\Jokes_DB_Log.LDF' ,
        SIZE = 5, 
        FILEGROWTH = 10%)
COLLATE Hebrew_CI_AS
GO

Use Jokes_DB 
GO

CREATE TABLE JokesUsers
(
	id_user int identity NOT NULL,
	username nvarchar(50) null,
	salted_hash nvarchar(2000)  Not NULL,
	salt nvarchar(200) NULL,
	email nvarchar(50) NULL, 
	user_img image null
)
GO


CREATE TABLE UsersFriends
(
	group_id int identity not null,
	id_user int NOT NULL,
	friend_id int not null,	
)
GO

CREATE TABLE Jokes
(
	id_joke int identity NOT NULL,
	id_user int,
	joke_title nvarchar(60) not null,
	joke_body nvarchar(3000) not null,
	joke_like int null,
	joke_img image null
)
GO

CREATE TABLE JokesComments
(
	comment_id int identity not null,
	id_joke int,
	id_user int,
	comment_body nvarchar(3000) not null,
	comment_like int null,
	comment_date datetime not null
)
GO

--Configure PRIMARY KEYS

Alter TABLE JokesUsers
ADD
CONSTRAINT [PK_JokeUsers] PRIMARY KEY (id_user)
GO

Alter TABLE UsersFriends
ADD
CONSTRAINT [PK_group_id] PRIMARY KEY (group_id)
GO

Alter TABLE Jokes
ADD
CONSTRAINT [PK_id_joke] PRIMARY KEY (id_joke)
GO

Alter TABLE JokesComments
ADD
CONSTRAINT [PK_comment_id] PRIMARY KEY (comment_id)
GO

--Configure FOREIGN KEYS

Alter TABLE UsersFriends
ADD
CONSTRAINT FK_id_user FOREIGN KEY (id_user) REFERENCES [JokesUsers](id_user),
CONSTRAINT FK_friend_id FOREIGN KEY (friend_id) REFERENCES [JokesUsers](id_user)
GO

Alter TABLE Jokes
ADD
CONSTRAINT FK_Joke_id_user FOREIGN KEY (id_user) REFERENCES [JokesUsers](id_user)
GO

Alter TABLE JokesComments
ADD
CONSTRAINT FK_id_joke FOREIGN KEY (id_joke) REFERENCES [Jokes](id_joke),
CONSTRAINT FK_Comment_id_user FOREIGN KEY (id_user) REFERENCES [JokesUsers](id_user)
GO
