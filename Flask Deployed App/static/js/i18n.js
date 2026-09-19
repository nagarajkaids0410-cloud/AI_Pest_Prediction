/**
 * Multi-Language Support (i18n)
 * Supports: English, Hindi, Kannada, Tamil, Telugu
 * Uses data-i18n attributes for instant client-side translation.
 */
(function () {
    'use strict';

    const translations = {
        en: {
            // Navbar
            'nav.home': 'Home',
            'nav.detector': 'Detector',
            'nav.supplements': 'Supplements',
            'nav.contact': 'Contact Us',
            'nav.brand': 'AI Plant Engine',

            // Home page
            'home.title': 'Plant Disease Detection',
            'home.subtitle': 'Our cutting-edge AI Engine helps you detect and diagnose diseases across a wide variety of fruits and vegetables in seconds.',
            'home.cta': 'Try the AI Engine',
            'home.crops_title': 'Supported Crops',

            // Crop names
            'crop.apple': 'Apple',
            'crop.blueberry': 'Blueberry',
            'crop.cherry': 'Cherry',
            'crop.corn': 'Corn',
            'crop.grape': 'Grape',
            'crop.orange': 'Orange',
            'crop.peach': 'Peach',
            'crop.pepper_bell': 'Pepper Bell',
            'crop.potato': 'Potato',
            'crop.raspberry': 'Raspberry',
            'crop.soybean': 'Soybean',
            'crop.squash': 'Squash',
            'crop.strawberry': 'Strawberry',
            'crop.tomato': 'Tomato',

            // AI Engine page
            'engine.title': 'AI Engine',
            'engine.subtitle': 'Upload a photo of a plant leaf and let the AI instantly detect any diseases.',
            'engine.why_title': 'Why is it necessary?',
            'engine.why_text': 'Plant diseases severely affect the growth and yield of their respective species. Early diagnosis is one of the most critical aspects of crop management. Without proper identification, disease control measures can be a waste of time and money, leading to further plant losses. Our AI engine provides an immediate preliminary diagnosis before symptoms worsen.',
            'engine.prevention_title': 'Prevention Steps',
            'engine.choose_image': 'Choose Image',
            'engine.open_camera': 'Open Camera',
            'engine.no_file': 'No file chosen',
            'engine.upload_hint': "Simply upload or snap a photo of your plant's leaf, and see the magic of AI.",
            'engine.analyze': 'Analyze Now',
            'engine.capture': 'Capture Photo',
            'engine.read_more': 'Read More',
            'engine.step1': 'Follow Good Sanitation Practices.',
            'engine.step2': 'Fertilize to Keep Your Plants Healthy.',
            'engine.step3': 'Inspect Plants for Diseases Before You Bring Them Home.',
            'engine.step4': 'Allow the Soil to Warm Before Planting.',
            'engine.step5': 'Ensure a Healthy Garden By Rotating Crops.',
            'engine.step6': 'Provide Good Air Circulation.',
            'engine.step7': 'Remove Diseased Stems and Foliage.',

            // Submit / Results page
            'submit.title': 'Analysis Result',
            'submit.subtitle': 'Here is what our AI detected.',
            'submit.analyzed': 'Analyzed Image',
            'submit.description': 'Brief Description:',
            'submit.tips': 'Tips to Grow Healthy Plants:',
            'submit.prevention': 'Prevention Steps:',
            'submit.benefits': 'Benefits:',
            'submit.supplement': 'Recommended Supplement',
            'submit.fertilizer': 'Recommended Fertilizer',
            'submit.buy': 'Buy Product',

            // Market page
            'market.title': 'Supplements Store',
            'market.subtitle': 'Buy the best supplements and fertilizers for your plants in one place.',
            'market.fertilizer_badge': 'Fertilizer',
            'market.supplement_badge': 'Supplement',
            'market.buy': 'Buy Now',
            'market.for': 'For',

            // Contact page
            'contact.title': 'Contact Us',
            'contact.subtitle': "Have questions or suggestions? We'd love to hear from you. Get in touch below.",
            'contact.bio': "Hi! I am an enthusiastic developer passionate about Machine Learning, Artificial Intelligence, and modern Web Development. I'm always eager to learn, build innovative things, and connect with like-minded individuals.",
            'contact.connect': "Let's Connect",
            'contact.github': 'GitHub Profile',
            'contact.linkedin': 'LinkedIn Network',

            // Footer
            'footer.home': 'Home',
            'footer.engine': 'AI Engine',
            'footer.contact': 'Contact',
            'footer.credit': 'Designed & Developed by Nagaraj K',

            // Chat widget
            'chat.title': 'AI Plant Assistant',
            'chat.placeholder': 'Ask about plant diseases...',

            // Voice
            'voice.listening': 'Listening...',
            'voice.speak': 'Click to speak',
        },

        hi: {
            'nav.home': 'होम',
            'nav.detector': 'डिटेक्टर',
            'nav.supplements': 'सप्लीमेंट्स',
            'nav.contact': 'संपर्क करें',
            'nav.brand': 'AI प्लांट इंजन',

            'home.title': 'पौधों की बीमारी का पता लगाएं',
            'home.subtitle': 'हमारा अत्याधुनिक AI इंजन सेकंडों में विभिन्न फलों और सब्जियों की बीमारियों का पता लगाने में मदद करता है।',
            'home.cta': 'AI इंजन आज़माएं',
            'home.crops_title': 'समर्थित फसलें',

            'crop.apple': 'सेब',
            'crop.blueberry': 'ब्लूबेरी',
            'crop.cherry': 'चेरी',
            'crop.corn': 'मक्का',
            'crop.grape': 'अंगूर',
            'crop.orange': 'संतरा',
            'crop.peach': 'आड़ू',
            'crop.pepper_bell': 'शिमला मिर्च',
            'crop.potato': 'आलू',
            'crop.raspberry': 'रास्पबेरी',
            'crop.soybean': 'सोयाबीन',
            'crop.squash': 'स्क्वैश',
            'crop.strawberry': 'स्ट्रॉबेरी',
            'crop.tomato': 'टमाटर',

            'engine.title': 'AI इंजन',
            'engine.subtitle': 'पौधे की पत्ती की तस्वीर अपलोड करें और AI से बीमारी का पता लगाएं।',
            'engine.why_title': 'यह क्यों आवश्यक है?',
            'engine.why_text': 'पौधों की बीमारियाँ उनकी वृद्धि और उपज को गंभीर रूप से प्रभावित करती हैं। शीघ्र निदान फसल प्रबंधन के सबसे महत्वपूर्ण पहलुओं में से एक है। उचित पहचान के बिना, रोग नियंत्रण उपाय समय और धन की बर्बादी हो सकते हैं।',
            'engine.prevention_title': 'रोकथाम के कदम',
            'engine.choose_image': 'छवि चुनें',
            'engine.open_camera': 'कैमरा खोलें',
            'engine.no_file': 'कोई फ़ाइल नहीं चुनी',
            'engine.upload_hint': 'बस अपने पौधे की पत्ती की फ़ोटो अपलोड करें या स्नैप करें, और AI का जादू देखें।',
            'engine.analyze': 'अभी विश्लेषण करें',
            'engine.capture': 'फ़ोटो कैप्चर करें',
            'engine.read_more': 'और पढ़ें',
            'engine.step1': 'अच्छी स्वच्छता प्रथाओं का पालन करें।',
            'engine.step2': 'पौधों को स्वस्थ रखने के लिए खाद डालें।',
            'engine.step3': 'पौधे घर लाने से पहले बीमारियों की जाँच करें।',
            'engine.step4': 'रोपण से पहले मिट्टी को गर्म होने दें।',
            'engine.step5': 'फसल चक्र अपनाकर स्वस्थ बगीचा सुनिश्चित करें।',
            'engine.step6': 'अच्छी हवा का संचार प्रदान करें।',
            'engine.step7': 'रोगग्रस्त तनों और पत्तियों को हटा दें।',

            'submit.title': 'विश्लेषण परिणाम',
            'submit.subtitle': 'यहाँ हमारे AI ने क्या पता लगाया है।',
            'submit.analyzed': 'विश्लेषित छवि',
            'submit.description': 'संक्षिप्त विवरण:',
            'submit.tips': 'स्वस्थ पौधे उगाने की सलाह:',
            'submit.prevention': 'रोकथाम के कदम:',
            'submit.benefits': 'फायदे:',
            'submit.supplement': 'अनुशंसित सप्लीमेंट',
            'submit.fertilizer': 'अनुशंसित उर्वरक',
            'submit.buy': 'उत्पाद खरीदें',

            'market.title': 'सप्लीमेंट स्टोर',
            'market.subtitle': 'अपने पौधों के लिए सर्वोत्तम सप्लीमेंट और उर्वरक एक ही स्थान पर खरीदें।',
            'market.fertilizer_badge': 'उर्वरक',
            'market.supplement_badge': 'सप्लीमेंट',
            'market.buy': 'अभी खरीदें',
            'market.for': 'के लिए',

            'contact.title': 'संपर्क करें',
            'contact.subtitle': 'कोई प्रश्न या सुझाव हैं? हम आपसे सुनना चाहते हैं।',
            'contact.bio': 'नमस्ते! मैं मशीन लर्निंग, आर्टिफिशियल इंटेलिजेंस और आधुनिक वेब डेवलपमेंट के प्रति उत्साही डेवलपर हूँ।',
            'contact.connect': 'जुड़ें',
            'contact.github': 'GitHub प्रोफ़ाइल',
            'contact.linkedin': 'LinkedIn नेटवर्क',

            'footer.home': 'होम',
            'footer.engine': 'AI इंजन',
            'footer.contact': 'संपर्क',
            'footer.credit': 'नागराज K द्वारा डिज़ाइन और विकसित',

            'chat.title': 'AI प्लांट सहायक',
            'chat.placeholder': 'पौधों की बीमारियों के बारे में पूछें...',
            'voice.listening': 'सुन रहा हूँ...',
            'voice.speak': 'बोलने के लिए क्लिक करें',
        },

        kn: {
            'nav.home': 'ಮುಖಪುಟ',
            'nav.detector': 'ಪತ್ತೆ ಯಂತ್ರ',
            'nav.supplements': 'ಪೂರಕಗಳು',
            'nav.contact': 'ಸಂಪರ್ಕಿಸಿ',
            'nav.brand': 'AI ಸಸ್ಯ ಎಂಜಿನ್',

            'home.title': 'ಸಸ್ಯ ರೋಗ ಪತ್ತೆ',
            'home.subtitle': 'ನಮ್ಮ ಅತ್ಯಾಧುನಿಕ AI ಎಂಜಿನ್ ವಿವಿಧ ಹಣ್ಣುಗಳು ಮತ್ತು ತರಕಾರಿಗಳ ರೋಗಗಳನ್ನು ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪತ್ತೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
            'home.cta': 'AI ಎಂಜಿನ್ ಪ್ರಯತ್ನಿಸಿ',
            'home.crops_title': 'ಬೆಂಬಲಿತ ಬೆಳೆಗಳು',

            'crop.apple': 'ಸೇಬು',
            'crop.blueberry': 'ಬ್ಲೂಬೆರಿ',
            'crop.cherry': 'ಚೆರ್ರಿ',
            'crop.corn': 'ಜೋಳ',
            'crop.grape': 'ದ್ರಾಕ್ಷಿ',
            'crop.orange': 'ಕಿತ್ತಳೆ',
            'crop.peach': 'ಪೀಚ್',
            'crop.pepper_bell': 'ದೊಡ್ಡ ಮೆಣಸು',
            'crop.potato': 'ಆಲೂಗಡ್ಡೆ',
            'crop.raspberry': 'ರಾಸ್ಪ್ಬೆರಿ',
            'crop.soybean': 'ಸೋಯಾಬೀನ್',
            'crop.squash': 'ಸ್ಕ್ವಾಷ್',
            'crop.strawberry': 'ಸ್ಟ್ರಾಬೆರಿ',
            'crop.tomato': 'ಟೊಮೆಟೊ',

            'engine.title': 'AI ಎಂಜಿನ್',
            'engine.subtitle': 'ಸಸ್ಯದ ಎಲೆಯ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು AI ಮೂಲಕ ರೋಗಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ.',
            'engine.why_title': 'ಇದು ಏಕೆ ಅಗತ್ಯ?',
            'engine.why_text': 'ಸಸ್ಯ ರೋಗಗಳು ಅವುಗಳ ಬೆಳವಣಿಗೆ ಮತ್ತು ಇಳುವರಿಯನ್ನು ತೀವ್ರವಾಗಿ ಪ್ರಭಾವಿಸುತ್ತವೆ. ಮೊದಲೇ ರೋಗನಿರ್ಣಯ ಬೆಳೆ ನಿರ್ವಹಣೆಯ ಪ್ರಮುಖ ಅಂಶಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ.',
            'engine.prevention_title': 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು',
            'engine.choose_image': 'ಚಿತ್ರ ಆಯ್ಕೆ',
            'engine.open_camera': 'ಕ್ಯಾಮೆರಾ ತೆರೆ',
            'engine.no_file': 'ಯಾವ ಫೈಲ್ ಆಯ್ಕೆಯಾಗಿಲ್ಲ',
            'engine.upload_hint': 'ನಿಮ್ಮ ಸಸ್ಯದ ಎಲೆಯ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಸ್ನ್ಯಾಪ್ ಮಾಡಿ.',
            'engine.analyze': 'ಈಗ ವಿಶ್ಲೇಷಿಸಿ',
            'engine.capture': 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
            'engine.read_more': 'ಇನ್ನಷ್ಟು ಓದಿ',
            'engine.step1': 'ಒಳ್ಳೆಯ ನೈರ್ಮಲ್ಯ ಅಭ್ಯಾಸಗಳನ್ನು ಅನುಸರಿಸಿ.',
            'engine.step2': 'ಸಸ್ಯಗಳನ್ನು ಆರೋಗ್ಯವಾಗಿ ಇರಿಸಲು ಗೊಬ್ಬರ ಹಾಕಿ.',
            'engine.step3': 'ಮನೆಗೆ ತರುವ ಮುನ್ನ ಸಸ್ಯಗಳ ರೋಗಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
            'engine.step4': 'ನಾಟಿ ಮಾಡುವ ಮೊದಲು ಮಣ್ಣು ಬೆಚ್ಚಗಾಗಲು ಬಿಡಿ.',
            'engine.step5': 'ಬೆಳೆ ಸರದಿಯಿಂದ ಆರೋಗ್ಯಕರ ತೋಟ ಖಚಿತಪಡಿಸಿ.',
            'engine.step6': 'ಒಳ್ಳೆಯ ಗಾಳಿ ಸಂಚಾರ ಒದಗಿಸಿ.',
            'engine.step7': 'ರೋಗಗ್ರಸ್ತ ಕಾಂಡ ಮತ್ತು ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.',

            'submit.title': 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ',
            'submit.subtitle': 'ನಮ್ಮ AI ಏನು ಪತ್ತೆ ಮಾಡಿದೆ ಎಂಬುದು ಇಲ್ಲಿದೆ.',
            'submit.analyzed': 'ವಿಶ್ಲೇಷಿಸಿದ ಚಿತ್ರ',
            'submit.description': 'ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ:',
            'submit.tips': 'ಆರೋಗ್ಯಕರ ಸಸ್ಯಗಳನ್ನು ಬೆಳೆಸಲು ಸಲಹೆಗಳು:',
            'submit.prevention': 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು:',
            'submit.benefits': 'ಪ್ರಯೋಜನಗಳು:',
            'submit.supplement': 'ಶಿಫಾರಸ್ಸು ಮಾಡಲಾದ ಪೂರಕ',
            'submit.fertilizer': 'ಶಿಫಾರಸ್ಸು ಮಾಡಲಾದ ಗೊಬ್ಬರ',
            'submit.buy': 'ಉತ್ಪನ್ನ ಖರೀದಿಸಿ',

            'market.title': 'ಪೂರಕಗಳ ಅಂಗಡಿ',
            'market.subtitle': 'ನಿಮ್ಮ ಸಸ್ಯಗಳಿಗಾಗಿ ಅತ್ಯುತ್ತಮ ಪೂರಕಗಳು ಮತ್ತು ಗೊಬ್ಬರಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಖರೀದಿಸಿ.',
            'market.fertilizer_badge': 'ಗೊಬ್ಬರ',
            'market.supplement_badge': 'ಪೂರಕ',
            'market.buy': 'ಈಗ ಖರೀದಿಸಿ',
            'market.for': 'ಇದಕ್ಕಾಗಿ',

            'contact.title': 'ಸಂಪರ್ಕಿಸಿ',
            'contact.subtitle': 'ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ಸಲಹೆಗಳಿವೆಯೇ? ನಿಮ್ಮಿಂದ ಕೇಳಲು ನಮಗೆ ಸಂತೋಷ.',
            'contact.bio': 'ನಮಸ್ಕಾರ! ನಾನು ಮಷೀನ್ ಲರ್ನಿಂಗ್, AI ಮತ್ತು ಆಧುನಿಕ ವೆಬ್ ಡೆವಲಪ್ಮೆಂಟ್ ಬಗ್ಗೆ ಉತ್ಸಾಹಿ ಡೆವಲಪರ್.',
            'contact.connect': 'ಸಂಪರ್ಕ ಮಾಡಿ',
            'contact.github': 'GitHub ಪ್ರೊಫೈಲ್',
            'contact.linkedin': 'LinkedIn ನೆಟ್ವರ್ಕ್',

            'footer.home': 'ಮುಖಪುಟ',
            'footer.engine': 'AI ಎಂಜಿನ್',
            'footer.contact': 'ಸಂಪರ್ಕ',
            'footer.credit': 'ನಾಗರಾಜ್ K ಅವರಿಂದ ವಿನ್ಯಾಸ ಮತ್ತು ಅಭಿವೃದ್ಧಿ',

            'chat.title': 'AI ಸಸ್ಯ ಸಹಾಯಕ',
            'chat.placeholder': 'ಸಸ್ಯ ರೋಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
            'voice.listening': 'ಆಲಿಸುತ್ತಿದ್ದೇನೆ...',
            'voice.speak': 'ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
        },

        ta: {
            'nav.home': 'முகப்பு',
            'nav.detector': 'கண்டறிதல்',
            'nav.supplements': 'துணைப் பொருட்கள்',
            'nav.contact': 'தொடர்பு',
            'nav.brand': 'AI தாவர இயந்திரம்',

            'home.title': 'தாவர நோய் கண்டறிதல்',
            'home.subtitle': 'எங்கள் நவீன AI இயந்திரம் பல்வேறு பழங்கள் மற்றும் காய்கறிகளின் நோய்களை நொடிகளில் கண்டறிய உதவுகிறது.',
            'home.cta': 'AI இயந்திரத்தை முயற்சிக்கவும்',
            'home.crops_title': 'ஆதரிக்கப்படும் பயிர்கள்',

            'crop.apple': 'ஆப்பிள்',
            'crop.blueberry': 'புளூபெர்ரி',
            'crop.cherry': 'செர்ரி',
            'crop.corn': 'சோளம்',
            'crop.grape': 'திராட்சை',
            'crop.orange': 'ஆரஞ்சு',
            'crop.peach': 'பீச்',
            'crop.pepper_bell': 'குடை மிளகாய்',
            'crop.potato': 'உருளைக்கிழங்கு',
            'crop.raspberry': 'ராஸ்ப்பெர்ரி',
            'crop.soybean': 'சோயாபீன்',
            'crop.squash': 'ஸ்குவாஷ்',
            'crop.strawberry': 'ஸ்ட்ராபெர்ரி',
            'crop.tomato': 'தக்காளி',

            'engine.title': 'AI இயந்திரம்',
            'engine.subtitle': 'தாவர இலையின் புகைப்படத்தை பதிவேற்றி AI மூலம் நோய்களை கண்டறியுங்கள்.',
            'engine.why_title': 'இது ஏன் அவசியம்?',
            'engine.why_text': 'தாவர நோய்கள் அவற்றின் வளர்ச்சியையும் மகசூலையும் கடுமையாக பாதிக்கின்றன. முன்கூட்டிய கண்டறிதல் பயிர் மேலாண்மையின் மிக முக்கியமான அம்சங்களில் ஒன்றாகும்.',
            'engine.prevention_title': 'தடுப்பு நடவடிக்கைகள்',
            'engine.choose_image': 'படத்தைத் தேர்ந்தெடுக்கவும்',
            'engine.open_camera': 'கேமரா திற',
            'engine.no_file': 'எந்த கோப்பும் தேர்ந்தெடுக்கப்படவில்லை',
            'engine.upload_hint': 'உங்கள் தாவர இலையின் புகைப்படத்தை பதிவேற்றி AI-ன் மாயாஜாலத்தைப் பாருங்கள்.',
            'engine.analyze': 'இப்போது பகுப்பாய்வு செய்',
            'engine.capture': 'புகைப்படம் எடு',
            'engine.read_more': 'மேலும் படிக்க',
            'engine.step1': 'நல்ல சுகாதார நடைமுறைகளைப் பின்பற்றுங்கள்.',
            'engine.step2': 'தாவரங்களை ஆரோக்கியமாக வைத்திருக்க உரம் இடுங்கள்.',
            'engine.step3': 'வீட்டிற்கு கொண்டு வருவதற்கு முன் நோய்களைப் பரிசோதியுங்கள்.',
            'engine.step4': 'நடவு செய்வதற்கு முன் மண் சூடாக அனுமதியுங்கள்.',
            'engine.step5': 'பயிர் சுழற்சி மூலம் ஆரோக்கியமான தோட்டத்தை உறுதிப்படுத்துங்கள்.',
            'engine.step6': 'நல்ல காற்று சுழற்சியை வழங்குங்கள்.',
            'engine.step7': 'நோயுற்ற தண்டுகள் மற்றும் இலைகளை நீக்குங்கள்.',

            'submit.title': 'பகுப்பாய்வு முடிவு',
            'submit.subtitle': 'எங்கள் AI கண்டறிந்தது இதோ.',
            'submit.analyzed': 'பகுப்பாய்வு செய்த படம்',
            'submit.description': 'சுருக்கமான விவரம்:',
            'submit.tips': 'ஆரோக்கியமான தாவரங்களை வளர்க்க குறிப்புகள்:',
            'submit.prevention': 'தடுப்பு நடவடிக்கைகள்:',
            'submit.benefits': 'நன்மைகள்:',
            'submit.supplement': 'பரிந்துரைக்கப்பட்ட துணைப்பொருள்',
            'submit.fertilizer': 'பரிந்துரைக்கப்பட்ட உரம்',
            'submit.buy': 'பொருளை வாங்கு',

            'market.title': 'துணைப் பொருட்கள் கடை',
            'market.subtitle': 'உங்கள் தாவரங்களுக்கான சிறந்த பொருட்களை ஒரே இடத்தில் வாங்குங்கள்.',
            'market.fertilizer_badge': 'உரம்',
            'market.supplement_badge': 'துணைப்பொருள்',
            'market.buy': 'இப்போது வாங்கு',
            'market.for': 'இதற்காக',

            'contact.title': 'தொடர்பு கொள்ளுங்கள்',
            'contact.subtitle': 'கேள்விகள் அல்லது ஆலோசனைகள் உள்ளதா? தொடர்பில் இருங்கள்.',
            'contact.bio': 'வணக்கம்! நான் இயந்திர கற்றல், AI மற்றும் நவீன வலை மேம்பாட்டில் ஆர்வமுள்ள டெவலப்பர்.',
            'contact.connect': 'இணைவோம்',
            'contact.github': 'GitHub சுயவிவரம்',
            'contact.linkedin': 'LinkedIn நெட்வொர்க்',

            'footer.home': 'முகப்பு',
            'footer.engine': 'AI இயந்திரம்',
            'footer.contact': 'தொடர்பு',
            'footer.credit': 'நாகராஜ் K வடிவமைத்து உருவாக்கியது',

            'chat.title': 'AI தாவர உதவியாளர்',
            'chat.placeholder': 'தாவர நோய்களைப் பற்றி கேளுங்கள்...',
            'voice.listening': 'கேட்கிறேன்...',
            'voice.speak': 'பேச கிளிக் செய்யவும்',
        },

        te: {
            'nav.home': 'హోమ్',
            'nav.detector': 'డిటెక్టర్',
            'nav.supplements': 'సప్లిమెంట్లు',
            'nav.contact': 'సంప్రదించండి',
            'nav.brand': 'AI ప్లాంట్ ఇంజిన్',

            'home.title': 'మొక్క వ్యాధి గుర్తింపు',
            'home.subtitle': 'మా అత్యాధునిక AI ఇంజిన్ వివిధ పండ్లు మరియు కూరగాయల వ్యాధులను సెకన్లలో గుర్తించడంలో సహాయం చేస్తుంది.',
            'home.cta': 'AI ఇంజిన్ ప్రయత్నించండి',
            'home.crops_title': 'మద్దతు ఉన్న పంటలు',

            'crop.apple': 'ఆపిల్',
            'crop.blueberry': 'బ్లూబెర్రీ',
            'crop.cherry': 'చెర్రీ',
            'crop.corn': 'మొక్కజొన్న',
            'crop.grape': 'ద్రాక్ష',
            'crop.orange': 'నారింజ',
            'crop.peach': 'పీచ్',
            'crop.pepper_bell': 'బెల్ పెప్పర్',
            'crop.potato': 'బంగాళాదుంప',
            'crop.raspberry': 'రాస్ప్‌బెర్రీ',
            'crop.soybean': 'సోయాబీన్',
            'crop.squash': 'స్క్వాష్',
            'crop.strawberry': 'స్ట్రాబెర్రీ',
            'crop.tomato': 'టమాటా',

            'engine.title': 'AI ఇంజిన్',
            'engine.subtitle': 'మొక్క ఆకు ఫోటో అప్‌లోడ్ చేసి AI ద్వారా వ్యాధులను గుర్తించండి.',
            'engine.why_title': 'ఇది ఎందుకు అవసరం?',
            'engine.why_text': 'మొక్కల వ్యాధులు వాటి పెరుగుదల మరియు దిగుబడిని తీవ్రంగా ప్రభావితం చేస్తాయి. ముందస్తు రోగ నిర్ధారణ పంట నిర్వహణలో అత్యంత కీలకమైన అంశాలలో ఒకటి.',
            'engine.prevention_title': 'నివారణ చర్యలు',
            'engine.choose_image': 'చిత్రం ఎంచుకోండి',
            'engine.open_camera': 'కెమెరా తెరవండి',
            'engine.no_file': 'ఫైల్ ఎంచుకోలేదు',
            'engine.upload_hint': 'మీ మొక్క ఆకు ఫోటో అప్‌లోడ్ చేసి AI మాయాజాలం చూడండి.',
            'engine.analyze': 'ఇప్పుడు విశ్లేషించండి',
            'engine.capture': 'ఫోటో తీయండి',
            'engine.read_more': 'మరింత చదవండి',
            'engine.step1': 'మంచి పారిశుద్ధ్య పద్ధతులను అనుసరించండి.',
            'engine.step2': 'మొక్కలను ఆరోగ్యంగా ఉంచడానికి ఎరువు వేయండి.',
            'engine.step3': 'ఇంటికి తీసుకురాకముందు మొక్కలను పరీక్షించండి.',
            'engine.step4': 'నాటడానికి ముందు నేల వేడి అవ్వనివ్వండి.',
            'engine.step5': 'పంట మార్పిడి ద్వారా ఆరోగ్యకరమైన తోటను నిర్ధారించండి.',
            'engine.step6': 'మంచి గాలి ప్రసరణ కల్పించండి.',
            'engine.step7': 'వ్యాధిగ్రస్తమైన కాండాలు మరియు ఆకులను తొలగించండి.',

            'submit.title': 'విశ్లేషణ ఫలితం',
            'submit.subtitle': 'మా AI ఏమి గుర్తించిందో ఇక్కడ ఉంది.',
            'submit.analyzed': 'విశ్లేషించిన చిత్రం',
            'submit.description': 'సంక్షిప్త వివరణ:',
            'submit.tips': 'ఆరోగ్యకరమైన మొక్కలు పెంచడానికి చిట్కాలు:',
            'submit.prevention': 'నివారణ చర్యలు:',
            'submit.benefits': 'ప్రయోజనాలు:',
            'submit.supplement': 'సిఫార్సు చేసిన సప్లిమెంట్',
            'submit.fertilizer': 'సిఫార్సు చేసిన ఎరువు',
            'submit.buy': 'ఉత్పత్తి కొనండి',

            'market.title': 'సప్లిమెంట్ల దుకాణం',
            'market.subtitle': 'మీ మొక్కలకు అత్యుత్తమ సప్లిమెంట్లు మరియు ఎరువులను ఒకే చోట కొనండి.',
            'market.fertilizer_badge': 'ఎరువు',
            'market.supplement_badge': 'సప్లిమెంట్',
            'market.buy': 'ఇప్పుడు కొనండి',
            'market.for': 'కోసం',

            'contact.title': 'సంప్రదించండి',
            'contact.subtitle': 'ప్రశ్నలు లేదా సూచనలు ఉన్నాయా? మాతో సంప్రదించండి.',
            'contact.bio': 'హలో! నేను మెషిన్ లెర్నింగ్, AI మరియు ఆధునిక వెబ్ డెవలప్‌మెంట్‌పై ఉత్సాహంగా ఉన్న డెవలపర్.',
            'contact.connect': 'కనెక్ట్ అవ్వండి',
            'contact.github': 'GitHub ప్రొఫైల్',
            'contact.linkedin': 'LinkedIn నెట్‌వర్క్',

            'footer.home': 'హోమ్',
            'footer.engine': 'AI ఇంజిన్',
            'footer.contact': 'సంప్రదించు',
            'footer.credit': 'నాగరాజ్ K చే డిజైన్ & డెవలప్ చేయబడింది',

            'chat.title': 'AI ప్లాంట్ అసిస్టెంట్',
            'chat.placeholder': 'మొక్క వ్యాధుల గురించి అడగండి...',
            'voice.listening': 'వింటున్నాను...',
            'voice.speak': 'మాట్లాడటానికి క్లిక్ చేయండి',
        }
    };

    // Language codes for speech recognition
    const speechLangCodes = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        ta: 'ta-IN',
        te: 'te-IN'
    };

    let currentLang = localStorage.getItem('app_language') || 'en';

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    function applyTranslations(lang) {
        currentLang = lang;
        localStorage.setItem('app_language', lang);

        const dict = translations[lang] || translations['en'];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                // For inputs, update placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Update active language button indicator
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update language dropdown trigger label
        const labelEl = document.getElementById('current-lang-label');
        if (labelEl) {
            const labels = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ', ta: 'தமிழ்', te: 'తెలుగు' };
            labelEl.textContent = labels[lang] || 'English';
        }

        // Notify voice assistant about language change
        if (window.voiceAssistant) {
            window.voiceAssistant.setLanguage(speechLangCodes[lang] || 'en-IN');
        }
    }

    // Initialize
    function init() {
        // Bind language selector buttons
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.dataset.lang;
                if (lang && translations[lang]) {
                    applyTranslations(lang);
                }
            });
        });

        // Apply saved language
        applyTranslations(currentLang);
    }

    // Public API
    window.i18n = {
        setLanguage: applyTranslations,
        getCurrentLang: () => currentLang,
        getSpeechLang: () => speechLangCodes[currentLang] || 'en-IN',
        translations: translations
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
