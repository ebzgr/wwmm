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
    
    // Footer is loaded by footer-loader.js

    // Render IG-like feed
    renderSocialFeed();
    // Disable infinite scroll and hide loader
    const loaderEl = document.getElementById('feed-loader');
    if (loaderEl) loaderEl.style.display = 'none';

    // Arrival toasts
    showArrivalToasts();

    // Welcome confetti
    showWelcomeConfetti();

    // Side celebrity promotions
    renderSideCelebPromos();
});

// Feed data
const initialPosts = [
    // Introduction post
    {
        username: 'Social Media Guide',
        sponsored: false,
        product: 'Social Media World',
        caption: 'Welcome to the World of Social Proofing & Celebrities! 🎭\n\nIn this social media realm, you\'ll encounter:\n🤥 Lies and Truth\n🎯 Promotions with Intentions\n🧭 Your Job: Navigate Wisely\n\nCan you spot the difference between genuine recommendations and clever marketing? 🤔',
        hashtags: ['#socialproof', '#marketing', '#awareness'],
        likes: 0,
        timeAgo: 'Just now',
        avatarUrl: 'https://i.pravatar.cc/100?img=1',
        mediaUrl: 'assets/img/phones.jpg',
        isIntro: true
    },
    {
        username: 'lux_skin_by_lina',
        sponsored: true,
        product: 'Glow Serum X',
        caption: 'My morning routine is incomplete without this! ✨ #ad',
        hashtags: ['#skincare', '#glowup', '#ad'],
        likes: 12543,
        timeAgo: '2h',
        avatarUrl: 'https://i.pravatar.cc/100?img=12',
        mediaUrl: 'assets/img/a-lifestyle-product-advertisement-featur_BTHXxsj6RS6zfws_mxLQLw_G4bsJfSjRy6IyKJfdPM0Xg.jpeg'
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
    // Travel social-proof critique post (with provided image)
    {
        username: 'EcoWatch (Investigations)',
        sponsored: false,
        product: 'Travel Hype vs. Earth',
        caption: 'Travel companies lean on social proof — “this island is the new paradise”, “everyone is going” — to trigger FOMO and herd behavior. But mass tourism means more flights, reef damage, and waste. Paradise for ads, pressure for the planet.',
        hashtags: ['#socialproof', '#tourism', '#climate'],
        likes: 6234,
        timeAgo: '1h',
        avatarUrl: 'https://i.pravatar.cc/100?img=48',
        mediaUrl: 'assets/img/fais-moi-une-affiche-de-publicite-pour-u_WkmHYMLuTv6qKfqRgt5cHg_kSTLx57wSeKbq2JJS4cqyQ.jpeg'
    },
    // Toothbrush ad (restored)
    {
        username: 'ShopNow • Paid Partnership',
        sponsored: true,
        product: 'UltraClean ToothWave',
        caption: 'Dentist-approved shine in 7 days. See the difference ✨',
        hashtags: ['#sponsored', '#oralcare'],
        likes: 3245,
        timeAgo: '2h',
        avatarUrl: 'https://i.pravatar.cc/100?img=24',
        mediaUrl: 'assets/img/image 2.png',
        proof: { bestSeller: true, press: ['Vogue', 'ELLE'], influencer: 'Dr. Maya, DDS' }
    },
    // Apple strategy post (new)
    {
        username: 'brandwatcher.ai',
        sponsored: false,
        product: 'Apple — Social Proof by Design',
        caption: 'Status is contagious. Apple turns ownership into a public signal — keynote applause, launch lines, “Shot on iPhone”, and blue bubbles — so buying in feels like joining the in‑group. Scarcity drops and premium pricing then frame it as the high‑status default.',
        hashtags: ['#apple', '#socialproof', '#branding'],
        likes: 7120,
        timeAgo: '30m',
        avatarUrl: 'https://i.pravatar.cc/100?img=41',
        mediaUrl: 'assets/img/a-sleek-product-advertisement-showcasing_JLY3X1AYTe-7VHk2XYzyKg_47lzCXjERdK-L6mVGe1fuQ.jpeg',
        proof: { press: ['The Verge', 'WIRED'], trending: true }
    },
    // Ending post
    {
        username: 'WWMM Team',
        sponsored: false,
        product: 'Explore Other Worlds',
        caption: 'Unlike other social media that keep you with their endless posts... 📱\n\nWe let you go to explore other worlds! 🌍\n\nReady to discover more manipulative marketing techniques? The journey continues beyond this feed.',
        hashtags: ['#explore', '#marketing', '#awareness', '#freedom'],
        likes: 0,
        timeAgo: 'Just now',
        avatarUrl: 'https://i.pravatar.cc/100?img=2',
        mediaUrl: 'assets/img/why-effective.jpg',
        isEnding: true
    }
];

let feedState = {
    posts: [...initialPosts],
    page: 1,
    loading: false,
    usedSignatures: new Set(),
    usedAdSignatures: new Set()
};

function renderSocialFeed() {
    const feed = document.getElementById('social-feed');
    if (!feed) return;
    // Track signatures to avoid duplicates
    for (const p of feedState.posts) {
        feedState.usedSignatures.add(getPostSignature(p));
    }
    feed.innerHTML = '';
    
    // Separate intro, ending, and regular posts
    const introPost = feedState.posts.find(p => p.isIntro);
    const endingPost = feedState.posts.find(p => p.isEnding);
    const regularPosts = feedState.posts.filter(p => !p.isIntro && !p.isEnding && !!p.mediaUrl && !p.noMedia);
    
    // Render intro post first
    if (introPost) {
        const introEl = createPostElement(introPost, 0);
        feed.appendChild(introEl);
    }
    
    // Insert ads into regular posts and render them
    const postsWithAds = insertAds(regularPosts);
    postsWithAds.forEach((post, index) => {
        const postEl = createPostElement(post, index + 1);
        feed.appendChild(postEl);
    });
    
    // Render ending post last
    if (endingPost) {
        const endingEl = createPostElement(endingPost, feedState.posts.length - 1);
        feed.appendChild(endingEl);
    }
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
                <button class="btn-icon btn-cta btn-buy" data-action="shop" data-index="${index}">Buy Now</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
            ` : post.isIntro ? `
                <button class="btn-icon" data-action="like" data-index="${index}">❤ Like</button>
                <button class="btn-icon" data-action="comment" data-index="${index}">💬 Comment</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
                <button class="btn-icon btn-buy" data-action="shop" data-index="${index}">🛒 Explore</button>
            ` : post.isEnding ? `
                <button class="btn-icon" data-action="like" data-index="${index}">❤ Like</button>
                <button class="btn-icon" data-action="comment" data-index="${index}">💬 Comment</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
                <button class="btn-icon btn-buy" data-action="shop" data-index="${index}" onclick="window.location.href='index.html#worlds'">🛒 Back to Map</button>
            ` : `
                <button class="btn-icon" data-action="like" data-index="${index}">❤ Like</button>
                <button class="btn-icon" data-action="comment" data-index="${index}">💬 Comment</button>
                <button class="btn-icon" data-action="save" data-index="${index}">🔖 Save</button>
                <button class="btn-icon btn-buy" data-action="shop" data-index="${index}">🛒 Buy Now</button>
            `}
        </div>
        ${renderProofBadges(post)}
        <div class="post-caption">
            ${escapeHtml(post.caption)} <span class="hashtags">${post.hashtags.map(h => escapeHtml(h)).join(' ')}</span>
        </div>
        ${renderPressStrip(post)}
        <div class="post-meta">${formatNumber(post.likes)} likes • ${post.timeAgo}</div>
        ${(post.isIntro || post.isEnding) ? '' : renderComments(post)}
        ${(post.isIntro || post.isEnding) ? '' : renderPostExplainer(post)}
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
        alert('are you sure you are not being inluenced ?');
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
    // Disabled: do not load more posts
    return;
}

function insertAds(posts) {
    // Insert a fake ad after every 3 posts, avoid duplicates
    const result = [];
    let count = 0;
    let lastAdSignature = null;
    for (const p of posts) {
        result.push(p);
        count++;
        if (count % 3 === 0) {
            const ad = createUniqueAd(count, lastAdSignature);
            lastAdSignature = getAdSignature(ad);
            result.push(ad);
        }
    }
    return result;
}

function createUniqueAd(seed, avoidSignature) {
    const baseAds = [
        {
            username: 'ShopNow • Paid Partnership',
            products: ['UltraClean ToothWave', 'SmileWave Pro', 'PearlShine X'],
            captions: [
                'Dentist-approved shine in 7 days. See the difference ✨',
                'Whiter teeth, fast. Clinically shown.',
                'Your new daily clean — better in a week.'
            ],
            hashtags: ['#sponsored', '#oralcare'],
            avatarImg: 24,
            mediaQuery: 'toothbrush,oralcare',
            proofTemplates: () => ({ bestSeller: true, press: pickSome(['Vogue', 'ELLE', 'Allure'], 2), influencer: 'Dr. Maya, DDS' })
        },
        {
            username: 'HomeChef • Sponsored',
            products: ['Stainless Master Knife', 'ProEdge Santoku', 'ChefLine Paring Set'],
            captions: [
                'Slice like a pro. Limited drop. 🔪',
                'Balanced. Sharp. Built to last.'
            ],
            hashtags: ['#partner', '#kitchen'],
            avatarImg: 14,
            mediaQuery: 'knife,kitchen',
            proofTemplates: () => ({ verified: true, press: pickSome(['Bon Appétit', 'Food52'], 1), influencer: 'Chef Tariq' })
        }
    ];

    let tries = 0;
    while (tries < 50) {
        tries++;
        const b = baseAds[Math.floor(Math.random() * baseAds.length)];
        const product = b.products[Math.floor(Math.random() * b.products.length)];
        const caption = b.captions[Math.floor(Math.random() * b.captions.length)];
        const ad = {
            username: b.username,
            product,
            caption,
            hashtags: b.hashtags,
            likes: 0,
            timeAgo: 'Just now',
            avatarUrl: `https://i.pravatar.cc/100?img=${b.avatarImg}`,
            mediaUrl: `https://source.unsplash.com/800x800/?${encodeURIComponent(b.mediaQuery)}`,
            isAd: true,
            proof: b.proofTemplates()
        };
        const sig = getAdSignature(ad);
        if (sig !== avoidSignature && !feedState.usedAdSignatures.has(sig)) {
            feedState.usedAdSignatures.add(sig);
            return ad;
        }
    }
    // Fallback: simple variant to guarantee return
    return {
        username: 'Sponsored',
        product: 'Featured Product',
        caption: 'Discover what everyone is talking about.',
        hashtags: ['#ad'],
        likes: 0,
        timeAgo: 'Just now',
        avatarUrl: 'https://i.pravatar.cc/100?img=1',
        mediaUrl: 'https://source.unsplash.com/800x800/?product,ad',
        isAd: true,
        proof: { trending: true }
    };
}

