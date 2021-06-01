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
        string salted_hash;
        string salt;
        string email;
        string user_img;

        public User()
        {

        }
        public User(string username)
        {
            Username = username;
        }



        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Salted_hash { get => salted_hash; set => salted_hash = value; }
        public string Salt { get => salt; set => salt = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
    }
}