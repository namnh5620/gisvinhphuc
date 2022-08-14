using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class fileModel
    {
        public List<fileModel> ListModel = new List<fileModel>();
        public int id { get; set; }
        public string name { get; set; }
        public string url { get; set; }
        public string objtype { get; set; }
        public string objid { get; set; }
    }
}
