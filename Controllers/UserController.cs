using JokesPrj.Models;
using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace JokesPrj.Controllers
{
    public class UserController : ApiController
    {
        //Get One User from users table.
        [HttpPost]
        [Route("api/user")]
        public IHttpActionResult GetUserFromDB([FromBody] User user)
        {
            try
            {
                user = Globals.UserDAL.GetUserHash(user);
                if (user == null)
                    return Content(HttpStatusCode.NotFound, $"User {user.Username} or pass is incorrect");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/get/user")]
        public IHttpActionResult GetUserFromDB([FromBody] int id_user)
        {
            try
            {
                User u;
                u = Globals.UserDAL.GetUserByID(id_user)
                if (u == null)
                    return Content(HttpStatusCode.NotFound, $"User was not found");
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/add/user")]
        public IHttpActionResult AddNewUser([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Created(new Uri(Request.RequestUri.AbsoluteUri + user.Id_user), Globals.UserDAL.SaveNewUserToDB(user));
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
