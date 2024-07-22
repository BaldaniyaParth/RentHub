module.exports = (fn) => {
    // Wraps an asynchronous function with error handling
    return (req, res, next) => {
        // Execute function and catch any errors
        fn(req, res, next).catch(next);
    };
};
