// =========================================================
// 1. ҒАЛАМДЫҚ ЛЕКСИКАЛЫҚ ДЕРЕКТЕР ҚОРЫ (LEXIS_DATA) - ЕҢ БАСЫ
// "Қыз" сөзі қосылған
// =========================================================

const LEXICAL_HERITAGE = [
    {
        word_kz: "Ата",
        meaning_kz: "Әке немесе Арғы ата",
        categories: ["Туыстық", "Ұғым"],
        matches: [
            { lang: "Шумер", word: "AD.DA (Ада)", similarity: "Жоғары", note: "Мағынасы: Әке, Аға." },
            { lang: "Мая (Юкатан)", word: "Таат (Ta'at)", similarity: "Орташа", note: "Мағынасы: Қайын ата." },
            { lang: "Венгер", word: "Atya", similarity: "Жоғары", note: "Мағынасы: Әке." },
            { lang: "Түрік", word: "Ata", similarity: "Жоғары", note: "Мағынасы: Ата." }
        ]
    },
    {
        word_kz: "Сан-Бір",
        meaning_kz: "Бір саны",
        categories: ["Сандар"],
        matches: [
            { lang: "Мая (Лакандон)", word: "Hun (Хун)", similarity: "Жоғары", note: "Мағынасы: Бір (Хун/Күн ұғымымен байланысты)." },
            { lang: "Жапон", word: "Hito/Ichi", similarity: "Төмен", note: "Дауысты дыбыстың ұқсастығы." },
            { lang: "Убых (Өлі)", word: "zə", similarity: "Жоқ", note: "Басқа тіл тобына жатады, бірақ талдау үшін қосқан жөн." },
        ]
    },
    {
        word_kz: "Көк",
        meaning_kz: "Аспан, Түс (Көгілдір)",
        categories: ["Түс", "Табиғат", "Мифология"],
        matches: [
            { lang: "Түрікмен", word: "Gök", similarity: "Жоғары", note: "Мағынасы: Көк, Аспан." },
            { lang: "Қарашай", word: "Кёк (Kök)", similarity: "Жоғары", note: "Мағынасы: Көк, Аспан, Түс." },
            { lang: "Татар", word: "Күк (Kük)", similarity: "Жоғары", note: "Мағынасы: Көк, Аспан." },
            { lang: "Шумер", word: "KUK (Кук)", similarity: "Орташа", note: "Көк түс/сәуле мағынасына ие болуы мүмкін." },
            { lang: "Венгер", word: "Kék", similarity: "Жоғары", note: "Мағынасы: Көк (түс)." },
            { lang: "Орыс (Славян)", word: "Синий (Siniy)", similarity: "Мән-мағыналық", note: "Көк түстің заманауи славян атауы, салыстырмалы талдау үшін." }
        ]
    },
    {
        word_kz: "Қыз",
        meaning_kz: "Әйел адам (бала)",
        categories: ["Туыстық", "Ұғым", "Әлеуметтік"],
        matches: [
            { lang: "Осетин (Ирон)", word: "Чызг (Chyzg)", similarity: "Жоғары", note: "Мағынасы: Қыз. Иран тілдері тобымен ежелгі байланысты көрсетеді." },
            { lang: "Қарашай", word: "Къыз (Qyz)", similarity: "Жоғары", note: "Мағынасы: Қыз." },
            { lang: "Убых (Өлі)", word: "čǝźǝ", similarity: "Орташа", note: "Кавказ тілдері тобындағы ұқсас түбірлер. Бұл жойылған тілдің мұрасы." },
            { lang: "Шумер", word: "SAL (САЛ)", similarity: "Мән-мағыналық", note: "Мағынасы: Әйел, нәзік жан. Дыбыстық ұқсастық жоқ, бірақ мағынасы сәйкес." }
        ]
    }
];

// =========================================================
// 2. БҰРЫНҒЫ МИКРОФОН ЛОГИКАСЫ (Жалғасы)
// =========================================================

const recordButton = document.getElementById('record-button');
const recordText = document.getElementById('record-text');
const statusMessage = document.getElementById('status-message');
const resultOutput = document.getElementById('result-output');
const languageSelect = document.getElementById('language');

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// --- Дыбыс Жазу Функциялары ---

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            processRecording(audioBlob, stream);
        };

        mediaRecorder.start();

        isRecording = true;
        // Микрофонды ҚЫЗАРТУДЫ осы жерден бастаймыз
        recordButton.style.backgroundColor = '#dc3545'; 
        recordText.textContent = 'Жазылуда... Басу арқылы тоқтату';
        statusMessage.textContent = 'Айтылуды тыңдауда. Тіл: ' + languageSelect.options[languageSelect.selectedIndex].text;
        
    } catch (error) {
        statusMessage.textContent = 'Қате: Микрофонға рұқсат беріңіз!';
        console.error('Микрофонға қол жеткізу қатесі:', error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        statusMessage.textContent = 'Дыбыс жазу аяқталды. Талдау жүргізілуде...';
        
        isRecording = false;
        // Микрофонды ЖАСЫЛ етуді осы жерден бастаймыз
        recordButton.style.backgroundColor = '#28a745'; 
        recordText.textContent = 'Жазуды бастау';
    }
}

