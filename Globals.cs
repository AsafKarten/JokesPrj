using JokesPrj.Controllers;
using System.Configuration;
using JokesPrj.DAL;
using JokesPrj.Models;

namespace JokesPrj
{
    public static class Globals
    {
        //initializing data access layer with sql server before start the work between client side and backnd side.
        #region ctor
        static Globals()
        {
            //get connection string from Web.config;
            var conStr = ConfigurationManager.ConnectionStrings["LocalDB"].ConnectionString;
            //var conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLocal"].ConnectionString;
            //var conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLivedns"].ConnectionString;
            Globals.UserDAL = new UserDAL(conStr);
        }
        #endregion

        #region Controllers
        public static UserController UserController { get; set; }
        #endregion

        #region DAL
        public static UserDAL UserDAL { get; set; }
        #endregion

        #region Models
        public static User User { get; set; }
        #endregion
    }
}