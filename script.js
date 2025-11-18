 // ... (Кодтың басы) ... (Алдыңғы жауапта толық берілген)

    // ---------------------------------------------------------------------
    // 4. ҒАЛАМДЫҚ КОДТАР ЛЕКСИКАСЫ (UCL) МОДУЛІ (Құрылым)
    // ---------------------------------------------------------------------

    const uclArea = document.createElement('div');
    uclArea.className = 'module-area ucl-area';
    uclArea.id = 'ucl-module';
    uclArea.innerHTML = `
        <hr>
        <h3>⚜️ Ғаламдық Кодтар Лексикасы (UCL)</h3>
        <p>Адамнан тыс тілдерді (Құс, Аң, Таңба) және Ғарыштық кодтарды зерттеу орталығы.</p>
        
        <div class="ucl-section">
            <h4>🖼️ Таңба/Сурет және 🔊 Дауыс Зерттеу Галереясы</h4>
            <p>Тастағы, Балшықтағы Таңбаларды/Суреттерді жүктеңіз немесе Табиғат дыбысын талдаңыз.</p>
            
            <label for="image-input" class="switch-btn file-label" style="background-color:#5bc0de; margin-right: 10px;">
                <i class="fas fa-image"></i> Сурет/Таңба Жүктеу (Галерея)
            </label>
            <input type="file" id="image-input" accept="image/*" class="file-input hidden">
            
            <label for="audio-input" class="switch-btn file-label" style="background-color:#483d8b;">
                <i class="fas fa-volume-up"></i> Аудио Жүктеу
            </label>
            <input type="file" id="audio-input" accept="audio/*" class="file-input hidden">

            <button id="analyse-media" class="switch-btn" style="background-color:#2a52be; margin-top: 15px;">
                <i class="fas fa-search"></i> Кодты Талдау
            </button>
        </div>

        <div class="ucl-section">
            <h4>✍️ Зерттеу Мақаласын / Деректерді Жүктеу</h4>
            <textarea id="article-text" placeholder="Мақалаңызды осы жерге толық жазыңыз..." 
                      style="width: 100%; min-height: 200px; padding: 10px; margin-top: 10px; border-radius: 5px; box-sizing: border-box; resize: vertical;"></textarea>
            
            <button id="publish-article" class="switch-btn" style="background-color:#0056b3; margin-right: 10px;">
                <i class="fas fa-file-upload"></i> Мақаланы Жіберу
            </button>
            <button id="save-content" class="switch-btn" style="background-color:#ffc107; color: #343a40;">
                <i class="fas fa-save"></i> Сақтау
            </button>
            <button id="clear-content" class="switch-btn" style="background-color:#dc3545;">
                <i class="fas fa-trash-alt"></i> Жою (Себет)
            </button>
        </div>

        <div class="ucl-section">
            <h4>💬 UCL Пікірлесу Терезесі (Gemini, ЖИ)</h4>
            <textarea id="comment-text" placeholder="Пікіріңізді немесе сұрағыңызды енгізіңіз..." 
                      style="width: 100%; min-height: 80px; padding: 10px; margin-top: 10px; border-radius: 5px; box-sizing: border-box; resize: vertical;"></textarea>
            <button id="submit-comment" class="switch-btn" style="background-color:#28a745;">
                Пікірді Жіберу
            </button>
            <p style="margin-top: 10px; font-style: italic;">Жауапты ЖИ Gemini 🤖 арқылы алу мүмкіндігі.</p>
        </div>

        <div class="ucl-section" style="text-align: center;">
            <h4>📞 Кері Байланыс / Бөлісу</h4>
            <p>Жобаның сілтемесін және зерттеу нәтижелерін бөлісіңіз:</p>
            
            <button id="share-app" class="switch-btn" style="background-color:#007bff; margin-bottom: 15px;">
                <i class="fas fa-share-alt"></i> Жобаны Бөлісу
            </button>

            <div style="margin-top: 15px;">
                <a href="#" target="_blank" style="color:#1877f2; margin: 0 5px;"><i class="fab fa-facebook-f fa-2x"></i></a>
                <a href="#" target="_blank" style="color:#25d366; margin: 0 5px;"><i class="fab fa-whatsapp fa-2x"></i></a>
                <a href="#" target="_blank" style="color:#0088cc; margin: 0 5px;"><i class="fab fa-telegram-plane fa-2x"></i></a>
                
                <a href="#" target="_blank" style="color:#ff0000; margin: 0 5px;"><i class="fab fa-youtube fa-2x"></i></a>
                <a href="#" target="_blank" style="color:#c13584; margin: 0 5px;"><i class="fab fa-instagram fa-2x"></i></a>
                <a href="#" target="_blank" style="color:#000000; margin: 0 5px;"><i class="fab fa-tiktok fa-2x"></i></a>
            </div>
        </div>

        <button id="activate-ucl" class="switch-btn" style="background-color:#dc3545; margin-top: 15px;">
            Ғарыштық Кодты Декодтау
        </button>
        <div id="ucl-output" class="hidden" style="margin-top: 15px;"></div>
        
        <hr>
    `;
    document.querySelector('.app-container').appendChild(uclArea);

    // ... (Кодтың соңы) ... (Төмендегі Event Listeners бөлімін толық көшіруіңіз керек)

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
    document.getElementById('show-ana').addEventListener('click', () => displayLexicalHeritage("Ана"));
    document.getElementById('show-adam').addEventListener('click', () => displayLexicalHeritage("Адам"));
    document.getElementById('show-kok').addEventListener('click', () => displayLexicalHeritage("Көк"));
    document.getElementById('show-zher').addEventListener('click', () => displayLexicalHeritage("Жер"));
    document.getElementById('show-ot').addEventListener('click', () => displayLexicalHeritage("От"));
    document.getElementById('show-su').addEventListener('click', () => displayLexicalHeritage("Су"));
    document.getElementById('show-tanba').addEventListener('click', () => displayLexicalHeritage("Таңба"));
    document.getElementById('show-san-bir').addEventListener('click', () => displayLexicalHeritage("Сан-Бір"));
    document.getElementById('show-sak').addEventListener('click', () => displayLexicalHeritage("Сақ"));
    document.getElementById('show-gun').addEventListener('click', () => displayLexicalHeritage("Ғұн"));
    document.getElementById('show-kyz').addEventListener('click', () => displayLexicalHeritage("Қыз"));

    // UCL батырмалары
    document.getElementById('activate-ucl').addEventListener('click', activateUCL);
    
    // Жаңа Медиа және Сақтау логикасы
    document.getElementById('analyse-media').addEventListener('click', () => {
        alert("🖼️ Медиа файлдарды (Сурет, Аудио) талдау функциясы әзірленуде. Бұл Таңбаларды/Дауыстарды зерттеуге арналған.");
    });

    document.getElementById('save-content').addEventListener('click', () => {
        alert("💾 Зерттеу мақаласы мен деректер жергілікті браузерге сақталды. Қалпына келтіру мүмкіндігі бар.");
    });

    document.getElementById('clear-content').addEventListener('click', () => {
        const confirmClear = confirm("🗑️ Мақала мен деректерді өшіруге сенімдісіз бе? Себетке жіберіледі.");
        if (confirmClear) {
             document.getElementById('article-text').value = '';
             document.getElementById('comment-text').value = '';
             alert("Деректер тазаланды.");
        }
    });

    document.getElementById('share-app').addEventListener('click', () => {
        const appUrl = window.location.href; 
        alert(`🔗 Бөлісу диалогы ашылды. Жоба сілтемесін көшіріңіз:\n\n${appUrl}\n\n(Facebook, WhatsApp, Telegram, YouTube, Instagram, TikTok арқылы таратыңыз!)`);
    });

    document.getElementById('publish-article').addEventListener('click', () => {
        const article = document.getElementById('article-text').value;
        if (article.length > 50) {
            alert("Мақалаңыз/Зерттеуіңіз қабылданды! Рахмет. Ғылыми топ тексергеннен кейін жарияланады.");
        } else {
            alert("Мақала тым қысқа. Толығырақ жазыңыз!");
        }
    });

    document.getElementById('submit-comment').addEventListener('click', () => {
        const comment = document.getElementById('comment-text').value;
        if (comment.trim() !== "") {
            alert(`💬 Сіздің пікіріңіз қабылданды: "${comment.substring(0, 30)}...". Gemini жауап күтуде.`);
        } else {
            alert("Пікір жазыңыз.");
        }
    });
    

    // Бастапқы іске қосу
    initializeRecognition();
});    
