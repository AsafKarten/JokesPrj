using JokesPrj.Controllers;
using System.Configuration;
using JokesPrj.DAL;
using JokesPrj.Models;

namespace JokesPrj
{
    public static class Globals
    {
        static string conStr;
        //initializing data access layer with sql server before start the work between client side and backnd side.
        #region ctor
        static Globals()
        {
            bool localWebAPI = true;//before doing publish need to be false
            bool sqlLocal = true;//before doing publish need to be false
            if (localWebAPI && sqlLocal)
                conStr = ConfigurationManager.ConnectionStrings["LocalDB"].ConnectionString;
            else if (localWebAPI && !sqlLocal)
                conStr = ConfigurationManager.ConnectionStrings["SQLLiveDNSfromLocalWebAPI"].ConnectionString;
            else
                conStr = ConfigurationManager.ConnectionStrings["LiveDNSfromLivednsWebAPI"].ConnectionString;
            UserDAL = new UserDAL(conStr);
        }
        #endregion

        #region Controllers
        public static UserController UserController { get; set; }
        public static ImageController ImageController { get; set; }
        public static JokesController JokesController { get; set; }
        #endregion

        #region DAL
        public static UserDAL UserDAL { get; set; }
        public static JokeDAL JokeDAL { get; set; }

        #endregion

        #region Models
        public static User User { get; set; }
        public static Image Image { get; set; }
        public static Joke Joke { get; set; }
        #endregion
    }
}