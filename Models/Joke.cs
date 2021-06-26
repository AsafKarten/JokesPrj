

namespace JokesPrj.Models
{
    public class Joke
    {
        int id_joke;
        int id_user;
        string joke_title;
        string joke_body;
        string joke_img;

        public int Id_joke { get => id_joke; set => id_joke = value; }
        public int Id_user { get => id_user; set => id_user = value; }
        public string Joke_title { get => joke_title; set => joke_title = value; }
        public string Joke_body { get => joke_body; set => joke_body = value; }
        public string Joke_img { get => joke_img; set => joke_img = value; }

        public Joke()
        {
            
        }
        public Joke(int id_user, string joke_title, string joke_body)
        {
            Id_user = id_user;
            Joke_title = joke_title;
            Joke_body = joke_body;
        }
    }


}