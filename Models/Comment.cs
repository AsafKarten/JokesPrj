using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class Comment
    {
        int comment_id;
        int id_joke;
        int id_user;
        string comment_body;
        DateTime comment_date;
        string user_img;
        string username;
        public int Comment_id { get => comment_id; set => comment_id = value; }
        public int Id_joke { get => id_joke; set => id_joke = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public string Comment_body { get => comment_body; set => comment_body = value; }
        public DateTime Comment_date { get => comment_date; set => comment_date = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Username { get => username; set => username = value; }

        public Comment(int comment_id, int id_joke, int id_user, string comment_body, DateTime comment_date, string user_img, string username)
        {
            Comment_id = comment_id;
            Id_joke = id_joke;
            Id_user = id_user;
            Comment_body = comment_body;
            Comment_date = comment_date;
            User_img = user_img;
            Username = username;
        }
    }
}