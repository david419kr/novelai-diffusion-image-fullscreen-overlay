let currentFullscreenSrc = null;
let currentFullscreenImg = null;
let overlay = null;

let buttonPosition = 'bottomRight'; // 기본 위치값

function loadButtonPosition() {
  const savedPosition = localStorage.getItem('naiButtonPosition');
  if (savedPosition) {
    buttonPosition = savedPosition;
  }
  return buttonPosition;
}

function saveButtonPosition(position) {
  localStorage.setItem('naiButtonPosition', position);
  buttonPosition = position;
}

function applyButtonPosition(container) {
  container.style.top = '';
  container.style.bottom = '';
  container.style.left = '';
  container.style.right = '';
  container.style.transform = '';
  
  switch(buttonPosition) {
    case 'topLeft':
      container.style.top = '20px';
      container.style.left = '20px';
      break;
    case 'middleLeft':
      container.style.top = '50%';
      container.style.left = '20px';
      container.style.transform = 'translateY(-50%)';
      break;
    case 'bottomLeft':
      container.style.bottom = '20px';
      container.style.left = '20px';
      break;
    case 'topRight':
      container.style.top = '20px';
      container.style.right = '20px';
      break;
    case 'middleRight':
      container.style.top = '50%';
      container.style.right = '20px';
      container.style.transform = 'translateY(-50%)';
      break;
    case 'bottomRight':
      container.style.bottom = '20px';
      container.style.right = '20px';
      break;
  }
}

