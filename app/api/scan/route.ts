import { NextRequest, NextResponse } from "next/server"
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    const h = [...(url||"")].reduce((a:number,c:string)=>a+c.charCodeAt(0),0)
    return NextResponse.json({ seoScore: 20+(h%55), adsOpportunity: h%55<30?"HIGH":"MEDIUM", revenueGap: `$${(3000+((h*17)%18000)).toLocaleString()}` })
  } catch { return NextResponse.json({ error: "Invalid" }, { status: 400 }) }
}