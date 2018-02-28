$('.delete-link').click(function(e){
  e.preventDefault();
  var url = $(this).attr('href');
  console.log(url);
  $.ajax({
      url: url,
      method: 'DELETE'
    }).done(function() {
      window.location = '/pets';
    });
});
function autoplay() {
    $('.carousel.carousel-slider').carousel('next');
    setTimeout(autoplay, 4000);
}

$(document).ready(function() {
    $('select').material_select();
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $('.carousel').carousel({fullWidth:true});
    $('.carousel1').carousel({padding: 0});
    $('.materialboxed').materialbox();
    $(".button-collapse").sideNav();
    autoplay()

});
