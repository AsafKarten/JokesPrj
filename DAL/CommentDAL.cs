using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace JokesPrj.DAL
{
    public class CommentDAL
    {
        private readonly string conStr;

        public CommentDAL(string conStr)
        {
            this.conStr = conStr;
        }


        public List<Comment> GetAllComments(int id_joke)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    Comment C = null;
                    List<Comment> commentList = new List<Comment>();
                    string query = $"SELECT * FROM JokesComments WHERE id_joke= @id_joke";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_joke", id_joke);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader == null)
                    {
                        return commentList;
                    }
                    while (reader.Read())
                    {
                        C = new Comment(
                            Convert.ToInt32(reader["comment_id"]),
                            Convert.ToInt32(reader["id_joke"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToString(reader["comment_body"]),
                            Convert.ToDateTime(reader["comment_date"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToString(reader["username"])
                            );
                        commentList.Add(C);
                    }
                    return commentList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public int AddNewCommentToDB(Comment comment)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into JokesComments (id_joke,id_user,comment_body,comment_date,user_img,username) VALUES (@id_joke,@id_user,@comment_body,@comment_date,@user_img,@username)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_joke", SqlDbType.Int).Value = comment.Id_joke;
                    cmd.Parameters.AddWithValue("@id_user", SqlDbType.Int).Value = comment.Id_user;
                    cmd.Parameters.AddWithValue("@comment_body", SqlDbType.NVarChar).Value = comment.Comment_body;
                    cmd.Parameters.AddWithValue("@comment_date", SqlDbType.DateTime).Value = comment.Comment_date;
                    cmd.Parameters.AddWithValue("@user_img", SqlDbType.NVarChar).Value = comment.User_img;
                    cmd.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = comment.Username;
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