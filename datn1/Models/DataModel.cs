using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class DataModel
    {
        public List<DataModel> ListModel = new List<DataModel>();
        public string name { get; set; }
        public int price { get; set; }
        public string date { get; set; }
        public string email { get; set; }
        public string department { get; set; }
    }
}
