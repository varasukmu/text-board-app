import prisma from '@/lib/prisma'

export async function PUT(req, context) {
  const params = await context.params   // ✅ เหมือนกัน

  const body = await req.json()

  const updated = await prisma.block.update({
    where: { id: Number(params.id) },
    data: {
      content: body.content
    }
  })

  return Response.json(updated)
}

export async function DELETE(req, context) {
  const params = await context.params   // ✅ await ตรงนี้

  await prisma.block.delete({
    where: { id: Number(params.id) }
  })

  return Response.json({ ok: true })
}