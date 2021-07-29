using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using static JokesPrj.Models.Image;

namespace JokesPrj.DAL
{
    public class JokeDAL
    {
        private readonly string conStr;
        public JokeDAL(string conStr)
        {
            this.conStr = conStr;
        }

        public int SaveNewPhotoToDB(string path, int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Update Jokes Set joke_img=@joke_img where id_joke=@id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_img ", SqlDbType.NVarChar).Value = path;
                    cmd.Parameters.AddWithValue("@id_joke", SqlDbType.Int).Value = id;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }




        public int SaveNewJokeToDB(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into Jokes (id_user,joke_title,joke_body,joke_like,username,user_img,comment_count) VALUES (@id_user,@joke_title,@joke_body,@joke_like,@username,@user_img,@comment_count)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", SqlDbType.Int).Value = j.Id_user;
                    cmd.Parameters.AddWithValue("@joke_title", SqlDbType.NVarChar).Value = j.Joke_title;
                    cmd.Parameters.AddWithValue("@joke_body", SqlDbType.NVarChar).Value = j.Joke_body;
                    cmd.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = j.Username;
                    cmd.Parameters.AddWithValue("@user_img", SqlDbType.NVarChar).Value = j.User_img;
                    cmd.Parameters.AddWithValue("@joke_like", SqlDbType.Int).Value = 0;
                    cmd.Parameters.AddWithValue("@comment_count", SqlDbType.Int).Value = 0;
                    int res = cmd.ExecuteNonQuery();
                    int joke_id = GetJokeID(j);
                    return joke_id;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private int GetJokeID(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    string img = j.Joke_img;
                    con.Open();
                    string query = $"SELECT * FROM Jokes WHERE joke_title= @joke_title and username= @username and joke_body= @joke_body";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_title", j.Joke_title);
                    cmd.Parameters.AddWithValue("@joke_body", j.Joke_body);
                    cmd.Parameters.AddWithValue("@username", j.Username);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                    return j.Id_joke;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Joke GetJoke(int id_joke)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    Joke j = null;
                    string query = $"SELECT * FROM Jokes WHERE id_joke= @id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_joke", id_joke);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["joke_img"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                    return j;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        public List<Joke> GetYourJokes(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    Joke j = null;
                    List<Joke> jokeList = new List<Joke>();
                    string query = $"SELECT * FROM Jokes WHERE id_user= @id_user";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", id);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader == null)
                    {
                        return jokeList;
                    }
                    while (reader.Read())
                    {
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["joke_img"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                        jokeList.Add(j);
                    }
                    return jokeList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public List<Joke> RetriveJokesList(List<Like> likeList)
        {
            List<Joke> fullListJokes = new List<Joke>();
            foreach (Like item in likeList)
            {
                Joke j = null;
                j = GetJoke(item.Id_joke);
                fullListJokes.Add(j);
            }
            return fullListJokes;
        }

        public Joke GetJoke(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"SELECT * FROM Jokes WHERE joke_title= @joke_title";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_title", j.Joke_title);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["joke_img"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                    return j;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Joke> GetAllJokes(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    List<Joke> jokeList = new List<Joke>();
                    string query = $"SELECT * FROM Jokes WHERE joke_title= @joke_title";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_title", j.Joke_title);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader == null)
                    {
                        return jokeList;
                    }
                    while (reader.Read())
                    {
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["joke_img"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                        jokeList.Add(j);
                    }
                    return jokeList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Joke> GetAllJokes()
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {

                    List<Joke> jokes = new List<Joke>();
                    Joke j = null;
                    string query = "select * from Jokes";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Connection.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        j = new Joke(
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["joke_like"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"]),
                            Convert.ToString(reader["joke_img"]),
                            Convert.ToString(reader["username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToInt32(reader["comment_count"])
                            );
                        jokes.Add(j);
                    }
                    return jokes;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public int IncrementLike(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    int like_counter = 0;
                    if (j.Joke_like == 0)
                    {
                        like_counter = 1;
                    }
                    else
                    {
                        like_counter = j.Joke_like + 1;
                    }
                    con.Open();
                    string query = $"UPDATE Jokes SET joke_like= @joke_like WHERE id_joke= @id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_like ", SqlDbType.Int).Value = like_counter;
                    cmd.Parameters.AddWithValue("@id_joke", SqlDbType.Int).Value = j.Id_joke;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public int DecrementLike(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    int like_counter = j.Joke_like - 1;
                    con.Open();
                    string query = $"Update Jokes Set joke_like=@joke_like where id_joke=@id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_like ", SqlDbType.Int).Value = like_counter;
                    cmd.Parameters.AddWithValue("@id_joke", SqlDbType.Int).Value = j.Id_joke;
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
