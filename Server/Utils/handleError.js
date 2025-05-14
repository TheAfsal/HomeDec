// errorHandler.js
const handleError = (error) => {
  
    if (error.name === "ValidationError") {
      return {
        status: 400,
        message: error.errors[Object.keys(error.errors)[0]].message
      };
    }
  
    return {
      status: 500,
      message: "An unexpected error occurred",
      errors: [],
    };
  };
  
  module.exports = { handleError };