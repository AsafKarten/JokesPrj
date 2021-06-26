﻿using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace JokesPrj.DAL
{
    public class JokeDAL
    {
        private readonly string conStr;
        public JokeDAL(string conStr)
        {
            this.conStr = conStr;
        }
        public int SaveNewJokeToDB(Joke j)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    string query = $"Insert into Jokes (id_user,joke_title,joke_body) VALUES (@id_user,@joke_title,@joke_body)";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@id_user", SqlDbType.Int).Value = j.Id_user;
                    cmd.Parameters.AddWithValue("@joke_title", SqlDbType.NVarChar).Value = j.Joke_title;
                    cmd.Parameters.AddWithValue("@joke_body", SqlDbType.NVarChar).Value = j.Joke_body;
                    int res = cmd.ExecuteNonQuery();
                    return res;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Joke> GetJokes(string title)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    con.Open();
                    List<Joke> jokeList = new List<Joke>();
                    Joke joke = null;
                    string query = $"SELECT * FROM Jokes where joke_title=@joke_title";
                    SqlCommand cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@joke_title", title);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (!reader.Read())
                    {
                        return null;
                    }
                    while (reader.Read())
                    {
                        joke = new Joke(
                            Convert.ToInt16(reader["id_user"]),
                            Convert.ToString(reader["joke_title"]),
                            Convert.ToString(reader["joke_body"])
                            );
                        jokeList.Add(joke);
                    }
                    return jokeList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}