// Interludes removed

function getPostSignature(post) {
    return [post.username, post.product, post.caption].map(x => String(x || '').toLowerCase()).join('::');
}

function generateNewPosts(count) {
    const creators = [
        'tech.by.mina', 'chef.luc', 'runwithkori', 'eco.wander', 'studio_ari', 'soundseekers', 'gearhub_daily'
    ];
    const products = [
        'PeakBuds ANC', 'TerraKettle', 'SprintLite Runners', 'OceanSafe Sunscreen', 'MonoCam X', 'PulseTracker S', 'NightBrew Maker'
    ];
    const captions = [
        'Switched last week — never going back. 🔄',
        'Hype is real. Didn\'t expect this much difference.',
        'Spotted everywhere lately, finally tried it. Impressed.'
    ];
    const tagSets = [
        ['#review', '#trending'],
        ['#everydaycarry', '#bestseller'],
        ['#gear', '#verified'],
        ['#sustainable', '#popular'],
        ['#creatorpick', '#seenon']
    ];

    const generated = [];
    let safety = 0;
    while (generated.length < count && safety < 200) {
        safety++;
        const seed = Date.now() + safety + Math.floor(Math.random() * 100000);
        const username = creators[Math.floor(Math.random() * creators.length)];
        const product = products[Math.floor(Math.random() * products.length)];
        const caption = captions[Math.floor(Math.random() * captions.length)];
        const hashtags = tagSets[Math.floor(Math.random() * tagSets.length)];
        const base = {
            username,
            sponsored: Math.random() < 0.25,
            product,
            caption,
            hashtags,
            likes: 1500 + Math.floor(Math.random() * 22000),
            timeAgo: `${feedState.page + 1}d`,
            avatarUrl: `https://i.pravatar.cc/100?img=${(seed % 70) + 1}`,
            mediaUrl: `https://source.unsplash.com/800x800/?${encodeURIComponent(product)},product`
        };

        // Attach proof cues with variety
        const proof = {};
        if (Math.random() < 0.4) proof.bestSeller = true;
        if (Math.random() < 0.4) proof.trending = true;
        if (Math.random() < 0.25) proof.verified = true;
        if (Math.random() < 0.3) proof.influencer = ['Mina', 'Kori', 'Ari', 'Luc'][Math.floor(Math.random() * 4)];
        if (Math.random() < 0.35) proof.press = ['WIRED', 'GQ', 'The Verge', 'Bon Appétit'].sort(() => 0.5 - Math.random()).slice(0, 2);
        if (Object.keys(proof).length) base.proof = proof;

        const sig = getPostSignature(base);
        if (!feedState.usedSignatures.has(sig)) {
            feedState.usedSignatures.add(sig);
            generated.push(base);
        }
    }
    return generated;
}

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

