import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ═══════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════
const LANGS = {
  en: {
    name: "English", flag: "🇬🇧",
    appName: "AGRONITI",
    selectRole: "Who are you?",
    farmer: "Farmer", buyer: "Buyer", admin: "Admin / Govt",
    farmerDesc: "Sell crops, get AI advice", buyerDesc: "Buy fresh produce", adminDesc: "Analytics & oversight",
    continue: "Continue →",
    dashboard: "Dashboard", sellCrop: "Sell Crop", aiAdvisor: "AI Advisor",
    nearbyBuyers: "Nearby Buyers", myOrders: "My Orders", history: "History",
    availableCrops: "Available Crops", transport: "Transport", overview: "Overview",
    farmers: "Farmers", buyers: "Buyers", reports: "Reports",
    goodMorning: "Good Morning", welcome: "Welcome",
    cropsListed: "Crops Listed", estProfit: "Est. Profit", marketTrend: "Market Trend",
    nearbyBuyersCount: "Nearby Buyers", thisMonth: "This month", within15km: "Within 15 km",
    wheatTrend: "Wheat Price Trend (7 Days)", seasonalDemand: "Seasonal Demand",
    myCrops: "My Crops", crop: "Crop", quantity: "Quantity", price: "Price",
    date: "Date", status: "Status", sold: "Sold", listed: "Listed",
    sellYourCrop: "Sell Your Crop", cropName: "Crop Name", selectCrop: "-- Select Crop --",
    qtyKg: "Quantity (kg)", yourPrice: "Your Price (₹/quintal)",
    storeIfNoBuyer: "Store if no buyer found?", yesStore: "Yes, store it", noSell: "No, sell ASAP",
    listCrop: "List Crop for Sale →", aiSuggestion: "AI Suggestion",
    currentMarket: "Current market price for", is: "is", trend: "Trend", rising: "↑ Rising",
    successTitle: "Crop Listed Successfully!", successMsg: "Buyers nearby will be notified.",
    listAnother: "List Another Crop", askAboutCrop: "Ask About Your Crop",
    aiPlaceholder: "e.g. Should I sell wheat today?", tryAsking: "Try asking:",
    nearbyBuyersTitle: "Nearby Buyers", nearLocation: "Buyers within 15 km of your location",
    mapView: "Map View", contactBuyer: "Contact Buyer", requestSent: "✅ Request Sent!",
    rating: "Rating", distance: "Distance",
    totalFarmers: "Total Farmers", totalSales: "Total Sales", scamRate: "Scam Rate",
    lossRate: "Post-Harvest Loss", priceRegion: "Price Trend by Region",
    salesRate: "Sales Rate", cropDist: "Crop Distribution",
    signOut: "Sign Out", language: "Language",
    cropsAvail: "Crops Available", avgPrice: "Avg Market Price", transportCost: "Transport Cost",
    storageNearby: "Nearby Storage", bookTransport: "Book Transport",
    filterBy: "Filter", allCrops: "All Crops", priceRange: "Price Range",
    farmerName: "Farmer", location: "Location", buy: "Buy Now",
    voiceTip: "🎙 Tap mic and speak in your language",
    listening: "Listening...", voiceError: "Voice not supported in this browser",
  },
  hi: {
    name: "हिंदी", flag: "🇮🇳",
    appName: "एग्रोनिति",
    selectRole: "आप कौन हैं?",
    farmer: "किसान", buyer: "खरीदार", admin: "प्रशासन / सरकार",
    farmerDesc: "फसल बेचें, AI सलाह पाएं", buyerDesc: "ताजा उपज खरीदें", adminDesc: "विश्लेषण और निगरानी",
    continue: "जारी रखें →",
    dashboard: "डैशबोर्ड", sellCrop: "फसल बेचें", aiAdvisor: "AI सलाहकार",
    nearbyBuyers: "पास के खरीदार", myOrders: "मेरे ऑर्डर", history: "इतिहास",
    availableCrops: "उपलब्ध फसलें", transport: "परिवहन", overview: "अवलोकन",
    farmers: "किसान", buyers: "खरीदार", reports: "रिपोर्ट",
    goodMorning: "सुप्रभात", welcome: "स्वागत है",
    cropsListed: "सूचीबद्ध फसलें", estProfit: "अनुमानित लाभ", marketTrend: "बाजार रुझान",
    nearbyBuyersCount: "पास के खरीदार", thisMonth: "इस महीने", within15km: "15 किमी के भीतर",
    wheatTrend: "गेहूं मूल्य रुझान (7 दिन)", seasonalDemand: "मौसमी मांग",
    myCrops: "मेरी फसलें", crop: "फसल", quantity: "मात्रा", price: "मूल्य",
    date: "तारीख", status: "स्थिति", sold: "बिक गया", listed: "सूचीबद्ध",
    sellYourCrop: "अपनी फसल बेचें", cropName: "फसल का नाम", selectCrop: "-- फसल चुनें --",
    qtyKg: "मात्रा (किलो)", yourPrice: "आपका मूल्य (₹/क्विंटल)",
    storeIfNoBuyer: "खरीदार न मिले तो भंडारण?", yesStore: "हाँ, भंडारण करें", noSell: "नहीं, तुरंत बेचें",
    listCrop: "फसल सूचीबद्ध करें →", aiSuggestion: "AI सुझाव",
    currentMarket: "का वर्तमान बाजार मूल्य", is: "है", trend: "रुझान", rising: "↑ बढ़ रहा है",
    successTitle: "फसल सफलतापूर्वक सूचीबद्ध!", successMsg: "पास के खरीदारों को सूचित किया जाएगा।",
    listAnother: "और फसल सूचीबद्ध करें", askAboutCrop: "अपनी फसल के बारे में पूछें",
    aiPlaceholder: "जैसे: क्या आज गेहूं बेचूं?", tryAsking: "पूछें:",
    nearbyBuyersTitle: "पास के खरीदार", nearLocation: "आपके स्थान से 15 किमी के भीतर खरीदार",
    mapView: "मैप व्यू", contactBuyer: "खरीदार से संपर्क करें", requestSent: "✅ अनुरोध भेजा!",
    rating: "रेटिंग", distance: "दूरी",
    totalFarmers: "कुल किसान", totalSales: "कुल बिक्री", scamRate: "धोखाधड़ी दर",
    lossRate: "फसल हानि", priceRegion: "क्षेत्रवार मूल्य रुझान",
    salesRate: "बिक्री दर", cropDist: "फसल वितरण",
    signOut: "साइन आउट", language: "भाषा",
    cropsAvail: "उपलब्ध फसलें", avgPrice: "औसत बाजार मूल्य", transportCost: "परिवहन लागत",
    storageNearby: "पास का भंडारण", bookTransport: "परिवहन बुक करें",
    filterBy: "फ़िल्टर", allCrops: "सभी फसलें", priceRange: "मूल्य सीमा",
    farmerName: "किसान", location: "स्थान", buy: "अभी खरीदें",
    voiceTip: "🎙 माइक दबाएं और अपनी भाषा में बोलें",
    listening: "सुन रहा है...", voiceError: "इस ब्राउज़र में आवाज़ समर्थित नहीं",
  },
  kn: {
    name: "ಕನ್ನಡ", flag: "🇮🇳",
    appName: "ಅಗ್ರೋನಿತಿ",
    selectRole: "ನೀವು ಯಾರು?",
    farmer: "ರೈತ", buyer: "ಖರೀದಿದಾರ", admin: "ಆಡಳಿತ / ಸರ್ಕಾರ",
    farmerDesc: "ಬೆಳೆ ಮಾರಿ, AI ಸಲಹೆ ಪಡೆಯಿರಿ", buyerDesc: "ತಾಜಾ ಉತ್ಪನ್ನ ಖರೀದಿಸಿ", adminDesc: "ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ",
    continue: "ಮುಂದುವರಿಯಿರಿ →",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", sellCrop: "ಬೆಳೆ ಮಾರಿ", aiAdvisor: "AI ಸಲಹೆಗಾರ",
    nearbyBuyers: "ಹತ್ತಿರದ ಖರೀದಿದಾರರು", myOrders: "ನನ್ನ ಆದೇಶಗಳು", history: "ಇತಿಹಾಸ",
    availableCrops: "ಲಭ್ಯ ಬೆಳೆಗಳು", transport: "ಸಾರಿಗೆ", overview: "ಅವಲೋಕನ",
    farmers: "ರೈತರು", buyers: "ಖರೀದಿದಾರರು", reports: "ವರದಿಗಳು",
    goodMorning: "ಶುಭೋದಯ", welcome: "ಸ್ವಾಗತ",
    cropsListed: "ಪಟ್ಟಿ ಮಾಡಿದ ಬೆಳೆಗಳು", estProfit: "ಅಂದಾಜು ಲಾಭ", marketTrend: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ",
    nearbyBuyersCount: "ಹತ್ತಿರದ ಖರೀದಿದಾರರು", thisMonth: "ಈ ತಿಂಗಳು", within15km: "15 ಕಿಮೀ ಒಳಗೆ",
    wheatTrend: "ಗೋಧಿ ಬೆಲೆ ಪ್ರವೃತ್ತಿ (7 ದಿನ)", seasonalDemand: "ಋತು ಬೇಡಿಕೆ",
    myCrops: "ನನ್ನ ಬೆಳೆಗಳು", crop: "ಬೆಳೆ", quantity: "ಪ್ರಮಾಣ", price: "ಬೆಲೆ",
    date: "ದಿನಾಂಕ", status: "ಸ್ಥಿತಿ", sold: "ಮಾರಲಾಯಿತು", listed: "ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ",
    sellYourCrop: "ನಿಮ್ಮ ಬೆಳೆ ಮಾರಿ", cropName: "ಬೆಳೆ ಹೆಸರು", selectCrop: "-- ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ --",
    qtyKg: "ಪ್ರಮಾಣ (ಕೆಜಿ)", yourPrice: "ನಿಮ್ಮ ಬೆಲೆ (₹/ಕ್ವಿಂಟಾಲ್)",
    storeIfNoBuyer: "ಖರೀದಿದಾರ ಸಿಗದಿದ್ದರೆ ಶೇಖರಣೆ?", yesStore: "ಹೌದು, ಶೇಖರಿಸಿ", noSell: "ಇಲ್ಲ, ಈಗಲೇ ಮಾರಿ",
    listCrop: "ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡಿ →", aiSuggestion: "AI ಸಲಹೆ",
    currentMarket: "ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ", is: "ಆಗಿದೆ", trend: "ಪ್ರವೃತ್ತಿ", rising: "↑ ಏರುತ್ತಿದೆ",
    successTitle: "ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ!", successMsg: "ಹತ್ತಿರದ ಖರೀದಿದಾರರಿಗೆ ತಿಳಿಸಲಾಗುವುದು.",
    listAnother: "ಇನ್ನೊಂದು ಬೆಳೆ ಪಟ್ಟಿ ಮಾಡಿ", askAboutCrop: "ನಿಮ್ಮ ಬೆಳೆ ಬಗ್ಗೆ ಕೇಳಿ",
    aiPlaceholder: "ಉದಾ: ಇಂದು ಗೋಧಿ ಮಾರಬೇಕೇ?", tryAsking: "ಕೇಳಿ:",
    nearbyBuyersTitle: "ಹತ್ತಿರದ ಖರೀದಿದಾರರು", nearLocation: "ನಿಮ್ಮ ಸ್ಥಳದಿಂದ 15 ಕಿಮೀ ಒಳಗೆ",
    mapView: "ನಕ್ಷೆ ವೀಕ್ಷಣೆ", contactBuyer: "ಖರೀದಿದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ", requestSent: "✅ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ!",
    rating: "ರೇಟಿಂಗ್", distance: "ದೂರ",
    totalFarmers: "ಒಟ್ಟು ರೈತರು", totalSales: "ಒಟ್ಟು ಮಾರಾಟ", scamRate: "ವಂಚನೆ ದರ",
    lossRate: "ಬೆಳೆ ನಷ್ಟ", priceRegion: "ಪ್ರದೇಶದ ಬೆಲೆ ಪ್ರವೃತ್ತಿ",
    salesRate: "ಮಾರಾಟ ದರ", cropDist: "ಬೆಳೆ ವಿತರಣೆ",
    signOut: "ಸೈನ್ ಔಟ್", language: "ಭಾಷೆ",
    cropsAvail: "ಲಭ್ಯ ಬೆಳೆಗಳು", avgPrice: "ಸರಾಸರಿ ಬೆಲೆ", transportCost: "ಸಾರಿಗೆ ವೆಚ್ಚ",
    storageNearby: "ಹತ್ತಿರದ ಶೇಖರಣೆ", bookTransport: "ಸಾರಿಗೆ ಬುಕ್ ಮಾಡಿ",
    filterBy: "ಫಿಲ್ಟರ್", allCrops: "ಎಲ್ಲ ಬೆಳೆಗಳು", priceRange: "ಬೆಲೆ ಶ್ರೇಣಿ",
    farmerName: "ರೈತ", location: "ಸ್ಥಳ", buy: "ಈಗ ಖರೀದಿಸಿ",
    voiceTip: "🎙 ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತಾಡಿ",
    listening: "ಆಲಿಸುತ್ತಿದೆ...", voiceError: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಬೆಂಬಲ ಇಲ್ಲ",
  },
  mr: {
    name: "मराठी", flag: "🇮🇳",
    appName: "अॅग्रोनिती",
    selectRole: "तुम्ही कोण आहात?",
    farmer: "शेतकरी", buyer: "खरेदीदार", admin: "प्रशासन / सरकार",
    farmerDesc: "पीक विका, AI सल्ला घ्या", buyerDesc: "ताजे उत्पादन खरेदी करा", adminDesc: "विश्लेषण आणि देखरेख",
    continue: "पुढे जा →",
    dashboard: "डॅशबोर्ड", sellCrop: "पीक विका", aiAdvisor: "AI सल्लागार",
    nearbyBuyers: "जवळचे खरेदीदार", myOrders: "माझे ऑर्डर", history: "इतिहास",
    availableCrops: "उपलब्ध पिके", transport: "वाहतूक", overview: "आढावा",
    farmers: "शेतकरी", buyers: "खरेदीदार", reports: "अहवाल",
    goodMorning: "सुप्रभात", welcome: "स्वागत आहे",
    cropsListed: "सूचीबद्ध पिके", estProfit: "अंदाजे नफा", marketTrend: "बाजार ट्रेंड",
    nearbyBuyersCount: "जवळचे खरेदीदार", thisMonth: "या महिन्यात", within15km: "15 किमी मध्ये",
    wheatTrend: "गव्हाचा किंमत ट्रेंड (7 दिवस)", seasonalDemand: "हंगामी मागणी",
    myCrops: "माझी पिके", crop: "पीक", quantity: "प्रमाण", price: "किंमत",
    date: "तारीख", status: "स्थिती", sold: "विकले", listed: "सूचीबद्ध",
    sellYourCrop: "तुमचे पीक विका", cropName: "पीकाचे नाव", selectCrop: "-- पीक निवडा --",
    qtyKg: "प्रमाण (किलो)", yourPrice: "तुमची किंमत (₹/क्विंटल)",
    storeIfNoBuyer: "खरेदीदार न मिळाल्यास साठवण?", yesStore: "होय, साठवा", noSell: "नाही, लगेच विका",
    listCrop: "पीक सूचीबद्ध करा →", aiSuggestion: "AI सूचना",
    currentMarket: "चा सध्याचा बाजार भाव", is: "आहे", trend: "ट्रेंड", rising: "↑ वाढत आहे",
    successTitle: "पीक यशस्वीरित्या सूचीबद्ध!", successMsg: "जवळच्या खरेदीदारांना सूचित केले जाईल.",
    listAnother: "आणखी पीक सूचीबद्ध करा", askAboutCrop: "तुमच्या पिकाबद्दल विचारा",
    aiPlaceholder: "उदा. आज गहू विकावा का?", tryAsking: "विचारा:",
    nearbyBuyersTitle: "जवळचे खरेदीदार", nearLocation: "तुमच्या ठिकाणापासून 15 किमी मध्ये",
    mapView: "नकाशा दृश्य", contactBuyer: "खरेदीदाराशी संपर्क करा", requestSent: "✅ विनंती पाठवली!",
    rating: "रेटिंग", distance: "अंतर",
    totalFarmers: "एकूण शेतकरी", totalSales: "एकूण विक्री", scamRate: "फसवणूक दर",
    lossRate: "पीक हानी", priceRegion: "प्रदेशानुसार किंमत ट्रेंड",
    salesRate: "विक्री दर", cropDist: "पीक वितरण",
    signOut: "साइन आउट", language: "भाषा",
    cropsAvail: "उपलब्ध पिके", avgPrice: "सरासरी बाजार भाव", transportCost: "वाहतूक खर्च",
    storageNearby: "जवळची साठवण", bookTransport: "वाहतूक बुक करा",
    filterBy: "फिल्टर", allCrops: "सर्व पिके", priceRange: "किंमत श्रेणी",
    farmerName: "शेतकरी", location: "स्थान", buy: "आता खरेदी करा",
    voiceTip: "🎙 मायक दाबा आणि तुमच्या भाषेत बोला",
    listening: "ऐकत आहे...", voiceError: "या ब्राउझरमध्ये व्हॉइस समर्थित नाही",
  },
  te: {
    name: "తెలుగు", flag: "🇮🇳",
    appName: "అగ్రోనిటి",
    selectRole: "మీరు ఎవరు?",
    farmer: "రైతు", buyer: "కొనుగోలుదారు", admin: "నిర్వాహణ / ప్రభుత్వం",
    farmerDesc: "పంట అమ్మండి, AI సలహా పొందండి", buyerDesc: "తాజా ఉత్పత్తులు కొనండి", adminDesc: "విశ్లేషణ మరియు పర్యవేక్షణ",
    continue: "కొనసాగించండి →",
    dashboard: "డాష్‌బోర్డ్", sellCrop: "పంట అమ్మండి", aiAdvisor: "AI సలహాదారు",
    nearbyBuyers: "దగ్గరలోని కొనుగోలుదారులు", myOrders: "నా ఆర్డర్లు", history: "చరిత్ర",
    availableCrops: "అందుబాటులో ఉన్న పంటలు", transport: "రవాణా", overview: "అవలోకనం",
    farmers: "రైతులు", buyers: "కొనుగోలుదారులు", reports: "నివేదికలు",
    goodMorning: "శుభోదయం", welcome: "స్వాగతం",
    cropsListed: "జాబితా చేసిన పంటలు", estProfit: "అంచనా లాభం", marketTrend: "మార్కెట్ ట్రెండ్",
    nearbyBuyersCount: "దగ్గరలోని కొనుగోలుదారులు", thisMonth: "ఈ నెల", within15km: "15 కి.మీ లోపు",
    wheatTrend: "గోధుమ ధర ట్రెండ్ (7 రోజులు)", seasonalDemand: "సీజనల్ డిమాండ్",
    myCrops: "నా పంటలు", crop: "పంట", quantity: "పరిమాణం", price: "ధర",
    date: "తేదీ", status: "స్థితి", sold: "అమ్ముడైంది", listed: "జాబితా చేశారు",
    sellYourCrop: "మీ పంట అమ్మండి", cropName: "పంట పేరు", selectCrop: "-- పంట ఎంచుకోండి --",
    qtyKg: "పరిమాణం (కిలో)", yourPrice: "మీ ధర (₹/క్వింటాల్)",
    storeIfNoBuyer: "కొనుగోలుదారు దొరకకపోతే నిల్వ?", yesStore: "అవును, నిల్వ చేయండి", noSell: "లేదు, వెంటనే అమ్మండి",
    listCrop: "పంటను జాబితా చేయండి →", aiSuggestion: "AI సూచన",
    currentMarket: "ప్రస్తుత మార్కెట్ ధర", is: "ఉంది", trend: "ట్రెండ్", rising: "↑ పెరుగుతోంది",
    successTitle: "పంట విజయవంతంగా జాబితా చేయబడింది!", successMsg: "దగ్గరలోని కొనుగోలుదారులకు తెలియజేయబడుతుంది.",
    listAnother: "మరో పంట జాబితా చేయండి", askAboutCrop: "మీ పంట గురించి అడగండి",
    aiPlaceholder: "ఉదా: ఈరోజు గోధుమ అమ్మాలా?", tryAsking: "అడగండి:",
    nearbyBuyersTitle: "దగ్గరలోని కొనుగోలుదారులు", nearLocation: "మీ స్థానం నుండి 15 కి.మీ లోపు",
    mapView: "మ్యాప్ వ్యూ", contactBuyer: "కొనుగోలుదారుని సంప్రదించండి", requestSent: "✅ అభ్యర్థన పంపబడింది!",
    rating: "రేటింగ్", distance: "దూరం",
    totalFarmers: "మొత్తం రైతులు", totalSales: "మొత్తం అమ్మకాలు", scamRate: "మోసం రేటు",
    lossRate: "పంట నష్టం", priceRegion: "ప్రాంతం వారీ ధర ట్రెండ్",
    salesRate: "అమ్మకాల రేటు", cropDist: "పంట పంపిణీ",
    signOut: "సైన్ అవుట్", language: "భాష",
    cropsAvail: "అందుబాటులో ఉన్న పంటలు", avgPrice: "సగటు మార్కెట్ ధర", transportCost: "రవాణా ఖర్చు",
    storageNearby: "దగ్గరలోని నిల్వ", bookTransport: "రవాణా బుక్ చేయండి",
    filterBy: "ఫిల్టర్", allCrops: "అన్ని పంటలు", priceRange: "ధర పరిధి",
    farmerName: "రైతు", location: "స్థానం", buy: "ఇప్పుడు కొనండి",
    voiceTip: "🎙 మైక్ నొక్కి మీ భాషలో మాట్లాడండి",
    listening: "వింటోంది...", voiceError: "ఈ బ్రౌజర్‌లో వాయిస్ మద్దతు లేదు",
  },
};

