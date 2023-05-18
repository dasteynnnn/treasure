const romanValues = [
    { value : 1000, char : "M" },
    { value : 500, char : "D" },
    { value : 100, char : "C" },
    { value : 50, char : "L" },
    { value : 10, char : "X" },
    { value : 5, char : "V" },
    { value : 1, char : "I" }
]

exports.convert = async (number) => {
    const response = await this.romanConversion(number, "");
    return { result : response }
}

exports.romanConversion = (n, output) => {
    if(n == 0){
        return output
    }
    if(n < 1) return output

    for(let roman of romanValues) {
        //if(n === roman.value - 1) this.romanConversion(n - (roman.value + 1), output += "I" + roman.char)
        if(n >= roman.value) {
            return this.romanConversion(n - roman.value, output += roman.char)
        } 
    }
}