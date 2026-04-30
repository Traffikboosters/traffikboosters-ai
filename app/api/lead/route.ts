import { NextRequest, NextResponse } from "next/server"
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const url = process.env.SUPABASE_URL
    if (url) {
      fetch(`${url}/functions/v1/core-automation-engine`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
        body: JSON.stringify({ action: "website_lead", source: "traffikboosters.ai", tenant_id: "11111111-1111-1111-1111-111111111111", payload: data }),
      }).catch(() => {})
    }
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Invalid" }, { status: 400 }) }
}