// ═══════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════
const priceData = [
  {day:"Mon",price:1800},{day:"Tue",price:1950},{day:"Wed",price:1870},
  {day:"Thu",price:2100},{day:"Fri",price:2050},{day:"Sat",price:2200},{day:"Sun",price:2150},
];
const demandData = [
  {month:"Jan",demand:70},{month:"Feb",demand:55},{month:"Mar",demand:80},
  {month:"Apr",demand:90},{month:"May",demand:65},{month:"Jun",demand:75},
];
const pieData = [
  {name:"Wheat",value:35},{name:"Rice",value:28},{name:"Tomato",value:15},
  {name:"Onion",value:12},{name:"Other",value:10}
];
const PIE_COLORS = ["#2E7D32","#FF9800","#1976D2","#9C27B0","#607D8B"];
const regionData = [
  {region:"Dharwad",price:2100},{region:"Hubli",price:1980},{region:"Belgaum",price:2050},
  {region:"Bijapur",price:1920},{region:"Mysore",price:2180},
];
const buyers = [
  {id:1,name:"Ramesh Traders",dist:"3.2 km",crop:"Wheat, Rice",rating:4.5,phone:"+91 98765 43210"},
  {id:2,name:"Suresh Agro",dist:"5.8 km",crop:"Vegetables",rating:4.2,phone:"+91 87654 32109"},
  {id:3,name:"Karnataka Mandi",dist:"8.1 km",crop:"All Crops",rating:4.8,phone:"+91 76543 21098"},
  {id:4,name:"Green Harvest Co.",dist:"12.4 km",crop:"Rice, Maize",rating:4.0,phone:"+91 65432 10987"},
];
const availableCropsData = [
  {id:1,farmer:"Ravi Kumar",crop:"Wheat",qty:"500 kg",price:"₹2,100/q",loc:"Dharwad",freshness:"2 days ago"},
  {id:2,farmer:"Suresh Patil",crop:"Rice",qty:"800 kg",price:"₹1,850/q",loc:"Hubli",freshness:"1 day ago"},
  {id:3,farmer:"Anita Reddy",crop:"Tomato",qty:"200 kg",price:"₹950/q",loc:"Belgaum",freshness:"Today"},
  {id:4,farmer:"Mahesh Gowda",crop:"Onion",qty:"350 kg",price:"₹1,200/q",loc:"Mysore",freshness:"3 days ago"},
  {id:5,farmer:"Priya Singh",crop:"Maize",qty:"600 kg",price:"₹1,650/q",loc:"Bijapur",freshness:"Today"},
];
const crops = ["Wheat","Rice","Maize","Tomato","Onion","Potato","Sugarcane","Cotton","Soybean","Groundnut"];
const myCrops = [
  {name:"Wheat",qty:"500 kg",price:"₹2,100/q",status:"listed",date:"22 Feb 2026"},
  {name:"Rice",qty:"300 kg",price:"₹1,850/q",status:"sold",date:"18 Feb 2026"},
  {name:"Tomato",qty:"200 kg",price:"₹900/q",status:"listed",date:"25 Feb 2026"},
];
const cropPrices = {Wheat:2100,Rice:1850,Maize:1650,Tomato:950,Onion:1200,Potato:600,Sugarcane:350,Cotton:6200,Soybean:4100,Groundnut:5500};

