using JokesPrj.Models;
using System;
using System.Web.Http;

namespace JokesPrj.Controllers
{
    public class JokesController : ApiController
    {
        [HttpPost]
        [Route("api/new/joke")]
        public IHttpActionResult AddNewUser([FromBody] Joke joke)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Created(new Uri(Request.RequestUri.AbsoluteUri + joke.Id_user), Globals.JokeDAL.SaveNewJokeToDB(joke));
                return Ok("Joke was posted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
