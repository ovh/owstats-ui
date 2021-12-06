<?php
$current_file_name = basename(__FILE__, '.php');
$suffix = explode('__', $current_file_name)[1];
$location = get_credentials_location($suffix);

// get credentials
$credentials = read_credentials($location);
$application_key =  $credentials['APP_KEY'];
$application_secret = $credentials['APP_SECRET'];
$consumer_key = $credentials['CONSUMER_KEY'];
$hosting_name = $credentials['HOSTING'];
$endpoint = $credentials['ENDPOINT'];
$api_logs_base_url = $credentials['LOGS_BASE_URL'];

if(empty($application_key) or empty($application_secret) or empty($consumer_key) or empty($hosting_name) or empty($endpoint) or empty($api_logs_base_url)) {
    header("HTTP/1.1 500 Internal Server Error");
    exit('Error : credentials file is incomplete or not available');
}

// get logs username and password
$username = $_POST["user"];
$password = $_POST["password"];

if(!$username or !$password) {
    header("HTTP/1.1 500 Internal Server Error");
    exit('Error : no username or password');
}

// check if user is authorized : try to access common logs platform
$url = $api_logs_base_url . "/" . $hosting_name . "/";

$api_call = curl_init($url);
curl_setopt($api_call, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($api_call, CURLOPT_USERPWD, $username . ":" . $password);
curl_exec($api_call);
$httpCode = curl_getinfo($api_call, CURLINFO_HTTP_CODE);
curl_close($api_call);

if ($httpCode == 200) {

    // get timestamp
    try {
        $url_time = "https://" . $endpoint . "/1.0/auth/time";
        $api_time = curl_init($url_time);
        curl_setopt($api_time, CURLOPT_RETURNTRANSFER, 1);
        $timestamp = curl_exec($api_time);
        curl_close($api_time);
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        exit($e->getMessage());
    }

    // get user logs token
    $url_logs_token = "https://" . $endpoint . "/1.0/hosting/web/" . $hosting_name . "/userLogsToken";

    try {
        $response = ovh_api($url_logs_token, $application_key, $application_secret, $consumer_key, $timestamp);
        if($response['httpCode'] == 200) {
          echo $response['message'];
        }
        else {
            header("HTTP/1.1 500 Internal Server Error");
            echo $response['message'];
          }
    } catch (Exception $e) {
        header("HTTP/1.1 500 Internal Server Error");
        echo $e->getMessage();
    }
} else if ($httpCode == 401) {
    // authentication failed
    header("HTTP/1.1 401 Unauthorized");
    echo 'user or password is incorrect';
} else {
    header("HTTP/1.1 500 Internal Server Error");
    echo 'Error: please contact your administrator';   
}

// ovh api call
function ovh_api($url, $application_key, $application_secret, $consumer_key, $timestamp)
{
    $result = [];
    $toSign = $application_secret . "+" . $consumer_key . "+GET+" . $url . "++" . $timestamp;
    $signature = '$1$' . sha1($toSign);
    $headers = [];
    array_push($headers, 'X-Ovh-Application: ' . $application_key);
    array_push($headers, 'X-Ovh-Consumer: ' . $consumer_key);
    array_push($headers, 'X-Ovh-Signature: ' . $signature);
    array_push($headers, 'X-Ovh-Timestamp: ' . $timestamp);

    $api_call = curl_init($url);
    curl_setopt($api_call, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($api_call, CURLOPT_HTTPHEADER, $headers);

    $message = curl_exec($api_call);
    $httpCode = curl_getinfo($api_call, CURLINFO_HTTP_CODE);
    $result['message'] = $message;
    $result['httpCode'] = $httpCode;
    curl_close($api_call);

    return $result;
}

// get credentials location
function get_credentials_location($suffix)
{
    $location_file_name = '.location.owstats__'.$suffix;
    $location_file = file_get_contents($location_file_name);
    $step_number = (int)str_replace(PHP_EOL, '', $location_file);
    $relative_path = '../.env.owstats__'.$suffix;
    if ($location_file) {
        for ($i = 0; $i < $step_number; $i++) {
            $relative_path = '../' . $relative_path;
        }
        return $relative_path;
    } else {
        return $relative_path;
    }
}

// read credentials
function read_credentials($file)
{
    $credentials = [];
    $handle = @fopen($file, "r");

    if ($handle) {
        while (($buffer = fgets($handle, 4096)) !== false) {
            $element = explode('=', $buffer);
            $credentials[$element[0]] = str_replace(PHP_EOL, '', $element[1]);
        }
        if (!feof($handle)) {
            echo "Error : could no read credentials\n";
        }
        fclose($handle);
    }
    return $credentials;
}
