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
  var docuBodyscrollTop;
  if (raf!=1){
    // code for firefox
    docuBodyscrollTop = document.documentElement.scrollTop;
  } else {
    // code for chrome
    docuBodyscrollTop = document.body.scrollTop;
  }
  // the following for loop moves all the pizzas at a time.
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((docuBodyscrollTop / 1250) + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }
  // instead of calling scrollAnimate function every time scroll is invoked I dicided
  // to used requestAnimationFrame
  requestId = requestAnimationFrame(scrollAnimate);
}
```
The end results:
![timeline trace](/README-IMG/screenshot-60fps.png)

Frames in under 60fps! pretty awesome! huh?

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
The end result:
![timeline trace](/README-IMG/screenshot-pizzaresize-5ms.png)

resized pizzas in 1.712ms! super fast!

##### 3) Achieving PageSpeed score of 90/100 on index.html

Utilizing grunt I minified css, js and inline the code since the files were not huge, plus optimize images. All development files are in `/src` directory and grunt puts all production files at `/` (root). Not online did index.html scored a 96, so do all other pages.

![Google PageSpeed score](/README-IMG/screenshot-pagespeed.png)

####Part 3: Grunt Tasks

The following project uses the following grunt task which would need to be downloaded separately if someone needed to recreate the production version of this project.

1. jshint
2. uglify
3. cssmin
4. imagemin
5. processhtml

Grunt works with the source files located at `/src` and the processed production files are moved to `/` (root).

---


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
