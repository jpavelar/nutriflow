import { NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function POST() {
  try {
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const email = user.emailAddresses[0]?.emailAddress
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim()

    // Dispara o n8n para sincronizar o nutricionista
    await triggerN8nWorkflow('nutriflow', {
      action: 'syncNutritionist',
      clerkUserId: userId,
      email: email,
      name: name,
      imageUrl: user.imageUrl
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
