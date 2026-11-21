function validateField(field) {
    if (field.type === "file") {
        var file = field.files[0];
        var invalidType = file && field.accept.split(",").indexOf(file.type) === -1;
        field.setCustomValidity(invalidType ? "Chỉ hỗ trợ ảnh PNG, JPEG hoặc WebP." : "");
    } else if (field.required) {
        var isEmpty = field.value.trim() === "";
        field.setCustomValidity(isEmpty ? "Vui lòng nhập nội dung." : "");
    }
}

document.querySelectorAll(".editor-layout, .comment-form").forEach(function (form) {
    var fields = form.querySelectorAll("input[required], textarea[required], input[type='file'][accept]");

    fields.forEach(function (field) {
        validateField(field);
        field.addEventListener("input", function () {
            validateField(field);
        });
    });

    form.addEventListener("submit", function (event) {
        fields.forEach(validateField);

        if (!form.reportValidity()) {
            event.preventDefault();
        }
    });
});
