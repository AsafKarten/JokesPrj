using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class Like
    {
        int like_id;
        int id_joke;
        int id_user;
        string user_img;
        string username;
        public int Like_id { get => like_id; set => like_id = value; }
        public int Id_joke { get => id_joke; set => id_joke = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Username { get => username; set => username = value; }

        public Like ()
	    {

    	}
        public Like(int id_joke, int id_user, string user_img, string username)
        {
            Id_joke = id_joke;
            Id_user = id_user;
            User_img = user_img;
            Username = username;
        }

        public Like(int like_id, int id_joke, int id_user, string user_img, string username)
        {
            Like_id = like_id;
            Id_joke = id_joke;
            Id_user = id_user;
            User_img = user_img;
            Username = username;
        }
    }
}