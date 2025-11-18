  document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------------------
    // 1. КОНСТАНТАЛАР МЕН ДЕРЕКТЕР ҚОРЫ
    // ---------------------------------------------------------------------
    const recordButton = document.getElementById('record-button');
    const recordText = document.getElementById('record-text');
    const statusMessage = document.getElementById('status-message');
    const resultOutput = document.getElementById('result-output');
    const languageSelect = document.getElementById('language');
    let recognition; 

    // ***************************************************************
    // ******** ЛЕКСИКАЛЫҚ МҰРАНЫҢ КЕҢЕЙТІЛГЕН ДЕРЕКТЕР ҚОРЫ *********
    // ***************************************************************
    const LEXICAL_HERITAGE = [
        // Бұнда барлық Ата, Ана, Көк, Сан-Бір, Адам, Жер, От, Су, Таңба, Сақ, Ғұн деректері толық енгізілген...
        {
            word_kz: "Ата",
            meaning_kz: "Әкесінің әкесі, қарт адам, баба",
            categories: ["Туыстық", "Ұғым"],
            matches: [
                { lang: "Шумер (sum)", word: "Адда", similarity: "Дыбыстық", note: "Шумер тіліндегі 'Әке', 'Көшбасшы' ұғымы. Түркі тілімен ортақ түбір." },
                { lang: "Санскрит (sa)", word: "Атта", similarity: "Жоғары", note: "Көне Үнді тілінде 'Әке', 'Аға'." },
                { lang: "Түрік (tr)", word: "Ata", similarity: "Толық", note: "Баба, әке." }
            ]
        },
        {
            word_kz: "Ана",
            meaning_kz: "Баланың шешесі, әйел-ана",
            categories: ["Туыстық", "Ұғым"],
            matches: [
                { lang: "Латын (la)", word: "Māter/Anna", similarity: "Мән-мағыналық", note: "Латын 'Māter' және көне сөздердегі 'Anna' ('Ана' ұғымы)." },
                { lang: "Орыс (ru)", word: "Мать", similarity: "Мән-мағыналық", note: "Индоеуропалық түбір." },
                { lang: "Жапон (ja)", word: "Ane", similarity: "Дыбыстық", note: "Мағынасы: Апай/Үлкен әйел. (Дыбыстық ұқсастық)" }
            ]
        },
        {
            word_kz: "Көк",
            meaning_kz: "Аспан түсі, көгілдір, Тәңірі",
            categories: ["Табиғат", "Дін", "Түс"],
            matches: [
                { lang: "Ағылшын (en)", word: "Sky", similarity: "Мән-мағыналық", note: "Мағынасы: Аспан. Көк Тәңірі ұғымына жақын." },
                { lang: "Кәріс (ko)", word: "Gok", similarity: "Дыбыстық", note: "Көне корей тіліндегі 'Жоғары/Үстіңгі' ұғымы." },
                { lang: "Қытай (zh)", word: "Kòng", similarity: "Дыбыстық", note: "Мағынасы: Бос, Аспан (кей контексте)." }
            ]
        },
        {
            word_kz: "Сан-Бір",
            meaning_kz: "Жалғыз, БІР, бастау, бөлшектелмейтін",
            categories: ["Философия", "Санау"],
            matches: [
                { lang: "Майя (maya)", word: "Hun", similarity: "Дыбыстық/Мән-мағыналық", note: "Майя өркениетіндегі 'Бір' саны, бастау ұғымы." },
                { lang: "Египет (egy)", word: "Saa", similarity: "Дыбыстық", note: "Мағынасы: Уақыттың бастауы. (Мүмкін, көне сөз)." },
                { lang: "Латын (la)", word: "Unus", similarity: "Мән-мағыналық", note: "Мағынасы: Бір." }
            ]
        },
        {
            word_kz: "Адам",
            meaning_kz: "Барлық адамзаттың түп атасы. Рационалды тіршілік иесі",
            categories: ["Адамзат", "Түбір", "Философия"],
            matches: [
                { lang: "Македон (mk)", word: "Човек", similarity: "Дыбыстық", note: "Славян тобындағы негізгі ұғым. Еуропа орталығындағы тілдік таралуды көрсетеді." },
                { lang: "Герман (de)", word: "Mann", similarity: "Мән-мағыналық", note: "Еуропаның Герман тобындағы 'адам' немесе 'еркек' мағынасы." },
                { lang: "Иврит (he)", word: "Адам", similarity: "Толық", note: "Мағынасы: Адам. (Тарихи-діни түбір)." },
                { lang: "Қазақ (Кісі)", word: "Кісі", similarity: "Санаттық", note: "Адамның әлеуметтік сипаты (қонақ, сыйлы). В. Даль тұжырымымен байланыс." }
            ]
        },
        {
            word_kz: "Жер",
            meaning_kz: "Планета, топырақ, ортақ мекен",
            categories: ["Табиғат", "Ғарыш", "Түбір"],
            matches: [
                { lang: "Ағылшын (en)", word: "Earth", similarity: "Мән-мағыналық", note: "Ғаламдық ұғым. 'Терра' (Латын) және 'Жер' дыбыстық байланыстары." },
                { lang: "Шумер (sum)", word: "Ки", similarity: "Дыбыстық", note: "Шумердегі 'Ки' – Жер, Ғарыш қақпасы. (Көк/Жер байланысы)." },
                { lang: "Жапон (ja)", word: "Chi/Ji", similarity: "Дыбыстық", note: "Мағынасы: Жер, Топырақ." }
            ]
        },
        {
            word_kz: "От",
            meaning_kz: "Тіршілік негізі, жылу, энергетикалық бастау",
            categories: ["Элемент", "Табиғат", "Түбір"],
            matches: [
                { lang: "Латын (la)", word: "Ignis", similarity: "Мән-мағыналық", note: "Мағынасы: От. (Энергетикалық ұқсастық)" },
                { lang: "Кәріс (ko)", word: "Pul", similarity: "Дыбыстық", note: "Мағынасы: От. (Түбірлес дыбыстық ұқсастық)" }
            ]
        },
        {
            word_kz: "Су",
            meaning_kz: "Тіршілік көзі, өмір, ылғал",
            categories: ["Элемент", "Табиғат", "Түбір"],
            matches: [
                { lang: "Шумер (sum)", word: "А", similarity: "Дыбыстық", note: "Шумерде 'А' – Су, Теңіз. (Ең ежелгі түбірлердің бірі)." },
                { lang: "Орыс (ru)", word: "Вода", similarity: "Мән-мағыналық", note: "Славян тобындағы негізгі ұғым." }
            ]
        },
        {
            word_kz: "Таңба",
            meaning_kz: "Жазу, код, ұрпаққа қалдырылған белгі",
            categories: ["Жазу", "Тарих", "Код"],
            matches: [
                { lang: "Көне Түркі (Orkhon)", word: "Таңба", similarity: "Толық", note: "Орхон-Енисей жазбаларындағы белгі. (Түбірдің өзі)." },
                { lang: "Латын (la)", word: "Signum", similarity: "Мән-мағыналық", note: "Мағынасы: Белгі, таңба." }
            ]
        },
        {
            word_kz: "Сақ",
            meaning_kz: "Тарихи атау, 'Мәңгілік' немесе 'Батыл' мағынасы",
            categories: ["Тарих", "Мифология", "Ұғым"],
            matches: [
                { lang: "Грек (Миф)", word: "Медуза Горгона", similarity: "Мән-мағыналық", note: "Грек деректерінде Сақтардың анасы ретінде түсіндірілуі мүмкін." },
                { lang: "Санскрит (sa)", word: "Сака", similarity: "Жоғары", note: "Шығыс Иран тайпаларының атауы. Мәңгілік ұғымымен байланысты." }
            ]
        },
        {
            word_kz: "Ғұн",
            meaning_kz: "Ежелгі көшпелі тайпа. Еділ-Аттиланың халқы",
            categories: ["Тарих", "Көсем", "Әлемдік ықпал"],
            matches: [
                { lang: "Венгр (Мажар)", word: "Hun", similarity: "Жоғары", note: "Венгрлер өздерін Ғұндардың тікелей ұрпағы санайды." },
                { lang: "Герман (Ескі)", word: "Hune", similarity: "Жоғары", note: "Ғұндардың Еуропадағы атауы. (Аттиланың ықпалы)." }
            ]
        }
    ];

    // ---------------------------------------------------------------------
    // 2. ФУНКЦИЯЛАР (SPEECH RECOGNITION ИМИТАЦИЯСЫ)
    // ---------------------------------------------------------------------

    function initializeRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            statusMessage.textContent = 'Кешіріңіз, браузеріңіз дауысты тануды қолдамайды.';
            recordButton.style.display = 'none';
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.interimResults = true; 
        recognition.lang = languageSelect.value;
        recognition.continuous = false;
        recognition.maxAlternatives = 1; 

        recognition.onstart = () => {
            recordText.textContent = 'Тыңдау... Тоқтату үшін басыңыз';
            recordButton.classList.add('is-recording');
            recordButton.style.backgroundColor = '#dc3545'; // Қызыл түс
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
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

    function displayPhoneticAnalysis(text) {
        statusMessage.textContent = 'Фонетикалық Талдау Аяқталды!';
        
        resultOutput.innerHTML = `
            <h4>🗣️ Фонетикалық/Лексикалық Анализ:</h4>
            <p><strong>Алынған Мәтін (${languageSelect.value.toUpperCase()}):</strong> ${text}</p>
            <p><strong>Әлеуетті байланыс:</strong> Жазылған сөздердің көне түркі және ғаламдық тілдердегі 'Лексикалық Мұрамен' байланысы тексерілуде...</p>
        `;
    }
    
    // UCL Модулі іске қосылғандағы визуалды хабарламаны көрсететін функция
    function activateUCL() {
        const uclOutput = document.getElementById('ucl-output');
        uclOutput.classList.remove('hidden');

        uclOutput.innerHTML = `
            <div class="ucl-card">
                <p><strong>Модуль Қосылды:</strong> Ғаламдық Кодтар Лексикасының жүйесі іске қосылды. Белгісіз тілдерді декодтау басталады...</p>
                <p><strong>Декодтау нәтижесі:</strong></p>
                <ul>
                    <li>**Ғарыштық жиілік (432 Гц):** Тұрақтылық, "Мәңгілік Айналу" коды.</li>
                    <li>**Кванттық код (0/1):** Энергияның және субстанцияның тыныштық күйі.</li>
                    <li>**Жүйеге Жазылу:** Әлдебір ғаламдық сайтқа жазылуда...</li>
                </ul>
            </div>
        `;
        alert("Ғаламдық Кодтар Лексикасының жүйесі іске қосылды!");
    }

    // ---------------------------------------------------------------------
    // 3. ЛЕКСИКАЛЫҚ МҰРА МОДУЛІ (Құрылым)
    // ---------------------------------------------------------------------

    const heritageArea = document.createElement('div');
    heritageArea.className = 'module-area';
    heritageArea.id = 'lexical-heritage-module';
    heritageArea.innerHTML = `
        <hr>
        <h3>📜 Лексикалық Мұра Модулі</h3>
        <p>Ғаламдық тілдердің ортақ түбірлері мен ұғымдарын салыстыру. (Тіл, Тарих, Элементтер)</p>
        <div id="heritage-output"></div>
        <div style="margin-top: 15px;">
            <button id="show-ata" class="switch-btn">Ата</button>
            <button id="show-ana" class="switch-btn">Ана</button>
            <button id="show-adam" class="switch-btn">Адам</button>
            <button id="show-kok" class="switch-btn">Көк</button>
            <button id="show-zher" class="switch-btn">Жер</button>
            <button id="show-ot" class="switch-btn">От</button>
            <button id="show-su" class="switch-btn">Су</button>
            <button id="show-tanba" class="switch-btn">Таңба</button>
            <button id="show-san-bir" class="switch-btn">Сан-Бір</button>
            <button id="show-sak" class="switch-btn">Сақ</button>
            <button id="show-gun" class="switch-btn">Ғұн</button>
            <button id="show-kyz" class="switch-btn">Қыз</button>
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
    // 4. ҒАЛАМДЫҚ КОДТАР ЛЕКСИКАСЫ (UCL) МОДУЛІ (Құрылым)
    // ---------------------------------------------------------------------

    const uclArea = document.createElement('div');
    uclArea.className = 'module-area ucl-area';    
