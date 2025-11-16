document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------------------
    // 1. КОНСТАНТАЛАР МЕН ДЕРЕКТЕР ҚОРЫ
    // ---------------------------------------------------------------------
    const recordButton = document.getElementById('record-button');
    const recordText = document.getElementById('record-text');
    const statusMessage = document.getElementById('status-message');
    const resultOutput = document.getElementById('result-output');
    const languageSelect = document.getElementById('language');
    let recognition; // SpeechRecognition объектісін сақтау үшін

    // ЛЕКСИКАЛЫҚ МҰРАНЫҢ ДЕРЕКТЕР ҚОРЫ
    const LEXICAL_HERITAGE = [
        {
            word_kz: "Ата",
            meaning_kz: "Әкесінің әкесі, қарт адам, баба",
            categories: ["Туыстық", "Ұғым"],
            matches: [
                { lang: "Маори (mi)", word: "Awhito", similarity: "Дыбыстық", note: "Маори тіліндегі 'Тұқым', 'Ата-баба' ұғымына сәйкес." },
                { lang: "Санскрит (hi)", word: "Атта", similarity: "Жоғары", note: "Көне Үнді тілінде 'Әке', 'Аға'." },
                { lang: "Түрік (tr)", word: "Ata", similarity: "Толық", note: "Баба, әке." }
            ]
        },
        {
            word_kz: "Көк",
            meaning_kz: "Аспан түсі, көгілдір, Тәңірі",
            categories: ["Табиғат", "Дін", "Түс"],
            matches: [
                { lang: "Ағылшын (en)", word: "Sky", similarity: "Мән-мағыналық", note: "Мағынасы: Аспан. Түркілердің Көк Тәңірі ұғымына жақын." },
                { lang: "Қытай (zh)", word: "Kòng", similarity: "Дыбыстық", note: "Мағынасы: Бос, Аспан (кей контексте)." },
                { lang: "Кечуа (qu)", word: "Q'ocha", similarity: "Дыбыстық/Мән-мағыналық", note: "Мағынасы: Көл, теңіз. Судың көк түсі." }
            ]
        },
        {
            word_kz: "Сан-Бір",
            meaning_kz: "Жалғыз, БІР, бастау, бөлшектелмейтін",
            categories: ["Философия", "Санау"],
            matches: [
                { lang: "Египет (egy)", word: "Saa", similarity: "Дыбыстық", note: "Мағынасы: Уақыттың бастауы. (Мүмкін, көне сөз)." },
                { lang: "Латын (la)", word: "Unus", similarity: "Мән-мағыналық", note: "Мағынасы: Бір." },
                { lang: "Навахо (nav)", word: "Taa", similarity: "Дыбыстық", note: "Мағынасы: Жалғыз, жалпы бастау." }
            ]
        },
        {
            word_kz: "Қыз",
            meaning_kz: "Жас әйел, бойжеткен, қорғалған",
            categories: ["Туыстық", "Ұғым"],
            matches: [
                { lang: "Грек (el)", word: "Kóre", similarity: "Дыбыстық", note: "Мағынасы: Қыз, Персефонаның екінші аты. Дыбыстық ұқсастық бар." },
                { lang: "Араб (ar)", word: "Қисса", similarity: "Дыбыстық", note: "Мағынасы: Әңгіме, аңыз. (Қыз туралы аңыз)." }
            ]
        },
        {
            word_kz: "Сақ",
            meaning_kz: "Тарихи атау, 'Мәңгілік' немесе 'Батыл' мағынасы",
            categories: ["Тарих", "Мифология", "Ұғым"],
            matches: [
                { lang: "Үнді (Санскрит)", word: "Сака", similarity: "Жоғары", note: "Мағынасы: Шығыс Иран тайпаларының атауы. Үнді жылнамаларындағы мәңгілік ұғымымен байланысты." },
                { lang: "Грек (Миф)", word: "Медуза Горгона", similarity: "Мән-мағыналық", note: "Грек деректерінде Сақтардың анасы ретінде түсіндірілуі мүмкін." },
                { lang: "Көне Скандинавия", word: "Sakar", similarity: "Орташа", note: "Мағынасы: Қақтығыс, жанжал. (Сақтардың батылдығымен байланысты)." }
            ]
        },
        {
            word_kz: "Ғұн",
            meaning_kz: "Ежелгі көшпелі тайпа. Еділ-Аттиланың халқы",
            categories: ["Тарих", "Көсем", "Әлемдік ықпал"],
            matches: [
                { lang: "Венгр (Мажар)", word: "Hun", similarity: "Жоғары", note: "Венгрлер өздерін Ғұндардың тікелей ұрпағы санайды. (Ұқсастық: 'Hun' атауында)." },
                { lang: "Герман (Ескі)", word: "Hune", similarity: "Жоғары", note: "Ғұндардың Еуропадағы атауы. (Аттиланың ықпалы)." },
                { lang: "Кельт (Ирланд)", word: "Finn", similarity: "Мән-мағыналық", note: "Кейбір тарихи теориялар Ғұндардың Кельт мәдениетіне ықпалын көрсетеді." }
            ]
        }
    ];

    // ---------------------------------------------------------------------
    // 2. ФУНКЦИЯЛАР (SPEECH RECOGNITION ИМИТАЦИЯСЫ)
    // ---------------------------------------------------------------------

    function initializeRecognition() {
        // Speech Recognition API тек қазіргі браузерлерде жұмыс істейді
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            statusMessage.textContent = 'Кешіріңіз, браузеріңіз дауысты тануды қолдамайды. Мәтін енгізуді қолданыңыз.';
            recordButton.style.display = 'none';
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.interimResults = true; // Уақытша нәтижелерді көрсету
        recognition.lang = languageSelect.value;
        recognition.continuous = false;
        recognition.maxAlternatives = 1; // Ең жақсы бір нәтижені ғана көрсету

        recognition.onstart = () => {
            recordText.textContent = 'Тыңдау... Тоқтату үшін басыңыз';
            recordButton.classList.add('is-recording');
            recordButton.style.backgroundColor = '#dc3545'; // Қызыл түс
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            // Нәтижені имитациялау (Біздің жобаның негізгі функциясы)
            displayPhoneticAnalysis(transcript);
        };

        recognition.onend = () => {
            recordText.textContent = 'Жазуды бастау';
            recordButton.classList.remove('is-recording');
            recordButton.style.backgroundColor = '#28a745'; // Жасыл түс
        };

        recognition.onerror = (event) => {
            statusMessage.textContent = `Қате: ${event.error}. Қайтадан байқаңыз.`;
            recordText.textContent = 'Жазуды бастау';
            recordButton.classList.remove('is-recording');
            recordButton.style.backgroundColor = '#28a745';
        };
    }

    // Фонетикалық Талдау Нәтижесін Көрсету (Имитация)
    function displayPhoneticAnalysis(text) {
        statusMessage.textContent = 'Фонетикалық Талдау Аяқталды!';
        
        // Нәтижелерді HTML ретінде форматтау
        resultOutput.innerHTML = `
            <h4>🗣️ Фонетикалық/Лексикалық Анализ:</h4>
            <p><strong>Алынған Мәтін (${languageSelect.value.toUpperCase()}):</strong> ${text}</p>
            <p><strong>Синтаксистік талдау:</strong> Сөздердің негізгі түбірлері: 'Көк', 'Ата', 'Бір'.</p>
            <p><strong>Әлеуетті байланыс:</strong> Жазылған сөздердің көне түркі және ғаламдық тілдердегі 'Лексикалық Мұрамен' байланысы тексерілуде...</p>
        `;
    }

    // ---------------------------------------------------------------------
    // 3. ЛЕКСИКАЛЫҚ МҰРА МОДУЛІ (JS арқылы құрылған)
    // ---------------------------------------------------------------------

    const heritageArea = document.createElement('div');
    heritageArea.className = 'module-area';
    heritageArea.id = 'lexical-heritage-module';
    heritageArea.innerHTML = `
        <hr>
        <h3>📜 Лексикалық Мұра Модулі</h3>
        <p>Ғаламдық тілдердің ортақ түбірлері мен ұғымдарын салыстыру.</p>
        <div id="heritage-output"></div>
        <div style="margin-top: 15px;">
            <button id="show-ata" class="switch-btn">Ата</button>
            <button id="show-kok" class="switch-btn">Көк</button>
            <button id="show-bir" class="switch-btn">Сан-Бір</button>
            <button id="show-kyz" class="switch-btn">Қыз</button>
            <button id="show-sak" class="switch-btn">Сақ</button>
            <button id="show-gun" class="switch-btn">Ғұн</button>
        </div>
        <hr>
    `;
    document.querySelector('.app-container').appendChild(heritageArea);

    function displayLexicalHeritage(word) {
        const data = LEXICAL_HERITAGE.find(item => item.word_kz === word);
        const outputDiv = document.getElementById('heritage-output');

        if (data) {
            let htmlContent = `
                <div class="heritage-card">
                    <h4>Сөз: ${data.word_kz} (${data.meaning_kz})</h4>
                    <p><strong>Санаттар:</strong> ${data.categories.join(', ')}</p>
                    <hr>
                    <h5>🌐 Ғаламдық Сәйкестіктер:</h5>
                    <ul>
            `;

            data.matches.forEach(match => {
                htmlContent += `
                    <li>
                        <strong>${match.lang}:</strong> ${match.word} (Ұқсастық: ${match.similarity})<br>
                        <small>Көрнекілік: ${match.note}</small>
                    </li>
                `;
            });

            htmlContent += `</ul></div>`;
            outputDiv.innerHTML = htmlContent;
        } else {
            outputDiv.innerHTML = `<p><strong>${word}</strong> сөзі деректер қорынан табылмады.</p>`;
        }
    }

    // ---------------------------------------------------------------------
    // 4. ҒАЛАМДЫҚ КОДТАР ЛЕКСИКАСЫ (UCL) МОДУЛІ
    // ---------------------------------------------------------------------

    const uclArea = document.createElement('div');
    uclArea.className = 'module-area ucl-area';
    uclArea.id = 'ucl-module';
    uclArea.innerHTML = `
        <hr>
        <h3>⚜️ Ғаламдық Кодтар Лексикасы (UCL)</h3>
        <p>Адамнан тыс және табиғи кодтарды декодтауға арналған модуль.</p>
        <button id="activate-ucl" class="switch-btn" style="background-color:#dc3545;">Модульді Іске Қосу</button>
        <div id="ucl-output" class="hidden"></div>
        <hr>
    `;
    document.querySelector('.app-container').appendChild(uclArea);

    function activateUCL() {
        const uclOutput = document.getElementById('ucl-output');
        uclOutput.classList.remove('hidden');

        uclOutput.innerHTML = `
            <div class="ucl-card">
                <p><strong>Модуль Қосылды:</strong> Адамнан тыс тілдер модулі — ішінен терезе ашылды!</p>
                <p><strong>Декодтау нәтижесі:</strong></p>
                <ul>
                    <li>**Ғарыштық жиілік (432 Гц):** Тұрақтылық, "Мәңгілік Айналу" коды (Сақ/Ғұн философиясымен байланысты).</li>
                    <li>**Кванттық код (0/1):** Энергияның және субстанцияның тыныштық күйі (Сан-Бір ұғымына жақын).</li>
                    <li>**Жүйеге Жазылу:** Әлдебір ғаламдық сайтқа жазылуда...</li>
                </ul>
            </div>
        `;
        alert("Ғаламдық Кодтар Лексикасының жүйесі іске қосылды. Белгісіз тілдерді декодтау басталады...");
    }

    // ---------------------------------------------------------------------
    // 5. ОҚИҒА ТЫҢДАУШЫЛАРЫ (EVENT LISTENERS)
    // ---------------------------------------------------------------------

    recordButton.addEventListener('click', () => {
        if (recordButton.classList.contains('is-recording')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    languageSelect.addEventListener('change', () => {
        initializeRecognition();
        statusMessage.textContent = `Тіл ${languageSelect.options[languageSelect.selectedIndex].text} болып өзгертілді. Жазуды бастаңыз.`;
    });

    // Лексикалық Мұра батырмалары
    document.getElementById('show-ata').addEventListener('click', () => displayLexicalHeritage("Ата"));
    document.getElementById('show-kok').addEventListener('click', () => displayLexicalHeritage("Көк"));
    document.getElementById('show-bir').addEventListener('click', () => displayLexicalHeritage("Сан-Бір"));
    document.getElementById('show-kyz').addEventListener('click', () => displayLexicalHeritage("Қыз"));
    document.getElementById('show-sak').addEventListener('click', () => displayLexicalHeritage("Сақ"));
    document.getElementById('show-gun').addEventListener('click', () => displayLexicalHeritage("Ғұн"));

    // UCL батырмасы
    document.getElementById('activate-ucl').addEventListener('click', activateUCL);

    // Бастапқы іске қосу
    initializeRecognition();
});
