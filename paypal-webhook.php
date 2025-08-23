<?php
// paypal-webhook.php

// JSON von PayPal einlesen
$body = file_get_contents("php://input");
$data = json_decode($body, true);

// Für Debugging (später löschen oder in Datei loggen)
file_put_contents("webhook_log.txt", date("c") . " - " . $body . PHP_EOL, FILE_APPEND);

// Prüfen ob Event vorhanden ist
if (!isset($data["event_type"])) {
    http_response_code(400);
    exit("Invalid webhook");
}

// Nur reagieren, wenn Zahlung abgeschlossen ist
if ($data["event_type"] === "PAYMENT.CAPTURE.COMPLETED") {
    $payerEmail = $data["resource"]["payer"]["email_address"] ?? null;
    $amount = $data["resource"]["amount"]["value"] ?? null;
    $currency = $data["resource"]["amount"]["currency_code"] ?? null;

    // Mail an Käufer
    if ($payerEmail) {
        $subject = "Bestellbestätigung – Pfalzventure";
        $message = "Hallo!\n\nVielen Dank für deine Bestellung bei Pfalzventure.\n"
                 . "Wir haben deine Zahlung über $amount $currency erhalten.\n\n"
                 . "Du erhältst in Kürze weitere Infos zu deiner Bestellung.\n\n"
                 . "Viele Grüße\nRobert Prokasky – Pfalzventure";
        $headers = "From: info@pfalzventure.de";

        mail($payerEmail, $subject, $message, $headers);
    }

    // Mail an dich
    $adminMail = "info@pfalzventure.de";
    $subjectAdmin = "Neue Bestellung im Shop";
    $messageAdmin = "Neue Zahlung eingegangen:\n\n"
                  . "Kunde: $payerEmail\n"
                  . "Betrag: $amount $currency\n\n"
                  . "Webhook-Daten:\n" . print_r($data, true);
    $headersAdmin = "From: info@pfalzventure.de";

    mail($adminMail, $subjectAdmin, $messageAdmin, $headersAdmin);
}

// Wichtig: immer 200 zurückgeben, sonst denkt PayPal, der Webhook ist kaputt
http_response_code(200);
echo "OK";