function renderPostExplainer(post) {
    const analysis = analyzePostForSocialProof(post);
    return `
        <div class="post-explainer">
            <div class="explainer-title">Why this works</div>
            <p class="explainer-text">${escapeHtml(analysis.strategy)}</p>
            <div class="explainer-proof"><strong>Social proof:</strong> ${escapeHtml(analysis.proofSummary)}</div>
        </div>
    `;
}

function renderComments(post) {
    const comments = generateCommentsForPost(post);
    if (!comments.length) return '';
    const items = comments.map(c => `
        <div class="comment-item">
            <img class="comment-avatar" src="${escapeAttr(c.avatar)}" alt="${escapeAttr(c.name)}" />
            <div class="comment-content">
                <div class="comment-author">${escapeHtml(c.name)}</div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
            </div>
        </div>
    `).join('');
    return `<div class="comments">${items}</div>`;
}

function generateCommentsForPost(post) {
    if (!post || (!post.mediaUrl && post.noMedia)) return [];
    const names = ['Alex M.', 'Zoé L.', 'Nina P.', 'Karim B.', 'Sophie D.', 'Eric T.', 'Luca R.', 'Maya K.'];
    const baseTexts = [
        'Je l\'ai, trop bien 👍',
        'Reçu la semaine dernière, validé.',
        'Franchement, ça marche mieux que prévu.',
        'Team déjà convaincue ici.',
        'Qualité au rendez-vous.'
    ];
    const productTexts = [
        `J\'ai ${post.product || 'ce produit'} — aucun regret.`,
        `${post.product || 'Ce produit'}: approuvé à la maison.`,
        `Utilisé tous les jours depuis 10j.`
    ];
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 comments
    const result = [];
    for (let i = 0; i < count; i++) {
        const name = names[(hashCode(post.username + i) >>> 0) % names.length];
        const avatarSeed = 1 + ((hashCode(name + post.product) >>> 0) % 70);
        const textPool = Math.random() < 0.6 ? productTexts : baseTexts;
        const text = textPool[(hashCode(post.caption + i) >>> 0) % textPool.length];
        result.push({
            name,
            text,
            avatar: `https://i.pravatar.cc/64?img=${avatarSeed}`
        });
    }
    return result;
}

