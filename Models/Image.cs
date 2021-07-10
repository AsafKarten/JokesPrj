

namespace JokesPrj.Models
{
    public class Image
    {
        public class Img
        {
            public string uri { get; set; }
            public string name { get; set; }
            public string folder { get; set; }
            public string type { get; set; }
        }

        public class ImgRes
        {
            public string message { get; set; }
            public string path { get; set; }
            public bool isOk { get; set; }
        }
    }
}