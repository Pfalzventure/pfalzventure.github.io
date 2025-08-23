<?php
// paypal-webhook.php

// JSON Body von PayPal empfangen
$body = file_get_contents("php://input");
$data = json_decode($body, true);

// Debug-Log speichern (zum Prüfen)
file_put_contents("webhook_log.txt", date("c")." ".$body.PHP_EOL, FILE_APPEND);

// Auf bestimmte Events reagieren
if ($data['event_type'] === "PAYMENT.CAPTURE.COMPLETED") {
    $payerEmail = $data['resource']['payer']['email_address'];
    $amount = $data['resource']['amount']['value'];
    $currency = $data['resource']['amount']['currency_code'];

    // Bestellbestätigung schicken
    $subject = "Bestellbestätigung – Pfalzventure";
    $message = "Hallo,\n\nvielen Dank für deine Bestellung bei Pfalzventure!\n\n".
               "Wir haben deine Zahlung über $amount $currency erhalten.\n".
               "Dein Abenteuer wartet auf dich!\n\n".
               "Viele Grüße\nRobert Prokasky – Pfalzventure";

    $headers = "From: info@pfalzventure.de\r\n";

    mail($payerEmail, $subject, $message, $headers);
}

http_response_code(200); // wichtig für PayPal
?>
