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
        [HttpPost]
        public IHttpActionResult UploadImage([FromBody] Img image)
        {
            //create the response object
            ImgRes res = new ImgRes();

            try
            {
                //path
                string path = HttpContext.Current.Server.MapPath(@"~/upload/" + image.folder);

                //create directory if not exists
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                //create the image data
                string imageName = image.name + ".jpg";
                string imagePath = Path.Combine(path, imageName);
                byte[] imageBytes = Convert.FromBase64String(image.base64);

                //write the image and save it
                File.WriteAllBytes(imagePath, imageBytes);

                //update the resposne object
                res.path = $"{Server.GetServerUrl()}/{image.folder}/{imageName}";
                res.isOk = true;

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
