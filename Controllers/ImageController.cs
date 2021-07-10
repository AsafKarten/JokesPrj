using System;
using System.Net;
using System.Web.Http;
using System.Web;
using System.IO;
using static JokesPrj.Models.Image;
using JokesPrj.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Data.SqlClient;
using System.Data;

namespace JokesPrj.Controllers
{

    public class ImageController : ApiController
    {
        //public Task<HttpResponseMessage> Post([FromBody]  image)
        //{
        //    string output = "start---";
        //    List<string> savedFilePath = new List<string>();
        //    if (!Request.Content.IsMimeMultipartContent())
        //    {
        //        throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
        //    }
        //    string rootPath = HttpContext.Current.Server.MapPath("~/uploadFiles");
        //    var provider = new MultipartFileStreamProvider(rootPath);
        //    var task = Request.Content.ReadAsMultipartAsync(provider).
        //    ContinueWith<HttpResponseMessage>(t =>
        //    {
        //        if (t.IsCanceled || t.IsFaulted)
        //        {
        //            Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
        //        }

        //        foreach (MultipartFileData item in provider.FileData)
        //        {
        //            try
        //            {
        //                output += " ---here";
        //                string name = item.Headers.ContentDisposition.FileName.Replace("\"", "");
        //                output += " ---here2=" + name;
        //                //need the guid because in react native in order to refresh an inamge it has to have a new name
        //                string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + Guid.NewGuid() +
        //                Path.GetExtension(name);
        //                //string newFileName = name + "" + Guid.NewGuid();
        //                output += " ---here3" + newFileName;
        //                //delete all files begining with the same name
        //                string[] names = Directory.GetFiles(rootPath);
        //                foreach (var fileName in names)
        //                {
        //                    if (Path.GetFileNameWithoutExtension(fileName).IndexOf(Path.GetFileNameWithoutExtension(name)) != -1)
        //                    {
        //                        File.Delete(fileName);
        //                    }
        //                }
        //                //File.Move(item.LocalFileName, Path.Combine(rootPath, newFileName));
        //                File.Copy(item.LocalFileName, Path.Combine(rootPath, newFileName), true);
        //                File.Delete(item.LocalFileName);
        //                output += " ---here4";
        //                Uri baseuri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, string.Empty));
        //                output += " ---here5";
        //                string fileRelativePath = "~/uploadFiles/" + newFileName;
        //                output += " ---here6 imageName=" + fileRelativePath;
        //                Uri fileFullPath = new Uri(baseuri, VirtualPathUtility.ToAbsolute(fileRelativePath));
        //                output += " ---here7" + fileFullPath.ToString();
        //                savedFilePath.Add(fileFullPath.ToString());
        //            }
        //            catch (Exception ex)
        //            {
        //                output += " ---excption=" + ex.Message;
        //                string message = ex.Message;
        //            }
        //        }
        //        return Request.CreateResponse(HttpStatusCode.Created, savedFilePath[0] + "!" + provider.FileData.Count + "!" + output);
        //    });
        //    return task;
        //}
        [Route("api/uploadpicture")]
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
                string imageName = image.name + "." + image.type;
                string imagePath = Path.Combine(path, imageName);
                byte[] imageBytes = Convert.FromBase64String(image.uri);

                //write the image and save it
                File.WriteAllBytes(imagePath, imageBytes);

                //update the resposne object
                res.path = $"{Server.GetServerUrl()}/upload/{image.folder}/{imageName}";
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
