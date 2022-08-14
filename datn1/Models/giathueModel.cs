using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class giathueModel
    {
        public List<giathueModel> ListModel = new List<giathueModel>();
        public int id { get; set; }
        public string madnht { get; set; }
        public string makcn { get; set; }
        public string thuedat { get; set; }
        public string thuenhaxuong { get; set; }
        public string phisdht { get; set; }
        public string phixlnt { get; set; }
        public string phidien { get; set; }
        public string phinuoc { get; set; }
        public string phidt { get; set; }
        public string phiinternet { get; set; }
        public string phivsmt { get; set; }
    }
}
