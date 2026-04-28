import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getPatients, createPatient } from '@/lib/airtable'
import { z } from 'zod'

const patientSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\+55\d{2}9?\d{8}$/, 'Formato inválido. Use: +5511999999999'),
  goal: z.enum(['Emagrecimento', 'Ganho de massa', 'Saúde geral', 'Outro']),
  restrictions: z.string().optional().default(''),
  next_appointment: z.string().datetime().optional().nullable(),
})

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const goal = searchParams.get('goal') || undefined

    const patients = await getPatients(userId, { search, status, goal })
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const parsed = patientSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const newPatient = await createPatient({
      ...parsed.data,
      nutritionist_id: userId,
      status: 'Ativo',
      next_appointment: parsed.data.next_appointment || null,
    })

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
