exports.handler = async (event) => {
  try {
    // Log the entire event for debugging
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    // Parse OAuth code from query or body
    const params = new URLSearchParams(event.body || event.rawQuery || "");
    const code = params.get("code");

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing OAuth code", details: params.toString() }),
      };
    }

    // GitHub OAuth credentials from environment
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Exchange code for token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tokenData),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
