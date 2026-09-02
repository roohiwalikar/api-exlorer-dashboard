// ==========================================
// COGNIFYZ TASK 5
// API INTEGRATION
// ==========================================

// Public API
const API_URL = "https://jsonplaceholder.typicode.com/posts";


// ==========================================
// APPLICATION STATE
// ==========================================

let allPosts = [];


// ==========================================
// DOM ELEMENTS
// ==========================================

const postsContainer =
    document.getElementById("postsContainer");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("searchInput");

const refreshBtn =
    document.getElementById("refreshBtn");

const retryBtn =
    document.getElementById("retryBtn");

const noResults =
    document.getElementById("noResults");

const totalPosts =
    document.getElementById("totalPosts");

const visiblePosts =
    document.getElementById("visiblePosts");

const totalUsers =
    document.getElementById("totalUsers");

const statusText =
    document.getElementById("statusText");

const statusDot =
    document.getElementById("statusDot");


// Modal elements
const modal =
    document.getElementById("modal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");

const modalUser =
    document.getElementById("modalUser");


// ==========================================
// FETCH DATA FROM API
// ==========================================

async function fetchPosts() {

    showLoading();

    try {

        /*
         * Fetch data from the public API.
         * This fulfills the API integration requirement.
         */

        const response =
            await fetch(API_URL);


        // Check if API request was successful

        if (!response.ok) {

            throw new Error(
                `API request failed with status ${response.status}`
            );

        }


        /*
         * Convert API response into JSON.
         * JSON parsing requirement.
         */

        const data =
            await response.json();


        // Store API data

        allPosts = data;


        // Update interface

        displayPosts(allPosts);

        updateStatistics(allPosts);

        setApiStatus(true);


    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        showError(
            error.message
        );

        setApiStatus(false);

    } finally {

        hideLoading();

    }
}


// ==========================================
// DISPLAY POSTS
// ==========================================

function displayPosts(posts) {

    postsContainer.innerHTML = "";


    // No matching posts

    if (posts.length === 0) {

        noResults.classList.remove("hidden");

        visiblePosts.textContent = "0";

        return;
    }


    noResults.classList.add("hidden");


    /*
     * Dynamically create HTML elements
     * from API JSON data.
     */

    posts.forEach(post => {

        const article =
            document.createElement("article");


        article.className =
            "post-card";


        article.innerHTML = `

            <div class="post-number">
                POST #${post.id}
            </div>

            <h3>
                ${escapeHTML(post.title)}
            </h3>

            <p>
                ${escapeHTML(post.body)}
            </p>

            <div class="user-badge">
                👤 User ${post.userId}
            </div>

        `;


        // Open details modal

        article.addEventListener(
            "click",
            () => openModal(post)
        );


        postsContainer.appendChild(article);

    });


    visiblePosts.textContent =
        posts.length;
}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    event => {

        const searchTerm =
            event.target.value
                .toLowerCase()
                .trim();


        const filteredPosts =
            allPosts.filter(post =>

                post.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                post.body
                    .toLowerCase()
                    .includes(searchTerm)

            );


        displayPosts(filteredPosts);

    }
);


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(posts) {

    totalPosts.textContent =
        posts.length;


    visiblePosts.textContent =
        posts.length;


    const uniqueUsers =
        new Set(
            posts.map(post => post.userId)
        );


    totalUsers.textContent =
        uniqueUsers.size;
}


// ==========================================
// API STATUS
// ==========================================

function setApiStatus(isOnline) {

    if (isOnline) {

        statusText.textContent =
            "API Connected Successfully";

        statusDot.classList.add("online");

        statusDot.classList.remove("offline");

    } else {

        statusText.textContent =
            "API Connection Failed";

        statusDot.classList.add("offline");

        statusDot.classList.remove("online");
    }
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    errorBox.classList.add("hidden");

    postsContainer.innerHTML = "";

    noResults.classList.add("hidden");
}


function hideLoading() {

    loading.classList.add("hidden");
}


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(message) {

    errorBox.classList.remove("hidden");

    errorMessage.textContent =
        message;

    postsContainer.innerHTML = "";

}


// ==========================================
// REFRESH
// ==========================================

refreshBtn.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        fetchPosts();

    }
);


// Retry button

retryBtn.addEventListener(
    "click",
    () => {

        fetchPosts();

    }
);


// ==========================================
// MODAL
// ==========================================

function openModal(post) {

    modalTitle.textContent =
        post.title;

    modalBody.textContent =
        post.body;

    modalUser.textContent =
        post.userId;

    modal.classList.remove("hidden");
}


function closePostModal() {

    modal.classList.add("hidden");

}


closeModal.addEventListener(
    "click",
    closePostModal
);


// Close modal when clicking outside

modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            closePostModal();

        }

    }
);


// Close modal with Escape key

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closePostModal();

        }

    }
);


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

fetchPosts();