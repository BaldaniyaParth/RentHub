// Start progress bar when any link is clicked
document.querySelector("a").addEventListener("click", function () {
  NProgress.start();
});

// Complete the progress bar when the page is fully loaded
window.addEventListener("load", function () {
  NProgress.done();
});