function analyzePostForSocialProof(post) {
    const isEducational = /(Explainer|Solutions)/i.test(String(post.product || '')) || /(Prof\.|Dr\.)/.test(String(post.username || ''));
    if (isEducational) {
        return {
            strategy: 'Informational post aimed at raising awareness and teaching how social proof influences decisions.',
            proofSummary: 'None (educational)'
        };
    }

    const cues = collectSocialProofCues(post);

    const parts = [];
    if (cues.endorsement) parts.push('Leverages influencer endorsement to transfer trust.');
    if (cues.popularity) parts.push('Signals popularity (bestseller/trending) to reduce uncertainty.');
    if (cues.authority) parts.push('Uses authority cues (verification/press) for reassurance.');
    if (cues.herdLikes) parts.push('Shows high engagement to trigger herd behavior.');
    if (!parts.length) parts.push('Uses subtle social signals to suggest many others approve.');

    const proofTypes = [];
    if (cues.endorsement) proofTypes.push('Endorsement (influencer/creator)');
    if (cues.popularity) proofTypes.push('Popularity (bestseller/trending)');
    if (cues.authority) proofTypes.push('Authority (press/verified)');
    if (cues.herdLikes) proofTypes.push('Herd popularity (visible likes)');

    return {
        strategy: parts.join(' '),
        proofSummary: proofTypes.length ? proofTypes.join(', ') : 'Implied popularity'
    };
}

