
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    const userId = '54b2000e-be34-47e8-8ea8-b74cc1adab34' // From logs
    const account = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: 'google'
        }
    })
    console.log('Account found:', !!account)
    if (account) {
        console.log('Has access_token:', !!account.access_token)
        console.log('Has refresh_token:', !!account.refresh_token)
        console.log('Refresh token length:', account.refresh_token ? account.refresh_token.length : 0)
    }
}

check()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
