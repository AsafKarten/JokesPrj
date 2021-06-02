using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class User
    {
        int id_user;
        string username;
        string email;
        string user_img;
        string salt;

        public User()
        {

        }
        public User(int id_user)
        {
            Id_user = id_user;
        }
        public User(string username)
        {
            Username = username;
        }

        public User (int id_user, string salt)
        {
            Id_user = id_user;
            Salt = salt;
        }

        public User(string username, string email)
        {
            Username = username;
            Email = email;
        }



        public User(string username, string email,string salt)
        {
            Username = username;
            Email = email;
            Salt = salt;
        }

        public User(int id_user, string username, string email, string user_img)
        {
            Id_user = id_user;
            Username = username;
            Email = email;
            User_img = user_img;
        }

        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Salt { get => salt; set => salt = value; }
    }
}