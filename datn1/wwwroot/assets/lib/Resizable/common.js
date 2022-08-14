function to_delete_url(url)
{
    if(confirm('Ban co muon xoa khong?'))
        window.location.href=url;
}

function _showHide(id)
{
	var element = document.getElementById(id);
	var style = element.style;
	if(style.display == "none")
	    style.display = "";
    else
	    style.display = "none";
}

function popup (name,width,height) { 
     var options = "toolbar=0,location=1,directories=1,status=1,menubar=1,scrollbars=1,resizable=1, width="+width+",height="+height; 
     Cal2=window.open(name,"popup",options); 
}


function loadToday()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = dd+'/'+mm+'/'+yyyy;
    document.write(today);
}


$(document).ready(function() {
    $('.multi-carousel').carousel({
        interval: 3000
})

$('.multi-carousel .item').each(function(){
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
      
      for (var i=0;i<2;i++) {
        next=next.next();
        if (!next.length) {
    	    next = $(this).siblings(':first');
  	    }
        
        next.children(':first-child').clone().appendTo($(this));
      }
    }); 
});

function showPicture(imageUrl) {
    document.getElementById("previewImage").innerHTML = "<img  class='img-responsive' src='" + imageUrl + "'>";
}

function showPdf(pdfPath) {
    document.getElementById("previewImage").innerHTML = "<object type='application/pdf' height='800px' width='96%' data='/files/attach/" + pdfPath + "'></ xsl:attribute ></object>";
}