function showSettingsPanel() {
  const existingPanel = document.querySelector('.nai-settings-panel');
  if (existingPanel) {
    existingPanel.remove();
    return;
  }
  
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'nai-settings-panel';
  settingsPanel.style.position = 'absolute';
  settingsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  settingsPanel.style.padding = '15px';
  settingsPanel.style.borderRadius = '8px';
  settingsPanel.style.zIndex = '1001';
  settingsPanel.style.color = 'white';
  settingsPanel.style.fontFamily = 'Arial, sans-serif';
  settingsPanel.style.fontSize = '14px';
  settingsPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  
  const title = document.createElement('h3');
  title.textContent = 'Button Position';
  title.style.margin = '0 0 10px 0';
  title.style.fontSize = '16px';
  settingsPanel.appendChild(title);
  
  const optionsContainer = document.createElement('div');
  optionsContainer.style.display = 'grid';
  optionsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  optionsContainer.style.gap = '8px';
  
  const positions = [
    { id: 'topLeft', label: '↖' },
    { id: 'topRight', label: '↗'},
    { id: 'middleLeft', label: '←' },
    { id: 'middleRight', label: '→' },
    { id: 'bottomLeft', label: '↙' },
    { id: 'bottomRight', label: '➘' }
  ];
  
  positions.forEach(pos => {
    const option = document.createElement('button');
    option.textContent = pos.label;
    option.style.padding = '6px 10px';
    option.style.backgroundColor = buttonPosition === pos.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    option.style.border = 'none';
    option.style.borderRadius = '4px';
    option.style.color = 'white';
    option.style.cursor = 'pointer';
    option.style.transition = 'background-color 0.2s';
    
    option.onmouseover = () => {
      option.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    };
    option.onmouseout = () => {
      option.style.backgroundColor = buttonPosition === pos.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    };
    
    option.onclick = (e) => {
      e.stopPropagation();
      
      document.querySelectorAll('.nai-settings-panel button').forEach(btn => {
        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      
      option.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      
      saveButtonPosition(pos.id);
      
      const buttonContainer = document.querySelector('.nai-buttons-container');
      if (buttonContainer) {
        applyButtonPosition(buttonContainer);
      }
    };
    
    optionsContainer.appendChild(option);
  });
  
  settingsPanel.appendChild(optionsContainer);
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '15px';
  closeButton.style.padding = '6px 10px';
  closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.color = 'white';
  closeButton.style.cursor = 'pointer';
  closeButton.style.width = '100%';
  
  closeButton.onclick = (e) => {
    e.stopPropagation();
    settingsPanel.remove();
  };
  
  settingsPanel.appendChild(closeButton);
  
  const buttonContainer = document.querySelector('.nai-buttons-container');
  if (buttonContainer) {
    if (buttonPosition.includes('Right')) {
      settingsPanel.style.right = '80px';
    } else {
      settingsPanel.style.left = '80px';
    }
    
    if (buttonPosition.includes('top')) {
      settingsPanel.style.top = '20px';
    } else if (buttonPosition.includes('middle')) {
      settingsPanel.style.top = '50%';
      settingsPanel.style.transform = 'translateY(-50%)';
    } else {
      settingsPanel.style.bottom = '20px';
    }
  }
  
  settingsPanel.onclick = (e) => {
    e.stopPropagation();
  };
  
  overlay.appendChild(settingsPanel);
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`전체화면 전환 오류: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function addImageClickListeners() {
  const imageContainers = document.querySelectorAll('.sc-689ac2c0-25.cZBtyG');
  
  imageContainers.forEach(container => {
    const img = container.querySelector('img');
    if (img) {
      if (!img.hasAttribute('data-fullscreen-enabled')) {
        img.setAttribute('data-fullscreen-enabled', 'true');
        img.addEventListener('click', handleImageClick);
      }
    }
  });
}

function handleImageClick(event) {
  event.stopPropagation();
  
  const img = event.target;
  const src = img.getAttribute('src');
  
  showFullscreenImage(src, img);
}

function downloadImage(src) {
  const a = document.createElement('a');
  a.href = src;
  a.download = 'novelai_image_' + new Date().getTime() + '.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function showFullscreenImage(src, originalImg) {
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  
  overlay = document.createElement('div');
  overlay.className = 'nai-fullscreen-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '999999';
  
  const fullscreenImg = document.createElement('img');
  fullscreenImg.className = 'nai-fullscreen-image';
  fullscreenImg.src = src;
  fullscreenImg.style.maxWidth = '100%';
  fullscreenImg.style.maxHeight = '100%';
  fullscreenImg.style.objectFit = 'contain';
  
  overlay.appendChild(fullscreenImg);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'nai-buttons-container';
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.flexDirection = 'column';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.zIndex = '1000';

  loadButtonPosition();

  applyButtonPosition(buttonContainer);

  
  const fullscreenButton = document.createElement('div');
  fullscreenButton.className = 'nai-fullscreen-toggle-button';
  fullscreenButton.style.width = '32px';
  fullscreenButton.style.height = '32px';
  fullscreenButton.style.opacity = '1';
  fullscreenButton.style.cursor = 'pointer';
  fullscreenButton.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  fullscreenButton.style.borderRadius = '50%';
  fullscreenButton.style.display = 'flex';
  fullscreenButton.style.justifyContent = 'center';
  fullscreenButton.style.alignItems = 'center';
  fullscreenButton.style.padding = '8px';
  fullscreenButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
  `;
  
  fullscreenButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFullScreen();
  });
  
  const downloadButton = document.createElement('div');
  downloadButton.className = 'nai-download-button';
  downloadButton.style.width = '32px';
  downloadButton.style.height = '32px';
  downloadButton.style.opacity = '1';
  downloadButton.style.cursor = 'pointer';
  downloadButton.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  downloadButton.style.borderRadius = '50%';
  downloadButton.style.display = 'flex';
  downloadButton.style.justifyContent = 'center';
  downloadButton.style.alignItems = 'center';
  downloadButton.style.padding = '8px';
  downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;
  
  downloadButton.addEventListener('click', (event) => {
    event.stopPropagation();
    
    if (parseFloat(downloadButton.style.opacity) < 1) {
      return;
    }
    
    downloadImage(src);
    
    downloadButton.style.opacity = '0.4';
    downloadButton.style.pointerEvents = 'none';
  });

  const settingsButton = document.createElement('div');
  settingsButton.className = 'nai-settings-button';
  settingsButton.style.width = '32px';
  settingsButton.style.height = '32px';
  settingsButton.style.opacity = '1';
  settingsButton.style.cursor = 'pointer';
  settingsButton.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  settingsButton.style.borderRadius = '50%';
  settingsButton.style.display = 'flex';
  settingsButton.style.justifyContent = 'center';
  settingsButton.style.alignItems = 'center';
  settingsButton.style.padding = '8px';

  settingsButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  `;

  settingsButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showSettingsPanel();
  });

  
  buttonContainer.appendChild(downloadButton);
  buttonContainer.appendChild(fullscreenButton);
  buttonContainer.appendChild(settingsButton);
  
  overlay.appendChild(buttonContainer);
  
  document.body.appendChild(overlay);
  
  document.body.style.overflow = 'hidden';
  
  currentFullscreenSrc = src;
  currentFullscreenImg = originalImg;
  
  overlay.addEventListener('click', closeFullscreenImage);
  
  setupImageObserver(originalImg);
}

function closeFullscreenImage() {
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
    currentFullscreenSrc = null;
    currentFullscreenImg = null;
    
    document.body.style.overflow = '';
  }
}

function setupImageObserver(img) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const newSrc = img.getAttribute('src');
        if (newSrc !== currentFullscreenSrc && overlay) {
          const fullscreenImg = overlay.querySelector('.nai-fullscreen-image');
          if (fullscreenImg) {
            fullscreenImg.src = newSrc;
            currentFullscreenSrc = newSrc;
            
            const downloadButton = overlay.querySelector('.nai-download-button');
            if (downloadButton) {
              downloadButton.style.opacity = '1';
              downloadButton.style.pointerEvents = 'auto';
            }
          }
        }
      }
    });
  });
  
  observer.observe(img, { attributes: true, attributeFilter: ['src'] });
  
  if (overlay) {
    overlay.addEventListener('click', () => {
      observer.disconnect();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addImageClickListeners();
  
  const bodyObserver = new MutationObserver((mutations) => {
    addImageClickListeners();
  });
  
  bodyObserver.observe(document.body, { childList: true, subtree: true });
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  addImageClickListeners();
  
  const bodyObserver = new MutationObserver((mutations) => {
    addImageClickListeners();
  });
  
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay) {
    closeFullscreenImage();
  }
});