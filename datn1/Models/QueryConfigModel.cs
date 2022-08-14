using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class QueryConfigModel
    {
        public List<QueryConfigModel> ListModel = new List<QueryConfigModel>();
        public string tb { get; set; }
        public string cols { get; set; }
        public string w { get; set; }
        public string o { get; set; }
        public string l { get; set; }
        public string d { get; set; }
        public page pg { get; set; }
    }
    public class page
    {
        public string trang { get; set; }
        public string recordNumber { get; set; }
    }
}
