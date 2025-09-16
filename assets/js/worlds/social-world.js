// Social Proof World Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 50
        });
    }
    
    // Load footer component
    fetch('../../components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.log('Footer component not found, using fallback');
        });

    // Render IG-like feed
    renderSocialFeed();
    setupInfiniteScroll();

    // Arrival toasts
    showArrivalToasts();

    // Welcome confetti
    showWelcomeConfetti();
});

// Feed data
const initialPosts = [
    {
        username: 'lux_skin_by_lina',
        sponsored: true,
        product: 'Glow Serum X',
        caption: 'My morning routine is incomplete without this! ✨ #ad',
        hashtags: ['#skincare', '#glowup', '#ad'],
        likes: 12543,
        timeAgo: '2h',
        avatarUrl: 'https://i.pravatar.cc/100?img=12',
        mediaUrl: 'assets/img/BTHXxsj6RS6zfws_mxLQLw.webp'
    },
    {
        username: 'fitwithmarco',
        sponsored: true,
        product: 'ThermoBoost Pro',
        caption: 'Shredding season made easy 🔥 Use code MARCO20',
        hashtags: ['#fitness', '#thermoboost', '#cutting'],
        likes: 8421,
        timeAgo: '4h',
        avatarUrl: 'https://i.pravatar.cc/100?img=5',
        mediaUrl: 'assets/img/image.png'
    },
    {
        username: 'byte.tech',
        sponsored: false,
        product: 'BytePods 2',
        caption: 'Noise off. Focus on. 🎧',
        hashtags: ['#tech', '#audio', '#review'],
        likes: 19321,
        timeAgo: '7h',
        avatarUrl: 'https://i.pravatar.cc/100?img=33',
        mediaUrl: 'assets/img/image 1.png'
    },
    {
        username: 'travelwithana_removed',
        sponsored: false,
        product: '',
        caption: '',
        hashtags: [],
        likes: 0,
        timeAgo: '',
        avatarUrl: '',
        noMedia: true
    },
    
    // Professor/Teacher posts - Explanations (social proof)
    {
        username: 'Prof. Léa Martin (Marketing)',
        sponsored: false,
        product: 'Explainer: Social Proof',
        caption: 'Companies signal popularity (ratings, “bestseller”, “as seen in”) to reduce uncertainty and leverage our herd instinct. When choices are ambiguous, we copy others—especially “people like us.”',
        hashtags: ['#socialproof', '#marketingpsychology', '#heuristics'],
        likes: 2213,
        timeAgo: '3h',
        avatarUrl: 'https://i.pravatar.cc/100?img=52',
        noMedia: true
    },
    {
        username: 'Dr. Hugo Bernard (Psychology)',
        sponsored: false,
        product: 'Explainer: Authority & Popularity',
        caption: '“Most popular” and “press mentions” exploit informational social influence: we assume others (or media) know better. This is amplified by urgency or scarcity claims.',
        hashtags: ['#behavioralscience', '#authority', '#influence'],
        likes: 1987,
        timeAgo: '5h',
        avatarUrl: 'https://i.pravatar.cc/100?img=58',
        noMedia: true
    },
    // Professor/Teacher posts - Solutions/Awareness
    {
        username: 'Prof. Ana Ribeiro (Marketing Ethics)',
        sponsored: false,
        product: 'Solutions: Build Awareness',
        caption: 'Pause on “bestseller” or “trending” tags. Ask: Would I buy without the label? Check sample sizes on reviews, and separate usefulness from popularity.',
        hashtags: ['#criticalthinking', '#consumerawareness', '#ethics'],
        likes: 1742,
        timeAgo: '8h',
        avatarUrl: 'https://i.pravatar.cc/100?img=61',
        noMedia: true
    },
    {
        username: 'Dr. Camille Dupont (Cognitive Psych)',
        sponsored: false,
        product: 'Solutions: Slow Decisions',
        caption: 'Counter social proof by switching to System 2: compare alternatives, read a neutral review, and set a 24h rule for non-essentials before buying.',
        hashtags: ['#debiasing', '#system2', '#buyinghabits'],
        likes: 1659,
        timeAgo: '10h',
        avatarUrl: 'https://i.pravatar.cc/100?img=64',
        noMedia: true
    }
];

let feedState = {
    posts: [...initialPosts],
    page: 1,
    loading: false
};

function renderSocialFeed() {
    const feed = document.getElementById('social-feed');
    if (!feed) return;
    feed.innerHTML = '';
    const postsWithAds = insertAds(feedState.posts);
    postsWithAds.forEach((post, index) => {
        const postEl = createPostElement(post, index);
        feed.appendChild(postEl);
    });
}

