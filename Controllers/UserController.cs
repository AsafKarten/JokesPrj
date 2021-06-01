using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class UserController : ApiController
    {
        //Get One User from users table.
        [HttpPost]
        [Route("api/user")]
        public IHttpActionResult GetUserFromDB([FromBody] Login L)
        {
            try
            {
                User user = new User();
                user = Globals.UserDAL.GetUser(L.Username, L.Pass);
                if (user == null)
                    return Content(HttpStatusCode.NotFound, $"User {L.Username} or pass is incorrect");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
