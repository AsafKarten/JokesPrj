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

                User user = new Login();
                user = Globals.UserDAL.GetUserSalt(L.Username, L.Pass);
                if (user == null)
                    return Content(HttpStatusCode.NotFound, $"User {L.Username} or pass is incorrect");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/add/user")]
        public IHttpActionResult AddNewUser([FromBody] Registration user)
        {
            try
            {
                user = Globals.UserDAL.AddUser(user);
                if (user != null)
                    return Ok($"User created Successfully");
                return Content(HttpStatusCode.NotFound, $"User {user.Username} is allready exist ");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
