function splitter(text) {
    let output = [];
    let current = "";
    let bracketCount = 0;
    for(let i=0; i<text.length; i++) {
        let c = text[i];
        switch (c) {
            case ",":
            case " ":
                if(current.length > 0) {
                    output.push(current);
                    current = "";
                }
                break;
            case "<":
                if(bracketCount === 0) {
                    if(current.length > 0) {
                        output.push(current);
                        current = "";
                    }
                    bracketCount++;
                }
                current += c;
                break;
            case ">":
                current += c;
                if(bracketCount === 1) {
                    bracketCount--;
                    output.push(current);
                    current = "";
                }
                break;
            default:
                current += c;
        }
    }
    if(current.length > 0) {
        output.push(current);
    }
    return output;
}

module.exports = splitter;