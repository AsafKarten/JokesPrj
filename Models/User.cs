namespace JokesPrj.Models
{
    public class User
    {
        int id_user;
        string username;
        string email;
        string user_img;
        string hash;
        int i_follow;
        int follow_me;
        public int Id_user { get => id_user; set => id_user = value; }
        public string Username { get => username; set => username = value; }
        public string Email { get => email; set => email = value; }
        public string User_img { get => user_img; set => user_img = value; }
        public string Hash { get => hash; set => hash = value; }
        public int I_follow { get => i_follow; set => i_follow = value; }
        public int Follow_me { get => follow_me; set => follow_me = value; }

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

        public User(string username, string hash)
        {
            Username = username;
            Hash = hash;
        }

        public User(string username, string email, string hash)
        {
            Username = username;
            Email = email;
            Hash = hash;
        }
        public User(int id_user, string username, string user_img, int i_follow, int follow_me)
        {
            Id_user = id_user;
            Username = username;
            User_img = user_img;
            I_follow = i_follow;
            Follow_me = follow_me;
        }
        public User(int id_user, string username, string hash, string user_img, int i_follow, int follow_me)
        {
            Id_user = id_user;
            Username = username;
            Hash = hash;
            User_img = user_img;
            I_follow = i_follow;
            Follow_me = follow_me;
        }
    }
}