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
            string conStr = ConfigurationManager.ConnectionStrings["LocalDB"].ConnectionString;
            //string conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLocal"].ConnectionString;
            //string conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLivedns"].ConnectionString;
            Globals.UserDAL = new UserDAL(conStr);
            Globals.Encryption = new Encryption();
        }
        #endregion

        #region Controllers
        public static UserController UserController { get; set; }
        public static ImageController ImageController { get; set; }
        #endregion

        #region DAL
        public static UserDAL UserDAL { get; set; }
        #endregion

        #region Models
        public static User User { get; set; }
        public static Login Login { get; set; }
        public static Encryption Encryption { get; set; }
        public static Registration Registration { get; set; }
        public static Image Image { get; set; }
        #endregion
    }
}