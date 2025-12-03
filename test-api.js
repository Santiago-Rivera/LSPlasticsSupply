// Script de prueba para la API de create-payment-intent
const testAPI = async () => {
    try {
        console.log('🧪 Probando API create-payment-intent...');
        
        const response = await fetch('http://localhost:3000/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    { id: 'AL-BS-HS', quantity: 1 }, // Half size shallow
                    { id: 'AL-BS-HD', quantity: 2 }  // Half size deep
                ]
            })
        });

        console.log('📡 Status:', response.status);
        console.log('📡 Content-Type:', response.headers.get('content-type'));

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('✅ Respuesta JSON:', JSON.stringify(data, null, 2));
        } else {
            const text = await response.text();
            console.log('❌ Respuesta NO JSON:', text.substring(0, 500));
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
    }
};

testAPI();

