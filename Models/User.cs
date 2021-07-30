﻿namespace JokesPrj.Models
{
    public class User
    {
        int id_user;
        string id_external;
        string username;
        string email;
        string user_img;
        string hash;
        string salt;
        int i_follow;
        int follow_me;

        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Hash { get => hash; set => hash = value; }
        public int I_follow { get => i_follow; set => i_follow = value; }
        public int Follow_me { get => follow_me; set => follow_me = value; }
        public string Salt { get => salt; set => salt = value; }
        public string Id_external { get => id_external; set => id_external = value; }

        public User()
        {

        }

        public User(string username)
        {
            Username = username;
        }

        public User(int id_user, string username, string user_img, int i_follow, int follow_me)
        {
            Id_user = id_user;
            Username = username;
            User_img = user_img;
            I_follow = i_follow;
            Follow_me = follow_me;
        }
        public User(int id_user, string username, string hash,string email, string user_img, int i_follow, int follow_me, string id_external)
        {
            Id_user = id_user;
            Username = username;
            Hash = hash;
            Email = email;
            User_img = user_img;
            I_follow = i_follow;
            Follow_me = follow_me;
            Id_external = id_external;
        }
    }
}