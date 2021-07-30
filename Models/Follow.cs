using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public class Follow
    {
        int follow_id;
        int id_user;
        int target_id;
        string target_img;
        string target_username;
        string user_img;
        string username;

        public int Follow_id { get => follow_id; set => follow_id = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public int Target_id { get => target_id; set => target_id = value; }
        public string Target_img { get => target_img; set => target_img = value; }
        public string Target_username { get => target_username; set => target_username = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Username { get => username; set => username = value; }

        public Follow()
        {

        }

        public Follow(int follow_id, int id_user, int target_id, string target_img, string target_username, string user_img, string username)
        {
            Follow_id = follow_id;
            Id_user = id_user;
            Target_id = target_id;
            Target_img = target_img;
            Target_username = target_username;
            User_img = user_img;
            Username = username;
        }
    }
}