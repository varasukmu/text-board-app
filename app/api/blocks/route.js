import prisma from '@/lib/prisma'

export async function GET() {
  const blocks = await prisma.block.findMany()
  return Response.json(blocks)
}

export async function POST(req) {
  const body = await req.json()

  const block = await prisma.block.create({
    data: {
      title: body.title || "", // <--- เพิ่มบรรทัดนี้ให้รับ title
      content: body.content
    }
  })

  return Response.json(block)
}