function autoplay() {
  $('.carousel.carousel-slider').carousel('next');
  setTimeout(autoplay, 4000);
}

$(document).ready(function() {
  $('select').material_select();
  $('.carousel1').carousel();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
  $('.carousel').carousel({fullWidth: true});
  $('.materialboxed').materialbox();
  $(".button-collapse").sideNav();

  autoplay()

  $('.delete-link').on('click', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    console.log("Delete route");
    $.ajax({
        url: url,
        method: 'DELETE'
      }).done(function() {
        window.location = '/pets';
    });
  });

  $('.edit-profile').on('submit', function(e){
    e.preventDefault();
    var edits = $(this);
    var url = edits.attr('action');
    var changes = edits.serialize();
    $.ajax({
      method: 'PUT',
      url: url,
      data: changes
    }).done(function(data){
      window.location = '/';
    });
  });

});
