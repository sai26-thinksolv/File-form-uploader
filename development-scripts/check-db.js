const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const userCount = await prisma.user.count()
        console.log(`User count: ${userCount}`)

        const users = await prisma.user.findMany()
        console.log('Users:', users)

        console.log('Database connection successful.')
    } catch (e) {
        console.error('Database error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
