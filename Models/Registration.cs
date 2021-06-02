

namespace JokesPrj.Models
{
    public class Registration : User
    {
        string pass;
        public string Pass { get => pass; set => pass = value; }

        public Registration() { }
        public Registration(string username, string email) : base(username, email) { }

        public Registration(string username, string email, string pass) : base(username, email)
        {
            Pass = pass;
        }

        //public Registration(string username, string email, string salt) : base(username, email)
        //{
        //    Salt = salt;
        //}
    }
}