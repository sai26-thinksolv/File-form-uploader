import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkLogos() {
    try {
        const forms = await prisma.form.findMany({
            where: {
                logoUrl: {
                    not: null
                }
            },
            select: {
                id: true,
                title: true,
                logoUrl: true
            }
        })

        console.log('\n=== Forms with Logos ===\n')

        if (forms.length === 0) {
            console.log('No forms found with logos.')
        } else {
            forms.forEach((form, index) => {
                console.log(`${index + 1}. Form: ${form.title}`)
                console.log(`   ID: ${form.id}`)
                console.log(`   Logo URL: ${form.logoUrl}`)
                console.log(`   URL Type: ${form.logoUrl?.includes('thumbnail') ? '✅ NEW (thumbnail)' :
                        form.logoUrl?.includes('uc?export=view') ? '❌ OLD (uc?export=view)' :
                            form.logoUrl?.includes('lh3.googleusercontent') ? '⚠️ INTERMEDIATE (lh3)' :
                                '❓ UNKNOWN'
                    }`)
                console.log('')
            })
        }
    } catch (error) {
        console.error('Error checking logos:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkLogos()
