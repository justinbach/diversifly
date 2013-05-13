<?php
$colors = Array();
if(!(isset($_GET['colors']))){
  $colors = Array('FF0000', '00FF00','0000FF');
} else {
  $colors = $_GET['colors'];
}
header('Content-type: image/svg+xml');
echo('<?xml version="1.0" encoding="utf-8"?>');
switch(count($colors)) {
  case 5:
?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="_x35_-color" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
   y="0px" width="296px" height="196px" viewBox="0 0 296 196" enable-background="new 0 0 296 196" xml:space="preserve">
<g>
  <path fill="#<?echo $colors[0] ?>" d="M57.125,22.114c-14.262-2.66-20.606-1.13-25.097,2.091c-0.683,0.489-2.786,1.996-2.786,1.996
    s-3.432-0.169-3.678,2.569c-0.153,1.702,3.804,2.47,1.335,3.993c-2.473,1.521-4.184,1.521-4.184,4.181
    c0,2.662,3.991,1.715,3.798,3.992c-0.186,2.281-4.561,1.334-5.704,3.995c-1.136,2.66,5.519,3.8,5.138,5.893
    c-0.382,2.091-3.231,3.611-3.231,3.611s0,3.612,3.612,4.753c0,0,1.329,5.323-2.664,6.465c-3.991,1.142-2.982,3.421-2.982,3.421
    s8.876-1.331,9.067,0.949c0.19,2.284-1.143,8.179,0.95,12.167c2.089,3.994,4.182,11.976,11.406,13.691
    c4.942,1.167,20.056,1.243,29.437,1.212V25.539C66.318,23.964,61.539,22.937,57.125,22.114z"/>
  <path fill="#<?php echo $colors[0] ?>" d="M49.391,122.94c1.523,5.07,1.523,5.07,1.523,5.07s0.506,9.63,3.043,14.195
    c0.509,4.562-2.029,6.59-7.605,12.167s-6.716,6.713-5.767,8.616c0.954,1.901,2.662,2.092,12.546-4.942
    c3.041-1.709,11.598-3.421,13.5-0.571c1.71,3.804,3.04,5.704,4.559,5.137c0.111-0.043,0.234-0.105,0.352-0.167v-61.838
    C65.086,104.224,55.94,111.036,49.391,122.94z"/>
  <path fill="#<?php echo $colors[1] ?>" d="M114.158,48.16C97.091,35.294,83.201,29.05,71.542,25.539v71.555c4.33-0.016,7.442-0.049,7.762-0.01
    c0,0-3.221,0.979-7.762,3.523v61.838c1.514-0.73,3.664-2.519,6.305-0.41c2.853,2.29,9.697,9.512,11.786,9.888
    c3.612-0.184,5.708-2.088,5.708-2.088s2.088,4.753,5.131,4.943c3.04,0.19,9.314,2.091,13.875-3.425
    c2.035-2.461,4.979-4.771,8.17-7.753V55.069C120.068,52.84,117.301,50.53,114.158,48.16z"/>
  <path fill="#<?php echo $colors[2] ?>" d="M155.225,81.812c0,0,0.19-4.181-2.662-6.084c2.853-3.614,18.633-37.069,18.823-42.202
    c-1.712,9.122-19.774,41.441-19.774,41.441s-1.804-0.085-3.611-0.081c0.834,0.001,1.67,0.023,2.33,0.081h-4.661
    c0.661-0.058,1.495-0.08,2.331-0.081c-1.808-0.004-3.611,0.081-3.611,0.081s-18.063-32.319-19.772-41.441
    c0.19,5.133,15.968,38.588,18.82,42.202c-2.852,1.903-2.66,6.084-2.66,6.084s-1.459-11.441-18.26-26.742v108.531
    c3.966-3.704,8.317-8.447,11.796-15.823c6.272-13.309,7.602-11.595,9.124-32.696c1.33,9.696,1.33,23.383,1.33,23.383
    s0.763,4.946,3.234,4.756c2.471,0.19,3.233-4.756,3.233-4.756s0-13.687,1.329-23.383c1.523,21.102,2.853,19.388,9.124,32.696
    c3.481,7.382,7.835,12.124,11.804,15.832V55.062C156.68,70.366,155.225,81.812,155.225,81.812z"/>
  <path d="M150.33,74.967c-0.66-0.058-1.496-0.08-2.33-0.081c-0.835,0.001-1.67,0.023-2.331,0.081H150.33z"/>
  <path fill="#<?php echo $colors[3] ?> " d="M173.49,55.062v108.548c3.191,2.976,6.13,5.287,8.164,7.744c4.56,5.516,10.834,3.615,13.873,3.425
    c3.043-0.19,5.133-4.943,5.133-4.943s2.094,1.904,5.708,2.088c2.088-0.376,8.933-7.598,11.785-9.888
    c2.644-2.112,4.794-0.318,6.309,0.413v-61.841c-4.54-2.545-7.764-3.523-7.764-3.523c0.319-0.039,3.435-0.006,7.764,0.01V25.537
    c-11.659,3.513-25.55,9.756-42.62,22.624C178.703,50.527,175.938,52.835,173.49,55.062z"/>
  <path fill="#<?php echo $colors[4] ?>" d="M253.896,95.881c7.224-1.715,9.314-9.698,11.405-13.691c2.094-3.988,0.758-9.883,0.951-12.167
    c0.19-2.279,9.067-0.949,9.067-0.949s1.005-2.279-2.983-3.421c-3.994-1.142-2.663-6.465-2.663-6.465
    c3.609-1.141,3.609-4.753,3.609-4.753s-2.85-1.521-3.23-3.611c-0.379-2.093,6.272-3.233,5.137-5.893
    c-1.142-2.66-5.516-1.713-5.701-3.995c-0.192-2.277,3.795-1.33,3.795-3.992c0-2.66-1.709-2.66-4.181-4.181
    c-2.469-1.523,1.485-2.291,1.331-3.993c-0.244-2.739-3.677-2.569-3.677-2.569s-2.103-1.506-2.785-1.996
    c-4.493-3.221-10.837-4.751-25.097-2.091c-4.412,0.823-9.188,1.851-14.412,3.423v71.557
    C233.843,97.124,248.952,97.048,253.896,95.881z"/>
  <path fill="#<?php echo $colors[4] ?>" d="M224.809,162.612c1.521,0.567,2.85-1.333,4.56-5.137c1.903-2.85,10.459-1.138,13.499,0.571
    c9.886,7.034,11.595,6.844,12.547,4.942c0.95-1.903-0.19-3.039-5.767-8.616c-5.577-5.577-8.113-7.604-7.604-12.167
    c2.537-4.565,3.042-14.195,3.042-14.195s0,0,1.523-5.07c-6.548-11.904-15.69-18.714-22.146-22.333v61.841
    C224.58,162.507,224.7,162.569,224.809,162.612z"/>
</g>
</svg>
<?
    break;
  case(4):
?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="_x34_-color" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
   y="0px" width="296px" height="196px" viewBox="0 0 296 196" enable-background="new 0 0 296 196" xml:space="preserve">
<g>
  <path fill="#<?php echo $colors[0] ?>" d="M57.44,22.376c-14.211-2.651-20.534-1.126-25.01,2.083c-0.68,0.488-2.776,1.989-2.776,1.989
    s-3.42-0.169-3.666,2.561c-0.152,1.697,3.791,2.461,1.331,3.979c-2.464,1.516-4.169,1.516-4.169,4.167
    c0,2.653,3.977,1.708,3.785,3.979c-0.185,2.273-4.545,1.33-5.685,3.98c-1.132,2.651,5.5,3.788,5.121,5.873
    c-0.382,2.083-3.221,3.599-3.221,3.599s0,3.6,3.6,4.736c0,0,1.324,5.305-2.654,6.443c-3.978,1.138-2.973,3.409-2.973,3.409
    s8.846-1.326,9.036,0.946c0.19,2.276-1.139,8.15,0.947,12.125c2.083,3.979,4.167,11.935,11.366,13.645
    c7.198,1.702,36.06,1.072,37.07,1.198c0,0-18.691,5.559-29.808,25.768c1.517,5.053,1.517,5.053,1.517,5.053
    s0.504,9.598,3.032,14.146c0.508,4.546-2.021,6.566-7.578,12.125c-5.558,5.558-6.693,6.689-5.748,8.585
    c0.951,1.895,2.653,2.085,12.503-4.924c3.031-1.705,11.558-3.409,13.454-0.569c1.705,3.79,3.029,5.684,4.543,5.117
    c1.518-0.574,3.795-2.841,6.635-0.574c1.475,1.184,4.016,3.683,6.416,5.874V30.486C74.059,25.905,65.181,23.821,57.44,22.376z"/>
  <polygon points="148,74.966 148,74.966 148,74.966   "/>
  <path d="M148,75.046v-0.081l0,0c-0.833,0.001-1.665,0.022-2.322,0.081H148z"/>
  <path fill="#<?php echo $colors[1] ?>" d="M145.678,75.046c0.658-0.058,1.49-0.08,2.322-0.081c-1.801-0.004-3.599,0.081-3.599,0.081
    s-18-32.207-19.704-41.298c0.189,5.114,15.913,38.455,18.755,42.056c-2.842,1.896-2.65,6.063-2.65,6.063
    s-1.899-14.964-26.527-33.535c-11.213-8.453-21.038-14.018-29.769-17.847v137.202c2.225,2.032,4.328,3.799,5.329,3.979
    c3.599-0.183,5.688-2.079,5.688-2.079s2.082,4.734,5.114,4.925c3.028,0.189,9.282,2.083,13.827-3.414
    c4.549-5.494,13.641-10.23,19.896-23.493c6.251-13.263,7.576-11.555,9.093-32.583c1.325,9.661,1.325,23.302,1.325,23.302
    s0.761,4.928,3.223,4.739V75.046H145.678z"/>
  <path d="M150.321,75.046c-0.658-0.058-1.49-0.08-2.321-0.081v0.081H150.321z"/>
  <path fill="#<?php echo $colors[2] ?>" d="M155.199,81.868c0,0,0.189-4.167-2.653-6.063c2.843-3.601,18.568-36.941,18.759-42.056
    c-1.706,9.091-19.706,41.298-19.706,41.298s-1.797-0.084-3.598-0.081l0,0c0.831,0.001,1.663,0.022,2.321,0.081H148v68.017
    c2.461,0.188,3.221-4.739,3.221-4.739s0-13.641,1.324-23.302c1.519,21.028,2.843,19.32,9.094,32.583
    c6.253,13.263,15.349,17.999,19.897,23.493c4.544,5.497,10.797,3.604,13.825,3.414c3.032-0.19,5.117-4.925,5.117-4.925
    s2.085,1.896,5.687,2.079c1.002-0.181,3.108-1.95,5.332-3.982v-137.2c-8.731,3.829-18.559,9.395-29.773,17.848
    C157.096,66.903,155.199,81.868,155.199,81.868z"/>
  <path fill="#<?php echo $colors[3] ?>" d="M217.91,161.813c2.84-2.267,5.116,0,6.633,0.574c1.516,0.566,2.84-1.327,4.544-5.117
    c1.896-2.84,10.423-1.136,13.452,0.569c9.851,7.009,11.556,6.818,12.504,4.924c0.946-1.896-0.189-3.027-5.748-8.585
    c-5.559-5.559-8.085-7.579-7.577-12.125c2.528-4.549,3.031-14.146,3.031-14.146s0,0,1.518-5.053
    c-11.115-20.209-29.807-25.768-29.807-25.768c1.009-0.125,29.869,0.504,37.068-1.198c7.199-1.71,9.283-9.665,11.366-13.645
    c2.086-3.975,0.755-9.849,0.948-12.125c0.189-2.272,9.035-0.946,9.035-0.946s1.002-2.271-2.973-3.409
    c-3.979-1.138-2.654-6.443-2.654-6.443c3.598-1.137,3.598-4.736,3.598-4.736s-2.839-1.515-3.22-3.599
    c-0.378-2.085,6.251-3.222,5.119-5.873c-1.138-2.65-5.497-1.707-5.681-3.98c-0.192-2.271,3.781-1.326,3.781-3.979
    c0-2.651-1.703-2.651-4.167-4.167c-2.46-1.518,1.481-2.282,1.328-3.979c-0.244-2.73-3.664-2.561-3.664-2.561
    s-2.097-1.5-2.776-1.989c-4.478-3.209-10.8-4.734-25.01-2.083c-7.741,1.445-16.618,3.528-27.062,8.108v137.2
    C213.897,165.493,216.436,162.997,217.91,161.813z"/>
</g>
</svg>
<?
    break;
  default:
?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="_x33_-color" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
   y="0px" width="296px" height="196px" viewBox="0 0 296 196" enable-background="new 0 0 296 196" xml:space="preserve">
<g>
  <path fill="#<?php echo $colors[0] ?>" d="M57.532,22.464c-14.198-2.649-20.513-1.125-24.984,2.081c-0.68,0.487-2.773,1.986-2.773,1.986
    s-3.417-0.168-3.662,2.559c-0.152,1.694,3.787,2.458,1.33,3.974c-2.462,1.515-4.166,1.515-4.166,4.163
    c0,2.65,3.974,1.707,3.781,3.975c-0.185,2.271-4.54,1.328-5.679,3.976c-1.13,2.648,5.494,3.784,5.115,5.868
    c-0.38,2.081-3.217,3.595-3.217,3.595s0,3.596,3.596,4.731c0,0,1.323,5.3-2.651,6.436c-3.973,1.137-2.969,3.407-2.969,3.407
    s8.836-1.325,9.026,0.944c0.19,2.273-1.138,8.142,0.946,12.112c2.08,3.976,4.164,11.923,11.354,13.63
    c7.191,1.699,36.023,1.071,37.033,1.198c0,0-18.672,5.552-29.778,25.741c1.516,5.047,1.516,5.047,1.516,5.047
    s0.504,9.587,3.029,14.132c0.506,4.542-2.02,6.561-7.571,12.112c-5.552,5.553-6.686,6.684-5.742,8.578
    c0.949,1.893,2.65,2.082,12.49-4.92c3.027-1.702,11.546-3.405,13.44-0.568c1.702,3.785,3.026,5.678,4.539,5.112
    c1.515-0.573,3.791-2.839,6.627-0.573c2.839,2.278,9.654,9.468,11.733,9.843c3.596-0.183,5.682-2.079,5.682-2.079
    s2.079,4.731,5.108,4.922c1.244,0.079,3.042,0.421,5.032,0.445V42.289C85.44,28.748,70.021,24.795,57.532,22.464z"/>
  <path d="M150.319,75.082c-0.657-0.06-1.489-0.082-2.319-0.084c-0.832,0.003-1.663,0.024-2.32,0.084H150.319z"/>
  <path fill="#<?php echo $colors[1] ?>" d="M155.191,81.894c0,0,0.189-4.163-2.649-6.057c2.839-3.597,18.55-36.903,18.739-42.013
    c-1.704,9.082-19.687,41.258-19.687,41.258S149.8,74.995,148,74.998c0.831,0.003,1.662,0.024,2.319,0.084h-4.639
    c0.657-0.06,1.488-0.082,2.32-0.084c-1.8-0.003-3.595,0.084-3.595,0.084s-17.982-32.177-19.684-41.258
    c0.189,5.11,15.897,38.416,18.736,42.013c-2.839,1.895-2.648,6.057-2.648,6.057s-1.896-14.95-26.5-33.501
    c-2.961-2.232-5.82-4.253-8.593-6.104V174.89c2.852,0.031,6.107-0.62,8.781-3.854c4.545-5.49,13.627-10.222,19.876-23.471
    c6.244-13.249,7.567-11.543,9.083-32.55c1.323,9.652,1.323,23.278,1.323,23.278s0.76,4.924,3.22,4.733
    c2.459,0.19,3.218-4.733,3.218-4.733s0-13.626,1.324-23.278c1.516,21.007,2.839,19.301,9.084,32.55
    c6.246,13.249,15.332,17.98,19.878,23.471c2.673,3.234,5.933,3.888,8.785,3.854V42.284c-2.775,1.853-5.637,3.875-8.6,6.109
    C157.086,66.944,155.191,81.894,155.191,81.894z"/>
  <path fill="#<?php echo $colors[2] ?>" d="M195.313,174.444c3.03-0.19,5.11-4.922,5.11-4.922s2.085,1.896,5.684,2.079
    c2.078-0.375,8.892-7.564,11.731-9.843c2.838-2.266,5.11,0,6.626,0.573c1.515,0.565,2.837-1.327,4.54-5.112
    c1.894-2.837,10.411-1.134,13.438,0.568c9.841,7.002,11.543,6.812,12.49,4.92c0.946-1.895-0.189-3.025-5.741-8.578
    c-5.552-5.552-8.076-7.57-7.569-12.112c2.525-4.545,3.027-14.132,3.027-14.132s0,0,1.517-5.047
    c-11.105-20.188-29.775-25.741-29.775-25.741c1.007-0.126,29.839,0.501,37.03-1.198c7.191-1.707,9.273-9.654,11.354-13.63
    c2.084-3.97,0.755-9.839,0.946-12.112c0.189-2.27,9.027-0.944,9.027-0.944s1-2.27-2.971-3.407c-3.976-1.136-2.65-6.436-2.65-6.436
    c3.594-1.135,3.594-4.731,3.594-4.731s-2.837-1.515-3.216-3.595c-0.378-2.084,6.243-3.219,5.113-5.868
    c-1.137-2.648-5.491-1.705-5.676-3.976c-0.192-2.268,3.778-1.325,3.778-3.975c0-2.648-1.703-2.648-4.163-4.163
    c-2.457-1.516,1.479-2.28,1.326-3.974c-0.244-2.727-3.66-2.559-3.66-2.559s-2.094-1.499-2.774-1.986
    c-4.472-3.207-10.788-4.73-24.983-2.081c-12.487,2.332-27.902,6.283-48.178,19.82V174.89
    C192.276,174.865,194.072,174.523,195.313,174.444z"/>
</g>
</svg>
<?
}