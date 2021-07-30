using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class FollowController : ApiController
    {
        [HttpPost]
        [Route("api/add/follow")]
        public IHttpActionResult AddNewFollow([FromBody] Follow F)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                int res = Globals.FollowDAL.CheckFollowStauts(F);
                Created(new Uri(Request.RequestUri.AbsoluteUri + F), res);
                return Ok("follow added successfully." + res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("api/your/followers")]
        public IHttpActionResult GetYourFollowers([FromBody] Follow F)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Follow> Followers_list = Globals.FollowDAL.GetAllFollowersOfUser(F.Id_user);
                Created(new Uri(Request.RequestUri.AbsoluteUri + F), Followers_list);
                if (Followers_list != null)
                {
                    return Ok(Followers_list);
                }
                throw new Exception("No followers on this user");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
