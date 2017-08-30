// current location saved as "data-location" on body
var loc = document.body.dataset.location;

// whether or not the navigation exists on this page
var hasNav = $("header", null) !== null;

/* 	apply onmouseenter and onmouseleave events to everything with class js-hover
	hovering toggles a second class, js-hovered, that is used for style changes
	this is solely to say that I used these events instead of :hover in css */
$(".js-hover", []).forEach(function(el) {
	el.onmouseenter = function() {
		addClass(el, "js-hovered")
	};
	el.onmouseleave = function() {
		removeClass(el, "js-hovered")
	};
});

/* 	set input and change events on all input elements that clear
	the has-error class from their parent form-group */
$(".form-group.required", []).forEach(function(group) {

	var inputs = group.querySelectorAll("input, select, textarea");
	inputs.forEach(function(el) {

		el.oninput = el.onchange = function() {
			if (!isInvalid(el))
				removeClass(group, "has-error");
		};

	});
});

if (hasNav) {

	// update the top nav on resize
	// updateNav() is declared below; functions are always hoisted so this is fine
	document.body.onresize = updateNav;

	// update now (on load)
	updateNav();

	// add the active class to the nav tab matching the current location (if any)
	var navEl = $("#global-nav li[data-tab='" + loc + "']", null);
	addClass(navEl, "active");

	// fake log-in and log-out button click events

	$("#login-button").onclick = function() {
		addClass(document.body, "logged-in");
		return false;
	};

	$("#logout-button").onclick = function() {
		removeClass(document.body, "logged-in");
		return false;
	};

}

if (loc === "home") {

	/* 	=== carousel code ===
		the slides are aligned horizontally, with only one
		showing at a time. each update, the margin-left of
		the first slide is changed between 0, -100%, -200%, and -300% (for 4 slides),
		and returns to 0 at the end.
		this turns in to an animated slide via css transitions on the margin-left attribute.
		the left and right buttons also step the slides left or right, resetting the interval.
	*/

	var caroDelay = 5000;			// 5 second delay
	var caro = $("#home-carousel");	// save the carousel element
	var slides = caro.querySelectorAll(".slide"); // all slides in the carousel
	var firstSlide = slides[0];		// the first slide; used to move the slides
	var slideCount = slides.length;	// the amount of slides; used for wrapping back to the start/end
	var curSlide = 0;				// track the current slide
	var caroInterval;				// and the interval id

	// called with the slide to show; handles wrapping
	// and changing of the first slide's left margin
	var updateCaro = function(newSlide) {
		curSlide = newSlide;
		if (curSlide >= slideCount) curSlide = 0;
		if (curSlide < 0) curSlide = slideCount-1;
		firstSlide.style.marginLeft = curSlide*-100 + "%";
	};

	// clear and start the interval; used for clicking to advance the slide
	var resetInterval = function() {
		clearInterval(caroInterval);
		caroInterval = setInterval(function() {
			updateCaro(curSlide+1);
		}, caroDelay);
	};

	resetInterval();

	// step the slide left or right when one of the respective buttons are clicked

	$("#caro-next").onclick = function() {
		resetInterval();
		updateCaro(curSlide+1);
		return false;
	};

	$("#caro-prev").onclick = function() {
		resetInterval();
		updateCaro(curSlide-1);
		return false;
	};

}
else if (loc === "products") {

	/*	=== product information popup ===
		clicking on any of the anchor elements within a .product-wrap
		will open the respective popup, saved in the data-href attribute on the wrap.
		the options for the window are built using an object and translated to the string format;
		this was done for cleaner changing of the values.
	*/

	var winWidth = 750, winHeight = 650;
	var ops = {
		width: winWidth,
		height: winHeight,
		left: (screen.width - winWidth) / 2,	// center the window, just like in textbook
		top: (screen.height - winHeight) / 2,
		scrollbars: 1,	// we want scrollbars and resize-ability
		resizable: 1
	};

	// build the options string from the object above
	var options = [];
	Object.keys(ops).forEach(function(key) {
		options.push(key + "=" + ops[key]);
	});
	options = options.join(",");

	// apply the onclick for each anchor in each product to open the respective
	// html file, specified by data-href
	$(".product-wrap").forEach(function(prod) {

		var prodPage = prod.dataset.href;

		prod.querySelectorAll("a").forEach(function(anchor) {
			anchor.onclick = function() {
				window.open(prodPage, "productView", options);
				return false;
			};
		});

	});
}
else if (loc === "payment") {

	/*	=== payment form code ===
		this mainly handles toggling of the billing information
		matching the shipping info; the actual form
		submission is passed to a function */

	var paymentForm = $("#paymentForm");
	var billingWrap = $("#hiddenBilling");
	var billingInputs = billingWrap.querySelectorAll("input, select");

	// toggleBilling is the checkbox that says "same as shipping info"
	$("#toggleBilling").onchange = function() {
		var checked = this.checked;

		// apply disabled class to the wrapper
		setClassState(billingWrap, "disabled", checked);

		// and disabled state to all elements within
		billingInputs.forEach(function(el) {
			el.disabled = checked;
		});
	};

	// pass submission to validateForm
	paymentForm.onsubmit = function() {
		var valid = validateForm(this);
		return valid;
	};
}
else if (loc === "register") {

	/*	=== registration page ===
		this takes care of password matching validation,
		most of which is over-complicated to handle oninput and onchange
		on the password elements. basic validation is passed to validateForm */

	var regForm = $("#regForm");

	// called when either password changes
	var onPassChange = function() {
		// input elements
		var pass1 = regForm.password.value,
			pass2 = regForm.password2.value;

		// their .form-group elements
		var group1 = getAncestor(regForm.password, 2),
			group2 = getAncestor(regForm.password2, 2);

		// handle various states of passwords matching / being empty
		if (pass1 === pass2 && pass1.trim().length > 0) {
			addClass(group1, "has-success");
			addClass(group2, "has-success");
			removeClass(group1, "has-error");
			removeClass(group2, "has-error");
		}
		else {
			if (pass1.trim().length > 0 && pass2.trim().length > 0) {
				addClass(group1, "has-error");
				addClass(group2, "has-error");
			}
			removeClass(group1, "has-success");
			removeClass(group2, "has-success");
		}
	};

	// clear the oninput that was previously set on all input elements
	regForm.password.oninput = null;
	regForm.password2.oninput = null;

	// and give both the onchange above
	regForm.password.onchange = onPassChange;
	regForm.password2.onchange = onPassChange;

	regForm.onsubmit = function() {
		var valid = validateForm(this);
		var submit = false;

		if (valid) {

			// handle showing password errors in the formError box below the form
			var errorBox = $("#formError");
			if (this.password.value !== this.password2.value) {

				errorBox.querySelector(".text").innerText =
					"Passwords must match in order to submit.";
				removeClass(errorBox, "hidden");

				addClass(getAncestor(this.password, 2), "has-error");
				addClass(getAncestor(this.password2, 2), "has-error");
			}
			else {
				// valid; hide the error box
				addClass(errorBox, "hidden");
				submit = true;
			}

		}

		// true if submission should pass
		return submit;
	};
}
else if (loc === "welcome") {

	// welcome page is after registration; parse the query string for the
	// name and place it in the #name box

	var nameBox = $("#name");
	nameBox.innerText = getQueryData("name");

}
else if (loc === "product-view") {

	/*	=== product popup page ===
		most of this handles switching through the
		collection of product images via their thumbnails.
		closing the window is below, too */

	var selImg = $("#selectedImage");
	var thumbs = $(".imgThumbs > img");
	addClass(thumbs[0], "selected");

	// called when selected image is changed
	// removed "selected" from all thumbnails and applies it
	// to the new one
	var switchSelected = function(img) {
		thumbs.forEach(function(i) {
			removeClass(i, "selected");
		});
		addClass(img, "selected");
	};

	// set onmouseenter on each thumbnail
	thumbs.forEach(function(img) {
		img.onmouseenter = function() {
			selImg.src = this.src;
			switchSelected(this);
		};
	});

	// close button
	$("#close").onclick = function() {
		window.close();
	};

}

