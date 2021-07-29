using System;
using System.Collections.Generic;

namespace JokesPrj.Models
{
    public class Joke
    {
        int id_joke;
        int id_user;
        int joke_like;
        int comment_count;
        string joke_title;
        string joke_body;
        string joke_img;
        string username;
        string user_img;


        public int Id_joke { get => id_joke; set => id_joke = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public string Joke_title { get => joke_title; set => joke_title = value; }
        public string Joke_body { get => joke_body; set => joke_body = value; }
        public string Joke_img { get => joke_img; set => joke_img = value; }
        public string Username { get => username; set => username = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public int Joke_like { get => joke_like; set => joke_like = value; }
        public int Comment_count { get => comment_count; set => comment_count = value; }

        public Joke()
        {

        }
        public Joke(string joke_title)
        {
            Joke_title = joke_title;
        }
        public Joke(int id_user, string joke_title, string joke_body, string joke_img, string username, string user_img)
        {
            Id_user = id_user;
            Joke_like = 0;
            Comment_count = 0;
            Joke_title = joke_title;
            Joke_body = joke_body;
            Username = username;
            User_img = user_img;
            Joke_img = joke_img;
        }
        public Joke(int id_joke, int id_user, int joke_like, string joke_title, string joke_body, string username, string user_img, int comment_count)
        {
            Id_joke = id_joke;
            Id_user = id_user;
            Joke_like = joke_like;
            Joke_title = joke_title;
            Joke_body = joke_body;
            Username = username;
            Joke_img = joke_img;
            Comment_count = comment_count;
        }

        public Joke(int id_joke, int id_user, int joke_like, string joke_title, string joke_body, string joke_img, string username, string user_img, int comment_count)
        {
            Id_joke = id_joke;
            Id_user = id_user;
            Joke_like = joke_like;
            Joke_title = joke_title;
            Joke_body = joke_body;
            Username = username;
            User_img = user_img;
            Joke_img = joke_img;
            Comment_count = comment_count;
        }
    }
}