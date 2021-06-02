using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class Login : User
    {
        string pass;
        public string Pass { get => pass; set => pass = value; }
        public Login()
        {

        }

        public Login(int id_user, string salt) : base(id_user, salt)
        {

        }

        public Login(string username, string pass,string salt) : base(username,salt)
        {
            Pass = pass;
        }





    }
}