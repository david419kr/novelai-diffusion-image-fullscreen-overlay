let infiniteRunning = false;

function createInfiniteButtons() {
  const originalBtns = document.querySelectorAll('button.sc-ad71094a-3');
  if (!originalBtns || originalBtns.length === 0) return;

  originalBtns.forEach(originalBtn => {
    const parent = originalBtn.parentNode;
    if (parent.classList.contains('infinite-btn-container')) return;

    const container = document.createElement('div');
    container.classList.add('infinite-btn-container');
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.width = '100%';

    parent.insertBefore(container, originalBtn);
    container.appendChild(originalBtn);

    originalBtn.style.flex = '0 0 80%';

    const infiniteButton = originalBtn.cloneNode(true);
    infiniteButton.id = 'infiniteBtn-' + Math.random().toString(36).substr(2, 9); // 고유 ID
    infiniteButton.removeAttribute('disabled');
    infiniteButton.disabled = false;

    const spanEl = infiniteButton.querySelector('span');
    if (spanEl) spanEl.textContent = '∞ Gen';

    const extraDiv = infiniteButton.querySelector('div.sc-ad71094a-4.gMDKGA');
    if (extraDiv) extraDiv.remove();

    infiniteButton.style.flex = '0 0 20%';
    infiniteButton.style.backgroundColor = infiniteRunning ? '#f00' : '#eee';
    infiniteButton.style.color = '#000';
    infiniteButton.style.display = 'flex';
    infiniteButton.style.justifyContent = 'center';
    infiniteButton.style.alignItems = 'center';
    infiniteButton.style.padding = '0';
    infiniteButton.style.opacity = '1';

    infiniteButton.addEventListener('click', () => {
      infiniteRunning = !infiniteRunning;
      
      document.querySelectorAll('[id^="infiniteBtn-"]').forEach(btn => {
        btn.style.backgroundColor = infiniteRunning ? '#f00' : '#fff';
      });
      
      if (infiniteRunning) {
        triggerInfiniteGeneration();
      }
    });

    container.appendChild(infiniteButton);
  });
}

function findVisibleOriginalButton() {
  const btns = document.querySelectorAll('button.sc-ad71094a-3');
  for (const btn of btns) {
    if (btn.id && btn.id.includes('infiniteBtn')) continue;
    
    let element = btn;
    let isVisible = true;
    
    while (element && element !== document.body) {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') {
        isVisible = false;
        break;
      }
      element = element.parentElement;
    }
    
    if (isVisible) return btn;
  }
  return null;
}

async function triggerInfiniteGeneration() {
  if (!infiniteRunning) return;
  
  const originalBtn = findVisibleOriginalButton();
  if (!originalBtn) return;
  
  originalBtn.click();
  await waitForRequestComplete();
  
  if (infiniteRunning) {
    setTimeout(() => triggerInfiniteGeneration(), 500);
  }
}

function waitForRequestComplete() {
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      const btn = findVisibleOriginalButton();
      if (btn && !btn.disabled) {
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['disabled'] 
    });
    
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 10000);
  });
}

new MutationObserver(createInfiniteButtons).observe(document.body, { childList: true, subtree: true });
window.addEventListener('load', createInfiniteButtons);