function createPostElement(post, index) {
    const el = document.createElement('article');
    el.className = 'post' + (post.isAd ? ' post-ad' : '');
    el.innerHTML = `
        <div class="post-header">
            <img class="avatar-img" src="${escapeAttr(post.avatarUrl || '')}" alt="${escapeAttr(post.username)} avatar" loading="lazy" decoding="async" />
            <div class="username">${escapeHtml(post.username)}</div>
            ${(post.isAd || post.sponsored) ? '<div class="sponsored">Sponsored</div>' : ''}
        </div>
        ${post.noMedia ? '' : `
        <div class="post-media">
            <img class="post-image" src="${escapeAttr(post.mediaUrl || '')}" alt="${escapeAttr(post.product)}" loading="lazy" decoding="async" />
            <div class="product-tag">${escapeHtml(post.product)}</div>
        </div>`}
        <div class="post-actions">
            ${post.isAd ? `
                <button class="btn-icon btn-cta" data-action="shop" data-index="${index}">Shop Now</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
            ` : `
                <button class="btn-icon" data-action="like" data-index="${index}">❤ Like</button>
                <button class="btn-icon" data-action="comment" data-index="${index}">💬 Comment</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
                <button class="btn-icon" data-action="shop" data-index="${index}">🛍 Shop</button>
            `}
        </div>
        ${renderProofBadges(post)}
        <div class="post-caption">
            ${escapeHtml(post.caption)} <span class="hashtags">${post.hashtags.map(h => escapeHtml(h)).join(' ')}</span>
        </div>
        ${renderPressStrip(post)}
        <div class="post-meta">${formatNumber(post.likes)} likes • ${post.timeAgo}</div>
    `;

    el.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', onPostActionClick);
    });

    // Image fallbacks
    const avatarImg = el.querySelector('.avatar-img');
    const mediaImg = el.querySelector('.post-image');
    attachImageFallback(avatarImg, getAvatarCandidates(post));
    attachImageFallback(mediaImg, getMediaCandidates(post));

    return el;
}

function onPostActionClick(e) {
    const btn = e.currentTarget;
    const action = btn.getAttribute('data-action');
    const index = parseInt(btn.getAttribute('data-index'));
    const post = feedState.posts[index];

    // Simple UI feedback
    if (action === 'like') {
        post.likes += 1;
        renderSocialFeed();
    }

    // Track interaction
    try {
        if (typeof trackUserEvent === 'function') {
            trackUserEvent('social_post_action', {
                action: action,
                username: post.username,
                product: post.product,
                sponsored: !!post.sponsored
            });
        }
    } catch (err) {}

    // Simulate shop click CTA
    if (action === 'shop') {
        alert('This would open a product page.');
    }
}

function setupInfiniteScroll() {
    const loader = document.getElementById('feed-loader');
    if (!loader) return;
    const observer = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting && !feedState.loading) {
                await loadMorePosts();
            }
        }
    }, { rootMargin: '200px' });
    observer.observe(loader);
}

async function loadMorePosts() {
    feedState.loading = true;
    // Simulate async load
    await new Promise(r => setTimeout(r, 600));
    const more = initialPosts
        .map(p => ({ ...p }))
        .slice(0, 3)
        .map(p => ({ ...p, timeAgo: `${feedState.page + 1}d` }));
    feedState.posts.push(...more);
    feedState.page += 1;
    renderSocialFeed();
    feedState.loading = false;

    try {
        if (typeof trackUserEvent === 'function') {
            trackUserEvent('social_feed_load_more', { page: feedState.page });
        }
    } catch (err) {}
}

function insertAds(posts) {
    // Insert a fake ad after every 3 posts
    const result = [];
    let count = 0;
    for (const p of posts) {
        result.push(p);
        count++;
        if (count % 3 === 0) {
            result.push(createFakeAd(count));
        }
    }
    return result;
}

