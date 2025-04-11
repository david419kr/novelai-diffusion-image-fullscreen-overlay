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
  
  function addFullscreenButton() {
    const navbars = document.querySelectorAll('.sc-ad71094a-0.egdKpk');

    const filteredNavbars = Array.from(navbars).filter(navbar => {
      const child = navbar.querySelector('.sc-4f026a5f-2.sc-1f2c6c1f-14.iaNkyw.iQMkDn');
      return child && child.offsetParent !== null;
    });
    
    filteredNavbars.forEach(navbar => {
      if (navbar.querySelector('.novel-ai-fullscreen-btn')) {
        return;
      }
      
      // const lastElement = navbar.lastElementChild;

      const spacebar = document.createElement('div');
      spacebar.style.flex = '0 0 1.5%';
      
      const fullscreenBtn = document.createElement('a');
      fullscreenBtn.className = 'sc-689ac2c0-30 fonvGZ novel-ai-fullscreen-btn';
      fullscreenBtn.style.fontSize = '0.875rem';
      fullscreenBtn.style.opacity = '0.85';
      fullscreenBtn.style.width = 'max-content';
      fullscreenBtn.style.padding = '0px 0px';
      fullscreenBtn.style.height = '100%';
      fullscreenBtn.style.display = 'flex';
      fullscreenBtn.style.alignItems = 'center';
      fullscreenBtn.style.justifyContent = 'center';
      fullscreenBtn.style.cursor = 'pointer';
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'sc-37ae098d-0 fullscreen-icon';
      iconDiv.style.display = 'flex';
      iconDiv.style.alignItems = 'center';
      iconDiv.style.justifyContent = 'center';
      iconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
      `;
      
      fullscreenBtn.appendChild(iconDiv);
      
      fullscreenBtn.addEventListener('click', toggleFullScreen);
      // add mouse hober overlay description, with text "Toggle Browser Fullscreen"
      fullscreenBtn.addEventListener('mouseover', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'fullscreen-tooltip';
        tooltip.textContent = 'Fullscreen';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#22253f';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px 10px';
        tooltip.style.borderRadius = '0px';
        tooltip.style.zIndex = '9999';
        
        document.body.appendChild(tooltip);
        
        const rect = fullscreenBtn.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX - 40}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        
        fullscreenBtn.addEventListener('mouseout', () => {
          document.body.removeChild(tooltip);
        }, { once: true });
      });
      
      // navbar.insertBefore(fullscreenBtn, lastElement);
      navbar.appendChild(spacebar);
      navbar.appendChild(fullscreenBtn);
    });
  }
  
  setTimeout(addFullscreenButton, 1000);
  
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        addFullscreenButton();
      }
    }
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  