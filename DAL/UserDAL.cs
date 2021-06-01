using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.DAL
{
    public class UserDAL
    {
        private readonly string conStr;
        public UserDAL(string conStr)
        {
            this.conStr = conStr;
        }
    }
}