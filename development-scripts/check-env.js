console.log('='.repeat(50))
console.log('Environment Variables Check')
console.log('='.repeat(50))

console.log('\n1. GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ?
    `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : '❌ NOT SET')

console.log('\n2. GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ?
    `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...` : '❌ NOT SET')

console.log('\n3. NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ NOT SET')

console.log('\n4. NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ?
    `${process.env.NEXTAUTH_SECRET.substring(0, 10)}...` : '❌ NOT SET')

console.log('\n5. DATABASE_URL:', process.env.DATABASE_URL || '❌ NOT SET')

console.log('\n' + '='.repeat(50))

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('\n❌ ERROR: Google OAuth credentials are missing!')
    console.log('   Please add them to your .env file\n')
}

if (!process.env.NEXTAUTH_SECRET) {
    console.log('\n⚠️  WARNING: NEXTAUTH_SECRET is not set!')
    console.log('   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n')
}

if (!process.env.NEXTAUTH_URL) {
    console.log('\n⚠️  WARNING: NEXTAUTH_URL is not set!')
    console.log('   Should be: http://localhost:3000\n')
}

console.log('='.repeat(50))
