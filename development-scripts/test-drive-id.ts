
async function testDriveId(fileId: string) {
    console.log(`Testing File ID: ${fileId}`);

    // 1. Test Thumbnail URL
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    console.log(`\n1. Testing Thumbnail URL: ${thumbnailUrl}`);
    try {
        const res = await fetch(thumbnailUrl);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Response: ${text.substring(0, 200)}`);
        } else {
            console.log('✅ Success!');
        }
    } catch (e) {
        console.log('❌ Error:', e);
    }

    // 2. Test Download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    console.log(`\n2. Testing Download URL: ${downloadUrl}`);
    try {
        const res = await fetch(downloadUrl);
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Response: ${text.substring(0, 200)}`);
        } else {
            console.log('✅ Success!');
        }
    } catch (e) {
        console.log('❌ Error:', e);
    }
}

const fileId = '1g_LoYWzziMak0tZLubWI_UTkSaWsRZeD';
testDriveId(fileId);