// ═══════════════════════════════════════════════════
// AI LOGIC (calls Anthropic API)
// ═══════════════════════════════════════════════════
const getAIResponse = async (userMsg, lang) => {
  const langName = LANGS[lang]?.name || "English";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `You are AGRONITI, a friendly AI crop advisor for Indian farmers. Always respond in ${langName}. Keep answers very short (2-4 sentences max). Use simple words. Focus on: crop prices, best time to sell, storage advice, and nearby buyers. Include ₹ prices when relevant. Use emojis to be friendly. Current date: Feb 28 2026.`,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    const data = await res.json();
    return data?.content?.[0]?.text || "Sorry, I could not get advice right now. Please try again.";
  } catch {
    // Fallback if API fails
    const lower = userMsg.toLowerCase();
    if (lower.includes("wheat") || lower.includes("गेहूं") || lower.includes("ಗೋಧಿ")) return "🌾 Wheat: ₹2,100–₹2,200/q. Trend UP 📈. Hold 3–4 days for better price.";
    if (lower.includes("rice") || lower.includes("चावल") || lower.includes("ಅಕ್ಕಿ")) return "🌾 Rice: ₹1,800–₹1,950/q. Demand STABLE. Sell now if qty >200kg.";
    if (lower.includes("tomato") || lower.includes("टमाटर") || lower.includes("ಟೊಮ್ಯಾಟೊ")) return "🍅 Tomato: ₹800–₹1,200/q. HIGH risk. Sell TODAY – prices may drop next week.";
    return "👨‍🌾 Ask me about: crop prices, when to sell, nearby buyers, or storage options!";
  }
};

