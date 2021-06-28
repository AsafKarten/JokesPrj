using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace JokesPrj.Controllers
{
    public class JokesController : ApiController
    {
        public IHttpActionResult Get()
        {
            try
            {
                List<Joke> jokes = Globals.JokeDAL.GetAllJokes();
                return Ok(jokes);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

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
        public IHttpActionResult GetJoke([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Joke joke = Globals.JokeDAL.GetJoke(j);
                Created(new Uri(Request.RequestUri.AbsoluteUri + j), joke);
                if (joke != null)
                {
                    return Ok(joke);
                }
                throw new Exception("Jokes not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/search/joke")]
        public IHttpActionResult GetJokes([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                Joke joke = Globals.JokeDAL.GetJoke(j);
                Created(new Uri(Request.RequestUri.AbsoluteUri + j), joke);
                if (joke != null)
                {
                    return Ok(joke);
                }
                throw new Exception("Jokes not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/search/jokes")]
        public IHttpActionResult GetAllJokes([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Joke> jokes_list = Globals.JokeDAL.GetAllJokes(j);
                Created(new Uri(Request.RequestUri.AbsoluteUri + j), jokes_list);
                if (jokes_list != null)
                {
                    return Ok(jokes_list);
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
