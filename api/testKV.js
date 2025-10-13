export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  // Test: Gutschein speichern
  const key = "TESTCODE";
  const value = JSON.stringify({ wert: 20, benutzt: false });

  // Set (Key-Value speichern)
  const setResponse = await fetch(`${url}/set/${key}/${encodeURIComponent(value)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get (Key-Value abrufen)
  const getResponse = await fetch(`${url}/get/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await getResponse.json();

  res.status(200).json({
    message: "Verbindung erfolgreich!",
    geschrieben: value,
    gelesen: result,
  });
}
