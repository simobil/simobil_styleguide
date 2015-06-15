<?php
        $env        = "DLabs dev";
        $branch     = "";
        $branchFile = "./branch";

        $lastPush = "";
        $lastPushFile = "./last_push";

        $message = "";
        $messageFile = "./message";

        $hash = "";
        $hashFile = "./hash";

        $lastFiles = "";
        $lastFilesFile = "./last_git_files";

        if (file_exists($branchFile)) {
                $branch = trim(file_get_contents($branchFile));
        }

        if (file_exists($lastPushFile)) {
                $lastPush = trim(file_get_contents($lastPushFile));
        }

        if (file_exists($messageFile)) {
                $message = trim(file_get_contents($messageFile));
        }

        if (file_exists($hashFile)) {
                $hash = trim(file_get_contents($hashFile));
        }

        if (file_exists($lastFilesFile)) {
                $lastFiles = trim(file_get_contents($lastFilesFile));
        }

        $envType = explode(".", $_SERVER['SERVER_NAME']);
        if ($envType[0] != 'simobil') {
                $env .= str_replace("simobil-", " ", $envType[0]);
        }

        $title = "[" . $env . (!empty($branch) ? ", " . $branch : "") . "] Si.mobil 2.0";
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo $title; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <!--
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
    -->
    <link href="simobil_assets/css/bootstrap/bootstrap.css" rel="stylesheet">
    <link href="simobil_assets/css/bootstrap/responsive.css" rel="stylesheet">
    <link href="simobil_assets/css/simobil/simobil.css" rel="stylesheet">
    <link href="simobil_assets/css/simobil/responsive.css" rel="stylesheet">

    <style>
        #last-push, #lastmessage, #hash, #last_files { display: none; }
    </style>

    <link href="assets/css/docs.css" rel="stylesheet">
    <link href="assets/js/google-code-prettify/prettify.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="assets/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">

  </head>

  <body class="entry" data-spy="scroll" data-target=".subnav" data-offset="50">

  <div id="last-push"><?php echo $lastPush; ?></div>
  <div id="lastmessage"><?php echo $message; ?></div>
  <div id="hash"><?php echo $hash; ?></div>
  <div id="last_files"><?php echo $lastFiles; ?></div>

  <!-- Navbar
    ================================================== -->
    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button"class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="./index.html">Si.mobil styleguide</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="">
                <a href="./index.html">Overview</a>
              </li>
              <li>
                <a href="./simobil.html">Si.mobil specifics</a>
              </li>
              <li class="">
                <a href="./examples.html">Examples</a>
              </li>
              <li class="">
                <a href="./download.html">Download</a>
              </li>
              <!--
              <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Bootstrap docs <i class="carret"></i></a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="./scaffolding.html">Scaffolding</a>
                    </li>
                    <li>
                        <a href="./base-css.html">Base CSS</a>
                    </li>
                    <li>
                        <a href="./components.html">Components</a>
                    </li>
                    <li>
                        <a href="./javascript.html">Javascript plugins</a>
                    </li>
                    <li>
                        <a href="./less.html">Using LESS</a>
                    </li>
                </ul>
              </li>
              -->
            </ul>
          </div>
        </div>
      </div>
    </div>
<div class="page-block">
    <div class="container">

<!-- Masthead
================================================== -->
<header class="jumbotron masthead">
  <div class="inner">
    <h1>Si.mobil Styleguide</h1>
    <p>For quick and easy creation of web pages and web sites.</p>
    <p style="font-size: 15px; font-weight: normal; line-height: 20px;">
    An overview of approved, ready-to-use elements, which are all compliant with<br>
    Si.mobil's <strong>general design guidelines</strong>. A tool for designers and developers.
    </p>
  </div>
</header>