function collectSocialProofCues(post) {
    const p = post.proof || {};
    const likes = Number(post.likes) || 0;
    return {
        endorsement: !!(p.influencer || post.sponsored || post.isAd),
        popularity: !!(p.bestSeller || p.trending),
        authority: !!(p.verified || (p.press && p.press.length > 0)),
        herdLikes: likes >= 10000
    };
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function getAdSignature(ad) {
    return ['AD', ad.username, ad.product, ad.caption].map(x => String(x || '').toLowerCase()).join('::');
}

function pickSome(arr, n) {
    const copy = [...arr];
    copy.sort(() => 0.5 - Math.random());
    return copy.slice(0, n);
}

function renderSideCelebPromos() {
    try {
        const left = document.createElement('div');
        const right = document.createElement('div');
        left.className = 'side-promos side-promos-left';
        right.className = 'side-promos side-promos-right';

        const promos = [
            {
                name: 'Justin Bieber',
                text: '“Vous devez voir ça.”',
                avatar: 'https://source.unsplash.com/64x64/?celebrity,male',
                badge: 'Top célébrité'
            },
            {
                name: 'Kylie Jenner',
                text: '“Incontournable cette saison.”',
                avatar: 'https://source.unsplash.com/64x64/?celebrity,female',
                badge: 'Tendance'
            }
        ];

        const makeItem = (p) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'side-promo';
            item.innerHTML = `
                <img class="promo-avatar" src="${escapeAttr(p.avatar)}" alt="${escapeAttr(p.name)}" />
                <div class="promo-meta">
                    <div class="promo-name">${escapeHtml(p.name)}</div>
                    <div class="promo-text">${escapeHtml(p.text)}</div>
                </div>
                <span class="promo-badge">${escapeHtml(p.badge)}</span>
            `;
            item.addEventListener('click', () => {
                alert(`${p.name} fait la promo de ce produit.`);
            });
            return item;
        };

        left.appendChild(makeItem(promos[0]));
        right.appendChild(makeItem(promos[1]));

        document.body.appendChild(left);
        document.body.appendChild(right);
    } catch (e) {}
}