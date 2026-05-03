document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const mainDashboard = document.getElementById('main-dashboard');
  const btnLogin = document.getElementById('btn-login');

  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const tutorialTitle = document.getElementById('tutorial-title');
  const tutorialText = document.getElementById('tutorial-text');
  const btnNext = document.getElementById('btn-tutorial-next');
  const btnSkip = document.getElementById('btn-tutorial-skip');

  const tutorialSteps = [
    { title: "SYSTEM INITIALIZED", text: "Welcome to LeetNudge. The ultimate digital punk tracker and productivity interface." },
    { title: "AUTOMATIC TRACKING", text: "Submit problems on your favorite coding platform and watch them effortlessly synchronize into the dashboard in real-time. No manual entry." },
    { title: "MULTIPLE SHEETS", text: "Organize your grind. We've included predefined DSA, Interview Prep, and Company-wise sheets. You can also build entirely custom checklists." },
    { title: "AI ASSISTANT", text: "Whenever you're coding, the floating widget stays attached to your screen. It automatically monitors typing speed to detect struggle and provides contextual hints seamlessly. Let's go." }
  ];
  let tutorialIndex = 0;

  const renderTutorial = () => {
    if(tutorialIndex >= tutorialSteps.length) {
      tutorialOverlay.style.opacity = '0';
      setTimeout(() => tutorialOverlay.classList.add('hidden'), 500);
      localStorage.setItem('tutorialSeen', 'true');
      return;
    }
    tutorialTitle.innerText = tutorialSteps[tutorialIndex].title;
    tutorialText.innerText = tutorialSteps[tutorialIndex].text;
    if(tutorialIndex === tutorialSteps.length - 1) btnNext.innerText = "Enter System";
  };

  btnNext.addEventListener('click', () => { tutorialIndex++; renderTutorial(); });
  btnSkip.addEventListener('click', () => { 
    tutorialOverlay.style.opacity = '0';
    setTimeout(() => tutorialOverlay.classList.add('hidden'), 500);
    localStorage.setItem('tutorialSeen', 'true'); 
  });

  btnLogin.addEventListener('click', () => {
    loginScreen.classList.add('hidden');
    mainDashboard.classList.remove('hidden');
    
    // Check for tutorial
    if (!localStorage.getItem('tutorialSeen')) {
      tutorialOverlay.classList.remove('hidden');
      setTimeout(() => tutorialOverlay.style.opacity = '1', 50);
      renderTutorial();
    }
    
    // Trigger progress animations
    setTimeout(() => {
      document.querySelectorAll('.bar-fill').forEach(el => {
        el.style.width = el.getAttribute('data-target') + '%';
      });
    }, 300);
  });

  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.getAttribute('data-target');
      
      sections.forEach(sec => {
        if(sec.id === target) sec.classList.remove('hidden');
        else sec.classList.add('hidden');
      });
    });
  });

  // Populate heatmap
  const heatmap = document.getElementById('heatmap');
  for(let i = 0; i < 112; i++) {
    const box = document.createElement('div');
    box.className = 'heat-box';
    if(Math.random() > 0.65) box.classList.add('active');
    heatmap.appendChild(box);
  }

  // Populate Topics Analysis
  const sampleTopics = [
    { name: "Arrays & Hashing", percent: 85, status: "Strong", color: "green" },
    { name: "Two Pointers", percent: 70, status: "Strong", color: "green" },
    { name: "Dynamic Programming", percent: 50, status: "Average", color: "orange" },
    { name: "Trees", percent: 45, status: "Average", color: "orange" },
    { name: "Graphs", percent: 20, status: "Weak", color: "red" },
    { name: "Backtracking", percent: 15, status: "Weak", color: "red" }
  ];
  
  const topicContainer = document.getElementById('topic-analysis-container');
  if(topicContainer) {
    topicContainer.innerHTML = '';
    sampleTopics.forEach(t => {
      topicContainer.innerHTML += `
        <div style="display:flex; justify-content:space-between; font-weight:700; margin-top:16px; margin-bottom:8px; align-items:flex-end;">
          <span style="font-size:16px;">${t.name}</span> <span class="text-${t.color}" style="font-size:14px; font-weight:900;">${t.status} (${t.percent}%)</span>
        </div>
        <div class="bar-container"><div class="bar-fill bg-${t.color}" style="width:0%" data-target="${t.percent}"></div></div>
      `;
    });
  }

  // Predefined Sheets Data Expansion
  const predefinedSheets = {
    "DSA Guide": [
      { topic: "Arrays & Hashing", problems: [{name:"Contains Duplicate", diff:"Easy", done:true}, {name:"Valid Anagram", diff:"Easy", done:true}, {name:"Two Sum", diff:"Easy", done:true}, {name:"Group Anagrams", diff:"Medium", done:false}, {name:"Top K Frequent Elements", diff:"Medium", done:false}] },
      { topic: "Two Pointers", problems: [{name:"Valid Palindrome", diff:"Easy", done:true}, {name:"3Sum", diff:"Medium", done:false}, {name:"Container With Most Water", diff:"Medium", done:false}] },
      { topic: "Sliding Window", problems: [{name:"Best Time to Buy & Sell Stock", diff:"Easy", done:true}, {name:"Longest Substring Without Repeating", diff:"Medium", done:false}] }
    ],
    "Interview Prep": [
       { topic: "Mock Assessments", problems: [{name:"Alien Dictionary", diff:"Hard", done:false}, {name:"Word Ladder", diff:"Hard", done:false}, {name:"Median of Two Sorted Arrays", diff:"Hard", done:false}] }
    ],
    "Company-wise": [
       { topic: "Google / Meta", problems: [{name:"Logger Rate Limiter", diff:"Easy", done:false}, {name:"Bulls and Cows", diff:"Medium", done:false}, {name:"Expressive Words", diff:"Medium", done:false}] }
    ]
  };

  const sheetTabsContainer = document.getElementById('sheet-tabs-container');
  const sheetContent = document.getElementById('sheet-content');

  // Render tabs dynamically
  const sheetNames = ["DSA Guide", "Interview Prep", "Company-wise", "+ Custom Sheet"];
  sheetTabsContainer.innerHTML = sheetNames.map((name, i) => 
    `<button class="btn sheet-tab ${i===0?'active':''}" data-sheet="${name}">${name}</button>`
  ).join('');

  const dsaTabs = document.querySelectorAll('.sheet-tab');
  
  function renderSheet(sheetName) {
    if (sheetName === "+ Custom Sheet") { renderCustomSheetBuilder(); return; }
    
    sheetContent.innerHTML = '';
    const data = predefinedSheets[sheetName] || [];
    data.forEach(group => {
      let groupHTML = `<h4 style="margin-top:24px; margin-bottom:12px; font-size:18px; text-decoration:underline;">${group.topic}</h4>`;
      group.problems.forEach(p => {
        let diffColor = p.diff==='Easy'?'green':p.diff==='Medium'?'orange':'red';
        groupHTML += `
          <div class="dsa-item">
            <div style="display:flex; align-items:center; gap:12px;">
              <input type="checkbox" ${p.done?'checked':''}> 
              <span style="font-size:16px;">${p.name}</span>
            </div>
            <span class="text-${diffColor}">${p.diff}</span>
          </div>
        `;
      });
      sheetContent.innerHTML += groupHTML;
    });
  }

  function renderCustomSheetBuilder() {
    sheetContent.innerHTML = `
      <div style="background:#fff; border:4px solid #000; padding:24px; box-shadow:6px 6px 0px 0px #000; margin-top:24px; margin-bottom:24px;">
        <h4 style="margin-bottom:16px; font-size:24px;">Configure Custom Sheet</h4>
        <input type="text" id="custom-sheet-name" placeholder="SHEET TITLE (e.g. Grind 75)" style="width:calc(100% - 32px); padding:16px; margin-bottom:16px; border:4px solid #000; box-shadow:4px 4px 0px 0px #000; font-family: 'Space Grotesk', sans-serif; font-weight:700; font-size:18px;">
        <input type="text" id="custom-sheet-topic" placeholder="TOPIC PATTERN (e.g. Dynamic Programming)" style="width:calc(100% - 32px); padding:16px; margin-bottom:16px; border:4px solid #000; box-shadow:4px 4px 0px 0px #000; font-family: 'Space Grotesk', sans-serif; font-weight:700; font-size:18px;">
        <button class="btn btn-primary" id="btn-save-custom-sheet" style="width:100%; padding:20px; font-size:18px;">Attach Topic Protocol</button>
      </div>
      <div id="custom-render-area"></div>
    `;

    document.getElementById('btn-save-custom-sheet').addEventListener('click', () => {
       const topic = document.getElementById('custom-sheet-topic').value;
       if(!topic) return;
       document.getElementById('custom-render-area').innerHTML += `
          <h4 style="margin-top:24px; margin-bottom:12px; font-size:18px; text-decoration:underline; font-weight:900;">${topic.toUpperCase()}</h4>
          <div class="dsa-item"><div><input type="checkbox"> Optimal Protocol Generation</div><span class="text-green">Easy</span></div>
          <div class="dsa-item"><div><input type="checkbox"> Advanced State Tracking</div><span class="text-orange">Medium</span></div>
          <div class="dsa-item"><div><input type="checkbox"> Critical Path Analysis</div><span class="text-red">Hard</span></div>
       `;
       document.getElementById('custom-sheet-topic').value = '';
    });
  }

  // Bind tab clicking
  dsaTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      dsaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSheet(tab.getAttribute('data-sheet'));
    });
  });

  // initial load
  renderSheet("DSA Guide");

  // MATCHMAKING SYSTEM LOGIC
  const gameStartView = document.getElementById('game-start-view');
  const gameSearchingView = document.getElementById('game-searching-view');
  const gameFoundView = document.getElementById('game-found-view');
  const gameActiveView = document.getElementById('game-active-view');
  const gameResultView = document.getElementById('game-result-view');
  let matchTimerInt, searchTimerInt;

  document.getElementById('btn-find-match').addEventListener('click', () => {
    gameStartView.classList.add('hidden');
    gameSearchingView.classList.remove('hidden');
    
    let time = 0;
    const sTimer = document.getElementById('search-timer');
    sTimer.innerText = "00:00";
    searchTimerInt = setInterval(() => {
      time++;
      sTimer.innerText = "00:" + (time<10?'0':'') + time;
    }, 1000);

    setTimeout(() => {
      clearInterval(searchTimerInt);
      gameSearchingView.classList.add('hidden');
      gameFoundView.classList.remove('hidden');
      
      let count = 3;
      const countEl = document.getElementById('match-countdown');
      countEl.innerText = count;
      const cntInt = setInterval(() => {
        count--;
        if(count === 0) countEl.innerText = "FIGHT!";
        else countEl.innerText = count;
        
        if(count < 0) {
          clearInterval(cntInt);
          startActiveMatch();
        }
      }, 1000);
    }, 3000); // 3s search simulation
  });

  function startActiveMatch() {
    gameFoundView.classList.add('hidden');
    gameActiveView.classList.remove('hidden');
    
    let matchTime = 0;
    const aTimer = document.getElementById('active-timer');
    aTimer.innerText = "00:00";
    document.getElementById('match-editor').value = "";
    document.getElementById('you-status').className = "text-orange";
    document.getElementById('you-status').innerText = "Coding...";
    document.getElementById('opp-status').className = "text-orange";
    document.getElementById('opp-status').innerText = "Coding...";

    matchTimerInt = setInterval(() => {
      matchTime++;
      let m = Math.floor(matchTime / 60);
      let s = matchTime % 60;
      aTimer.innerText = (m<10?'0':'')+m+":"+(s<10?'0':'')+s;
      
      if(matchTime === 4) document.getElementById('opp-status').innerText = "Testing...";
      if(matchTime === 7) document.getElementById('opp-status').innerText = "Failed testcase...";
    }, 1000);
  }

  const editor = document.getElementById('match-editor');
  if(editor) {
    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      clearInterval(matchTimerInt);
      gameActiveView.classList.add('hidden');
      gameResultView.classList.remove('hidden');
      gameResultView.style.background = "var(--color-red)";
      document.getElementById('match-result-title').innerText = "DISQUALIFIED";
      document.getElementById('match-result-text').innerText = "Paste action detected. Anti-cheat triggered.";
    });
  }

  document.getElementById('btn-submit-match').addEventListener('click', () => {
    clearInterval(matchTimerInt);
    document.getElementById('you-status').className = "text-green";
    document.getElementById('you-status').innerText = "Accepted!";
    
    setTimeout(() => {
      gameActiveView.classList.add('hidden');
      gameResultView.classList.remove('hidden');
      gameResultView.style.background = "var(--color-green)";
      document.getElementById('match-result-title').innerText = "VICTORY";
      document.getElementById('match-result-text').innerText = "Optimal solution confirmed. Rank +15";
    }, 1000);
  });

  document.getElementById('btn-back-dashboard').addEventListener('click', () => {
    gameResultView.classList.add('hidden');
    gameStartView.classList.remove('hidden');
  });

  document.getElementById('btn-export').addEventListener('click', () => {

    const csvContent = "data:text/csv;charset=utf-8,Problem,Difficulty,Status\nTwo Sum,Easy,Solved\nLongest Substring,Medium,Unsolved\nEdit Distance,Hard,Unsolved";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leetnudge_performance_data.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});
