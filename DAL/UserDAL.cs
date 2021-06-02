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
                    string salted_hash = "";
                    con.Open();
                    User check_user = null;
                    string query = $"SELECT * FROM JokesUsers where username = @username";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", username);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        check_user = new Login(Convert.ToInt32(reader["id_user"]), Convert.ToString(reader["salt"]));
                    }
                    salted_hash = Globals.Encryption.EncodePassword(check_user, pass);
                    check_user = VerifyUser(check_user, salted_hash);
                    return check_user;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public User VerifyUser(User user, string salted_hash)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"SELECT * FROM JokesUsers where id_user = @id_user AND salted_hash = @salted_hash ";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", user.Id_user);
                    cmd.Parameters.AddWithValue("@salted_hash", salted_hash);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        user = new User(Convert.ToInt32(reader["id_user"]), Convert.ToString(reader["username"]), Convert.ToString(reader["email"]), Convert.ToString(reader["user_img"]));
                    }
                    return user;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Registration AddUser(Registration R)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    int x = 10;
                    string salted_hash = "";
                    string new_salt = Globals.Encryption.GeneratePassword(x);
                    User temp_user = null;
                    User new_user = null;
                    string query = $"SELECT * FROM JokesUsers where username = @username or email = @email";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", R.Username);
                    cmd.Parameters.AddWithValue("@email", R.Email);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        temp_user = new Registration(Convert.ToString(reader["username"]), Convert.ToString(reader["email"]));
                    }
                    if (temp_user != null)
                    {
                        throw new Exception("Username is already exist");
                    }
                    else
                    {
                        new_user = new User(R.Username, R.Email, new_salt);
                        salted_hash = Globals.Encryption.EncodePassword(new_user, R.Pass);
                        SaveNewUserToDB(new_user, salted_hash);
                    }
                    return R;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private void SaveNewUserToDB(User u, string salted_hash)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into JokesUsers (username,salted_hash,salt,email) VALUES (@username,@salted_hash,@salt,@email)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    cmd.Parameters.AddWithValue("@salted_hash", salted_hash);
                    cmd.Parameters.AddWithValue("@salt", u.Salt);
                    cmd.Parameters.AddWithValue("@email", u.Email);
                    int res = cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}