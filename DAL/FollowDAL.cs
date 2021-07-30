using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace JokesPrj.DAL
{
    public class FollowDAL
    {
        private readonly string conStr;
        public FollowDAL(string conStr)
        {
            this.conStr = conStr;
        }

        public int CheckFollowStauts(Follow f)
        {
            int res = 0;
            bool status = true;
            User logged_user;
            User target_user;
            logged_user = Globals.UserDAL.GetUserByID(f.Id_user);
            target_user = Globals.UserDAL.GetUserByID(f.Target_id);

            List<Follow> userFollowList;
            userFollowList = GetAllFollowing(f.Id_user);
            foreach (Follow item in userFollowList)
            {
                if (item.Target_id.Equals(f.Target_id))
                {
                    status = false;
                    f = item;
                }
            }
            if (status == false)
            {
                res = UnFollowFromDB(f);
                Globals.UserDAL.UpdateIFollow(logged_user, status);
                Globals.UserDAL.UpdateFollowMe(target_user, status);

            }
            else
            {
                res = AddNewFollowToDB(f);
                Globals.UserDAL.UpdateIFollow(logged_user, status);
                Globals.UserDAL.UpdateFollowMe(target_user, status);
            }
            return res;
        }



        private int AddNewFollowToDB(Follow f)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into Follow (id_user,target_id,target_img,target_username,user_img,username) VALUES (@id_user,@target_id,@target_img,@target_username,@user_img,@username)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", SqlDbType.Int).Value = f.Id_user;
                    cmd.Parameters.AddWithValue("@target_id", SqlDbType.Int).Value = f.Target_id;
                    cmd.Parameters.AddWithValue("@target_img", SqlDbType.NVarChar).Value = f.Target_img;
                    cmd.Parameters.AddWithValue("@target_username", SqlDbType.NVarChar).Value = f.Username;
                    cmd.Parameters.AddWithValue("@user_img", SqlDbType.NVarChar).Value = f.User_img;
                    cmd.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = f.Username;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private int UnFollowFromDB(Follow f)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    SqlCommand sql_cmnd = new SqlCommand("RemoveFollower", con);
                    sql_cmnd.CommandType = CommandType.StoredProcedure;
                    sql_cmnd.Parameters.AddWithValue("@ID", SqlDbType.Int).Value = f.Follow_id;
                    int res = sql_cmnd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        private List<Follow> GetAllFollowing(int id_user)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    Follow F = null;
                    List<Follow> followList = new List<Follow>();
                    string query = $"SELECT * FROM Follow WHERE id_user= @id_user";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", id_user);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader == null)
                    {
                        return followList;
                    }
                    while (reader.Read())
                    {
                        F = new Follow(
                            Convert.ToInt32(reader["follow_id"]),
                            Convert.ToInt32(reader["id_user"]),
                            Convert.ToInt32(reader["target_id"]),
                            Convert.ToString(reader["target_img"]),
                            Convert.ToString(reader["target_username"]),
                            Convert.ToString(reader["user_img"]),
                            Convert.ToString(reader["username"])
                            );
                        followList.Add(F);
                    }
                    return followList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public List<Follow> GetAllFollowersOfUser(int id_user)
        {
            try
            {
                Follow F = null;
                List<Follow> Followers = new List<Follow>();
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"SELECT * FROM Follow WHERE target_id= @id_user";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", id_user);
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        F = new Follow(
                            Convert.ToInt32(reader["follow_id"]),
                            Convert.ToInt32(reader["target_id"]),
                            Convert.ToString(reader["target_username"]),
                            Convert.ToString(reader["target_img"])

                            );
                        Followers.Add(F);
                    }
                }
                return Followers;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}