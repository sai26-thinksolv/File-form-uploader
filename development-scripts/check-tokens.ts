import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTokens() {
    try {
        console.log('Checking user tokens in database...\n');

        // Get all accounts
        const accounts = await prisma.account.findMany({
            where: {
                provider: 'google'
            },
            select: {
                id: true,
                userId: true,
                provider: true,
                access_token: true,
                refresh_token: true,
                expires_at: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (accounts.length === 0) {
            console.log('No Google accounts found in database.');
            return;
        }

        console.log(`Found ${accounts.length} Google account(s):\n`);

        accounts.forEach((account, index) => {
            console.log(`Account ${index + 1}:`);
            console.log(`  User ID: ${account.userId}`);
            console.log(`  User Email: ${account.user.email}`);
            console.log(`  User Name: ${account.user.name}`);
            console.log(`  Access Token: ${account.access_token ? '✓ Present' : '✗ MISSING'}`);
            console.log(`  Refresh Token: ${account.refresh_token ? '✓ Present' : '✗ MISSING'}`);

            if (account.expires_at) {
                const expiresAt = new Date(account.expires_at * 1000);
                const now = new Date();
                const isExpired = expiresAt < now;
                console.log(`  Expires At: ${expiresAt.toISOString()} ${isExpired ? '(EXPIRED)' : '(Valid)'}`);
            } else {
                console.log(`  Expires At: Not set`);
            }
            console.log('');
        });

        // Check if any account is missing refresh token
        const missingRefreshToken = accounts.filter(a => !a.refresh_token);
        if (missingRefreshToken.length > 0) {
            console.log('⚠️  WARNING: Some accounts are missing refresh tokens!');
            console.log('   This will cause authentication errors when the access token expires.');
            console.log('   The user needs to re-authenticate to get a new refresh token.\n');
        }

    } catch (error) {
        console.error('Error checking tokens:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTokens();
