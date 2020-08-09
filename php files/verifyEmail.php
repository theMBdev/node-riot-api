<?php
$servername = "/////////////";
$username = "//////////////";
$password = "/////////////";
$dbname = "/////////////";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// TODO - update for security purposes
$sql = "UPDATE people SET verified='1' WHERE code='".$_GET["code"]."' AND email='".$_GET["email"]."' ";

if (mysqli_query($conn, $sql)) {
    $sql2 = "SELECT verified FROM people WHERE email='".$_GET["email"]."' AND code='".$_GET["code"]."'";
    $result = mysqli_query($conn, $sql2);
    
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            if($row["verified"] == 0) {
                echo "Email and code are not a match";
            } else {
                 echo "You are now verified and will recieve your stats weekly";
            }
  }
       
    } else {
           echo "Error2: " . $sql2 . "<br>" . mysqli_error($conn);
    }
    
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);

?>