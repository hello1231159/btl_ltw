var rows = document.querySelectorAll(".table-scroll tbody tr");
var pageCount = document.querySelector(".admin-page-count");
var pagination = document.querySelector(".admin-pages");
var filters = document.querySelector(".admin-filters");
var keywordInput = filters.elements.namedItem("keyword");
var statusSelect = filters.elements.namedItem("status");
var pageSize = 5;
var matchingRows = [];

function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");
}

function showPage(page) {
    var start = (page - 1) * pageSize;
    var end = Math.min(start + pageSize, matchingRows.length);

    matchingRows.forEach(function (row, index) {
        row.hidden = index < start || index >= end;
    });

    pageCount.textContent = (end - start) + " / " + matchingRows.length;

    Array.from(pagination.children).forEach(function (button, index) {
        if (index + 1 === page) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }
    });
}

function applyFilters() {
    var keyword = normalizeText(keywordInput.value.trim());
    var status = statusSelect.value;

    matchingRows = Array.from(rows).filter(function (row) {
        var content = Array.from(row.cells[1].querySelectorAll("strong, td > small"))
            .map(function (part) {
                return part.textContent;
            }).join(" ");
        var rowStatus = row.querySelector(".pill").textContent.trim();

        row.hidden = true;
        return normalizeText(content).includes(keyword) && (status === "" || rowStatus === status);
    });

    var totalPages = Math.ceil(matchingRows.length / pageSize);
    pagination.textContent = "";

    for (var page = 1; page <= totalPages; page++) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = page;
        button.setAttribute("aria-label", "Trang " + page);
        button.addEventListener("click", function (event) {
            showPage(Number(event.currentTarget.textContent));
        });
        pagination.appendChild(button);
    }

    pagination.hidden = totalPages <= 1;
    showPage(1);
}

filters.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilters();
});
statusSelect.addEventListener("change", applyFilters);
applyFilters();
