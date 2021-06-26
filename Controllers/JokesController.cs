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

        [HttpGet]
        [Route("api/search/title")]
        public IHttpActionResult GetJoke(string title)
        {
            try
            {
                List<Joke> joke_list = Globals.JokeDAL.GetJokes(title);
                if (joke_list != null)
                    return Ok(joke_list);
                else
                    throw new Exception("No jokes found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
