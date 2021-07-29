using JokesPrj.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;


namespace JokesPrj.Controllers
{
    public class JokesController : ApiController
    {

        [HttpGet]
        [Route("api/feed")]
        public IHttpActionResult GetFeed()
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
        public IHttpActionResult AddNewJoke([FromBody] Joke joke)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                int id_joke = Globals.JokeDAL.SaveNewJokeToDB(joke);
                Created(new Uri(Request.RequestUri.AbsoluteUri + joke.Id_user), id_joke);
                return Ok(id_joke);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/profile/feed")]
        public IHttpActionResult GetProfileFeed([FromBody] Joke j)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data.");
                }
                List<Joke> jokes_list = Globals.JokeDAL.GetYourJokes(j.Id_user);
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
