<?php
$servername = "///////////////";
$username = "////////////////";
$password = "////////////////";
$dbname = "/////////////////";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$randomeInt = rand(1,1000000);

$sql = "INSERT INTO people (email, summonerName, zone, code)
VALUES ('".$_POST["email"]."', '".$_POST["summonerName"]."', '".$_POST["zone"]."', '".$randomeInt."')";

if (mysqli_query($conn, $sql)) {
	echo nl2br("Verification email sent to '".$_POST["email"]."' \n Emails can take up to 1 hour to be sent, also check your spam folder");

	$userEmail = $_POST["email"];
	$userCode = $randomeInt;

	$urlToSend = "https://mbtest100.000webhostapp.com/verifyEmail.php?email=$userEmail&code=$userCode";

	// replace spaces
	$urlLink = str_replace(' ', '%20', $urlToSend);


	// send email here 
	$to = $_POST["email"];
	$subject = "Verification - League of Legends Weekly Stats";
	$txt = "Click link to verify, $urlLink";
	$headers = "From: mbtest100.000webhostapp.com";

	mail($to,$subject,$txt,$headers);


} else {
	echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);

?>