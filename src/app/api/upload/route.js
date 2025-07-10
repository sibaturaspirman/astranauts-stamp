import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('tokenAstranauts')?.value
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('photo')
    const boothId = formData.get('boothId')

    if (!file || typeof file === 'string' || !boothId) {
      return Response.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const blob = new Blob([buffer], { type: file.type })
    const uploadForm = new FormData()
    uploadForm.append('file', blob, file.name || 'photo.jpg')

    // STEP 1: upload to /upload
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-id': process.env.API_APP_ID,
        'x-app-key': process.env.API_APP_KEY,
      },
      body: uploadForm,
    })

    const uploadData = await uploadRes.json()
    const imageUrl = uploadData?.file
    if (!imageUrl) {
      return Response.json({ error: 'Upload failed' }, { status: 500 })
    }

    // STEP 2: send to /booth/:boothId
    const boothRes = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_API}/booth/${boothId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-app-id': process.env.API_APP_ID,
        'x-app-key': process.env.API_APP_KEY,
      },
      body: JSON.stringify({ imageUrl }),
    })

    const boothData = await boothRes.json()
    return Response.json({ success: true, imageUrl, booth: boothData })
  } catch (err) {
    console.error('❌ Upload booth error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
