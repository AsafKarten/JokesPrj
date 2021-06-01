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
        //string salted_hash;
        string salt;
        string email;
        string user_img;

        public User()
        {

        }
        public User(int id_user, string username, string email, string user_img)
        {
            Id_user = id_user;
            Username = username;
            Email = email;
            User_img = user_img;
        }


        public User(string username)
        {
            Username = username;
        }


        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Salt { get => salt; set => salt = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
    }
}