<!-- hr class="soften" -->


    <section style="padding-top:0">
        <div class="container">
        <h1>The purpose of Si.mobil Styleguide</h1>
        <br>
            <div class="row">
                <div class="span3">
                <p>
                <strong>Simple use</strong> for developers and designers. Styleguide contains readymade elements, which
                can be used in a standard copy-paste manner.
                </p>
                </div>
                <div class="span3">
                <p>
                <strong>Compliance with design guidelines.</strong> All the elements available have already been
                approved for use.
                </p>
                </div>
                <div class="span3">
                <p>
                <strong>Everything in one place.</strong> All the elements and their pertaining documentation are
                always found in one place.
                </p>
                </div>
                <div class="span3">
                <p>
                <strong>Upscale ability.</strong> With the help of the Styleguide and Twitter Bootstrap, upgrading
                existing elements and web pages is both time efficient and simple.
                </p>
                </div>
            </div>
        </div>
        <hr>
        <div class="container">
            <div class="row">
                <div class="span6">
                    <h2><img src="assets/img/ico_designers.gif" style="margin-right: 20px"> For designers</h2>
                    <p>
                    Si.mobil Styleguide is a tool that gives designers a simple, yet extensive overview of all approved and used elements,
                    all of which are compliant with Si.mobil's general design guidelines. It provides detailed instructions on desired use
                    of colours, grid, typography, buttons, sliders, and any other elements a designer may need when working on a web site design.
                    </p>
                    <p>
                    When creating new pages, a designer should choose to use any of the already created elements and thus simplify the process
                    of designing a new web page or web site.
                    </p>
                    <p>
                    All the elements are created based on the Bootstrap grid, which enables an effortless adaptation of layouts to smaller
                    screens or mobile/tablet devices.
                    </p>
                </div>
                <div class="span6">
                    <h2><img src="assets/img/ico_developers.gif" style="margin-right: 20px"> For developers</h2>
                    <p>
                    Si.mobil Styleguide is a tool that allows for a simple creation and adaptation of existing and new web pages,
                    which are in line with Si.mobil's design guidelines.
                    </p>
                    <p>
                    You are provided with a structured, organized and documented library of adaptable elements. All the elements are defined in
                    terms of structure and design as well as functionality for both desktop and mobile devices.
                    </p>
                    <p>
                    Basic coding guidelines are also set by the Styleguide, which contains CSS files, typography files and
                    easy-to-download-and-use plug-ins.
                    </p>
                    <p>
                    Developers can access the entire documentation containing instructions on how to use each separate element, complete with
                    practical examples which can simply be copied and pasted at developer's own discretion.
                    </p>
                    <p>
                    Styleguide is based on <a href="http://twitter.github.io/bootstrap/" target="_blank">Twitter Bootstrap</a>,
                    version <a href="https://github.com/twitter/bootstrap/tree/v2.0.4" target="_blank">2.0.4</a>.
                    </p>
                </div>
            </div>
        </div>

        <hr>

        <div class="container">
            <h1>Benefits</h1>
            <br>
            <div class="row">
                <div class="span6">
                    <p>
                    <strong>Control/reference point</strong> for those in charge with the representation of Si.mobil through online assets.
                    Styleguide enables a continuous and instant overview of currently approved design and coding  guidelines.
                    </p>
                </div>
                <div class="span6">
                    <p>
                    <strong>Cost and time efficient.</strong> The ready-to-use approach saves time for both corporate and designer/developer teams,
                    directly assuring increased cost efficiency.
                    </p>
                </div>
            </div>
        </div>

        <style>
        .flex-video {
          position: relative;
          padding-top: 25px;
          padding-bottom: 67.5%;
          height: 0;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .flex-video.widescreen { padding-bottom: 57.25%; }
        .flex-video.vimeo { padding-top: 0; }

        .flex-video iframe,
        .flex-video object,
        .flex-video embed {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        @media only screen and (max-device-width: 800px), only screen and (device-width: 1024px) and (device-height: 600px), only screen and (width: 1280px) and (orientation: landscape), only screen and (device-width: 800px), only screen and (max-width: 767px) {
          .flex-video { padding-top: 0; }
        }
        </style>
        <br>
        <div class="container">
            <div class="row">
                <div class="span6">
                    <div class="flex-video">
                        <iframe src="//www.youtube.com/embed/lNtxcbYklP4?rel=0" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
                <div class="span6">
                    <div class="flex-video">
                        <iframe src="//www.youtube.com/embed/j_D9cYUbstE?rel=0" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>

     <!-- Footer
      ================================================== -->
      <footer class="footer">
        <p class="pull-right"><a href="#">Back to top</a></p>
      </footer>

    </div><!-- /container -->

</div>

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/google-code-prettify/prettify.js"></script>
    <script src="assets/js/bootstrap-transition.js"></script>
    <script src="assets/js/bootstrap-alert.js"></script>
    <script src="assets/js/bootstrap-modal.js"></script>
    <script src="assets/js/bootstrap-dropdown.js"></script>
    <script src="assets/js/bootstrap-scrollspy.js"></script>
    <script src="assets/js/bootstrap-tab.js"></script>
    <script src="assets/js/bootstrap-tooltip.js"></script>
    <script src="assets/js/bootstrap-popover.js"></script>
    <script src="assets/js/bootstrap-button.js"></script>
    <script src="assets/js/bootstrap-collapse.js"></script>
    <script src="assets/js/bootstrap-carousel.js"></script>
    <script src="assets/js/bootstrap-typeahead.js"></script>
    <script src="assets/js/application.js"></script>


  </body>
</html>
