## Website Performance Optimization portfolio project

After learning about the critical rendering path in [Website Performance Optimization](https://www.udacity.com/course/ud884), and learning about RAIL (Response, Animate, Idle and Load) the four major life cycles of a web app in [Browser Rendering Optimization](https://www.udacity.com/course/ud860), I was given this project to apply what techniques I had learned.

### Getting started

####Part 1: Running the final project

The final project can be seen at [https://reye.sh/frontend-nanodegree-mobile-portfolio](https://reye.sh/frontend-nanodegree-mobile-portfolio). If you need to see the code, it's in the branch `gh-pages` in this repository.

####Part 2: Optimization that were preformed.

##### 1) 60fps on scrolling in views/pizza.html

In the original code the scrolling pizzas caused jank while in animation. The following problems where found:

1. The animation was done while the scroll event actived. In other words as the browser was scrolling the function was kept being called on. 
1. The actual function that animated the pizza was causing layout trashing
1. There was over 200 pizzas animating and of them only about 18 were on onscreen.

The following code shows how I tackled these issues:

```javascript
// the following variables are needed to scroll background pizza. They are animated using
// requestAnimationFrame (in scrollAnimate function) once and on the first scroll, and
// requestAnimationFrame is stopped when the user stops scrolling.

var timer = null;
var flag = 0;
var requestId = 0;
var items = 0;
// the following is used to detect firefox, used in scrollAnimate for scrollTop property.
var raf = window.mozRequestAnimationFrame || 1;

// runs updatePositions on Load, this is the only time this function is ever called to set the pizzas in place.
// window.addEventListener('scroll', updatePositions);
// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', function() {
  var cols = 6;
  var s = 256;
  for (var i = 0; i < 18; i++) {
    var elem = document.createElement('img');
    elem.className = 'mover';
    elem.src = "images/pizza.png";
    elem.style.height = "100px";
    elem.style.width = "73.333px";
    elem.basicLeft = (i % cols) * s;
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    document.querySelector("#movingPizzas1").appendChild(elem);
  }
  updatePositions();
  // items is ran once, used to be part of animation, since it only need to run once i decided to put it here.
  items = document.getElementsByClassName('mover');
});
// the following function allows to run animation on scroll once, and then stop when user stops scrolling.
// code was found on stackoverflow.com, sorry :( but I couldn't find the exact link, but there are many examples.
window.addEventListener('scroll', function() {
    if(timer !== null) {
        if( flag === 0 ) {
          // flag is set to one to run the scrollAnimate function only once.
          flag = 1;
          scrollAnimate();
        }
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
          // scrolling is stopped
          // cancels the requestAnimationFrame recursive loop.
          cancelAnimationFrame(requestId);
          requestId = undefined;
          // reset flag to 0, to start the next scrollAnimate on scroll.
          flag = 0;
    }, 200);
}, false);

function scrollAnimate() {
  // console.log('yay!: '+raf);
  if (raf!=1){
    // code for firefox
    var docuBodyscrollTop = document.documentElement.scrollTop;
  } else {
    // code for chrome
    var docuBodyscrollTop = document.body.scrollTop;
  }
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((docuBodyscrollTop / 1250) + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }
  requestId = requestAnimationFrame(scrollAnimate);
}
```
pretty awesome! huh?

##### 2) Pizza resizing in less than 5 ms in views/pizza.html

In the original code once the slider was moved to resize the pizzas on the screen, the function took more than 200ms to complete.

1. The main culprit for this is layout trashing.

In the following example I moved necessary statements from the for loop. The statements accessed layout causing jankiness. 

```javascript
  function changePizzaSizes(size) {
    //Since the following three statements generate the same values when the function is ran
    //I moved them out of the for loop, this elimates layout thrashing.
    var rPizzaClength = document.getElementsByClassName("randomPizzaContainer").length;
    var dx = determineDx(document.getElementsByClassName("randomPizzaContainer")[0], size);
    var newwidth = (document.getElementsByClassName("randomPizzaContainer")[0].offsetWidth + dx) + 'px';
    for (var i = 0; i < rPizzaClength; i++) {
      document.getElementsByClassName("randomPizzaContainer")[i].style.width = newwidth;
    }
  }
```

##### 3) Achieving PageSpeed score of 90/100 on index.html









####Part 1: Optimize PageSpeed Insights score for index.html

Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights! Optional: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

Profile, optimize, measure... and then lather, rinse, and repeat. Good luck!

####Part 2: Optimize Frames per Second in pizza.html

To optimize views/pizza.html, you will need to modify views/js/main.js until your frames per second rate is 60 fps or higher. You will find instructive comments in main.js. 

You might find the FPS Counter/HUD Display useful in Chrome developer tools described here: [Chrome Dev Tools tips-and-tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks).

### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

### Customization with Bootstrap
The portfolio was built on Twitter's <a href="http://getbootstrap.com/">Bootstrap</a> framework. All custom styles are in `dist/css/portfolio.css` in the portfolio repo.

* <a href="http://getbootstrap.com/css/">Bootstrap's CSS Classes</a>
* <a href="http://getbootstrap.com/components/">Bootstrap's Components</a>

### Sample Portfolios

Feeling uninspired by the portfolio? Here's a list of cool portfolios I found after a few minutes of Googling.

* <a href="http://www.reddit.com/r/webdev/comments/280qkr/would_anybody_like_to_post_their_portfolio_site/">A great discussion about portfolios on reddit</a>
* <a href="http://ianlunn.co.uk/">http://ianlunn.co.uk/</a>
* <a href="http://www.adhamdannaway.com/portfolio">http://www.adhamdannaway.com/portfolio</a>
* <a href="http://www.timboelaars.nl/">http://www.timboelaars.nl/</a>
* <a href="http://futoryan.prosite.com/">http://futoryan.prosite.com/</a>
* <a href="http://playonpixels.prosite.com/21591/projects">http://playonpixels.prosite.com/21591/projects</a>
* <a href="http://colintrenter.prosite.com/">http://colintrenter.prosite.com/</a>
* <a href="http://calebmorris.prosite.com/">http://calebmorris.prosite.com/</a>
* <a href="http://www.cullywright.com/">http://www.cullywright.com/</a>
* <a href="http://yourjustlucky.com/">http://yourjustlucky.com/</a>
* <a href="http://nicoledominguez.com/portfolio/">http://nicoledominguez.com/portfolio/</a>
* <a href="http://www.roxannecook.com/">http://www.roxannecook.com/</a>
* <a href="http://www.84colors.com/portfolio.html">http://www.84colors.com/portfolio.html</a>
