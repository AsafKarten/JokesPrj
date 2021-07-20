using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class CommentController : ApiController
    {
        [HttpPost]
        [Route("api/get/comments")]
        //move to joke
        public IHttpActionResult GetJokeComments([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Comment> comment_list = Globals.CommentDAL.GetAllComments(j.Id_joke);
                Created(new Uri(Request.RequestUri.AbsoluteUri + j), comment_list);
                if (comment_list != null)
                {
                    return Ok(comment_list);
                }
                throw new Exception("no Comments on this post");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("api/add/comment")]
        public IHttpActionResult AddNewComment([FromBody] Comment comment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Created(new Uri(Request.RequestUri.AbsoluteUri + comment.Id_joke), Globals.CommentDAL.AddNewCommentToDB(comment));
                return Ok("Comment added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
