document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 요소 선택 ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const currentTabDescriptionElement = document.getElementById('current-tab-description');

    // 탭별 폼 및 결과 영역
    const sajuForm = document.getElementById('saju-form');
    const sajuResultArea = document.getElementById('saju-result');
    const todayForm = document.getElementById('today-form');
    const todayResultArea = document.getElementById('today-result');
    const todayRandomBtn = document.getElementById('today-random');
    const astroForm = document.getElementById('astro-form');
    const astroResultArea = document.getElementById('astro-result');
    const loveForm = document.getElementById('love-form');
    const loveResultArea = document.getElementById('love-result');
    
    // --- 데이터 및 상수 ---
    const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const JI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    const OHAENG_KOR = ['목', '화', '토', '금', '수'];

    const tabDescriptions = {
        saju: "타고난 기운을 통해 자신의 성향과 삶의 흐름을 이해합니다.",
        today: "매일 새롭게 주어지는 하루의 지침을 확인하세요.",
        astro: "서양 점성술을 통해 당신의 성향과 가능성을 발견하세요.",
        love: "사랑의 기운과 관계의 흐름에 대한 조언을 얻으세요."
    };

    // --- 이벤트 리스너 ---

    // 탭 전환 로직
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
            updateCurrentTabDescription(tabName); // 설명 업데이트
        });
    });

    // 사주팔자 폼 제출
    sajuForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoading(sajuResultArea);
        const inputs = {
            name: document.getElementById('saju-name').value,
            birthdate: document.getElementById('saju-birthdate').value,
            birthtime: document.getElementById('saju-birthtime').value,
            isLunar: document.getElementById('saju-lunar').checked,
            gender: document.querySelector('input[name="gender"]:checked').value,
        };
        saveInputs('saju', inputs);

        // 2초 후 결과 표시 (계산 시뮬레이션)
        setTimeout(() => {
            const resultData = getSajuResult(inputs);
            renderSajuResult(resultData, sajuResultArea);
        }, 1500);
    });

    // 오늘의 운세 폼 제출
    todayForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoading(todayResultArea);
        const inputs = { birthdate: document.getElementById('today-birthdate').value };
        saveInputs('today', inputs);
        
        setTimeout(() => {
            const resultData = getTodaysFortune(inputs.birthdate);
            renderTodaysFortune(resultData, todayResultArea);
        }, 1000);
    });

    // 오늘의 운세 랜덤 생성 버튼
    todayRandomBtn.addEventListener('click', () => {
        showLoading(todayResultArea);
        // 입력 필드 클리어
        document.getElementById('today-birthdate').value = '';
        localStorage.removeItem('todayInputs');

        setTimeout(() => {
            const resultData = getTodaysFortune(null); // 생년월일 없이 호출
            renderTodaysFortune(resultData, todayResultArea);
        }, 1000);
    });

    // 점성술 폼 제출
    astroForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoading(astroResultArea);
        const inputs = {
            birthdate: document.getElementById('astro-birthdate').value,
            birthCity: document.getElementById('astro-birth-city').value,
        };
        saveInputs('astro', inputs);
        
        setTimeout(() => {
            const resultData = getAstroResult(inputs.birthdate);
            renderAstroResult(resultData, astroResultArea);
        }, 1000);
    });

    // 연애운 폼 제출
    loveForm.addEventListener('submit', e => {
        e.preventDefault();
        showLoading(loveResultArea);
        const inputs = {
            myBirthdate: document.getElementById('love-my-birthdate').value,
            partnerBirthdate: document.getElementById('love-partner-birthdate').value,
            status: document.getElementById('love-status').value
        };
        saveInputs('love', inputs);

        setTimeout(() => {
            const resultData = getLoveResult(inputs);
            renderLoveResult(resultData, loveResultArea);
        }, 1500);
    });


    // --- 로직 함수 ---

    /** 사주 결과 생성 (MVP용 간소화 로직) */
    function getSajuResult(inputs) {
        const year = new Date(inputs.birthdate).getFullYear();
        
        // 아주 간략한 년주 계산
        const yearGanIndex = (year - 4) % 10;
        const yearJiIndex = (year - 4) % 12;

        return {
            name: inputs.name || '당신',
            pillars: {
                year: GAN[yearGanIndex] + JI[yearJiIndex],
                month: GAN[Math.floor(Math.random() * 10)] + JI[Math.floor(Math.random() * 12)],
                day: GAN[Math.floor(Math.random() * 10)] + JI[Math.floor(Math.random() * 12)],
                hour: inputs.birthtime !== "-1" ? GAN[Math.floor(Math.random() * 10)] + JI[parseInt(inputs.birthtime, 10)] : '미상'
            },
            ohaeng: { // 랜덤 분포
                mok: Math.floor(Math.random() * 4) + 1,
                hwa: Math.floor(Math.random() * 4) + 1,
                to: Math.floor(Math.random() * 4) + 1,
                geum: Math.floor(Math.random() * 4) + 1,
                su: Math.floor(Math.random() * 4) + 1,
            },
            summary: "넓은 숲의 큰 나무와 같은 기운을 지녔습니다. 포용력이 넓고 주변에 사람이 모이지만, 가끔은 자신의 성장을 위해 곁가지를 쳐내는 결단도 필요합니다.",
            strengths: "책임감이 강하고 인정이 많아 리더의 자질이 있습니다. 한번 시작한 일은 끝까지 밀고 나가는 끈기가 돋보입니다.",
            weaknesses: "변화를 받아들이는 데 시간이 걸릴 수 있으며, 때로는 너무 많은 짐을 혼자 지려고 하는 경향이 있습니다. 주변 사람들과 나누는 법을 배우는 것이 좋습니다."
        };
    }

    /** 오늘의 운세 생성 (날짜 기반 랜덤) */
    function getTodaysFortune(birthdate) {
        const seed = new Date().toISOString().slice(0, 10); // 오늘 날짜를 시드로 사용
        const pseudoRandom = (str) => {
            let h = 1779033703, i = str.length;
            while(i) h = (h ^ str.charCodeAt(--i)) * 3432918353;
            h = h << 13 | h >>> 19;
            return (h ^ h >>> 16) >>> 0;
        };
        
        const rand = pseudoRandom(seed + (birthdate || ''));

        const oneLiners = ["예상치 못한 기회가 찾아오는 날", "사소한 오해가 즐거운 인연으로", "나의 작은 친절이 큰 행운으로 돌아옵니다", "과감한 도전보다 현상 유지가 이로운 하루"];
        const moneyFortunes = ["지출 관리에 신경 써야 할 때", "뜻밖의 작은 수입이 기대됩니다", "투자는 신중하게, 소비는 계획적으로", "오래 전에 빌려준 돈을 돌려받을 수 있습니다"];
        const workFortunes = ["동료와의 협업에서 좋은 결과가", "묵묵히 해온 노력을 인정받습니다", "새로운 아이디어가 샘솟는 날", "잠시 쉬어가며 다음 단계를 계획하세요"];
        const healthFortunes = ["가벼운 산책으로 활력을 되찾으세요", "충분한 수면이 필요한 하루", "소화가 잘 되는 음식 위주로 섭취하세요", "스트레칭으로 굳은 몸을 풀어주세요"];
        const relationshipFortunes = ["오랜 친구에게서 반가운 소식이", "새로운 만남보다는 기존 관계에 집중하세요", "솔직한 대화가 관계를 더욱 깊게 만듭니다", "가족과 따뜻한 시간을 보내기 좋은 날"];
        const luckyColors = ["스카이 블루", "라벤더 퍼플", "레몬 옐로우", "포레스트 그린"];
        const thingsToAvoid = ["과도한 욕심", "성급한 결정", "지나친 음주", "불필요한 논쟁"];

        return {
            oneLiner: oneLiners[rand % oneLiners.length],
            details: {
                money: moneyFortunes[rand % moneyFortunes.length],
                work: workFortunes[rand % workFortunes.length],
                health: healthFortunes[rand % healthFortunes.length],
                relationship: relationshipFortunes[rand % relationshipFortunes.length],
            },
            lucky: {
                color: luckyColors[rand % luckyColors.length],
                number: rand % 90 + 1,
                avoid: thingsToAvoid[rand % thingsToAvoid.length],
            }
        };
    }

    /** 점성술 결과 생성 */
    function getAstroResult(birthdate) {
        const date = new Date(birthdate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let sign = '';

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) sign = '양자리';
        else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) sign = '황소자리';
        else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) sign = '쌍둥이자리';
        else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) sign = '게자리';
        else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) sign = '사자자리';
        else if ((month == 8 && day >= 23) || (month == 9 && day <= 23)) sign = '처녀자리';
        else if ((month == 9 && day >= 24) || (month == 10 && day <= 22)) sign = '천칭자리';
        else if ((month == 10 && day >= 23) || (month == 11 && day <= 22)) sign = '전갈자리';
        else if ((month == 11 && day >= 23) || (month == 12 && day <= 24)) sign = '사수자리';
        else if ((month == 12 && day >= 25) || (month == 1 && day <= 19)) sign = '염소자리';
        else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) sign = '물병자리';
        else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) sign = '물고기자리';

        const astroData = {
            '양자리': { keywords: ['열정', '도전', '솔직함', '리더십', '독립'], summary: '불의 기운을 가진 당신은 타고난 리더이며, 새로운 도전을 두려워하지 않는 용기를 지녔습니다. 때로는 성급한 결정보다 신중함이 필요합니다.' },
            '황소자리': { keywords: ['안정', '신중', '현실감각', '인내', '미식가'], summary: '땅의 기운처럼 안정적이고 신뢰를 주는 당신. 현실적인 감각이 뛰어나며, 한번 정한 목표는 꾸준히 밀고 나갑니다. 변화를 받아들이는 유연함을 기르면 좋습니다.'},
            // ... 다른 별자리 데이터 추가
        };
        
        return {
            sign: sign,
            keywords: astroData[sign]?.keywords || ['준비중'],
            summary: astroData[sign]?.summary || '자세한 정보는 곧 업데이트될 예정입니다.',
            moonSign: '추후 제공',
            risingSign: '추후 제공',
        };
    }

    /** 연애운 결과 생성 */
    function getLoveResult(inputs) {
        let score = null;
        if (inputs.partnerBirthdate) {
            const myTs = new Date(inputs.myBirthdate).getTime();
            const partnerTs = new Date(inputs.partnerBirthdate).getTime();
            score = Math.floor(((myTs % 1000) + (partnerTs % 1000)) / 2000 * 80) + 20; // 20~100점 사이의 점수
        }

        const oneLiners = {
            crush: "작은 용기가 두 사람의 거리를 좁혀줄 거예요.",
            dating: "익숙함에 속아 소중함을 잃지 않도록, 오늘은 표현이 중요해요.",
            'broken-up': "과거는 과거일 뿐, 새로운 인연을 맞이할 준비를 하세요.",
            'blind-date': "첫인상보다는 대화를 통해 상대의 진면목을 발견하세요."
        };
        
        const advices = [
            "상대방의 좋은 점을 찾아 칭찬해보세요.",
            "나의 마음을 솔직하게, 하지만 따뜻하게 전달하세요.",
            "함께 새로운 장소에 가거나 새로운 활동을 해보세요.",
            "때로는 한 걸음 물러서서 서로에게 생각할 시간을 주는 것도 좋습니다.",
            "물질적인 선물보다 마음이 담긴 작은 편지가 더 큰 감동을 줍니다."
        ];
        
        // 셔플하여 3개 선택
        const selectedAdvices = advices.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        let scoreText = '';
        if(score) {
            if (score > 85) scoreText = "서로에게 강하게 이끌리는 두 분은 천생연분에 가까운 궁합입니다. 함께いる 것만으로도 행복한 에너지가 넘칩니다.";
            else if (score > 65) scoreText = "생각과 가치관이 비슷해 안정적인 관계를 이어갈 수 있습니다. 작은 차이점들을 존중하며 맞춰나가는 노력이 필요합니다.";
            else scoreText = "서로 다른 매력에 끌렸지만, 그만큼 맞춰가야 할 부분도 많습니다. 서로에게 좋은 자극제가 되어 함께 성장할 수 있는 관계입니다.";
        }

        return {
            oneLiner: oneLiners[inputs.status],
            advices: selectedAdvices,
            score: score,
            scoreText: scoreText
        };
    }


    // --- 렌더링 함수 ---
    
    function showLoading(area) {
        area.style.display = 'block';
        area.innerHTML = `<div class="loading-spinner">결과를 분석하는 중입니다...</div>`;
    }

    function renderSajuResult(data, area) {
        const ohaengTotal = Object.values(data.ohaeng).reduce((a, b) => a + b, 0);

        area.innerHTML = `
            <div class="result-card">
                <h3>${data.name}님의 사주팔자</h3>
                <div class="saju-table">
                    <div class="saju-pillar">
                        <div class="pillar-title">년주(年柱)</div>
                        <div class="pillar-char">${data.pillars.year}</div>
                    </div>
                    <div class="saju-pillar">
                        <div class="pillar-title">월주(月柱)</div>
                        <div class="pillar-char">${data.pillars.month}</div>
                    </div>
                    <div class="saju-pillar">
                        <div class="pillar-title">일주(日柱)</div>
                        <div class="pillar-char">${data.pillars.day}</div>
                    </div>
                    <div class="saju-pillar">
                        <div class="pillar-title">시주(時柱)</div>
                        <div class="pillar-char">${data.pillars.hour}</div>
                    </div>
                </div>
                <h4>타고난 성향</h4>
                <p>${data.summary}</p>
                <h4>강점</h4>
                <p>${data.strengths}</p>
                <h4>주의할 점</h4>
                <p>${data.weaknesses}</p>

                <h4>오행 분포 (참고용)</h4>
                <div class="ohaeng-chart">
                    ${OHAENG_KOR.map((name, i) => `
                        <div class="ohaeng-bar">
                            <div class="bar-wrapper">
                                <div class="bar-fill" style="height: ${data.ohaeng[Object.keys(data.ohaeng)[i]] / ohaengTotal * 100}%; background-color: hsl(${i * 60}, 60%, 70%)"></div>
                            </div>
                            <div class="bar-label">${name}</div>
                        </div>
                    `).join('')}
                </div>
                 <p class="disclaimer" style="margin-top: 1rem; text-align: center;">* 본 사주 정보는 MVP 버전의 간이 계산법에 따른 것으로, 참고용으로만 활용하시기 바랍니다.</p>
            </div>
        `;
    }
    
    function renderTodaysFortune(data, area) {
        area.innerHTML = `
            <div class="result-card">
                <h3>오늘의 운세</h3>
                <p style="text-align:center; font-size: 1.2rem; font-weight: 500; margin-bottom: 2rem;">"${data.oneLiner}"</p>
                
                <h4>영역별 운세</h4>
                <p><strong>💰 금전운:</strong> ${data.details.money}</p>
                <p><strong>💼 일 & 학업운:</strong> ${data.details.work}</p>
                <p><strong>🌿 건강운:</strong> ${data.details.health}</p>
                <p><strong>🤝 대인관계운:</strong> ${data.details.relationship}</p>

                <h4>오늘의 행운 요소</h4>
                <p><strong>🎨 행운색:</strong> ${data.lucky.color}</p>
                <p><strong>🎲 행운숫자:</strong> ${data.lucky.number}</p>
                <p><strong>🚫 피해야 할 것:</strong> ${data.lucky.avoid}</p>
            </div>
        `;
    }

    function renderAstroResult(data, area) {
        area.innerHTML = `
            <div class="result-card">
                <h3>당신의 태양 별자리</h3>
                <div class="astro-summary">
                    <h2>${data.sign}</h2>
                </div>
                <h4>핵심 키워드</h4>
                <div class="keyword-chips">
                    ${data.keywords.map(k => `<span class="chip">${k}</span>`).join('')}
                </div>

                <h4>성향 분석</h4>
                <p>${data.summary}</p>
                
                <h4>달(Moon) / 상승궁(Rising)</h4>
                <p>자세한 달, 상승궁 정보는 추후 업데이트를 통해 제공될 예정입니다.</p>
            </div>
        `;
    }

    function renderLoveResult(data, area) {
        let scoreHTML = '';
        if(data.score !== null) {
            scoreHTML = `
                <h4>두 분의 궁합</h4>
                <div class="love-score">
                    <div class="score-display">${data.score}점</div>
                    <p class="score-text">${data.scoreText}</p>
                </div>
            `;
        }

        area.innerHTML = `
            <div class="result-card">
                <h3>오늘의 연애운</h3>
                <p style="text-align:center; font-size: 1.2rem; font-weight: 500; margin-bottom: 2rem;">"${data.oneLiner}"</p>
                
                ${scoreHTML}

                <h4>사랑의 조언</h4>
                <ul class="advice-list">
                    ${data.advices.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // --- LocalStorage 함수 ---
    
    function saveInputs(formName, inputs) {
        try {
            localStorage.setItem(`${formName}Inputs`, JSON.stringify(inputs));
        } catch (e) {
            console.warn("localStorage 저장에 실패했습니다.", e);
        }
    }

    function loadInputs(formName) {
        try {
            const saved = localStorage.getItem(`${formName}Inputs`);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch(e) {
            console.warn("localStorage 로딩에 실패했습니다.", e);
        }
        return null;
    }

    // --- 설명 업데이트 함수 ---
    function updateCurrentTabDescription(tabId) {
        currentTabDescriptionElement.textContent = tabDescriptions[tabId];
    }

    // --- 초기화 ---
    function init() {
        const sajuInputs = loadInputs('saju');
        if(sajuInputs) {
            document.getElementById('saju-name').value = sajuInputs.name || '';
            document.getElementById('saju-birthdate').value = sajuInputs.birthdate || '';
            document.getElementById('saju-birthtime').value = sajuInputs.birthtime || '-1';
            document.querySelector(`input[name="calendar"][value="${sajuInputs.isLunar ? 'lunar' : 'solar'}"]`).checked = true;
            document.querySelector(`input[name="gender"][value="${sajuInputs.gender}"]`).checked = true;
        }
        
        const todayInputs = loadInputs('today');
        if (todayInputs) {
             document.getElementById('today-birthdate').value = todayInputs.birthdate || '';
        }

        const astroInputs = loadInputs('astro');
        if (astroInputs) {
             document.getElementById('astro-birthdate').value = astroInputs.birthdate || '';
             document.getElementById('astro-birth-city').value = astroInputs.birthCity || '';
        }

        const loveInputs = loadInputs('love');
        if (loveInputs) {
            document.getElementById('love-my-birthdate').value = loveInputs.myBirthdate || '';
            document.getElementById('love-partner-birthdate').value = loveInputs.partnerBirthdate || '';
            document.getElementById('love-status').value = loveInputs.status || 'crush';
        }

        // 초기 로드 시 첫 번째 탭 설명 설정
        const activeTab = document.querySelector('.tab-link.active');
        if (activeTab) {
            updateCurrentTabDescription(activeTab.dataset.tab);
        }
    }

    init();
});
