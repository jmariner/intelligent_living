// jQuery is required to initialize and call some bootstrap plugins

// intialize tooltips
jQuery("[data-toggle='tooltip']").tooltip({
	container: "body"
});

// update the affixed header (called on window resize)
function updateAffix(offsetTop) {
	var affixNav = jQuery("nav");
	if (affixNav.data("bs.affix") !== undefined)
		affixNav.data("bs.affix").options.offset.top = offsetTop;
}