// ═══════════════════════════════════════════════════
// VOICE HOOK
// ═══════════════════════════════════════════════════
const useVoice = (lang, onResult) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recogRef = useRef(null);

  const langCodes = { en: "en-IN", hi: "hi-IN", kn: "kn-IN", mr: "mr-IN", te: "te-IN" };

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError(true); return; }
    const r = new SR();
    r.lang = langCodes[lang] || "en-IN";
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      onResult(txt);
    };
    recogRef.current = r;
    r.start();
  };

  const stop = () => { recogRef.current?.stop(); setListening(false); };
  return { listening, error, start, stop };
};

// ═══════════════════════════════════════════════════
// SHARED STYLE HELPERS
// ═══════════════════════════════════════════════════
const card = { background:"#fff", borderRadius:12, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.08)" };
const btn = (bg="#2E7D32",color="#fff",full=false) => ({
  background:bg, color, border:"none", borderRadius:8, padding:"11px 22px",
  fontSize:14, fontWeight:600, cursor:"pointer", width:full?"100%":"auto"
});
const input = { width:"100%", border:"1px solid #e0e0e0", borderRadius:8, padding:"10px 12px",
  fontSize:14, outline:"none", boxSizing:"border-box", background:"#fafafa" };
const label = { display:"block", fontSize:13, fontWeight:600, color:"#444", marginBottom:5 };

