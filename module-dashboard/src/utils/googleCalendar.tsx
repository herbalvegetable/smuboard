export async function getCalendarEvents(session: any, calendarId: string) {
    const { provider_token, provider_refresh_token } = session;

    async function makeRequest(accessToken: string) {
        const params = new URLSearchParams({
            maxResults: '15',
            singleEvents: 'true',
            orderBy: 'startTime',
            timeMin: new Date().toISOString(),
        })

        const uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId ?? "primary"}/events?${params}`;
        console.log("URI: ", uri);

        const res = await fetch(
            uri,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return res;
    }
    let res = await makeRequest(provider_token);

    // this shit dont work, ignore or js KIV
    if (res.status === 401 && provider_refresh_token) {
        console.log('expired token, refreshing...');
        const newTokens = await refreshAccessToken(provider_refresh_token);
        
        let newAccessToken = newTokens.access_token;
        res = await makeRequest(newAccessToken);
    }

    if (!res.ok) {

        const errorText = await res.text();
        console.error("Calendar API Error", errorText);
        return null;
    }

    const data = await res.json();
    console.log("Calendar events: ", data.items);

    if (data.items.length == 0) {
        return [];
    }
    return data.items;
}

async function refreshAccessToken(refreshToken: string) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || "Failed to refresh token");
    }

    // This contains your new 'access_token'
    return data;
}

export async function getCalendarList(session: any) {
    const { provider_token, provider_refresh_token } = session;

    const res = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${provider_token}`
            }
        }
    );

    const data = await res.json();
    console.log("Calendar list: ", data);

    return data;
}