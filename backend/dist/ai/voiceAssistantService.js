export class VoiceAssistantEngine {
    static processVoiceQuery(req) {
        const text = req.transcription.toLowerCase();
        const lang = req.language || 'hi';
        const ctx = req.farmerProfileContext;
        // Intent 1: Crop Recommendation ("kaunsi fasal", "kya ugayein", "recommend crop")
        if (text.includes('fasal') || text.includes('crop') || text.includes('ugaye') || text.includes('sow') || text.includes('plant')) {
            const soilStr = ctx?.soilType ? `Aapki ${ctx.soilType} mitti` : 'Aapki mitti aur mausam';
            const responseText = `Kisan Bhai, ${soilStr} aur abhi ke mausam ke anusar Sharbati Gehu (Wheat) ya Yellow Mustard (Sarson) ki buvai sabse uttamm rahegi. Isse aapko per acre 22-25 Quintal yield aur behtar mandi daam milega.`;
            return {
                transcription: req.transcription,
                detectedIntent: 'CROP_RECOMMENDATION',
                language: lang,
                responseText,
                audioText: responseText,
                suggestedActions: [{ label: 'View Detailed AI Crop Report', link: '/crop-recommendation' }],
            };
        }
        // Intent 2: Crop Price / Mandi Bhav ("daam", "bhav", "rate", "price", "mandi")
        if (text.includes('daam') || text.includes('bhav') || text.includes('rate') || text.includes('price') || text.includes('mandi')) {
            const location = ctx?.district || 'Lucknow APMC Mandi';
            const responseText = `${location} me Gehu (Wheat) ka aaj ka modal bhav ₹2,275 per quintal hai, aur Sarson ka bhav ₹5,650 per quintal hai. Agle 2 mahine me daam 5% se 8% tak badhne ki ummeed hai.`;
            return {
                transcription: req.transcription,
                detectedIntent: 'PRICE_PREDICTION',
                language: lang,
                responseText,
                audioText: responseText,
                suggestedActions: [{ label: 'Check 6-Month Price Graph', link: '/price-prediction' }],
            };
        }
        // Intent 3: Leaf Disease / Leaf Symptoms ("patti", "pilapan", "bimar", "disease", "spot", "leaf")
        if (text.includes('patt') || text.includes('leaf') || text.includes('pila') || text.includes('disease') || text.includes('bimar') || text.includes('keda')) {
            const responseText = `Pattiyon par peelapan ya dhabbe fungal infection (Early Blight) ya Nitrogen ki kami ka sanket ho sakte hain. Khet se pati ki photo khinch kar hamare Disease Detector me upload karein, AI turant dawa aur upchar bata dega.`;
            return {
                transcription: req.transcription,
                detectedIntent: 'DISEASE_DETECTION',
                language: lang,
                responseText,
                audioText: responseText,
                suggestedActions: [{ label: 'Scan Leaf Photo Now', link: '/disease-detection' }],
            };
        }
        // Intent 4: Weather / Mausam ("mausam", "rain", "barish", "temperature", "weather")
        if (text.includes('mausam') || text.includes('weather') || text.includes('barish') || text.includes('rain') || text.includes('dhoop')) {
            const dist = ctx?.district || 'Lucknow';
            const responseText = `${dist} me aaj aakaash saaf rahega. Tapman 31°C hai aur aane wale 3 dino me barish ki koi sambhavna nahi hai. Sinchai (irrigation) ke liye mausam bilkul anukool hai.`;
            return {
                transcription: req.transcription,
                detectedIntent: 'WEATHER_QUERY',
                language: lang,
                responseText,
                audioText: responseText,
                suggestedActions: [{ label: '7-Day Weather Advisory', link: '/weather' }],
            };
        }
        // Intent 5: Government Scheme ("yojana", "scheme", "pm kisan", "sarkar")
        if (text.includes('yojana') || text.includes('scheme') || text.includes('sarkar') || text.includes('kisan credit') || text.includes('pm')) {
            const responseText = `Sarkari yojanayein jaise PM-KISAN Samman Nidhi (₹6,000 varshik), Pradhan Mantri Fasal Bima Yojana (Crop Insurance), aur PM Kisan Credit Card par 4% byaj dar par rinn uplabdha hai.`;
            return {
                transcription: req.transcription,
                detectedIntent: 'GOVERNMENT_SCHEME',
                language: lang,
                responseText,
                audioText: responseText,
                suggestedActions: [{ label: 'View All Govt Schemes', link: '/schemes' }],
            };
        }
        // Fallback general response
        const fallbackText = `Namaste Kisan Bhai! Mai AsraVerse AI voice assistant hu. Aap mujhse fasal ki buvai, patti ki bimari, mandi bhav, mausam ya sarkari yojanaon ke bare me puch sakte hain.`;
        return {
            transcription: req.transcription,
            detectedIntent: 'GENERAL_ASSISTANCE',
            language: lang,
            responseText: fallbackText,
            audioText: fallbackText,
            suggestedActions: [
                { label: 'AI Crop Recommendation', link: '/crop-recommendation' },
                { label: 'Marketplace', link: '/marketplace' },
            ],
        };
    }
}
