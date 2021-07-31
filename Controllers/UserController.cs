using JokesPrj.Models;
using System;
using System.Net;
using System.Web.Http;

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
                User checked_user = null;
                checked_user = Globals.UserDAL.GetUserHash(user);
                if (checked_user != null)
                    return Ok(checked_user);
                return Content(HttpStatusCode.NotFound, $"User {user.Username} or pass is incorrect");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/user/id")]
        public IHttpActionResult GetUserByIdFromDB([FromBody] User user)
        {
            try
            {
                user = Globals.UserDAL.GetUser(user);
                if (user == null)
                    return Content(HttpStatusCode.NotFound, "error update user");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/get/user")]
        public IHttpActionResult GetUserFriendFromDB([FromBody] User u)
        {
            try
            {

                u = Globals.UserDAL.GetUserByID(u.Id_user);
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
        [Route("api/get/externalUser")]
        public IHttpActionResult GetExternalUserFromDB([FromBody] User u)
        {
            try
            {
                u = Globals.UserDAL.GetUserByIDExternal(u.Id_external);
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
                Created(new Uri(Request.RequestUri.AbsoluteUri + user), Globals.UserDAL.SaveNewUserToDB(user));
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/edit/user")]
        public IHttpActionResult UpdateDetailsUser([FromBody] User user)
        {
            try
            {
                user = Globals.UserDAL.GetUpdatedUser(user);
                if (user == null)
                    return Content(HttpStatusCode.NotFound, $"User was not updated");
                return Ok(user);
            }
            catch (Exception ex)
            {
                
                return BadRequest(ex.Message);
            }
        }
    }
}
