using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class Login
    {
        string username;
        string pass;

        public Login(string username, string pass)
        {
            this.Username = username;
            this.Pass = pass;
        }

        public string Username { get => username; set => username = value; }
        public string Pass { get => pass; set => pass = value; }
    }
}