using System;
using System.Security.Cryptography;
using System.Text;

namespace JokesPrj.Models
{
    public class Encryption
    {
        public string GeneratePassword(int length) //length of salt    
        {
            const string allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
            var randNum = new Random();
            var chars = new char[length];
            var allowedCharCount = allowedChars.Length;
            for (var i = 0; i <= length - 1; i++)
            {
                chars[i] = allowedChars[Convert.ToInt32((allowedChars.Length) * randNum.NextDouble())];
            }
            return new string(chars);
        }
        public string EncodePassword(User user, string pass) //encrypt password    
        {
            byte[] bytes = Encoding.Unicode.GetBytes(pass);
            byte[] src = Encoding.Unicode.GetBytes(user.Salt);
            byte[] dst = new byte[src.Length + bytes.Length];
            Buffer.BlockCopy(src, 0, dst, 0, src.Length);
            Buffer.BlockCopy(bytes, 0, dst, src.Length, bytes.Length);
            HashAlgorithm algorithm = HashAlgorithm.Create("SHA256");
            byte[] inArray = algorithm.ComputeHash(dst);
            //return Convert.ToBase64String(inArray);    
            return EncodePasswordSha256(Convert.ToBase64String(inArray));
        }
        public string EncodePasswordSha256(string pass) //Encrypt using SHA256    
        {
            Byte[] originalBytes;
            Byte[] encodedBytes;
            SHA256 sha256;
            //Instantiate MD5CryptoServiceProvider, get bytes for original password and compute hash (encoded password)    
            sha256 = new SHA256CryptoServiceProvider();
            originalBytes = ASCIIEncoding.Default.GetBytes(pass);
            encodedBytes = sha256.ComputeHash(originalBytes);
            //Convert encoded bytes back to a 'readable' string    
            return BitConverter.ToString(encodedBytes);
        }
    }
}