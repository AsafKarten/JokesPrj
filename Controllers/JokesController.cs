using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace JokesPrj.Controllers
{
    [EnableCorsAttribute("*", "*", "*")]
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

        [HttpPost]
        [Route("api/search/joke")]
        public IHttpActionResult GetJoke([FromBody] string title)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Joke> joke_list = Globals.JokeDAL.GetJokes(title);
                Created(new Uri(Request.RequestUri.AbsoluteUri + title), joke_list);
                if (joke_list != null)
                {
                    return Ok(joke_list);
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
