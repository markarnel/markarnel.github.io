"use strict";

// Get all elements with class "accordion"
const acc = document.querySelectorAll(".accordion");


acc.forEach((item) => {
	item.addEventListener("click", () => {
		if (item.classList.contains("active")) {
			item.classList.remove("active");
		} else {
			
			const show = document.querySelectorAll(".active");
			show.forEach((show) => {
				show.classList.remove("active");
			});
			item.classList.add("active");
		}
	});
});

