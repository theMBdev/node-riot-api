<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require("/var/www/vendor/phpmailer/phpmailer/src/SMTP.php");
require("/var/www/vendor/phpmailer/phpmailer/src/PHPMailer.php");
require("/var/www/vendor/phpmailer/phpmailer/src/Exception.php");

// Composer autoload.php file.
require('/var/www/vendor/autoload.php');

$servername = "////////////";
$username = "//////////";
$password = "//////////";
$dbname = "////////////";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

$randomeInt = rand(1,1000000);


// TODO - update for security purposes
$sql = "INSERT INTO people (email, summonerName, zone, code)
VALUES ('".$_POST["email"]."', '".$_POST["summonerName"]."', '".$_POST["zone"]."', '".$randomeInt."')";

if (mysqli_query($conn, $sql)) {

	echo nl2br("You have successfully signed up \n");

	$userEmail = $_POST["email"];
	$userSummonername = $_POST["summonerName"];
	$userZone = $_POST["zone"];
	$userCode = $randomeInt;

	$urlToSend = "http://ec2-18-132-36-72.eu-west-2.compute.amazonaws.com/verifyEmail.php?email=$userEmail&code=$userCode";

	// replace spaces
	$urlLink = str_replace(' ', '%20', $urlToSend);

	// from
	$sender = 'martinbhtc@gmail.com';
	$senderName = 'Sender Name';

	// to
	$recipient = $userEmail;


	// smtp_username
	$usernameSmtp = '///////////////////////////';
	// smtp_password
	$passwordSmtp = '//////////////////////////';


	// configuration set.
	$configurationSet = 'ConfigSet';

	$host = 'smtp.sendgrid.net';
	$port = 587;

	//ports
	// 25, 587	(for unencrypted/TLS connections)
	// 465	(for SSL connections)


	// The subject line of the email
	$subject = 'League Weelkly Verification';

	// The plain-text body of the email
	$bodyText =  "Email Test\r\nThis email was sent through the
    sendgrid interface.";

	// The HTML-formatted body of the email
	$bodyHtml = "

<h1>Email Test</h1>
<p>Click the link below to verify your email address and recieve weekly stats emails for the summoner below.
</p>    

<p>Summoner Name: ${userSummonername}</p>
<p>Region: ${userZone}</p>

<h2><a href='${urlToSend}'>Verify Email</a></h2>

<p></p>";

	$mail = new PHPMailer(true);

	try {
		// Specify the SMTP settings.
		$mail->isSMTP();
		$mail->SMTPAuth = true;   

		// debug info
		$mail->SMTPDebug = 2;

		$mail->Debugoutput = function($str, $level) {
			$GLOBALS['debug'] .= "$level: $str\n";
		};

		
		$mail->setFrom($sender, $senderName);
		$mail->Username   = $usernameSmtp;
		$mail->Password   = $passwordSmtp;
		$mail->Host       = $host;
		$mail->Port       = $port;
		$mail->SMTPAuth   = true;
		$mail->SMTPSecure = 'tls';
		$mail->addCustomHeader('X-SES-CONFIGURATION-SET', $configurationSet);
		// Specify the message recipients.
		$mail->addAddress($recipient);
		// You can also add CC, BCC, and additional To recipients here.
		
		// Specify the content of the message.
		$mail->isHTML(true);
		$mail->Subject    = $subject;
		$mail->Body       = $bodyHtml;
		$mail->AltBody    = $bodyText;

		$mail->SMTPOptions = array(
			'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false, 
				'allow_self_signed' => true )
		);

		$mail->Send();
		//   echo "Email sent!" , PHP_EOL;
		echo nl2br("Verification email sent to '".$_POST["email"]."' \n Emails can take up to 1 hour to be sent, also check your spam folder");

		// echo $debug;


	} catch (phpmailerException $e) {
		echo "An error occurred. {$e->errorMessage()}", PHP_EOL; //Catch errors from PHPMailer.
	} catch (Exception $e) {
		echo nl2br("Verification email not sent. \n {$mail->ErrorInfo}, \n \n"), PHP_EOL; 
		echo "Hey, if above says 'You have successfully signed up' this error is just be that the email server is not sending out verification emails today due to reaching its limit. Contact me at martinbhtc@gmail.com and i will send you your verification email.";
	}
	
	// header("Location: http://www.example.com/another-page.php");
	// exit();

} else {
	echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);

?>
