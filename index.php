<?php

// Main routing file for page requests

$page = '';

if(!isset($_GET['page']) || $_GET['page'] == NULL) { // TODO: check for '..'
  // just send them to the landing page
  $page = "landing";
} else {
  $page = $_GET['page'];
}

$abs_path = get_abs_path();

include('inc/header.php');
include('pages/' . $page . '.php');
include('inc/footer.php');


function get_abs_path() {
  $url = $_SERVER['REQUEST_URI'];
  $url_arr = explode('/', $url);
  $url_arr_size = count($url_arr);
  $url_arr_sliced = array_slice($url_arr, 0, $url_arr_size - 1);
  $path = implode('/', $url_arr_sliced) . '/';
  return $path;
}