function updateNav() {

	// update the sticky-nav bar when resizes occur
	// this passes to updateAffix, which calls some jQuery required by bootstrap

	var offsetTop = rect("header").height;
	$("#global-nav").setAttribute("data-offset-top", offsetTop);
	updateAffix(offsetTop);
}

/*	detailed for validation
	applies bootstrap error class to required
	form groups that are lacking values */
function validateForm(formEl) {

	var anyError = false;

	// check each .form-group for any input/select not filled in

	var formGroups = formEl.querySelectorAll(".form-group.required");
	formGroups.forEach(function(group) {

		var inputs = group.querySelectorAll("input, select");
		var hasError = false;

		for (var i=0; i < inputs.length; i++) {
			if (isInvalid(inputs[i])) {
				hasError = true;
				break;
			}
		}

		if (hasError) anyError = true;

		setClassState(group, "has-error", hasError);
	});

	// show and fill in the error box accordingly

	var errorBox = $("#formError");
	if (anyError) {
		errorBox.querySelector(".text").innerText =
			"Some required fields are missing and have been marked in red. Complete them to continue submiting.";
		removeClass(errorBox, "hidden");
	}
	else {
		addClass(errorBox, "hidden");
	}

	// allow form to submit if no errors
	return !anyError;
}

// check an input or select for validity
// inputs must have length>0 and select must have selectedIndex > 0
function isInvalid(inputEl) {

	if (inputEl.disabled === true) return false;

	if (inputEl instanceof HTMLInputElement)
		return inputEl.value.trim().length === 0;
	else if (inputEl instanceof HTMLSelectElement)
		return inputEl.selectedIndex === 0;
	else
		return true;
}