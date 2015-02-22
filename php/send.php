<?php
	error_reporting(E_ERROR | E_PARSE);

	//Host name und Telnet port of the FHEM server
	$fhemhost = $_GET["host"];
	if(empty($fhemhost)) $fhemhost = "localhost";
	$fhemport = 7072;
	$cmd = $_GET["cmd"];
	
	//Open socket
	$fhemsock = fsockopen($fhemhost, $fhemport, $errno, $errstr, 30);
	if (!$fhemsock) {
    	print "Error: $errstr ($errno)<br />\n";
	} else {
		$fhemcmd = $cmd."\r\nquit\r\n";
		fwrite($fhemsock, $fhemcmd);
		while(!feof($fhemsock)) {
			print fgets($fhemsock,128);
		}
	}
?>
