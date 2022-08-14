using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class UsersModel
    {
        public List<UsersModel> ListModel = new List<UsersModel>();
        public string taikhoan { get; set; }
        public string matkhau { get; set; }
        public string email { get; set; }
        public string phonenumber { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string type { get; set; }
        public string activate { get; set; }
        public string madnht { get; set; }
        public string makcn { get; set; }
    }
}
