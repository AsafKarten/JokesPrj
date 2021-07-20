using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class LikeController : ApiController
    {
        [HttpPost]
        [Route("api/add/like")]
        public IHttpActionResult AddNewLike([FromBody] Like like)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Created(new Uri(Request.RequestUri.AbsoluteUri + like.Id_joke), Globals.LikeDAL.CheckLikeStauts(like));
                return Ok("Like added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/get/likes")]
        //move to joke controller
        public IHttpActionResult GetJokeLikes([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Like> like_list = Globals.LikeDAL.GetAllLikes(j.Id_joke);
                Created(new Uri(Request.RequestUri.AbsoluteUri + j), like_list);
                if (like_list != null)
                {
                    return Ok(like_list);
                }
                throw new Exception("No likes on this post");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //fix this
        [HttpPost]
        [Route("api/your/likes/jokes")]
        public IHttpActionResult GetJokesUserLike([FromBody] Like L)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Like> jokes_list = Globals.LikeDAL.GetLikesJokes(L.Id_user);
                Created(new Uri(Request.RequestUri.AbsoluteUri + L), jokes_list);
                if (jokes_list != null)
                {
                    return Ok(jokes_list);
                }
                throw new Exception("Jokes not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