// ═══════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════
const StatCard = ({ emoji, label: lbl_, value, sub, color="#2E7D32" }) => (
  <div style={{ ...card, flex:1, minWidth:140 }}>
    <div style={{ fontSize:24, marginBottom:6 }}>{emoji}</div>
    <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>{lbl_}</div>
    <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{sub}</div>}
  </div>
);

// ═══════════════════════════════════════════════════
// AI CHAT COMPONENT (shared)
// ═══════════════════════════════════════════════════
const AIChat = ({ t, lang }) => {
  const [msgs, setMsgs] = useState([
    { from:"ai", text:"👋 " + (t.goodMorning || "Hello") + "! " + t.aiPlaceholder }
  ]);
  const [input_, setInput_] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMsg = async (text) => {
    if (!text?.trim()) return;
    const userMsg = { from:"user", text };
    setMsgs(m => [...m, userMsg, { from:"ai", text:"⏳ ..." }]);
    setInput_("");
    setLoading(true);
    const reply = await getAIResponse(text, lang);
    setMsgs(m => [...m.slice(0,-1), { from:"ai", text: reply }]);
    setLoading(false);
  };

  const { listening, error: voiceError, start, stop } = useVoice(lang, (txt) => {
    setInput_(txt);
    sendMsg(txt);
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>🤖 {t.aiAdvisor}</h2>
      <p style={{ color:"#888", fontSize:13, marginBottom:16 }}>{t.voiceTip}</p>
      <div style={{ ...card, maxWidth:560, display:"flex", flexDirection:"column", height:460 }}>
        <div style={{ background:"#2E7D32", color:"#fff", padding:"12px 18px", borderRadius:"12px 12px 0 0", fontWeight:600, fontSize:14 }}>
          💬 {t.askAboutCrop}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start" }}>
              <div style={{
                background:m.from==="user"?"#2E7D32":"#f1f5f1",
                color:m.from==="user"?"#fff":"#222",
                padding:"10px 14px", borderRadius:m.from==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                maxWidth:"82%", fontSize:14, lineHeight:1.5
              }}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:10, borderTop:"1px solid #f0f0f0", display:"flex", gap:8, alignItems:"center" }}>
          <input
            value={input_}
            onChange={e => setInput_(e.target.value)}
            onKeyDown={e => e.key==="Enter" && sendMsg(input_)}
            placeholder={t.aiPlaceholder}
            disabled={loading}
            style={{ ...input, flex:1 }}
          />
          <button
            onClick={listening ? stop : start}
            title={t.voiceTip}
            style={{ background: listening?"#e53935":"#f5f5f5", color:listening?"#fff":"#888",
              border:"none", borderRadius:8, padding:"10px 12px", cursor:"pointer", fontSize:16 }}>
            {listening ? "🔴" : "🎙"}
          </button>
          <button onClick={() => sendMsg(input_)} disabled={loading}
            style={{ ...btn(), padding:"10px 14px" }}>➤</button>
        </div>
        {listening && <div style={{ textAlign:"center", fontSize:12, color:"#e53935", padding:"4px 0 8px" }}>{t.listening}</div>}
        {voiceError && <div style={{ textAlign:"center", fontSize:12, color:"#999", padding:"4px 0 8px" }}>{t.voiceError}</div>}
      </div>
      <p style={{ marginTop:10, color:"#aaa", fontSize:12 }}>{t.tryAsking} "wheat price", "sell rice today?", "storage"</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// FARMER PAGES
// ═══════════════════════════════════════════════════
const FarmerDashboard = ({ t }) => (
  <div>
    <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>🌾 {t.goodMorning}, Ravi!</h2>
    <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
      <StatCard emoji="📦" label={t.cropsListed} value="3" sub="2 active" />
      <StatCard emoji="💰" label={t.estProfit} value="₹42,500" sub={t.thisMonth} color="#FF9800" />
      <StatCard emoji="📈" label={t.marketTrend} value="↑ UP" sub="Wheat +5%" color="#1976D2" />
      <StatCard emoji="👥" label={t.nearbyBuyersCount} value="12" sub={t.within15km} color="#9C27B0" />
    </div>
    <div style={{ display:"flex", gap:18, flexWrap:"wrap", marginBottom:20 }}>
      <div style={{ ...card, flex:2, minWidth:260 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14, color:"#333" }}>📈 {t.wheatTrend}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={priceData}>
            <XAxis dataKey="day" tick={{ fontSize:11 }} />
            <YAxis tick={{ fontSize:11 }} domain={[1600,2400]} />
            <Tooltip formatter={v => `₹${v}`} />
            <Line type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={2.5} dot={{ r:3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card, flex:1, minWidth:200 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14, color:"#333" }}>📊 {t.seasonalDemand}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={demandData}>
            <XAxis dataKey="month" tick={{ fontSize:10 }} />
            <YAxis tick={{ fontSize:10 }} />
            <Tooltip />
            <Bar dataKey="demand" fill="#FF9800" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div style={card}>
      <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>{t.myCrops}</h3>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#f8f9fa" }}>
            {[t.crop,t.quantity,t.price,t.date,t.status].map(h => (
              <th key={h} style={{ padding:"9px 10px", textAlign:"left", fontWeight:600, color:"#666" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {myCrops.map((c,i) => (
            <tr key={i} style={{ borderBottom:"1px solid #f3f3f3" }}>
              <td style={{ padding:"9px 10px", fontWeight:600 }}>🌾 {c.name}</td>
              <td style={{ padding:"9px 10px", color:"#666" }}>{c.qty}</td>
              <td style={{ padding:"9px 10px", color:"#2E7D32", fontWeight:600 }}>{c.price}</td>
              <td style={{ padding:"9px 10px", color:"#999" }}>{c.date}</td>
              <td style={{ padding:"9px 10px" }}>
                <span style={{ background:c.status==="sold"?"#e8f5e9":"#fff8e1", color:c.status==="sold"?"#2E7D32":"#F57F17", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>
                  {c.status==="sold"?t.sold:t.listed}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SellCrop = ({ t }) => {
  const [form, setForm] = useState({ crop:"", qty:"", price:"", store:"no" });
  const [submitted, setSubmitted] = useState(false);
  const suggested = cropPrices[form.crop] || null;

  if (submitted) return (
    <div style={{ textAlign:"center", padding:60 }}>
      <div style={{ fontSize:60, marginBottom:12 }}>✅</div>
      <h2 style={{ fontSize:22, fontWeight:700, color:"#2E7D32", marginBottom:8 }}>{t.successTitle}</h2>
      <p style={{ color:"#666", marginBottom:6 }}>{form.crop} – {form.qty} kg @ ₹{form.price||suggested}/q</p>
      <p style={{ color:"#999", fontSize:13, marginBottom:28 }}>{t.successMsg}</p>
      <button onClick={() => { setSubmitted(false); setForm({ crop:"",qty:"",price:"",store:"no" }); }} style={btn()}>
        {t.listAnother}
      </button>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>🌾 {t.sellYourCrop}</h2>
      <div style={{ ...card, maxWidth:500 }}>
        <div style={{ marginBottom:18 }}>
          <label style={label}>{t.cropName} *</label>
          <select value={form.crop} onChange={e => setForm(f => ({...f,crop:e.target.value}))} style={input}>
            <option value="">{t.selectCrop}</option>
            {crops.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {suggested && (
          <div style={{ background:"#e8f5e9", border:"1px solid #a5d6a7", borderRadius:8, padding:"10px 14px", marginBottom:18, fontSize:13 }}>
            💡 <strong>{t.aiSuggestion}:</strong> {t.currentMarket} {form.crop} {t.is} <strong>₹{suggested}/q</strong>. {t.trend}: <span style={{ color:"#2E7D32", fontWeight:600 }}>{t.rising}</span>
          </div>
        )}
        <div style={{ marginBottom:18 }}>
          <label style={label}>{t.qtyKg} *</label>
          <input type="number" placeholder="500" value={form.qty} onChange={e => setForm(f => ({...f,qty:e.target.value}))} style={input} />
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={label}>{t.yourPrice}</label>
          <input type="number" placeholder={suggested?`${t.aiSuggestion}: ₹${suggested}`:"Enter price"} value={form.price} onChange={e => setForm(f => ({...f,price:e.target.value}))} style={input} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={label}>{t.storeIfNoBuyer}</label>
          <div style={{ display:"flex", gap:20 }}>
            {[["yes",t.yesStore],["no",t.noSell]].map(([v,lbl_]) => (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13 }}>
                <input type="radio" value={v} checked={form.store===v} onChange={e => setForm(f => ({...f,store:e.target.value}))} />
                {lbl_}
              </label>
            ))}
          </div>
        </div>
        <button onClick={() => { if(!form.crop||!form.qty) return alert("Fill required fields"); setSubmitted(true); }} style={btn("#2E7D32","#fff",true)}>
          {t.listCrop}
        </button>
      </div>
    </div>
  );
};

const NearbyBuyers = ({ t }) => {
  const [contacted, setContacted] = useState({});
  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>📍 {t.nearbyBuyersTitle}</h2>
      <p style={{ color:"#888", fontSize:13, marginBottom:20 }}>{t.nearLocation}</p>
      <div style={{ background:"#e8f5e9", borderRadius:8, padding:"10px 14px", marginBottom:20, fontSize:13, border:"1px solid #c8e6c9" }}>
        🗺 {t.mapView}: Dharwad, Karnataka · 15.4589°N, 75.0078°E
      </div>
      <div style={{ display:"grid", gap:14, gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))" }}>
        {buyers.map(b => (
          <div key={b.id} style={card}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{b.name}</div>
            <div style={{ fontSize:12, color:"#888", marginBottom:8 }}>📦 {b.crop}</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:14 }}>
              <span style={{ color:"#1976D2" }}>📍 {b.dist}</span>
              <span style={{ color:"#FF9800" }}>⭐ {b.rating}</span>
            </div>
            {contacted[b.id] ? (
              <div style={{ background:"#e8f5e9", color:"#2E7D32", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:600, textAlign:"center" }}>
                {t.requestSent}
              </div>
            ) : (
              <button onClick={() => setContacted(c => ({...c,[b.id]:true}))} style={btn("#2E7D32","#fff",true)}>
                📞 {t.contactBuyer}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// BUYER PAGES
// ═══════════════════════════════════════════════════
const BuyerDashboard = ({ t }) => (
  <div>
    <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>🛒 {t.welcome}, Buyer!</h2>
    <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
      <StatCard emoji="🌾" label={t.cropsAvail} value="24" sub="Fresh today: 8" />
      <StatCard emoji="💰" label={t.avgPrice} value="₹1,920/q" sub="Down 2% today" color="#FF9800" />
      <StatCard emoji="🚛" label={t.transportCost} value="₹180/km" sub="Avg estimate" color="#1976D2" />
      <StatCard emoji="🏚" label={t.storageNearby} value="3 centers" sub="Within 10 km" color="#9C27B0" />
    </div>
    <div style={card}>
      <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>📈 {t.priceRegion}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={regionData}>
          <XAxis dataKey="region" tick={{ fontSize:11 }} />
          <YAxis tick={{ fontSize:11 }} domain={[1800,2300]} />
          <Tooltip formatter={v => `₹${v}`} />
          <Bar dataKey="price" fill="#1976D2" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AvailableCrops = ({ t }) => {
  const [filter, setFilter] = useState("all");
  const [booked, setBooked] = useState({});
  const filtered = filter === "all" ? availableCropsData : availableCropsData.filter(c => c.crop.toLowerCase() === filter);
  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>🌾 {t.availableCrops}</h2>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["all","Wheat","Rice","Tomato","Onion","Maize"].map(c => (
          <button key={c} onClick={() => setFilter(c==="all"?"all":c.toLowerCase())}
            style={{ background:filter===(c==="all"?"all":c.toLowerCase())?"#2E7D32":"#fff",
              color:filter===(c==="all"?"all":c.toLowerCase())?"#fff":"#555",
              border:"1px solid #e0e0e0", borderRadius:20, padding:"6px 14px", fontSize:13, cursor:"pointer", fontWeight:500 }}>
            {c==="all"?t.allCrops:c}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gap:14, gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))" }}>
        {filtered.map(c => (
          <div key={c.id} style={card}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontWeight:700, fontSize:15 }}>🌾 {c.crop}</span>
              <span style={{ fontSize:11, color:"#aaa" }}>{c.freshness}</span>
            </div>
            <div style={{ fontSize:13, color:"#666", marginBottom:4 }}>👨‍🌾 {t.farmerName}: {c.farmer}</div>
            <div style={{ fontSize:13, color:"#666", marginBottom:4 }}>📦 {t.quantity}: {c.qty}</div>
            <div style={{ fontSize:14, color:"#2E7D32", fontWeight:700, marginBottom:4 }}>{c.price}</div>
            <div style={{ fontSize:12, color:"#aaa", marginBottom:14 }}>📍 {c.loc}</div>
            {booked[c.id] ? (
              <div style={{ background:"#e8f5e9", color:"#2E7D32", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:600, textAlign:"center" }}>✅ Transport Booked!</div>
            ) : (
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setBooked(b => ({...b,[c.id]:true}))} style={{ ...btn("#FF9800"), flex:1, textAlign:"center" }}>🚛 {t.bookTransport}</button>
                <button style={{ ...btn("#1976D2"), flex:1, textAlign:"center" }}>💬 {t.buy}</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════
const AdminOverview = ({ t }) => (
  <div>
    <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20 }}>📊 {t.overview}</h2>
    <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:24 }}>
      <StatCard emoji="👨‍🌾" label={t.totalFarmers} value="12,480" sub="+340 this month" />
      <StatCard emoji="💰" label={t.totalSales} value="₹4.2Cr" sub="Feb 2026" color="#FF9800" />
      <StatCard emoji="⚠️" label={t.scamRate} value="2.3%" sub="↓ Down 0.4%" color="#e53935" />
      <StatCard emoji="📉" label={t.lossRate} value="18%" sub="Needs action" color="#FF9800" />
    </div>
    <div style={{ display:"flex", gap:18, flexWrap:"wrap", marginBottom:20 }}>
      <div style={{ ...card, flex:2, minWidth:280 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>{t.priceRegion}</h3>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={regionData}>
            <XAxis dataKey="region" tick={{ fontSize:11 }} />
            <YAxis tick={{ fontSize:11 }} />
            <Tooltip formatter={v => `₹${v}`} />
            <Bar dataKey="price" fill="#2E7D32" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ ...card, flex:1, minWidth:200 }}>
        <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>{t.cropDist}</h3>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div style={card}>
      <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>{t.salesRate}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={demandData}>
          <XAxis dataKey="month" tick={{ fontSize:11 }} />
          <YAxis tick={{ fontSize:11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="demand" stroke="#FF9800" strokeWidth={2} dot={{ r:3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AdminFarmers = ({ t }) => (
  <div>
    <h2 style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>👨‍🌾 {t.farmers}</h2>
    <div style={card}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#f8f9fa" }}>
            {["ID","Name","Location","Crops","Sales","Status"].map(h => (
              <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:600, color:"#555" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            {id:"F001",name:"Ravi Kumar",loc:"Dharwad",crops:"Wheat, Rice",sales:"₹82,000",status:"Active"},
            {id:"F002",name:"Suresh Patil",loc:"Hubli",crops:"Rice, Maize",sales:"₹61,500",status:"Active"},
            {id:"F003",name:"Anita Reddy",loc:"Belgaum",crops:"Tomato, Onion",sales:"₹39,200",status:"Active"},
            {id:"F004",name:"Mahesh Gowda",loc:"Mysore",crops:"Sugarcane",sales:"₹1,20,000",status:"Verified"},
            {id:"F005",name:"Priya Singh",loc:"Bijapur",crops:"Cotton",sales:"₹95,000",status:"⚠️ Review"},
          ].map(r => (
            <tr key={r.id} style={{ borderBottom:"1px solid #f3f3f3" }}>
              <td style={{ padding:"9px 12px", color:"#aaa" }}>{r.id}</td>
              <td style={{ padding:"9px 12px", fontWeight:600 }}>{r.name}</td>
              <td style={{ padding:"9px 12px", color:"#666" }}>📍 {r.loc}</td>
              <td style={{ padding:"9px 12px", color:"#666" }}>{r.crops}</td>
              <td style={{ padding:"9px 12px", color:"#2E7D32", fontWeight:600 }}>{r.sales}</td>
              <td style={{ padding:"9px 12px" }}>
                <span style={{ background:r.status==="Active"?"#e8f5e9":r.status==="Verified"?"#e3f2fd":"#fff3e0",
                  color:r.status==="Active"?"#2E7D32":r.status==="Verified"?"#1976D2":"#E65100",
                  padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// LAYOUT WRAPPER
// ═══════════════════════════════════════════════════
const roleConfig = {
  farmer: {
    color: "#2E7D32",
    light: "#e8f5e9",
    emoji: "👨‍🌾",
    nav: (t) => [
      { id:"dashboard", label:t.dashboard, emoji:"🏠" },
      { id:"sell", label:t.sellCrop, emoji:"🌾" },
      { id:"ai", label:t.aiAdvisor, emoji:"🤖" },
      { id:"buyers", label:t.nearbyBuyers, emoji:"📍" },
    ],
    pages: (t,lang) => ({
      dashboard: <FarmerDashboard t={t} />,
      sell: <SellCrop t={t} />,
      ai: <AIChat t={t} lang={lang} />,
      buyers: <NearbyBuyers t={t} />,
    }),
    name: (t) => t.farmer,
  },
  buyer: {
    color: "#1565C0",
    light: "#e3f2fd",
    emoji: "🛒",
    nav: (t) => [
      { id:"dashboard", label:t.dashboard, emoji:"🏠" },
      { id:"crops", label:t.availableCrops, emoji:"🌾" },
      { id:"ai", label:t.aiAdvisor, emoji:"🤖" },
    ],
    pages: (t,lang) => ({
      dashboard: <BuyerDashboard t={t} />,
      crops: <AvailableCrops t={t} />,
      ai: <AIChat t={t} lang={lang} />,
    }),
    name: (t) => t.buyer,
  },
  admin: {
    color: "#4A148C",
    light: "#f3e5f5",
    emoji: "🏛",
    nav: (t) => [
      { id:"overview", label:t.overview, emoji:"📊" },
      { id:"farmers", label:t.farmers, emoji:"👨‍🌾" },
      { id:"reports", label:t.reports, emoji:"📋" },
    ],
    pages: (t,lang) => ({
      overview: <AdminOverview t={t} />,
      farmers: <AdminFarmers t={t} />,
      reports: <div style={{ padding:40, textAlign:"center", color:"#888" }}>📋 Reports module – coming soon</div>,
    }),
    name: (t) => t.admin,
  },
};

// ═══════════════════════════════════════════════════
// LANGUAGE SELECTOR
// ═══════════════════════════════════════════════════
const LangBar = ({ lang, setLang, t }) => (
  <div style={{ position:"relative", display:"inline-block" }}>
    <select value={lang} onChange={e => setLang(e.target.value)}
      style={{ border:"1px solid #ddd", borderRadius:8, padding:"6px 10px", fontSize:13, cursor:"pointer", background:"#fff" }}>
      {Object.entries(LANGS).map(([k,v]) => (
        <option key={k} value={k}>{v.flag} {v.name}</option>
      ))}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════
// ROLE SELECT SCREEN
// ═══════════════════════════════════════════════════
const RoleSelect = ({ t, onSelect, lang, setLang }) => (
  <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    background:"linear-gradient(135deg,#1B5E20 0%,#2E7D32 50%,#388E3C 100%)", padding:20 }}>
    <div style={{ position:"absolute", top:16, right:20 }}>
      <LangBar lang={lang} setLang={setLang} t={t} />
    </div>
    <div style={{ fontSize:48, marginBottom:12 }}>🌿</div>
    <h1 style={{ color:"#fff", fontSize:32, fontWeight:900, letterSpacing:2, marginBottom:4 }}>{t.appName}</h1>
    <p style={{ color:"#a5d6a7", fontSize:14, marginBottom:40, letterSpacing:1 }}>SMART AGRI PLATFORM</p>
    <h2 style={{ color:"#fff", fontSize:18, fontWeight:600, marginBottom:28 }}>{t.selectRole}</h2>
    <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", maxWidth:600 }}>
      {[
        { role:"farmer", emoji:"👨‍🌾", label:t.farmer, desc:t.farmerDesc, color:"#2E7D32" },
        { role:"buyer", emoji:"🛒", label:t.buyer, desc:t.buyerDesc, color:"#1565C0" },
        { role:"admin", emoji:"🏛", label:t.admin, desc:t.adminDesc, color:"#4A148C" },
      ].map(({ role, emoji, label: lbl_, desc, color }) => (
        <button key={role} onClick={() => onSelect(role)}
          style={{ background:"rgba(255,255,255,0.95)", border:"3px solid transparent", borderRadius:16,
            padding:"24px 28px", width:170, cursor:"pointer", textAlign:"center",
            transition:"transform 0.15s", boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.borderColor=color; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="transparent"; }}>
          <div style={{ fontSize:40, marginBottom:10 }}>{emoji}</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a", marginBottom:6 }}>{lbl_}</div>
          <div style={{ fontSize:12, color:"#888", lineHeight:1.4 }}>{desc}</div>
        </button>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════
export default function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(null);
  const [sideOpen, setSideOpen] = useState(true);
  const [lang, setLang] = useState("en");
  const t = LANGS[lang];

  const handleRole = (r) => {
    setRole(r);
    const cfg = roleConfig[r];
    setPage(cfg.nav(t)[0].id);
  };

  const handleLangChange = (l) => {
    setLang(l);
    if (role) {
      const newT = LANGS[l];
      setPage(roleConfig[role].nav(newT)[0].id);
    }
  };

  if (!role) return <RoleSelect t={t} onSelect={handleRole} lang={lang} setLang={handleLangChange} />;

  const cfg = roleConfig[role];
  const navItems = cfg.nav(t);
  const pages = cfg.pages(t, lang);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Segoe UI',sans-serif", background:"#F5F7FA" }}>
      {/* Sidebar */}
      <aside style={{ width:sideOpen?210:0, overflow:"hidden", transition:"width 0.25s",
        background:cfg.color, color:"#fff", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 18px 14px", borderBottom:"1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ fontSize:18, fontWeight:900, letterSpacing:1 }}>{t.appName}</div>
          <div style={{ fontSize:11, opacity:0.7, marginTop:2 }}>{cfg.emoji} {cfg.name(t)}</div>
        </div>
        <nav style={{ flex:1, padding:"14px 10px" }}>
          {navItems.map(({ id, label: lbl_, emoji }) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ display:"flex", alignItems:"center", gap:9, width:"100%",
                background:page===id?"rgba(255,255,255,0.2)":"transparent",
                border:"none", color:"#fff", padding:"10px 12px", borderRadius:8,
                fontSize:13, fontWeight:page===id?700:400, cursor:"pointer", marginBottom:3, textAlign:"left" }}>
              <span style={{ fontSize:16 }}>{emoji}</span>{lbl_}
            </button>
          ))}
        </nav>
        <div style={{ padding:"14px 14px", borderTop:"1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, opacity:0.7, marginBottom:4 }}>{t.language}</div>
            <select value={lang} onChange={e => handleLangChange(e.target.value)}
              style={{ width:"100%", border:"none", borderRadius:6, padding:"6px 8px", fontSize:12, background:"rgba(255,255,255,0.2)", color:"#fff", cursor:"pointer" }}>
              {Object.entries(LANGS).map(([k,v]) => (
                <option key={k} value={k} style={{ color:"#000" }}>{v.flag} {v.name}</option>
              ))}
            </select>
          </div>
          <button onClick={() => { setRole(null); setPage(null); }}
            style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.4)", color:"rgba(255,255,255,0.8)", borderRadius:6, padding:"6px 12px", fontSize:12, cursor:"pointer", width:"100%" }}>
            🔀 {t.signOut}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <header style={{ background:"#fff", padding:"12px 22px", display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:"0 1px 4px rgba(0,0,0,0.08)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setSideOpen(s => !s)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#555", lineHeight:1 }}>
              ☰
            </button>
            <span style={{ fontWeight:700, color:cfg.color, fontSize:16 }}>
              {cfg.emoji} {navItems.find(n => n.id===page)?.label}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:13 }}>
            <span style={{ color:"#aaa" }}>📅 28 Feb 2026</span>
            <span style={{ background:cfg.light, color:cfg.color, padding:"4px 12px", borderRadius:20, fontWeight:600, fontSize:12 }}>
              {cfg.emoji} {cfg.name(t)}
            </span>
          </div>
        </header>
        <main style={{ flex:1, padding:"24px 24px 40px", overflowY:"auto" }}>
          {pages[page] || <div style={{ textAlign:"center", padding:40, color:"#aaa" }}>Page not found</div>}
        </main>
      </div>
    </div>
  );
}
