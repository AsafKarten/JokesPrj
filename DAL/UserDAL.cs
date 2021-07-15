using JokesPrj.Models;
using System;
using System.Data;
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
                        u = new User(Convert.ToInt32(reader["id_user"]), Convert.ToString(reader["username"]), Convert.ToString(reader["phash"]), Convert.ToString(reader["user_img"]));
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
                    string query = $"Insert into JokesUsers (username,phash,email) VALUES (@username,@phash,@email)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = u.Username;
                    cmd.Parameters.AddWithValue("@phash", SqlDbType.NVarChar).Value = u.Hash;
                    cmd.Parameters.AddWithValue("@email", SqlDbType.NVarChar).Value = u.Email;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public int UpdateUserImageOnPosts(string path, int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Update Jokes Set user_img=@user_img where id_user=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@user_img ", SqlDbType.NVarChar).Value = path;
                    cmd.Parameters.AddWithValue("@id", SqlDbType.Int).Value = id;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public int SaveNewPhotoToDB(string path, int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Update JokesUsers Set user_img=@user_img where id_user=@id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@user_img ", SqlDbType.NVarChar).Value = path;
                    cmd.Parameters.AddWithValue("@id", SqlDbType.Int).Value = id;
                    int res = cmd.ExecuteNonQuery();
                    int rows = UpdateUserImageOnPosts(path, id);
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