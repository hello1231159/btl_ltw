var searchForm = document.querySelector(".search-bar");
var searchInput = document.querySelector("#keyword");
var categorySelect = document.querySelector("#category");
var searchStatus = document.querySelector("#search-status");
var articles = document.querySelectorAll(".article-grid .story-card");
var articleGrid = document.querySelector(".article-grid");
var pagination = document.querySelector(".pagination");
var currentPage = 1;
var pageSize = 9;

function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
}

function filterArticles() {
    var keyword = normalizeText(searchInput.value.trim());
    var category = categorySelect.value;
    var matches = [];

    articles.forEach(function (article) {
        var content = normalizeText(article.textContent);
        var matchesKeyword = content.includes(keyword);
        var matchesCategory = category === "all" || article.classList.contains(category);

        if (matchesKeyword && matchesCategory) {
            matches.push(article);
        }

        article.style.display = "none";
    });

    var totalPages = Math.ceil(matches.length / pageSize);

    if (currentPage > totalPages) {
        currentPage = 1;
    }

    matches.forEach(function (article, index) {
        if (Math.floor(index / pageSize) + 1 === currentPage) {
            article.style.display = "";
        }
    });

    searchStatus.hidden = matches.length !== 0;
    pagination.style.display = totalPages > 1 ? "" : "none";
    pagination.innerHTML = "";

    for (var page = 1; page <= totalPages; page++) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = page < 10 ? "0" + page : String(page);
        button.setAttribute("aria-label", "Trang " + page);

        if (page === currentPage) {
            button.className = "current";
            button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", function (event) {
            currentPage = Number(event.currentTarget.textContent);
            filterArticles();
            articleGrid.scrollIntoView();
        });

        pagination.appendChild(button);
    }
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentPage = 1;
    filterArticles();
});

categorySelect.addEventListener("change", function () {
    currentPage = 1;
    filterArticles();
});

filterArticles();
