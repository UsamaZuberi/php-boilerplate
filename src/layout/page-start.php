<?php ob_start(); ?>
<?php header('X-Robots-Tag: noindex, nofollow'); ?>
<?php $placeHolderImage = 'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; ?>
<?php $primaryColor = '#EA5A4F'; ?>

<?php
$url = $_SERVER['REQUEST_URI'];
if (strstr($url, '.php')) {
    $url = explode('/', $url);
    $fileName = end($url);
    $fileName = current(explode('.', $fileName));

    if ($fileName == 'index') {
        $fileName = 'home';
    }
} else {
    $fileName = 'home';
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!--  Chrome, Firefox OS and Opera -->
    <meta name="theme-color" content="<?php echo $primaryColor ?>" />
    <!-- Windows Phone -->
    <meta name="msapplication-navbutton-color" content="<?php echo $primaryColor ?>" />
    <!-- iOS Safari -->
    <meta name="apple-mobile-web-app-status-bar-style" content="<?php echo $primaryColor ?>" />

    <link rel="icon" type="image/x-icon" href="../../build/images/favicon.ico">
    <link rel="preload" as="style" href="../../build/css/icons.css" onload="this.rel='stylesheet'" crossorigin="anonymous" />
    <link rel="stylesheet" href="../../build/css/main.css" crossorigin="anonymous" />

    <title>PHP Boilerplate</title>
</head>

<style>
    /* Loads CSS Specific For Each Page */
    <?php readfile("../../build/css/" . $fileName . ".css"); ?>
</style>

<body>
    <div id="root">