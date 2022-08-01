
module.exports.checkInputData = async function (data, resPage){
    
    try {
        if (data !== null || data == undefined) {throw ExceptionNotFound()};
        console.log("There is input data here");
        return true;
    } catch (e) {
        console.log("there is no data drawn");
        return false;
    }
    
}

// export {checkInputData}