function createFakeAd(seed) {
    const ads = [
        {
            username: 'ShopNow • Paid Partnership',
            product: 'UltraClean ToothWave',
            caption: 'Dentist-approved shine in 7 days. See the difference ✨',
            hashtags: ['#sponsored', '#oralcare'],
            likes: 0,
            timeAgo: 'Just now',
            avatarUrl: 'https://i.pravatar.cc/100?img=24',
            mediaUrl: 'assets/img/image 2.png',
            isAd: true,
            proof: {
                bestSeller: true,
                press: ['Vogue', 'ELLE'],
                influencer: 'Dr. Maya, DDS'
            }
        },
        {
            username: 'UrbanStyle • Sponsored',
            product: 'AeroMax Sneakers',
            caption: 'Comfort that propels you forward 🚀',
            hashtags: ['#ad', '#streetwear'],
            likes: 0,
            timeAgo: 'Just now',
            avatarUrl: 'https://i.pravatar.cc/100?img=29',
            mediaUrl: 'https://source.unsplash.com/800x800/?sneakers,street',
            isAd: true,
            proof: {
                trending: true,
                press: ['GQ', 'Hypebeast'],
                influencer: 'MarcoFit'
            }
        },
        {
            username: 'HomeChef • Sponsored',
            product: 'Stainless Master Knife',
            caption: 'Slice like a pro. Limited drop. 🔪',
            hashtags: ['#partner', '#kitchen'],
            likes: 0,
            timeAgo: 'Just now',
            avatarUrl: 'https://i.pravatar.cc/100?img=14',
            mediaUrl: 'https://source.unsplash.com/800x800/?knife,kitchen',
            isAd: true,
            proof: {
                verified: true,
                press: ['Bon Appétit'],
                influencer: 'Chef Tariq'
            }
        }
    ];
    return ads[seed % ads.length];
}

// Interludes removed

function attachImageFallback(imgEl, candidates) {
    if (!imgEl) return;
    let idx = 0;
    const tryNext = () => {
        if (idx >= candidates.length) return;
        const url = candidates[idx++];
        if (url && imgEl.src !== url) {
            imgEl.src = url;
        }
    };
    imgEl.addEventListener('error', tryNext);
    if (!imgEl.getAttribute('src')) {
        tryNext();
    }
}

function getAvatarCandidates(post) {
    const seed = Math.abs(hashCode(post.username)) % 70 + 1;
    return [
        post.avatarUrl,
        `https://i.pravatar.cc/100?img=${seed}`,
        `https://randomuser.me/api/portraits/${seed % 2 === 0 ? 'men' : 'women'}/${seed}.jpg`,
        'https://i.pravatar.cc/100'
    ].filter(Boolean);
}

function getMediaCandidates(post) {
    const seed = Math.abs(hashCode(post.product || post.username));
    const q = encodeURIComponent((post.product || 'product') + ',advertising');
    return [
        post.mediaUrl,
        `https://source.unsplash.com/800x800/?${q}`,
        `https://picsum.photos/seed/${seed}/800/800`
    ].filter(Boolean);
}

function hashCode(str) {
    let h = 0;
    for (let i = 0; i < String(str).length; i++) {
        h = ((h << 5) - h) + String(str).charCodeAt(i);
        h |= 0;
    }
    return h;
}

function showArrivalToasts() {
    try {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);

        const makeToast = (text) => {
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = text;
            container.appendChild(t);
            setTimeout(() => {
                t.remove();
                if (container.childElementCount === 0) container.remove();
            }, 4000);
        };

        makeToast('Website recommended by Doctor Maboul');
        setTimeout(() => makeToast('Justin Bieber just shared a post'), 1200);
    } catch (e) {}
}

function showWelcomeConfetti() {
    try {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '2001';
        document.body.appendChild(container);

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#9c88ff'];
        const count = 40;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            p.style.width = '10px';
            p.style.height = '10px';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = '-10px';
            const duration = 2 + Math.random() * 2.5;
            const rotate = 360 + Math.random() * 720;
            const delay = Math.random() * 0.4;
            p.style.opacity = '0.95';
            p.style.transform = 'translateY(-100vh)';
            p.style.transition = `transform ${duration}s cubic-bezier(0.33, 1, 0.68, 1) ${delay}s, opacity ${duration}s linear ${delay}s`;
            container.appendChild(p);

            requestAnimationFrame(() => {
                p.style.transform = `translateY(110vh) rotate(${rotate}deg)`;
                p.style.opacity = '0';
            });
        }

        setTimeout(() => {
            container.remove();
        }, 4500);
    } catch (e) {}
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
}

function renderProofBadges(post) {
    const p = post.proof || {};
    const badges = [];
    if (p.bestSeller) badges.push('<span class="badge best">Best Seller</span>');
    if (p.trending) badges.push('<span class="badge trending">Trending</span>');
    if (p.verified) badges.push('<span class="badge verified">Verified Choice</span>');
    if (p.influencer) badges.push(`<span class="badge">Recommended by ${escapeHtml(p.influencer)}</span>`);
    if (!badges.length) return '';
    return `<div class="proof-badges">${badges.join('')}</div>`;
}

function renderPressStrip(post) {
    const p = post.proof || {};
    if (!p.press || !p.press.length) return '';
    const list = p.press.map(brand => escapeHtml(brand)).join(' • ');
    return `<div class="press-strip"><span class="press-label">As seen in:</span> ${list}</div>`;
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}