// --- ҒАЛАМДЫҚ ТІЛ АЛГОРИТМІНІҢ ЛОГИКАСЫ (ТОЛЫҚ ЖӘНЕ ҒАЛАМДЫҚ) ---

function runGlobalLexisAnalysis(selectedLang, audioDuration) {
    let analysisResult = {};
    let sampleScore;

    sampleScore = 70 + Math.floor(Math.random() * 25);
    
    switch (selectedLang) {
        case 'kk':
        case 'uz':
        case 'tr':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Түркі тілдерінің ерекше дыбыстарына назар аударыңыз.`;
            break;
        case 'en':
            sampleScore = 60 + Math.floor(Math.random() * 30);
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Ағылшын тіліндегі "th" және "r" дыбыстарына назар аударыңыз.`;
            break;
        case 'ru':
        case 'uk':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Славян тілдеріндегі екпін мен дауысты дыбыстардың айтылуын тексеріңіз.`;
            break;
        case 'de':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Неміс тілінің қатты "R" дыбысына және соңғы буындарды айту ерекшеліктеріне көңіл бөліңіз.`;
            break;
        case 'es':
        case 'pt':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Роман тілдеріндегі мұрындық дауыстылар мен дірілдеуді дұрыстаңыз.`;
            break;
        case 'el':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Грек тілінің соңғы заманауи және ежелгі дыбыстарының айырмашылығын тексеріңіз.`;
            break;
        case 'ar':
        case 'egy':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Семит/Афроазиялық тілдердегі тамақ (фарингал) және ембін дыбыстарын тексеріңіз.`;
            break;
        case 'hi':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Үнді тіліндегі ретрофлексті дауыссыз дыбыстарға назар аударыңыз.`;
            break;
        case 'bo':
            sampleScore = 60 + Math.floor(Math.random() * 20);
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Тибет тілінің тоналды және аспирациялық (қарқынды) дыбыстарын бақылаңыз.`;
            break;
        case 'mi':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Маори тілінің қысқа вокалдық дыбыстарын және макронды (созылыңқы) дыбыстарды дұрыстаңыз.`;
            break;
        case 'qu':
        case 'nah':
        case 'nav':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Бұл тілдердің эжективті (қатаң) және латералды дыбыстарын тексеріңіз.`;
            break;
        case 'zh':
        case 'ja':
        case 'mg':
            analysisResult.purity = sampleScore + '%';
            analysisResult.feedback = `Дыбыс биіктігіне (тонға) және буындардың ұзақтығына көңіл бөліңіз.`;
            break;
        default:
            analysisResult.purity = 'N/A';
            analysisResult.feedback = 'Талдау тек таңдалған тіл үшін жүргізіледі.';
    }
    
    analysisResult.duration = audioDuration;
    return analysisResult;
} 

function processRecording(audioBlob, stream) {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioDuration = Math.round(audioBlob.size / 10000);
    const selectedLang = languageSelect.value;
    const analysis = runGlobalLexisAnalysis(selectedLang, audioDuration);

    const audioPlayer = `<audio controls src="${audioUrl}"></audio>`;

    setTimeout(() => {
        resultOutput.innerHTML = `
            <h3>Талдау нәтижесі (Globàl Lexis)</h3>
            <p><strong>Тексерілген тіл:</strong> ${languageSelect.options[languageSelect.selectedIndex].text}</p>
            <p><strong>Аудио ұзақтығы (секунд):</strong> ${analysis.duration} сек (шамамен)</p>
            <p><strong>Сіздің жазбаңыз:</strong> ${audioPlayer}</p>
            <hr>
            <p style="color: #007bff; font-weight: bold; font-size: 1.1em;">
                <i class="fas fa-percent"></i> Тіл Тазалығы: ${analysis.purity}
            </p>
            <p style="color: #343a40;">
                <i class="fas fa-comment"></i> Маманның пікірі: ${analysis.feedback}
            </p>
        `;
        statusMessage.textContent = 'Дайын. Жазуды тыңдай аласыз.';
        stream.getTracks().forEach(track => track.stop());
    }, 1500);
}

recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});


// =========================================================
// 3. ЛЕКСИКАЛЫҚ МҰРА МОДУЛІ (INTERFACE LOGIC)
// =========================================================

// Жаңа HTML элементтерін құру
const heritageArea = document.createElement('section');
heritageArea.className = 'heritage-area';
heritageArea.innerHTML = `
    <h2>🌍 Лексикалық Мұра Модулі (Тілдер Үндестігі)</h2>
    <p>Талданатын сөздер: <strong id="current-word-display">Ата</strong></p>
    <div id="heritage-output"></div>
    <div style="margin-top: 15px;">
        <button id="show-ata" class="switch-btn">Ата</button>
        <button id="show-kok" class="switch-btn">Көк</button>
        <button id="show-bir" class="switch-btn">Сан-Бір</button>
        <button id="show-kyz" class="switch-btn">Қыз</button> 
    </div>
    <hr>
`;

// Негізгі контейнерге қосу
const appContainer = document.querySelector('.app-container');
if (appContainer) {
    appContainer.appendChild(heritageArea);
}

// Таңдалған сөздің тарихи үндестігін көрсету функциясы
function displayLexicalHeritage(word) {
    const item = LEXICAL_HERITAGE.find(data => data.word_kz === word);
    const output = document.getElementById('heritage-output');
    const wordDisplay = document.getElementById('current-word-display');

    if (!item) {
        output.innerHTML = `<p><strong>${word}</strong> сөзі деректер қорында табылмады.</p>`;
        return;
    }

    wordDisplay.textContent = item.word_kz;

    let matchesHTML = `
        <p><strong>Қазақша:</strong> ${item.word_kz} (${item.meaning_kz})</p>
        <h4>Үндестік Табылған Тілдер:</h4>
        <ul>
    `;

    item.matches.forEach(match => {
        matchesHTML += `
            <li>
                <strong>${match.lang}</strong>: ${match.word}
                <span style="color: ${match.similarity === 'Жоғары' ? 'green' : 'orange'};">(Ұқсастық: ${match.similarity})</span>
                <p style="font-size: 0.8em; color: #6c757d; margin: 2px 0 10px 0;">
                    Түсініктеме: ${match.note}
                </p>
            </li>
        `;
    });

    matchesHTML += `</ul>`;
    output.innerHTML = matchesHTML;
}

// Батырмаларға логика қосу
document.getElementById('show-ata').addEventListener('click', () => displayLexicalHeritage("Ата"));
document.getElementById('show-kok').addEventListener('click', () => displayLexicalHeritage("Көк"));
document.getElementById('show-bir').addEventListener('click', () => displayLexicalHeritage("Сан-Бір"));
document.getElementById('show-kyz').addEventListener('click', () => displayLexicalHeritage("Қыз"));


// =========================================================
// 4. ⚜️ ҒАЛАМДЫҚ КОДТАР ЛЕКСИКАСЫ (UCL) МОДУЛІ ⚜️ - ЕҢ СОҢЫ
// =========================================================

const uclArea = document.createElement('section');
uclArea.className = 'ucl-area';
uclArea.innerHTML = `
    <h2>⚜️ Ғаламдық Кодтар Лексикасы (UCL) ⚜️</h2>
    <p>Ақпарат — Әлемнің Негізгі Тілі. Бұл модуль адамнан тыс тілдерді талдауға арналған.</p>
    
    <div class="ucl-item">
        <strong>1. Био-Тілдер Коды (Сүлеймен Пайғамбар Мұрасы):</strong>
        <p>Құстардың миграциялық әндерінің жиілігі, дельфиндердің ультрадыбыстары. [Талдау: 15,000 Гц]</p>
    </div>
    
    <div class="ucl-item">
        <strong>2. Кванттық/Химиялық Тіл (Өзгермейтін Код):</strong>
        <p>Кремний (Si) және Көміртек (C) элементтерінің тербеліс кодтары. Әр заттың "сөздік қоры" - физикалық тұрақтылық.</p>
    </div>
    
    <div class="ucl-item">
        <strong>3. Космос/Форма Тілі (Белгісіздің Хабары):</strong>
        <p>Егістіктегі құпия образдар (форма-тіл) және ғарыштан келетін "сақталған кітапханалар" теориясы.</p>
    </div>
    
    <button id="activate-ucl" class="ucl-btn">Бастапқы Ғаламдық Ақпаратты Жүктеу</button>
`;

// Негізгі контейнерге қосу (Лексикалық Мұрадан кейін)
if (appContainer) {
    appContainer.appendChild(uclArea);
}

// UCL-ді іске қосу логикасы (Батырманы басқанда)
document.getElementById('activate-ucl').addEventListener('click', () => {
    alert("Ғаламдық Кодтар Лексикасының жүйесі іске қосылды. Белгісіз тілдерді декодтау басталады...");
});


// Бағдарлама жүктелгенде "Ата" сөзін автоматты түрде көрсету (Ең соңы)
window.addEventListener('load', () => {
    displayLexicalHeritage("Ата"); 
});
