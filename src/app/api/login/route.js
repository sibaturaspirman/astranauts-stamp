export async function POST(request) {
    const body = await request.formData();
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-app-id": process.env.API_APP_ID,
        "x-app-key": process.env.API_APP_KEY,
      },
      body: new URLSearchParams({
        project: body.get("project"),
        name: body.get("name"),
        password: body.get("password"),
      }),
    });
  
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
}