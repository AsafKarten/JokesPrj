using JokesPrj.Models;
using System;
using System.Data.SqlClient;


namespace JokesPrj.DAL
{
    public class UserDAL
    {
        private readonly string conStr;
        public UserDAL(string conStr)
        {
            this.conStr = conStr;
        }

        /*Get user from database*/
        public User GetUserSalt(string username, string pass)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    User u = null;
                    string query = $"SELECT * FROM JokesUsers where username = @username";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", username);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {

                        u = new User(Convert.ToString(reader["salt"]));
                    }
                    string salted_hash = Globals.Encryption.EncodePassword(u, pass);
                    VerifyUser(u, salted_hash);
                    return u;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public User VerifyUser(User u, string salted_hash)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"SELECT * FROM JokesUsers where username = @username AND salted_hash = @salted_hash ";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    cmd.Parameters.AddWithValue("@salted_hash", salted_hash);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {

                        u = new User(Convert.ToInt32(reader["id_user"]), Convert.ToString(reader["username"]), Convert.ToString(reader["email"]), Convert.ToString(reader["user_img"]));
                    }
                    return u;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}