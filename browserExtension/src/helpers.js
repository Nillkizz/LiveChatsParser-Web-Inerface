export function addStylesheet(styles) {
    var styleElt, styleSheet;
    if (document.createStyleSheet) styleSheet = document.createStyleSheet();
    else {
        var head = document.getElementsByTagName("head")[0];
        styleElt = document.createElement("style");
        head.appendChild(styleElt);
        styleSheet = document.styleSheets[document.styleSheets.length - 1];
    }
    if (typeof styles === "string") {
        if (styleElt) styleElt.innerHTML = styles;
        else styleSheet.cssText = styles;
    } else {
        var i = 0;
        for (var selector in styles) {
            if (styleSheet.insertRule) {
                var rule = selector + " {" + styles[selector] + "}";
                styleSheet.insertRule(rule, i++);
            }
            else {
                styleSheet.addRule(selector, styles[selector], i++);
            }
        }
    }
}

export function parseMsg(msgNode) {
    // msgNode.querySelectorAll('img').forEach(img => {
    //     img.outerHTML = img.alt
    // })
    return msgNode.textContent

}