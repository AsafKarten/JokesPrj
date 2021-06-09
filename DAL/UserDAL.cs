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

        public User GetUserHash(User u)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"SELECT * FROM JokesUsers where username= @username ";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        u = new User(Convert.ToInt32(reader["id_user"]), Convert.ToString(reader["username"]), Convert.ToString(reader["hash"]));
                    }
                    return u;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public int SaveNewUserToDB(User u)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into JokesUsers (username,hash,email) VALUES (@username,@hash,@email)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    cmd.Parameters.AddWithValue("@hash", u.Hash);
                    cmd.Parameters.AddWithValue("@email", u.Email);
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}