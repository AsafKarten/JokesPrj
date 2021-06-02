using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JokesPrj.Models
{
    public static class Server
    {
        public static string GetServerUrl()
        {
            var request = HttpContext.Current.Request;

            return request.Url.Scheme + "://" + request.Url.Authority + request.ApplicationPath.TrimEnd('/');
        }
    }
}