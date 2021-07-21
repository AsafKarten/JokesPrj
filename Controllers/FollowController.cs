using JokesPrj.Models;
using System;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class FollowController : ApiController
    {
        [HttpPost]
        [Route("api/add/follow")]
        public IHttpActionResult AddNewLike([FromBody] Follow F)
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
    }
}
