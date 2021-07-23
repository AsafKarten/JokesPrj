using System;
using System.Net;
using System.Web.Http;
using System.Web;
using System.IO;
using static JokesPrj.Models.Image;
using JokesPrj.Models;


namespace JokesPrj.Controllers
{

    public class ImageController : ApiController
    {

        [Route("api/uploadpicture")]
        [HttpPost]
        public IHttpActionResult UploadImage([FromBody] Img image)
        {
            //create the response object
            ImgRes res = new ImgRes();

            try
            {
                //path
                string path = HttpContext.Current.Server.MapPath(@"~/Upload_users/" + image.folder);

                //create directory if not exists
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                //create the image data
                string imageName = image.name + "." + image.type;
                string imagePath = Path.Combine(path, imageName);
                byte[] imageBytes = Convert.FromBase64String(image.uri);

                //write the image and save it
                File.WriteAllBytes(imagePath, imageBytes);

                //update the resposne object
                res.path = $"{Server.GetServerUrl()}/Upload_users/{image.folder}/{imageName}";
                res.isOk = true;
                Globals.UserDAL.SaveNewPhotoToDB(res.path, int.Parse(image.folder));
                return Ok(res);
            }
            catch (Exception e)
            {
                res.message = e.Message;
                res.isOk = false;
                return Content(HttpStatusCode.BadRequest, res);
            }
        }
    }
}
