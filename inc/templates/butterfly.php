<script type="text/template" id="butterfly-template">
  <!--<div id="butterfly-goal" class="goal"></div>-->
  <div id="butterfly" class="page-container">
    <img src="img/diversifly_logo.png" width="180" height="134" />
    <h1 class="banner">YOUR BUTTERFLY</h1>
    <div class="spacer"></div>
    <div class="butterfly-page">
      <div id="butterfly-reveal">
      </div>
      <h2 id='species-name' class="subtitle">LOREM IPSUM DOLOR</h2>
      <p id='country-desc' class="body-copy">Et harum quidem rerum facilis est et expedita distinctio.</p>
    </div>
    <a class="button nav yellow" href="home"><span>Start Over</span></a>
  </div>
</script>

<script type="text/template" id="butterfly-palette-reveal-template">
    <div id="rotating-card">
      <a href="butterfly/<%= id %>" class="butterfly-palette nav front">
        <img src="img/palette.php?<%= colorString %>" width="224" height="157"/>
      </a>
      <a href="butterfly/<%= id %>" class="butterfly-palette nav back">
        <img src="img/palette.php" />
      </a>
    </div>
</script>