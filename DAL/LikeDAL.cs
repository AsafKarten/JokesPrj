using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace JokesPrj.DAL
{
    public class LikeDAL
    {
        private readonly string conStr;

        public LikeDAL(string conStr)
        {
            this.conStr = conStr;
        }
        //TODO: Fix it, need to fix the decremnet when i want to remove like on other joke
        public int CheckLikeStauts(Like L)
        {
            int res=0;
            bool status = false;
            Joke current;
            current = Globals.JokeDAL.GetJoke(L.Id_joke);
            List<Like> likes;
            likes = GetAllLikes(L.Id_joke);
            foreach (Like item in likes)
            {
                if (item.Id_user.Equals(L.Id_user))
                {
                    status = false;
                }

            }
            if (status == true)
            {
                Globals.JokeDAL.DecrementLike(current);
                res = RemoveLikeFromDB(L.Like_id);
            }
            else
            {
                Globals.JokeDAL.IncrementLike(current);
                res = AddNewLikeToDB(L);
            }
            return res;
        }

        public int RemoveLikeFromDB(int like_id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Delete from JokesLikes where like_id= @like_id";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@like_id", SqlDbType.Int).Value = like_id;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public int AddNewLikeToDB(Like like)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into JokesLikes (id_joke,id_user,user_img,username) VALUES (@id_joke,@id_user,@user_img,@username)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_joke", SqlDbType.Int).Value = like.Id_joke;
                    cmd.Parameters.AddWithValue("@id_user", SqlDbType.Int).Value = like.Id_user;
                    cmd.Parameters.AddWithValue("@user_img", SqlDbType.NVarChar).Value = like.User_img;
                    cmd.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = like.Username;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public List<Like> GetAllLikes(int id_joke)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    Like L = null;
                    List<Like> likeList = new List<Like>();
                    string query = $"SELECT * FROM JokesLikes WHERE id_joke= @id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_joke", id_joke);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader == null)
                    {
                        return likeList;
                    }
                    while (reader.Read())
                    {
                        L = new Like(
                            Convert.ToInt32(reader["like_id"]),
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToString(reader["username"])
                            );
                        likeList.Add(L);
                    }
                    return likeList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}