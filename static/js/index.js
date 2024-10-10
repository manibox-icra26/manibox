window.HELP_IMPROVE_VIDEOJS = false;

// Object to store preloaded images for each folder
const preloadedImages = {};

function preloadInterpolationImages() {
  $('.interpolation-container').each(function() {
    const folder = this.dataset.folder;
    const frames = parseInt(this.dataset.frames);
    preloadedImages[folder] = [];

    for (let i = 0; i < frames; i++) {
      const path = `./static/interpolation/${folder}/${String(i).padStart(6, '0')}.jpg`;
      const img = new Image();
      img.src = path;
      preloadedImages[folder][i] = img;
    }
  });
}


function createInterpolationSlider(container) {
  const folder = container.dataset.folder;
  const frames = parseInt(container.dataset.frames);
  const sliderId = `interpolation-slider-${folder}`;
  const imageWrapperId = `interpolation-image-wrapper-${folder}`;

  const sliderHtml = `
    <div class="columns is-vcentered interpolation-panel">
      <div class="column is-3 has-text-centered">
        <img src="./static/interpolation/${folder}/000000.jpg"
             class="interpolation-image"
             alt="Start Frame"/>
        <p>Start Frame</p>
      </div>
      <div class="column interpolation-video-column">
        <div id="${imageWrapperId}">
          Loading...
        </div>
        <input class="slider is-fullwidth is-large is-info"
               id="${sliderId}"
               step="1" min="0" max="${frames - 1}" value="0" type="range">
      </div>
      <div class="column is-3 has-text-centered">
        <img src="./static/interpolation/${folder}/${String(frames - 1).padStart(6, '0')}.jpg"
             class="interpolation-image"
             alt="End Frame"/>
        <p class="is-bold">End Frame</p>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', sliderHtml);

  $(`#${sliderId}`).on('input', function(event) {
    const image = preloadedImages[folder][this.value];
    image.ondragstart = () => false;
    image.oncontextmenu = () => false;
    $(`#${imageWrapperId}`).empty().append(image);
  });

  // Set initial image
  const initialImage = preloadedImages[folder][0];
  initialImage.ondragstart = () => false;
  initialImage.oncontextmenu = () => false;
  $(`#${imageWrapperId}`).empty().append(initialImage);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
      $('.interpolation-container').each(function() {
        createInterpolationSlider(this);
      });

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    // Create sliders for each interpolation-container
    $('.interpolation-container').each(function() {
      createInterpolationSlider(this);
    });

    bulmaSlider.attach('.interpolation-container input[type="range"]');
})
