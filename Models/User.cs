namespace JokesPrj.Models
{
    public class User
    {
        int id_user;
        string username;
        string email;
        string user_img;
        string hash;

        public User()
        {

        }
        public User(int id_user)
        {
            Id_user = id_user;
        }
        public User(string username)
        {
            Username = username;
        }

        public User (string username, string hash)
        {
            Username = username;
            Hash = hash;
        }

        public User(string username, string email,string hash)
        {
            Username = username;
            Email = email;
            Hash = hash;
        }
        public User(int id_user, string username, string hash)
        {
            Id_user = id_user;
            Username = username;
            Hash = hash;
        }

        public User(int id_user, string username, string email, string user_img)
        {
            Id_user = id_user;
            Username = username;
            Email = email;
            User_img = user_img;
        }

        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Hash { get => hash; set => hash = value; }
    }
}