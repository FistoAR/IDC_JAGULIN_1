
        (function() {
          const init = () => {
            if (window._interactionInitialized) return;
            window._interactionInitialized = true;
            console.log("Interaction Script: Initializing for page");

            const showTooltip = (el, content, textColor = '#fff', fillColor = 'rgba(0,0,0,0.8)') => {
              let tooltip = document.getElementById('interaction-tooltip');
              if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'interaction-tooltip';
                Object.assign(tooltip.style, {
                  position: 'fixed', background: fillColor, color: textColor,
                  padding: '8px 14px', borderRadius: '12px', fontSize: '13px',
                  fontWeight: '500', pointerEvents: 'none', zIndex: '10000', display: 'none',
                  maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'system-ui, -apple-system, sans-serif'
                });
                document.body.appendChild(tooltip);
              }
              
              const type = el.dataset.interaction;
              const isLink = type === 'link';
              const isDownload = type === 'download';
              
              tooltip.style.pointerEvents = (isLink || isDownload) ? 'auto' : 'none';
              tooltip.style.cursor = (isLink || isDownload) ? 'pointer' : 'default';
              tooltip.style.backgroundColor = fillColor || 'rgba(0,0,0,0.8)';
              tooltip.style.color = textColor || '#fff';
              
              if (isLink || isDownload) {
                tooltip.onclick = (e) => { e.stopPropagation(); window.executeInteraction(el, 'click'); };
                if (isLink) {
                   const urlDisp = content.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
                   tooltip.innerHTML = '<span style="opacity:0.7;margin-right:6px">Visit</span> <span style="text-decoration:underline">' + urlDisp + '</span>';
                } else {
                   tooltip.textContent = content;
                }
              } else {
                tooltip.onclick = null;
                tooltip.textContent = content;
              }
              
              tooltip.style.display = 'block';
              tooltip.style.transform = 'translateY(0) scale(1)';
              
              const rect = el.getBoundingClientRect();
              const tooltipRect = tooltip.getBoundingClientRect();
              tooltip.style.left = Math.max(10, Math.min(window.innerWidth - tooltipRect.width - 10, rect.left + (rect.width / 2) - (tooltipRect.width / 2))) + 'px';
              tooltip.style.top = (rect.top - tooltipRect.height - 12) + 'px';
            };

            const showPopup = (el, content, styles = {}) => {
              console.log("Interaction Script: Showing popup", { content, styles });
              let overlay = document.getElementById('interaction-popup-overlay');
              if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'interaction-popup-overlay';
                Object.assign(overlay.style, {
                  position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
                  backgroundColor: 'rgba(0,0,0,0.4)', zIndex: '9999',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  padding: '20px', animation: 'fadeIn 0.3s ease'
                });
                
                const modal = document.createElement('div');
                modal.id = 'interaction-popup-modal';
                Object.assign(modal.style, {
                  backgroundColor: '#fff', padding: '40px 30px', borderRadius: '24px',
                  maxWidth: '90%', maxHeight: '85%', overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative',
                  border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', minWidth: '320px', minHeight: '200px',
                  transform: 'scale(1)'
                });
                
                const bar = document.createElement('div');
                Object.assign(bar.style, {
                  position: 'absolute', top: '0', left: '0', width: '100%', height: '6px',
                  background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)'
                });
                
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                Object.assign(closeBtn.style, {
                  position: 'absolute', top: '15px', right: '20px', border: 'none',
                  background: 'rgba(255,255,255,0.8)', fontSize: '24px', cursor: 'pointer',
                  color: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '10'
                });
                closeBtn.onclick = (e) => { e.stopPropagation(); overlay.style.display = 'none'; };
                
                const contentDiv = document.createElement('div');
                contentDiv.id = 'interaction-popup-content';
                Object.assign(contentDiv.style, {
                  width: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '20px'
                });
                
                modal.appendChild(bar); modal.appendChild(closeBtn); modal.appendChild(contentDiv);
                overlay.appendChild(modal); document.body.appendChild(overlay);
                overlay.onclick = (e) => { if(e.target === overlay) overlay.style.display = 'none'; };

                if (!document.getElementById('popup-animations')) {
                  const s = document.createElement('style');
                  s.id = 'popup-animations';
                  s.innerHTML = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } ' +
                                '@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }';
                  document.head.appendChild(s);
                }
              }
              
              const contentDiv = document.getElementById('interaction-popup-content');
              contentDiv.innerHTML = '';

              if (el.tagName.toLowerCase() === 'img') {
                const img = document.createElement('img');
                img.src = el.src;
                const fit = el.dataset.popupFit || 'Fit';
                img.style.objectFit = fit === 'Fill' ? 'cover' : fit === 'Stretch' ? 'fill' : 'contain';
                Object.assign(img.style, {
                  maxWidth: '100%', maxHeight: '45vh', borderRadius: '12px',
                  width: fit === 'Stretch' ? '100%' : 'auto', height: fit === 'Stretch' ? '100%' : 'auto'
                });
                contentDiv.appendChild(img);
              }
              
              if (content) {
                const textEl = document.createElement('div');
                textEl.textContent = content;
                if (styles.font) textEl.style.fontFamily = styles.font + ', sans-serif';
                if (styles.size) textEl.style.fontSize = styles.size + 'px';
                textEl.style.fontWeight = styles.weight === 'Bold' ? 'bold' : styles.weight === 'Semi Bold' ? '600' : 'normal';
                if (styles.fill) textEl.style.color = styles.fill;
                Object.assign(textEl.style, { lineHeight: '1.4', width: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap' });
                contentDiv.appendChild(textEl);
              }
              
              const modal = document.getElementById('interaction-popup-modal');
              modal.style.width = styles.autoWidth === 'false' ? '500px' : 'auto';
              modal.style.maxWidth = styles.autoWidth === 'false' ? '90%' : '85%';
              modal.style.height = styles.autoHeight === 'false' ? '400px' : 'auto';
              modal.style.maxHeight = '85%';
              modal.style.animation = 'scaleUp 0.3s ease-out forwards';
              overlay.style.display = 'flex';
            };

            window.executeInteraction = (el, eventType) => {
              const type = el.dataset.interaction;
              const trigger = el.dataset.interactionTrigger || 'click';
              const value = el.dataset.interactionValue;
              const content = el.dataset.interactionContent;
              
              console.log("Interaction Script: Executing", { type, eventType, trigger, value });

              if (type === 'tooltip') { 
                if (eventType !== 'hover') return; 
              } else if (type === 'download') {
                if (eventType === 'hover' || eventType === 'click') showTooltip(el, 'Download');
                if (eventType !== 'click' && trigger !== eventType) return;
              } else if (type === 'link') {
                // For link hover, show a clickable tooltip to avoid popup blockers
                if (eventType === 'hover') showTooltip(el, value);
                // Always allow click for links to ensure accessibility
                if (eventType !== 'click' && trigger !== eventType) return;
              } else if (trigger !== eventType) {
                return;
              }

              if (type === 'link' && value) {
                const url = value.startsWith('http') ? value : 'https://' + value;
                const win = window.open(url, '_blank');
                if (!win) {
                  const a = document.createElement('a');
                  a.href = url;
                  a.target = '_blank';
                  a.rel = 'noopener noreferrer';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              } else if (type === 'call' && value) {
                location.href = 'tel:' + value;
              } else if (type === 'navigation' && value) {
                window.parent.postMessage({ type: 'flipbook-navigate', page: value }, '*');
              } else if (type === 'popup') {
                showPopup(el, content, {
                  font: el.dataset.popupFont, size: el.dataset.popupSize,
                  weight: el.dataset.popupWeight, fill: el.dataset.popupFill,
                  autoWidth: el.dataset.popupAutoWidth, autoHeight: el.dataset.popupAutoHeight
                });
              } else if (type === 'download' && value) {
                  const triggerDownload = (url, name) => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = name || 'download';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };

                  const filename = el.dataset.filename || 'download';
                  console.log("Interaction Script: Starting download", { filename, value });
                  
                  if (value.startsWith('data:')) {
                    triggerDownload(value, filename);
                  } else {
                    fetch(value)
                      .then(response => response.blob())
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        triggerDownload(blobUrl, filename);
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
                      })
                      .catch(err => {
                        console.warn("Fetch download failed, falling back:", err);
                        triggerDownload(value, filename);
                      });
                  }
              } else if (type === 'zoom' && value) {
                const scale = value || 2;
                if (eventType === 'click' && el.style.transform.includes('scale')) {
                  el.style.transform = 'none'; el.style.zIndex = '';
                } else {
                  Object.assign(el.style, { transition: 'transform 0.3s ease', transform: 'scale(' + scale + ')', zIndex: '1000' });
                }
              } else if (type === 'tooltip' && content) {
                showTooltip(el, content, el.dataset.tooltipTextColor, el.dataset.tooltipFillColor);
              }
            };

            document.addEventListener('click', (e) => {
              const el = e.target.closest('[data-interaction]');
              if (el) executeInteraction(el, 'click');
            });

            let lastHovered = null;
            document.addEventListener('mouseover', (e) => {
              const el = e.target.closest('[data-interaction]');
              if (!el || el === lastHovered) return;
              lastHovered = el;
              executeInteraction(el, 'hover');
            });

            document.addEventListener('mouseout', (e) => {
              const tooltip = document.getElementById('interaction-tooltip');
              const related = e.relatedTarget;
              
              // If we're moving to an element that's either interactive or the tooltip itself, keep it open
              if (related && (related.closest('[data-interaction]') || related.closest('#interaction-tooltip'))) {
                return;
              }

              if (tooltip) tooltip.style.display = 'none';
              
              // Reset Zoom ONLY if it was triggered by hover and we're leaving the element
              const el = e.target.closest('[data-interaction]');
              if (el && el.dataset.interaction === 'zoom' && el.dataset.interactionTrigger === 'hover' && (!related || !related.closest('[data-interaction]'))) {
                 el.style.transform = 'none'; el.style.zIndex = '';
              }
              lastHovered = null;
            });
          };

          if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
          else init();
        })();
      