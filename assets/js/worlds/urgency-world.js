// Urgency World Script - upgraded to spec
(function(){
	const OFFER_LOCK_MS = 5000;
	let activeIntervals = [];
	let hasClickedOffer = false;
	let initialTimerSnapshots = [];

	document.addEventListener('DOMContentLoaded', () => {
		if (typeof AOS !== 'undefined') {
			AOS.init({ duration: 600, easing: 'ease-out', once: true, offset: 50 });
		}

		cacheInitialTimerValues();
		initFlashTimers();
		initRealtimeCounters();
		wireDelegatedOfferClicks();
		wireModalCloseButton();
		wireAwarenessModalClose();
		wireBottomDetection();
		wireAwarenessCheckboxes();
		wireCalmEnter();
		wireBackdoor();
		wireCalmTop();
	});

	function cacheInitialTimerValues(){
		initialTimerSnapshots = Array.from(document.querySelectorAll('[data-seconds]')).map(el => ({ el, start: parseInt(el.getAttribute('data-seconds'), 10) || 0 }));
	}

	function clearAllIntervals(){
		activeIntervals.forEach(id => clearInterval(id));
		activeIntervals = [];
	}

	function initFlashTimers(){
		initialTimerSnapshots.forEach(({ el, start }) => {
			let remaining = start;
			updateTimeEl(el, remaining);
			const id = setInterval(() => {
				remaining = Math.max(0, remaining - 1);
				updateTimeEl(el, remaining);
				if (remaining === 0) clearInterval(id);
			}, 1000);
			activeIntervals.push(id);
		});
	}

	function updateTimeEl(el, s){
		const m = Math.floor(s / 60).toString().padStart(2, '0');
		const sec = (s % 60).toString().padStart(2, '0');
		el.textContent = `${m}:${sec}`;
	}

	function initRealtimeCounters(){
		const viewerCount = document.getElementById('viewerCount');
		const feed = document.getElementById('activityFeed');
		if (!viewerCount || !feed) return;
		const id = setInterval(() => {
			const delta = Math.random() < 0.5 ? -1 : 1;
			let val = parseInt(viewerCount.textContent || '0', 10);
			val = Math.max(1, val + delta);
			viewerCount.textContent = String(val);
			const li = document.createElement('li');
			li.textContent = `+${delta > 0 ? 1 : 0} viewer • ${(new Date()).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
			feed.prepend(li);
			while (feed.children.length > 6) feed.removeChild(feed.lastChild);
		}, 2000);
		activeIntervals.push(id);
	}

	function wireDelegatedOfferClicks(){
		document.body.addEventListener('click', (e) => {
			const offerBtn = e.target.closest('[data-offer-button]');
			if (!offerBtn) return;
			e.preventDefault();
			handleOfferClick();
		});
	}

	function wireModalCloseButton(){
		document.body.addEventListener('click', (e) => {
			const closeBtn = e.target.closest('.manip-close');
			if (!closeBtn) return;
			e.preventDefault();
			handleModalClose();
		});
	}

	function handleModalClose(){
		hideOverlay();
		resetPresentationToInitialState();
		hasClickedOffer = false;
		// Removed window.scrollTo(0,0) to maintain scroll position
	}

	function wireAwarenessModalClose(){
		document.body.addEventListener('click', (e) => {
			const closeBtn = e.target.closest('.awareness-modal-close');
			const backdrop = e.target.closest('.awareness-modal-backdrop');
			if (closeBtn || backdrop) {
				e.preventDefault();
				hideAwarenessModal();
			}
		});
	}

	function handleOfferClick(){
		hasClickedOffer = true;
		// Removed window.scrollTo(0,0) to maintain scroll position
		showOverlay();
		// Remove automatic timeout - modal will be closed by user clicking close button
	}

	function showOverlay(){
		const overlay = ensureOverlay();
		overlay.setAttribute('aria-hidden', 'false');
		overlay.classList.add('show');
		// Remove countdown timer - modal will be closed by user
	}

	function hideOverlay(){
		const overlay = ensureOverlay();
		overlay.classList.remove('show');
		overlay.setAttribute('aria-hidden', 'true');
	}

	function ensureOverlay(){
		let overlay = document.getElementById('manipOverlay');
		return overlay || document.querySelector('.manip-overlay') || document.createElement('div');
	}

	function resetPresentationToInitialState(){
		clearAllIntervals();
		// Uncheck awareness boxes
		document.querySelectorAll('.aware-box').forEach(cb => { cb.checked = false; });
		// Disable calm button and hide trigger
		const calmBtn = document.getElementById('enterCalmBtn');
		const calmTrigger = document.getElementById('calm-trigger');
		if (calmBtn) calmBtn.disabled = true;
		if (calmTrigger) {
			calmTrigger.classList.remove('visible');
			calmTrigger.setAttribute('aria-hidden', 'true');
		}
		// Reset timers
		cacheInitialTimerValues();
		initFlashTimers();
		initRealtimeCounters();
	}

	function wireBottomDetection(){
		// Bottom detection is now handled by the checkbox logic
		// This function is kept for compatibility but the main logic is in wireAwarenessCheckboxes
	}

	function wireAwarenessCheckboxes(){
		const boxes = Array.from(document.querySelectorAll('.aware-box'));
		const calmBtn = document.getElementById('enterCalmBtn');
		if (!boxes.length || !calmBtn) return;
		const checkAll = () => {
			const allChecked = boxes.every(b => b.checked);
			calmBtn.disabled = !allChecked;
			// Show/hide the calm trigger based on checkbox state
			const calmTrigger = document.getElementById('calm-trigger');
			if (calmTrigger) {
				if (allChecked) {
					calmTrigger.classList.add('visible');
					calmTrigger.setAttribute('aria-hidden', 'false');
				} else {
					calmTrigger.classList.remove('visible');
					calmTrigger.setAttribute('aria-hidden', 'true');
				}
			}
		};
		boxes.forEach(b => b.addEventListener('change', checkAll));
		checkAll();
	}

	function wireCalmEnter(){
		const calmBtn = document.getElementById('enterCalmBtn');
		if (!calmBtn) return;
		calmBtn.addEventListener('click', (e) => {
			if (calmBtn.disabled) return;
			showAwarenessModal();
		});
	}

	function showAwarenessModal(){
		const modal = document.getElementById('awarenessModal');
		if (modal) {
			modal.setAttribute('aria-hidden', 'false');
			modal.classList.add('show');
		}
	}

	function hideAwarenessModal(){
		const modal = document.getElementById('awarenessModal');
		if (modal) {
			modal.classList.remove('show');
			modal.setAttribute('aria-hidden', 'true');
		}
	}

	function wireBackdoor(){
		const backdoor = document.getElementById('backdoor');
		if (!backdoor) return;
		backdoor.addEventListener('click', () => {
			// If in calm, return to presentation. Otherwise, scroll to top.
			document.body.classList.remove('calm-enabled');
			window.scrollTo(0,0);
		});
	}

	function wireCalmTop(){
		const btnBackTop = document.getElementById('btn-back-top');
		if (btnBackTop) {
			btnBackTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
		}
		
		const btnBackMain = document.getElementById('btn-back-main');
		if (btnBackMain) {
			btnBackMain.addEventListener('click', () => {
				// Navigate back to main index page
				window.location.href = 'index.html';
			});
		}
	}
})();