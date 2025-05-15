// api/events.js
export default async function handler(req, res) {
  const clientId = process.env.PCO_CLIENT_ID;
  const clientSecret = process.env.PCO_CLIENT_SECRET;

  // Step 1: Get an access token
  const authResponse = await fetch("https://api.planningcenteronline.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  const authData = await authResponse.json();

  if (!authData.access_token) {
    return res.status(401).json({ error: "OAuth failed", details: authData });
  }

  // Step 2: Use the token to fetch event instances
  const token = authData.access_token;

  const eventResponse = await fetch("https://api.planningcenteronline.com/calendar/v2/event_instances", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const eventData = await eventResponse.json();
  res.status(200).json(eventData);
}
